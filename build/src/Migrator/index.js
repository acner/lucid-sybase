"use strict";
/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrator = void 0;
/// <reference path="../../adonis-typings/index.ts" />
const events_1 = require("events");
const utils_1 = require("@poppinss/utils");
const MigrationSource_1 = require("./MigrationSource");
/**
 * Migrator exposes the API to execute migrations using the schema files
 * for a given connection at a time.
 */
class Migrator extends events_1.EventEmitter {
    constructor(db, app, options) {
        super();
        this.db = db;
        this.app = app;
        this.options = options;
        this.client = this.db.connection(this.options.connectionName || this.db.primaryConnectionName);
        this.config = this.db.getRawConnection(this.client.connectionName).config;
        /**
         * Reference to the migrations config for the given connection
         */
        this.migrationsConfig = Object.assign({
            tableName: 'adonis_schema',
            disableTransactions: false,
        }, this.config.migrations);
        /**
         * Whether or not the migrator has been booted
         */
        this.booted = false;
        /**
         * Migration source to collect schema files from the disk
         */
        this.migrationSource = new MigrationSource_1.MigrationSource(this.config, this.app);
        /**
         * Mode decides in which mode the migrator is executing migrations. The migrator
         * instance can only run in one mode at a time.
         *
         * The value is set when `migrate` or `rollback` method is invoked
         */
        this.direction = this.options.direction;
        /**
         * Instead of executing migrations, just return the generated SQL queries
         */
        this.dryRun = !!this.options.dryRun;
        /**
         * An array of files we have successfully migrated. The files are
         * collected regardless of `up` or `down` methods
         */
        this.migratedFiles = {};
        /**
         * Last error occurred when executing migrations
         */
        this.error = null;
    }
    /**
     * Current status of the migrator
     */
    get status() {
        return !this.booted
            ? 'pending'
            : this.error
                ? 'error'
                : Object.keys(this.migratedFiles).length
                    ? 'completed'
                    : 'skipped';
    }
    /**
     * Returns the client for a given schema file. Schema instructions are
     * wrapped in a transaction unless transaction is not disabled
     */
    async getClient(disableTransactions) {
        /**
         * We do not create a transaction when
         *
         * 1. Migration itself disables transaction
         * 2. Transactions are globally disabled
         * 3. Doing a dry run
         */
        if (disableTransactions || this.migrationsConfig.disableTransactions || this.dryRun) {
            return this.client;
        }
        return this.client.transaction();
    }
    /**
     * Roll back the transaction when it's client is a transaction client
     */
    async rollback(client) {
        if (client.isTransaction) {
            await client.rollback();
        }
    }
    /**
     * Commits a transaction when it's client is a transaction client
     */
    async commit(client) {
        if (client.isTransaction) {
            await client.commit();
        }
    }
    /**
     * Writes the migrated file to the migrations table. This ensures that
     * we are not re-running the same migration again
     */
    async recordMigrated(client, name, executionResponse) {
        if (this.dryRun) {
            this.migratedFiles[name].queries = executionResponse;
            return;
        }
        await client.insertQuery().table(this.migrationsConfig.tableName).insert({
            name,
            batch: this.migratedFiles[name].batch,
        });
    }
    /**
     * Removes the migrated file from the migrations table. This allows re-running
     * the migration
     */
    async recordRollback(client, name, executionResponse) {
        if (this.dryRun) {
            this.migratedFiles[name].queries = executionResponse;
            return;
        }
        await client.query().from(this.migrationsConfig.tableName).where({ name }).del();
    }
    /**
     * Returns the migration source by ensuring value is a class constructor and
     * has disableTransactions property.
     */
    getMigrationSource(migration) {
        const source = migration.getSource();
        if (typeof source === 'function' && 'disableTransactions' in source) {
            return source;
        }
        throw new Error(`Invalid schema class exported by "${migration.name}"`);
    }
    /**
     * Executes a given migration node and cleans up any created transactions
     * in case of failure
     */
    async executeMigration(migration) {
        const Source = this.getMigrationSource(migration);
        const client = await this.getClient(Source.disableTransactions);
        try {
            const schema = new Source(client, migration.name, this.dryRun);
            this.emit('migration:start', this.migratedFiles[migration.name]);
            if (this.direction === 'up') {
                const response = await schema.execUp(); // Handles dry run itself
                await this.recordMigrated(client, migration.name, response); // Handles dry run itself
            }
            else if (this.direction === 'down') {
                const response = await schema.execDown(); // Handles dry run itself
                await this.recordRollback(client, migration.name, response); // Handles dry run itself
            }
            await this.commit(client);
            this.migratedFiles[migration.name].status = 'completed';
            this.emit('migration:completed', this.migratedFiles[migration.name]);
        }
        catch (error) {
            this.error = error;
            this.migratedFiles[migration.name].status = 'error';
            this.emit('migration:error', this.migratedFiles[migration.name]);
            await this.rollback(client);
            throw error;
        }
    }
    /**
     * Acquires a lock to disallow concurrent transactions. Only works with
     * `Mysql`, `PostgreSQL` and `MariaDb` for now.
     *
     * Make sure we are acquiring lock outside the transactions, since we want
     * to block other processes from acquiring the same lock.
     *
     * Locks are always acquired in dry run too, since we want to stay close
     * to the real execution cycle
     */
    async acquireLock() {
        if (!this.client.dialect.supportsAdvisoryLocks) {
            return;
        }
        const acquired = await this.client.dialect.getAdvisoryLock(1);
        if (!acquired) {
            throw new utils_1.Exception('Unable to acquire lock. Concurrent migrations are not allowed');
        }
        this.emit('acquire:lock');
    }
    /**
     * Release a lock once complete the migration process. Only works with
     * `Mysql`, `PostgreSQL` and `MariaDb` for now.
     */
    async releaseLock() {
        if (!this.client.dialect.supportsAdvisoryLocks) {
            return;
        }
        const released = await this.client.dialect.releaseAdvisoryLock(1);
        if (!released) {
            throw new utils_1.Exception('Migration completed, but unable to release database lock');
        }
        this.emit('release:lock');
    }
    /**
     * Makes the migrations table (if missing). Also created in dry run, since
     * we always reads from the schema table to find which migrations files to
     * execute and that cannot done without missing table.
     */
    async makeMigrationsTable() {
        const client = this.client;
        const hasTable = await client.schema.hasTable(this.migrationsConfig.tableName);
        if (hasTable) {
            return;
        }
        this.emit('create:schema:table');
        await client.schema.createTable(this.migrationsConfig.tableName, (table) => {
            table.increments().notNullable();
            table.string('name').notNullable();
            table.integer('batch').notNullable();
            table.timestamp('migration_time').defaultTo(client.getWriteClient().fn.now());
        });
    }
    /**
     * Returns the latest batch from the migrations
     * table
     */
    async getLatestBatch() {
        const rows = await this.client.from(this.migrationsConfig.tableName).max('batch as batch');
        return Number(rows[0].batch);
    }
    /**
     * Returns an array of files migrated till now
     */
    async getMigratedFiles() {
        const rows = await this.client
            .query()
            .from(this.migrationsConfig.tableName)
            .select('name');
        return new Set(rows.map(({ name }) => name));
    }
    /**
     * Returns an array of files migrated till now. The latest
     * migrations are on top
     */
    async getMigratedFilesTillBatch(batch) {
        return this.client
            .query()
            .from(this.migrationsConfig.tableName)
            .select('name', 'batch', 'migration_time')
            .where('batch', '>', batch)
            .orderBy('id', 'desc');
    }
    /**
     * Boot the migrator to perform actions. All boot methods must
     * work regardless of dryRun is enabled or not.
     */
    async boot() {
        this.emit('start');
        this.booted = true;
        await this.acquireLock();
        await this.makeMigrationsTable();
    }
    /**
     * Shutdown gracefully
     */
    async shutdown() {
        await this.releaseLock();
        this.emit('end');
    }
    /**
     * Migrate up
     */
    async runUp() {
        const batch = await this.getLatestBatch();
        const existing = await this.getMigratedFiles();
        const collected = await this.migrationSource.getMigrations();
        /**
         * Upfront collecting the files to be executed
         */
        collected.forEach((migration) => {
            if (!existing.has(migration.name)) {
                this.migratedFiles[migration.name] = {
                    status: 'pending',
                    queries: [],
                    file: migration,
                    batch: batch + 1,
                };
            }
        });
        const filesToMigrate = Object.keys(this.migratedFiles);
        for (let name of filesToMigrate) {
            await this.executeMigration(this.migratedFiles[name].file);
        }
    }
    /**
     * Migrate down (aka rollback)
     */
    async runDown(batch) {
        if (this.app.inProduction && this.migrationsConfig.disableRollbacksInProduction) {
            throw new Error('Rollback in production environment is disabled. Check "config/database" file for options.');
        }
        if (batch === undefined) {
            batch = (await this.getLatestBatch()) - 1;
        }
        const existing = await this.getMigratedFilesTillBatch(batch);
        const collected = await this.migrationSource.getMigrations();
        /**
         * Finding schema files for migrations to rollback. We do not perform
         * rollback when any of the files are missing
         */
        existing.forEach((file) => {
            const migration = collected.find(({ name }) => name === file.name);
            if (!migration) {
                throw new utils_1.Exception(`Cannot perform rollback. Schema file {${file.name}} is missing`, 500, 'E_MISSING_SCHEMA_FILES');
            }
            this.migratedFiles[migration.name] = {
                status: 'pending',
                queries: [],
                file: migration,
                batch: file.batch,
            };
        });
        const filesToMigrate = Object.keys(this.migratedFiles);
        for (let name of filesToMigrate) {
            await this.executeMigration(this.migratedFiles[name].file);
        }
    }
    on(event, callback) {
        return super.on(event, callback);
    }
    /**
     * Returns a merged list of completed and pending migrations
     */
    async getList() {
        const existingCollected = new Set();
        await this.makeMigrationsTable();
        const existing = await this.getMigratedFilesTillBatch(0);
        const collected = await this.migrationSource.getMigrations();
        const list = collected.map((migration) => {
            const migrated = existing.find(({ name }) => migration.name === name);
            /**
             * Already migrated. We move to an additional list, so that we can later
             * find the one's which are migrated but now missing on the disk
             */
            if (migrated) {
                existingCollected.add(migrated.name);
                return {
                    name: migration.name,
                    batch: migrated.batch,
                    status: 'migrated',
                    migrationTime: migrated.migration_time,
                };
            }
            return {
                name: migration.name,
                status: 'pending',
            };
        });
        /**
         * These are the one's which were migrated earlier, but now missing
         * on the disk
         */
        existing.forEach(({ name, batch, migration_time }) => {
            if (!existingCollected.has(name)) {
                list.push({ name, batch, migrationTime: migration_time, status: 'corrupt' });
            }
        });
        return list;
    }
    /**
     * Migrate the database by calling the up method
     */
    async run() {
        try {
            await this.boot();
            if (this.direction === 'up') {
                await this.runUp();
            }
            else if (this.options.direction === 'down') {
                await this.runDown(this.options.batch);
            }
        }
        catch (error) {
            this.error = error;
        }
        await this.shutdown();
    }
    /**
     * Close database connections
     */
    async close() {
        await this.db.manager.closeAll(true);
    }
}
exports.Migrator = Migrator;
