/// <reference path="../../adonis-typings/index.d.ts" />
import { DialectContract, QueryClientContract } from '@ioc:Adonis/Lucid/Database';
export declare class MysqlDialect implements DialectContract {
    private client;
    readonly name = "mysql";
    readonly supportsAdvisoryLocks = true;
    /**
     * Reference to the database version. Knex.js fetches the version after
     * the first database query, so it will be set to undefined initially
     */
    readonly version: any;
    /**
     * The default format for datetime column. The date formats is
     * valid for luxon date parsing library
     */
    readonly dateTimeFormat = "yyyy-MM-dd HH:mm:ss";
    constructor(client: QueryClientContract);
    /**
     * Truncate mysql table with option to cascade
     */
    truncate(table: string, cascade?: boolean): Promise<void>;
    /**
     * Returns an array of table names
     */
    getAllTables(): Promise<string[]>;
    /**
     * Drop all tables inside the database
     */
    dropAllTables(): Promise<void>;
    /**
     * Attempts to add advisory lock to the database and
     * returns it's status.
     */
    getAdvisoryLock(key: string, timeout?: number): Promise<boolean>;
    /**
     * Releases the advisory lock
     */
    releaseAdvisoryLock(key: string): Promise<boolean>;
}
