/// <reference path="../../adonis-typings/index.d.ts" />
import { SchemaBuilder } from 'knex';
import { QueryClientContract } from '@ioc:Adonis/Lucid/Database';
import { SchemaContract, DeferCallback } from '@ioc:Adonis/Lucid/Schema';
/**
 * Exposes the API to define table schema using deferred database
 * calls.
 */
export declare class Schema implements SchemaContract {
    db: QueryClientContract;
    file: string;
    dryRun: boolean;
    /**
     * All calls to `schema` and `defer` are tracked to be
     * executed later
     */
    private trackedCalls;
    /**
     * The state of the schema. It cannot be re-executed after completion
     */
    private state;
    /**
     * Enable/disable transactions for this schema
     */
    static disableTransactions: boolean;
    /**
     * Returns the schema to build database tables
     */
    get schema(): SchemaBuilder;
    /**
     * Control whether to debug the query or not. The initial
     * value is inherited from the query client
     */
    debug: boolean;
    constructor(db: QueryClientContract, file: string, dryRun?: boolean);
    /**
     * Returns schema queries sql without executing them
     */
    private getQueries;
    /**
     * Returns reporter instance
     */
    private getReporter;
    /**
     * Returns the log data
     */
    private getQueryData;
    /**
     * Executes schema queries and defer calls in sequence
     */
    private executeQueries;
    /**
     * Returns raw query for `now`
     */
    now(precision?: number): import("knex").Raw<any>;
    /**
     * Instance of raw knex query builder
     */
    raw(query: string, bindings?: any[]): import("knex").Raw<any>;
    /**
     * Wrapping database calls inside defer ensures that they run
     * in the right order and also they won't be executed when
     * schema is invoked to return the SQL queries
     */
    defer(cb: DeferCallback): void;
    /**
     * Invokes schema `up` method. Returns an array of queries
     * when `dryRun` is set to true
     */
    execUp(): Promise<true | string[]>;
    /**
     * Invokes schema `down` method. Returns an array of queries
     * when `dryRun` is set to true
     */
    execDown(): Promise<true | string[]>;
    up(): Promise<void>;
    down(): Promise<void>;
}
