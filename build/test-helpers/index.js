"use strict";
/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupReplicaDb = exports.setupReplicaDb = exports.setupApplication = exports.getPosts = exports.getUsers = exports.toNewlineArray = exports.getMigrator = exports.getBaseSchema = exports.mapToObj = exports.FakeAdapter = exports.getFactoryModel = exports.getBaseModel = exports.ormAdapter = exports.getDb = exports.getInsertBuilder = exports.getRawQueryBuilder = exports.getQueryBuilder = exports.getQueryClient = exports.resetTables = exports.cleanup = exports.setup = exports.getConfig = exports.fs = void 0;
/// <reference path="../adonis-typings/index.ts" />
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
const chance_1 = require("chance");
const knex_1 = __importDefault(require("knex"));
const dev_utils_1 = require("@poppinss/dev-utils");
const standalone_1 = require("@adonisjs/core/build/standalone");
const Schema_1 = require("../src/Schema");
const Migrator_1 = require("../src/Migrator");
const Adapter_1 = require("../src/Orm/Adapter");
const index_1 = require("../src/Database/index");
const QueryClient_1 = require("../src/QueryClient");
const BaseModel_1 = require("../src/Orm/BaseModel");
const FactoryModel_1 = require("../src/Factory/FactoryModel");
const Raw_1 = require("../src/Database/QueryBuilder/Raw");
const Insert_1 = require("../src/Database/QueryBuilder/Insert");
const Database_1 = require("../src/Database/QueryBuilder/Database");
exports.fs = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, 'tmp'));
dotenv_1.default.config();
/**
 * Returns config based upon DB set in environment variables
 */
function getConfig() {
    switch (process.env.DB) {
        case 'sqlite':
            return {
                client: 'sqlite',
                connection: {
                    filename: (0, path_1.join)(exports.fs.basePath, 'db.sqlite'),
                },
                useNullAsDefault: true,
                debug: !!process.env.DEBUG,
            };
        case 'mysql':
            return {
                client: 'mysql',
                connection: {
                    host: process.env.MYSQL_HOST,
                    port: Number(process.env.MYSQL_PORT),
                    database: process.env.DB_NAME,
                    user: process.env.MYSQL_USER,
                    password: process.env.MYSQL_PASSWORD,
                },
                debug: !!process.env.DEBUG,
                useNullAsDefault: true,
            };
        case 'mysql_legacy':
            return {
                client: 'mysql',
                connection: {
                    host: process.env.MYSQL_LEGACY_HOST,
                    port: Number(process.env.MYSQL_LEGACY_PORT),
                    database: process.env.DB_NAME,
                    user: process.env.MYSQL_LEGACY_USER,
                    password: process.env.MYSQL_LEGACY_PASSWORD,
                },
                debug: !!process.env.DEBUG,
                useNullAsDefault: true,
            };
        case 'pg':
            return {
                client: 'pg',
                connection: {
                    host: process.env.PG_HOST,
                    port: Number(process.env.PG_PORT),
                    database: process.env.DB_NAME,
                    user: process.env.PG_USER,
                    password: process.env.PG_PASSWORD,
                },
                debug: !!process.env.DEBUG,
                useNullAsDefault: true,
            };
        case 'mssql':
            return {
                client: 'mssql',
                connection: {
                    user: process.env.MSSQL_USER,
                    server: process.env.MSSQL_SERVER,
                    password: process.env.MSSQL_PASSWORD,
                    database: 'master',
                    options: {
                        enableArithAbort: true,
                    },
                },
                debug: !!process.env.DEBUG,
                pool: {
                    min: 0,
                    idleTimeoutMillis: 300,
                },
            };
        default:
            throw new Error(`Missing test config for ${process.env.DB} connection`);
    }
}
exports.getConfig = getConfig;
/**
 * Does base setup by creating databases
 */
