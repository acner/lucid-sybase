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
exports.TransactionClient = void 0;
const events_1 = require("events");
const hooks_1 = require("@poppinss/hooks");
const QueryBuilder_1 = require("../Orm/QueryBuilder");
const Raw_1 = require("../Database/StaticBuilder/Raw");
const Raw_2 = require("../Database/QueryBuilder/Raw");
const Insert_1 = require("../Database/QueryBuilder/Insert");
const Reference_1 = require("../Database/StaticBuilder/Reference");
const Database_1 = require("../Database/QueryBuilder/Database");
/**
 * Transaction uses a dedicated connection from the connection pool
 * and executes queries inside a given transaction.
 */
class TransactionClient extends events_1.EventEmitter {
    constructor(knexClient, dialect, connectionName, debug, emitter) {
        super();
        Object.defineProperty(this, "knexClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: knexClient
        });
        Object.defineProperty(this, "dialect", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: dialect
        });
        Object.defineProperty(this, "connectionName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: connectionName
        });
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: debug
        });
        Object.defineProperty(this, "emitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: emitter
        });
        /**
         * Always true
         */
        Object.defineProperty(this, "isTransaction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        /**
         * Transactions are always in write mode, since they always needs
         * the primary connection
         */
        Object.defineProperty(this, "mode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'dual'
        });
        /**
         * The profiler to be used for profiling queries
         */
        Object.defineProperty(this, "profiler", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hooks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new hooks_1.Hooks()
        });
        /**
         * Lucid models listens for transaction events to delete the reference. During
         * testing, it is common to generate more than 10 model instances and hence
         * the max listeners limit needs to be removed
         */
        this.setMaxListeners(Infinity);
    }
    /**
     * Whether or not transaction has been completed
     */
    get isCompleted() {
        return this.knexClient.isCompleted();
    }
    /**
     * Returns schema instance for the write client
     */
    get schema() {
        return this.getWriteClient().schema;
    }
    /**
     * Returns the read client. Which is just a single client in case
     * of transactions
     */
    getReadClient() {
        return this.knexClient;
    }
    /**
     * Returns the write client. Which is just a single client in case
     * of transactions
     */
    getWriteClient() {
        return this.knexClient;
    }
    /**
     * Truncate tables inside a transaction
     */
    async truncate(table, cascade = false) {
        await this.dialect.truncate(table, cascade);
    }
    /**
     * Returns an array of table names
     */
    async getAllTables(schemas) {
        return this.dialect.getAllTables(schemas);
    }
    /**
     * Get columns info inside a transaction. You won't need it here, however
     * added for API compatibility with the [[QueryClient]] class
     */
    async columnsInfo(table, column) {
        const query = this.knexClient.select(table);
        const result = await (column ? query.columnInfo(column) : query.columnInfo());
        return result;
    }
    /**
     * Get a new query builder instance
     */
    knexQuery() {
        return this.knexClient.queryBuilder();
    }
    /**
     * Returns the knex raw query builder instance. The query builder is always
     * created from the `write` client, so before executing the query, you
     * may want to decide which client to use.
     */
    knexRawQuery(sql, bindings) {
        return bindings ? this.knexClient.raw(sql, bindings) : this.knexClient.raw(sql);
    }
    /**
     * Returns a query builder instance for a given model. The `connection`
     * and `profiler` is passed down to the model, so that it continue
     * using the same options
     */
    modelQuery(model) {
        return new QueryBuilder_1.ModelQueryBuilder(this.knexQuery(), model, this);
    }
    /**
     * Get a new query builder instance
     */
    query() {
        return new Database_1.DatabaseQueryBuilder(this.knexQuery(), this);
    }
    /**
     * Get a new insert query builder instance
     */
    insertQuery() {
        return new Insert_1.InsertQueryBuilder(this.knexQuery(), this);
    }
    /**
     * Execute raw query on transaction
     */
    rawQuery(sql, bindings) {
        return new Raw_2.RawQueryBuilder(this.knexClient.raw(sql, bindings), this);
    }
    /**
     * Returns an instance of raw builder. This raw builder queries
     * cannot be executed. Use `rawQuery`, if you want to execute
     * queries raw queries.
     */
    raw(sql, bindings) {
        return new Raw_1.RawBuilder(sql, bindings);
    }
    /**
     * Returns reference builder.
     */
    ref(reference) {
        return new Reference_1.ReferenceBuilder(reference, this.knexClient.client);
    }
    /**
     * Returns another instance of transaction with save point
     */
    async transaction(callback, options) {
        const trx = await this.knexClient.transaction(options);
        const transaction = new TransactionClient(trx, this.dialect, this.connectionName, this.debug, this.emitter);
        /**
         * Always make sure to pass the profiler down the chain
         */
        transaction.profiler = this.profiler?.create('trx:begin', { state: 'begin' });
        /**
         * Self managed transaction
         */
        if (typeof callback === 'function') {
            try {
                const response = await callback(transaction);
                !transaction.isCompleted && (await transaction.commit());
                return response;
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        return transaction;
    }
    /**
     * Same as [[Transaction.query]] but also selects the table
     */
    from(table) {
        return this.query().from(table);
    }
    /**
     * Same as [[Transaction.insertTable]] but also selects the table
     */
    table(table) {
        return this.insertQuery().table(table);
    }
    /**
     * Register after commit or rollback hook
     */
    after(event, handler) {
        this.hooks.add('after', event, handler);
        return this;
    }
    /**
     * Commit the transaction
     */
    async commit() {
        try {
            await this.knexClient.commit();
            this.profiler?.end({ state: 'commit' });
            this.emit('commit', this);
            this.removeAllListeners();
        }
        catch (error) {
            this.profiler?.end({ state: 'commit' });
            this.removeAllListeners();
            throw error;
        }
        try {
            await this.hooks.exec('after', 'commit');
            this.hooks.clear('after');
        }
        catch { }
    }
    /**
     * Rollback the transaction
     */
    async rollback() {
        try {
            await this.knexClient.rollback();
            this.profiler?.end({ state: 'rollback' });
            this.emit('rollback', this);
            this.removeAllListeners();
        }
        catch (error) {
            this.profiler?.end({ state: 'rollback' });
            this.removeAllListeners();
            throw error;
        }
        try {
            await this.hooks.exec('after', 'rollback');
            this.hooks.clear('after');
        }
        catch { }
    }
    /**
     * Get advisory lock on the selected connection
     */
    getAdvisoryLock(key, timeout) {
        return this.dialect.getAdvisoryLock(key, timeout);
    }
    /**
     * Release advisory lock
     */
    releaseAdvisoryLock(key) {
        return this.dialect.releaseAdvisoryLock(key);
    }
}
exports.TransactionClient = TransactionClient;
