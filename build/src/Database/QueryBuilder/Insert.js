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
exports.InsertQueryBuilder = void 0;
const macroable_1 = require("macroable");
const Raw_1 = require("./Raw");
const QueryRunner_1 = require("../../QueryRunner");
const Raw_2 = require("../StaticBuilder/Raw");
const Reference_1 = require("../StaticBuilder/Reference");
/**
 * Exposes the API for performing SQL inserts
 */
class InsertQueryBuilder extends macroable_1.Macroable {
    constructor(knexQuery, client) {
        super();
        Object.defineProperty(this, "knexQuery", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: knexQuery
        });
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: client
        });
        /**
         * Custom data someone want to send to the profiler and the
         * query event
         */
        Object.defineProperty(this, "customReporterData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Control whether to debug the query or not. The initial
         * value is inherited from the query client
         */
        Object.defineProperty(this, "debugQueries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.client.debug
        });
    }
    /**
     * Returns the log data
     */
    getQueryData() {
        return {
            connection: this.client.connectionName,
            inTransaction: this.client.isTransaction,
            ...this.customReporterData,
        };
    }
    /**
     * Transforms the value to something that knex can internally understand and
     * handle. It includes.
     *
     * 1. Returning the `knexBuilder` for sub queries.
     * 2. Returning the `knexBuilder` for raw queries.
     */
    transformValue(value) {
        if (value instanceof Reference_1.ReferenceBuilder) {
            return value.toKnex(this.knexQuery.client);
        }
        return this.transformRaw(value);
    }
    /**
     * Returns the underlying knex raw query builder for Lucid raw
     * query builder
     */
    transformRaw(value) {
        if (value instanceof Raw_1.RawQueryBuilder) {
            return value['knexQuery'];
        }
        if (value instanceof Raw_2.RawBuilder) {
            return value.toKnex(this.knexQuery.client);
        }
        return value;
    }
    /**
     * Define custom reporter data. It will be merged with
     * the existing data
     */
    reporterData(data) {
        this.customReporterData = data;
        return this;
    }
    /**
     * Define table for performing the insert query
     */
    table(table) {
        this.knexQuery.table(table);
        return this;
    }
    /**
     * Define schema for the table
     */
    withSchema(schema) {
        this.knexQuery.withSchema(schema);
        return this;
    }
    /**
     * Define returning columns for the insert query
     */
    returning(column) {
        /**
         * Do not chain `returning` in sqlite3 to avoid knex warnings
         */
        if (this.client && ['sqlite3', 'mysql'].includes(this.client.dialect.name)) {
            return this;
        }
        this.knexQuery.returning(column);
        return this;
    }
    /**
     * Perform insert query
     */
    insert(columns) {
        if (columns && Array.isArray(columns)) {
            columns = columns.map((column) => {
                return column && typeof column === 'object'
                    ? Object.keys(column).reduce((result, key) => {
                        result[key] = this.transformValue(column[key]);
                        return result;
                    }, {})
                    : column;
            });
        }
        else if (columns && typeof columns === 'object') {
            columns = Object.keys(columns).reduce((result, key) => {
                result[key] = this.transformValue(columns[key]);
                return result;
            }, {});
        }
        this.knexQuery.insert(columns);
        return this;
    }
    /**
     * Insert multiple rows in a single query
     */
    multiInsert(columns) {
        return this.insert(columns);
    }
    /**
     * Turn on/off debugging for this query
     */
    debug(debug) {
        this.debugQueries = debug;
        return this;
    }
    /**
     * Define query timeout
     */
    timeout(time, options) {
        this.knexQuery['timeout'](time, options);
        return this;
    }
    /**
     * Returns SQL query as a string
     */
    toQuery() {
        return this.knexQuery.toQuery();
    }
    /**
     * Run query inside the given transaction
     */
    useTransaction(transaction) {
        this.knexQuery.transacting(transaction.knexClient);
        return this;
    }
    /**
     * Executes the query
     */
    async exec() {
        return new QueryRunner_1.QueryRunner(this.client, this.debugQueries, this.getQueryData()).run(this.knexQuery);
    }
    /**
     * Get sql representation of the query
     */
    toSQL() {
        return this.knexQuery.toSQL();
    }
    /**
     * Implementation of `then` for the promise API
     */
    then(resolve, reject) {
        return this.exec().then(resolve, reject);
    }
    /**
     * Implementation of `catch` for the promise API
     */
    catch(reject) {
        return this.exec().catch(reject);
    }
    /**
     * Implementation of `finally` for the promise API
     */
    finally(fullfilled) {
        return this.exec().finally(fullfilled);
    }
    /**
     * Required when Promises are extended
     */
    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
}
exports.InsertQueryBuilder = InsertQueryBuilder;
/**
 * Required by macroable
 */
Object.defineProperty(InsertQueryBuilder, "macros", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {}
});
Object.defineProperty(InsertQueryBuilder, "getters", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {}
});