async function setup(destroyDb = true) {
    if (process.env.DB === 'sqlite') {
        await exports.fs.ensureRoot();
    }
    const db = (0, knex_1.default)(Object.assign({}, getConfig(), { debug: false }));
    const hasUsersTable = await db.schema.hasTable('users');
    if (!hasUsersTable) {
        await db.schema.createTable('users', (table) => {
            table.increments();
            table.integer('country_id');
            table.string('username').unique();
            table.string('email').unique();
            table.integer('points').defaultTo(0);
            table.timestamp('joined_at', { useTz: process.env.DB === 'mssql' });
            table.integer('parent_id').nullable();
            table.timestamp('created_at').defaultTo(db.fn.now());
            table.timestamp('updated_at').nullable();
        });
    }
    const hasUuidUsers = await db.schema.hasTable('uuid_users');
    if (!hasUuidUsers) {
        await db.schema.createTable('uuid_users', (table) => {
            table.uuid('id').primary();
            table.string('username').unique();
            table.timestamp('created_at').defaultTo(db.fn.now());
            table.timestamp('updated_at').nullable();
        });
    }
    const hasFollowTable = await db.schema.hasTable('follows');
    if (!hasFollowTable) {
        await db.schema.createTable('follows', (table) => {
            table.increments();
            table.integer('user_id');
            table.integer('following_user_id');
            table.timestamp('created_at').defaultTo(db.fn.now());
            table.timestamp('updated_at').nullable();
        });
    }
    const hasFriendsTable = await db.schema.hasTable('friends');
    if (!hasFriendsTable) {
        await db.schema.createTable('friends', (table) => {
            table.increments();
            table.string('username').unique();
            table.timestamp('created_at').defaultTo(db.fn.now());
            table.timestamp('updated_at').nullable();
        });
    }
    const hasCountriesTable = await db.schema.hasTable('countries');
    if (!hasCountriesTable) {
        await db.schema.createTable('countries', (table) => {
            table.increments();
            table.string('name');
            table.timestamps();
        });
    }
    const hasSkillsTable = await db.schema.hasTable('skills');
    if (!hasSkillsTable) {
        await db.schema.createTable('skills', (table) => {
            table.increments();
            table.string('name').notNullable();
            table.timestamps();
        });
    }
    const hasUserSkillsTable = await db.schema.hasTable('skill_user');
    if (!hasUserSkillsTable) {
        await db.schema.createTable('skill_user', (table) => {
            table.increments();
            table.integer('user_id');
            table.integer('skill_id');
            table.string('proficiency');
            table.timestamps();
        });
    }
    const hasPostsTable = await db.schema.hasTable('posts');
    if (!hasPostsTable) {
        await db.schema.createTable('posts', (table) => {
            table.increments();
            table.integer('user_id');
            table.string('title').notNullable();
            table.boolean('is_published').defaultTo(false);
            table.timestamps();
        });
    }
    const hasComments = await db.schema.hasTable('comments');
    if (!hasComments) {
        await db.schema.createTable('comments', (table) => {
            table.increments();
            table.integer('post_id');
            table.string('body');
            table.timestamps();
        });
    }
    const hasProfilesTable = await db.schema.hasTable('profiles');
    if (!hasProfilesTable) {
        await db.schema.createTable('profiles', (table) => {
            table.increments();
            table.integer('user_id');
            table.string('display_name').notNullable();
            table.string('type').nullable();
            table.timestamps();
        });
    }
    const hasIdentitiesTable = await db.schema.hasTable('identities');
    if (!hasIdentitiesTable) {
        await db.schema.createTable('identities', (table) => {
            table.increments();
            table.integer('profile_id');
            table.string('identity_name');
            table.timestamps();
        });
    }
    const hasGroupsTable = await db.schema.hasTable('groups');
    if (!hasGroupsTable) {
        await db.schema.createTable('groups', (table) => {
            table.increments();
            table.string('name').notNullable();
            table.timestamps();
        });
    }
    const hasGroupUsersTable = await db.schema.hasTable('group_user');
    if (!hasGroupUsersTable) {
        await db.schema.createTable('group_user', (table) => {
            table.increments();
            table.integer('group_id');
            table.integer('user_id');
            table.timestamps();
        });
    }
    if (destroyDb) {
        await db.destroy();
    }
}
exports.setup = setup;
/**
 * Does cleanup removes database
 */
