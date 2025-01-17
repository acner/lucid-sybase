/// <reference path="../../../adonis-typings/index.d.ts" />
import knex from 'knex';
import { DialectContract } from '@ioc:Adonis/Lucid/Database';
import { QueryClientContract, TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
import { DatabaseQueryBuilderContract } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder';
import { Chainable } from './Chainable';
import { SimplePaginator } from '../Paginator/SimplePaginator';
/**
 * Database query builder exposes the API to construct and run queries for selecting,
 * updating and deleting records.
 */
export declare class DatabaseQueryBuilder extends Chainable implements DatabaseQueryBuilderContract {
    client: QueryClientContract;
    keysResolver?: ((columnName: string) => string) | undefined;
    /**
     * Custom data someone want to send to the profiler and the
     * query event
     */
    private customReporterData;
    /**
     * Control whether to debug the query or not. The initial
     * value is inherited from the query client
     */
    private debugQueries;
    /**
     * Required by macroable
     */
    protected static macros: {};
    protected static getters: {};
    constructor(builder: knex.QueryBuilder, client: QueryClientContract, keysResolver?: ((columnName: string) => string) | undefined);
    /**
     * Ensures that we are not executing `update` or `del` when using read only
     * client
     */
    private ensureCanPerformWrites;
    /**
     * Returns the log data
     */
    private getQueryData;
    /**
     * Define custom reporter data. It will be merged with
     * the existing data
     */
    reporterData(data: any): this;
    /**
     * Delete rows under the current query
     */
    del(): this;
    /**
     * Alias for [[del]]
     */
    delete(): this;
    /**
     * Clone the current query builder
     */
    clone(): DatabaseQueryBuilder;
    /**
     * Define returning columns
     */
    returning(columns: any): this;
    /**
     * Perform update by incrementing value for a given column. Increments
     * can be clubbed with `update` as well
     */
    increment(column: any, counter?: any): this;
    /**
     * Perform update by decrementing value for a given column. Decrements
     * can be clubbed with `update` as well
     */
    decrement(column: any, counter?: any): this;
    /**
     * Perform update
     */
    update(column: any, value?: any, returning?: string[]): this;
    /**
     * Fetch and return first results from the results set. This method
     * will implicitly set a `limit` on the query
     */
    first(): Promise<any>;
    /**
     * Fetch and return first results from the results set. This method
     * will implicitly set a `limit` on the query
     */
    firstOrFail(): Promise<any>;
    /**
     * Define a query to constraint to be defined when condition is truthy
     */
    ifDialect(dialects: DialectContract['name'] | DialectContract['name'][], matchCallback: (query: this) => any, noMatchCallback?: (query: this) => any): this;
    /**
     * Define a query to constraint to be defined when condition is falsy
     */
    unlessDialect(dialects: DialectContract['name'] | DialectContract['name'][], matchCallback: (query: this) => any, noMatchCallback?: (query: this) => any): this;
    /**
     * Turn on/off debugging for this query
     */
    debug(debug: boolean): this;
    /**
     * Define query timeout
     */
    timeout(time: number, options?: {
        cancel: boolean;
    }): this;
    /**
     * Returns SQL query as a string
     */
    toQuery(): string;
    /**
     * Run query inside the given transaction
     */
    useTransaction(transaction: TransactionClientContract): this;
    /**
     * Executes the query
     */
    exec(): Promise<any>;
    /**
     * Paginate through rows inside a given table
     */
    paginate(page: number, perPage?: number): Promise<SimplePaginator>;
    /**
     * Get sql representation of the query
     */
    toSQL(): knex.Sql;
    /**
     * Implementation of `then` for the promise API
     */
    then(resolve: any, reject?: any): any;
    /**
     * Implementation of `catch` for the promise API
     */
    catch(reject: any): any;
    /**
     * Implementation of `finally` for the promise API
     */
    finally(fullfilled: any): Promise<any>;
    /**
     * Required when Promises are extended
     */
    get [Symbol.toStringTag](): string;
}
