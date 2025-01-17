/// <reference path="../../../adonis-typings/index.d.ts" />
import knex from 'knex';
import { Macroable } from 'macroable';
import { InsertQueryBuilderContract } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder';
import { QueryClientContract, TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
/**
 * Exposes the API for performing SQL inserts
 */
export declare class InsertQueryBuilder extends Macroable implements InsertQueryBuilderContract {
    knexQuery: knex.QueryBuilder;
    client: QueryClientContract;
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
    constructor(knexQuery: knex.QueryBuilder, client: QueryClientContract);
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
     * Define table for performing the insert query
     */
    table(table: any): this;
    /**
     * Define returning columns for the insert query
     */
    returning(column: any): any;
    /**
     * Perform insert query
     */
    insert(columns: any): this;
    /**
     * Insert multiple rows in a single query
     */
    multiInsert(columns: any): this;
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