async function cleanup(customTables) {
    const db = (0, knex_1.default)(Object.assign({}, getConfig(), { debug: false }));
    if (customTables) {
        for (let table of customTables) {
            await db.schema.dropTableIfExists(table);
        }
        await db.destroy();
        return;
    }
    await db.schema.dropTableIfExists('users');
    await db.schema.dropTableIfExists('uuid_users');
    await db.schema.dropTableIfExists('follows');
    await db.schema.dropTableIfExists('friends');
    await db.schema.dropTableIfExists('countries');
    await db.schema.dropTableIfExists('skills');
    await db.schema.dropTableIfExists('skill_user');
    await db.schema.dropTableIfExists('profiles');
    await db.schema.dropTableIfExists('posts');
    await db.schema.dropTableIfExists('comments');
    await db.schema.dropTableIfExists('identities');
    await db.schema.dropTableIfExists('knex_migrations');
    await db.schema.dropTableIfExists('groups');
    await db.schema.dropTableIfExists('group_user');
    await db.destroy();
}
exports.cleanup = cleanup;
/**
 * Reset database tables
 */
async function resetTables() {
    const db = (0, knex_1.default)(Object.assign({}, getConfig(), { debug: false }));
    await db.table('users').truncate();
    await db.table('uuid_users').truncate();
    await db.table('follows').truncate();
    await db.table('friends').truncate();
    await db.table('countries').truncate();
    await db.table('skills').truncate();
    await db.table('skill_user').truncate();
    await db.table('profiles').truncate();
    await db.table('posts').truncate();
    await db.table('comments').truncate();
    await db.table('identities').truncate();
    await db.table('groups').truncate();
    await db.table('group_user').truncate();
    await db.destroy();
}
exports.resetTables = resetTables;
/**
 * Returns the query client typed to it's interface
 */
function getQueryClient(connection, application, mode) {
    return new QueryClient_1.QueryClient(mode || 'dual', connection, application.container.use('Adonis/Core/Event'));
}
exports.getQueryClient = getQueryClient;
/**
 * Returns query builder instance for a given connection
 */
function getQueryBuilder(client) {
    return new Database_1.DatabaseQueryBuilder(client.getWriteClient().queryBuilder(), client);
}
exports.getQueryBuilder = getQueryBuilder;
/**
 * Returns raw query builder instance for a given connection
 */
function getRawQueryBuilder(client, sql, bindings) {
    const writeClient = client.getWriteClient();
    return new Raw_1.RawQueryBuilder(bindings ? writeClient.raw(sql, bindings) : writeClient.raw(sql), client);
}
exports.getRawQueryBuilder = getRawQueryBuilder;
/**
 * Returns query builder instance for a given connection
 */
function getInsertBuilder(client) {
    return new Insert_1.InsertQueryBuilder(client.getWriteClient().queryBuilder(), client);
}
exports.getInsertBuilder = getInsertBuilder;
/**
 * Returns the database instance
 */
function getDb(application) {
    const config = {
        connection: 'primary',
        connections: {
            primary: getConfig(),
            secondary: getConfig(),
        },
    };
    return new index_1.Database(config, application.container.use('Adonis/Core/Logger'), application.container.use('Adonis/Core/Profiler'), application.container.use('Adonis/Core/Event'));
}
exports.getDb = getDb;
/**
 * Returns the orm adapter
 */
function ormAdapter(db) {
    return new Adapter_1.Adapter(db);
}
exports.ormAdapter = ormAdapter;
/**
 * Returns the base model with the adapter attached to it
 */
function getBaseModel(adapter, application) {
    BaseModel_1.BaseModel.$adapter = adapter;
    BaseModel_1.BaseModel.$container = application.container;
    return BaseModel_1.BaseModel;
}
exports.getBaseModel = getBaseModel;
/**
 * Returns the factory model
 */
function getFactoryModel() {
    return FactoryModel_1.FactoryModel;
}
exports.getFactoryModel = getFactoryModel;
/**
 * Fake adapter implementation
 */
