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
exports.Schema = void 0;
const utils_1 = require("@poppinss/utils");
const QueryReporter_1 = require("../QueryReporter");
const utils_2 = require("../utils");
/**
 * Exposes the API to define table schema using deferred database
 * calls.
 */
class Schema {
    constructor(db, file, dryRun = false) {
        this.db = db;
        this.file = file;
        this.dryRun = dryRun;
        /**
         * All calls to `schema` and `defer` are tracked to be
         * executed later
         */
        this.trackedCalls = [];
        /**
         * The state of the schema. It cannot be re-executed after completion
         */
        this.state = 'pending';
        /**
         * Control whether to debug the query or not. The initial
         * value is inherited from the query client
         */
        this.debug = this.db.debug;
    }
    /**
     * Returns the schema to build database tables
     */
    get schema() {
        const schema = this.db.schema;
        this.trackedCalls.push(schema);
        return schema;
    }
    /**
     * Returns schema queries sql without executing them
     */
    getQueries() {
        return this.trackedCalls
            .filter((schema) => typeof schema['toQuery'] === 'function')
            .map((schema) => schema.toQuery());
    }
    /**
     * Returns reporter instance
     */
    getReporter() {
        return new QueryReporter_1.QueryReporter(this.db, this.debug, {});
    }
    /**
     * Returns the log data
     */
    getQueryData(sql) {
        return {
            connection: this.db.connectionName,
            inTransaction: this.db.isTransaction,
            ddl: true,
            ...sql,
            method: utils_2.getDDLMethod(sql.sql),
        };
    }
    /**
     * Executes schema queries and defer calls in sequence
     */
    async executeQueries() {
        for (let trackedCall of this.trackedCalls) {
            if (typeof trackedCall === 'function') {
                await trackedCall(this.db);
            }
            else {
                const reporter = this.getReporter();
                try {
                    trackedCall['once']('query', (sql) => reporter.begin(this.getQueryData(sql)));
                    await trackedCall;
                    reporter.end();
                }
                catch (error) {
                    reporter.end(error);
                    throw error;
                }
            }
        }
    }
    /**
     * Returns raw query for `now`
     */
    now(precision) {
        return precision
            ? this.db.knexRawQuery(`CURRENT_TIMESTAMP(${precision})`)
            : this.db.knexRawQuery('CURRENT_TIMESTAMP');
    }
    /**
     * Instance of raw knex query builder
     */
    raw(query, bindings) {
        return this.db.knexRawQuery(query, bindings);
    }
    /**
     * Wrapping database calls inside defer ensures that they run
     * in the right order and also they won't be executed when
     * schema is invoked to return the SQL queries
     */
    defer(cb) {
        this.trackedCalls.push(cb);
    }
    /**
     * Invokes schema `up` method. Returns an array of queries
     * when `dryRun` is set to true
     */
    async execUp() {
        if (this.state === 'completed') {
            throw new utils_1.Exception('Cannot execute a given schema twice');
        }
        await this.up();
        this.state = 'completed';
        if (this.dryRun) {
            return this.getQueries();
        }
        await this.executeQueries();
        return true;
    }
    /**
     * Invokes schema `down` method. Returns an array of queries
     * when `dryRun` is set to true
     */
    async execDown() {
        if (this.state === 'completed') {
            throw new utils_1.Exception('Cannot execute a given schema twice');
        }
        await this.down();
        this.state = 'completed';
        if (this.dryRun) {
            return this.getQueries();
        }
        await this.executeQueries();
        return true;
    }
    async up() { }
    async down() { }
}
exports.Schema = Schema;
/**
 * Enable/disable transactions for this schema
 */
Schema.disableTransactions = false;
