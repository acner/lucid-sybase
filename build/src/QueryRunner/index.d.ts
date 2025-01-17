import knex from 'knex';
import { QueryClientContract, TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
/**
 * Query runner exposes the API for executing knex query builder by using the
 * read/write replicas supported only by Lucid.
 *
 * Also it will emit the query data and profile the queries as well.
 */
export declare class QueryRunner {
    private client;
    private debug;
    private logData;
    private reporter;
    constructor(client: QueryClientContract | TransactionClientContract, debug: boolean, logData: any);
    /**
     * Is query dialect using sqlite database or not
     */
    private isUsingSqlite;
    /**
     * Find if query has a transaction attached to it, by using
     * `useTransaction` method
     */
    private isInTransaction;
    /**
     * Find if query is a write query or not.
     */
    private isWriteQuery;
    /**
     * Returns read or write client by inspecting the query
     */
    private getQueryClient;
    /**
     * Executes the query by handling exceptions and returns it back
     * gracefully.
     */
    private executeQuery;
    /**
     * Executes the knex builder directly
     */
    private executeDirectly;
    /**
     * Executes query by using a proper read or write connection.
     */
    private executeUsingManagedConnection;
    /**
     * Run query by managing its life-cycle
     */
    run(query: knex.QueryBuilder | knex.Raw): Promise<any>;
}