class FakeAdapter {
    constructor() {
        Object.defineProperty(this, "operations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_handlers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                insert: null,
                update: null,
                find: null,
                delete: null,
                findAll: null,
                refresh: null,
            }
        });
    }
    _invokeHandler(action, model, options) {
        if (typeof this._handlers[action] === 'function') {
            return this._handlers[action](model, options);
        }
    }
    query() {
        return {
            client: {
                dialect: {
                    dateTimeFormat: 'yyyy-MM-dd HH:mm:ss',
                },
            },
        };
    }
    on(action, handler) {
        this._handlers[action] = handler;
    }
    modelClient() { }
    modelConstructorClient() { }
    async insert(instance, attributes) {
        this.operations.push({ type: 'insert', instance, attributes });
        return this._invokeHandler('insert', instance, attributes);
    }
    async refresh(instance) {
        this.operations.push({ type: 'refresh', instance });
        return this._invokeHandler('refresh', instance);
    }
    async delete(instance) {
        this.operations.push({ type: 'delete', instance });
        return this._invokeHandler('delete', instance);
    }
    async update(instance, attributes) {
        this.operations.push({ type: 'update', instance, attributes });
        return this._invokeHandler('update', instance, attributes);
    }
    async find(model, key, value, options) {
        const payload = { type: 'find', model, key, value };
        if (options) {
            payload.options = options;
        }
        this.operations.push(payload);
        return this._invokeHandler('find', model, options);
    }
    async findAll(model, options) {
        const payload = { type: 'findAll', model };
        if (options) {
            payload.options = options;
        }
        this.operations.push(payload);
        return this._invokeHandler('findAll', model, options);
    }
}
exports.FakeAdapter = FakeAdapter;
/**
 * Converts a map to an object
 */
function mapToObj(collection) {
    let obj = {};
    collection.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
}
exports.mapToObj = mapToObj;
/**
 * Returns the base schema class typed to it's interface
 */
function getBaseSchema() {
    return Schema_1.Schema;
}
exports.getBaseSchema = getBaseSchema;
/**
 * Returns instance of migrator
 */
function getMigrator(db, app, config) {
    return new Migrator_1.Migrator(db, app, config);
}
exports.getMigrator = getMigrator;
/**
 * Split string to an array using cross platform new lines
 */
function toNewlineArray(contents) {
    return contents.split(/\r?\n/);
}
exports.toNewlineArray = toNewlineArray;
/**
 * Returns an array of users filled with random data
 */
function getUsers(count) {
    const chance = new chance_1.Chance();
    return [...new Array(count)].map(() => {
        return {
            username: chance.string({ alpha: true }),
            email: chance.email(),
        };
    });
}
exports.getUsers = getUsers;
/**
 * Returns an array of posts for a given user, filled with random data
 */
function getPosts(count, userId) {
    const chance = new chance_1.Chance();
    return [...new Array(count)].map(() => {
        return {
            user_id: userId,
            title: chance.sentence({ words: 5 }),
        };
    });
}
exports.getPosts = getPosts;
/**
 * Setup application
 */
async function setupApplication(dbConfig, additionalProviders, environment = 'test') {
    await exports.fs.add('.env', '');
    await exports.fs.add('config/app.ts', `
    export const appKey = 'averylong32charsrandomsecretkey',
    export const http = {
      cookie: {},
      trustProxy: () => true,
    }
  `);
    await exports.fs.add('config/database.ts', `
    const dbConfig = ${JSON.stringify(dbConfig, null, 2)}
    export default dbConfig
  `);
    const app = new standalone_1.Application(exports.fs.basePath, environment, {
        aliases: {
            App: './app',
        },
        providers: ['@adonisjs/core', '@adonisjs/repl'].concat(additionalProviders || []),
    });
    await app.setup();
    await app.registerProviders();
    await app.bootProviders();
    if (process.env.DEBUG) {
        app.container.use('Adonis/Core/Event').on('db:query', (query) => {
            console.log({
                model: query.model,
                sql: query.sql,
                bindings: query.bindings,
            });
        });
    }
    return app;
}
exports.setupApplication = setupApplication;
async function setupReplicaDb(connection, datatoInsert) {
    const hasUsersTable = await connection.schema.hasTable('replica_users');
    if (!hasUsersTable) {
        await connection.schema.createTable('replica_users', (table) => {
            table.increments();
            table.string('username');
        });
    }
    await connection.table('replica_users').insert(datatoInsert);
}
exports.setupReplicaDb = setupReplicaDb;
async function cleanupReplicaDb(connection) {
    await connection.schema.dropTable('replica_users');
}
exports.cleanupReplicaDb = cleanupReplicaDb;
