/// <reference path="../../adonis-typings/index.d.ts" />
/// <reference path="../../adonis-typings/querybuilder.d.ts" />
/// <reference path="../../adonis-typings/database.d.ts" />
/// <reference path="../../adonis-typings/model.d.ts" />
/// <reference path="../../adonis-typings/orm.d.ts" />
/// <reference path="../../adonis-typings/relations.d.ts" />
/// <reference types="@adonisjs/logger/build/adonis-typings/logger" />
/// <reference types="@adonisjs/profiler/build/adonis-typings/profiler" />
/// <reference types="@adonisjs/events/build/adonis-typings" />
/// <reference types="@adonisjs/core/build/adonis-typings/health-check" />
import { Macroable } from 'macroable';
import { EmitterContract } from '@ioc:Adonis/Core/Event';
import { LoggerContract } from '@ioc:Adonis/Core/Logger';
import { ProfilerContract } from '@ioc:Adonis/Core/Profiler';
import { DatabaseConfig, IsolationLevels, DatabaseContract, QueryClientContract, DatabaseClientOptions, TransactionClientContract, ConnectionManagerContract } from '@ioc:Adonis/Lucid/Database';
import { RawBuilder } from './StaticBuilder/Raw';
import { prettyPrint } from '../Helpers/prettyPrint';
import { ModelQueryBuilder } from '../Orm/QueryBuilder';
import { InsertQueryBuilder } from './QueryBuilder/Insert';
import { ReferenceBuilder } from './StaticBuilder/Reference';
import { SimplePaginator } from './Paginator/SimplePaginator';
import { DatabaseQueryBuilder } from './QueryBuilder/Database';
/**
 * Database class exposes the API to manage multiple connections and obtain an instance
 * of query/transaction clients.
 */
export declare class Database extends Macroable implements DatabaseContract {
    private config;
    private logger;
    private profiler;
    private emitter;
    /**
     * Required by macroable
     */
    protected static macros: {};
    protected static getters: {};
    /**
     * Reference to self constructor. TypeScript sucks with "this.constructor"
     * https://github.com/microsoft/TypeScript/issues/4586
     */
    Database: typeof Database;
    /**
     * Reference to connections manager
     */
    manager: ConnectionManagerContract;
    /**
     * Primary connection name
     */
    primaryConnectionName: string;
    /**
     * Reference to query builders. We expose them, so that they can be
     * extended from outside using macros.
     */
    DatabaseQueryBuilder: typeof DatabaseQueryBuilder;
    InsertQueryBuilder: typeof InsertQueryBuilder;
    ModelQueryBuilder: typeof ModelQueryBuilder;
    SimplePaginator: typeof SimplePaginator;
    /**
     * A store of global transactions
     */
    connectionGlobalTransactions: Map<string, TransactionClientContract>;
    hasHealthChecksEnabled: boolean;
    prettyPrint: typeof prettyPrint;
    constructor(config: DatabaseConfig, logger: LoggerContract, profiler: ProfilerContract, emitter: EmitterContract);
    /**
     * Validate config at runtime
     */
    private validateConfig;
    /**
     * Compute whether health check is enabled or not after registering the connections.
     * There are chances that all pre-registered connections are not using health
     * checks but a dynamic connection is using it. We don't support that use case
     * for now, since it complicates things a lot and forces us to register the
     * health checker on demand.
     */
    private findIfHealthChecksAreEnabled;
    /**
     * Registering all connections with the manager, so that we can fetch
     * and connect with them whenver required.
     */
    private registerConnections;
    /**
     * Returns the connection node from the connection manager
     */
    getRawConnection(name: string): import("@ioc:Adonis/Lucid/Database").ConnectionNode | undefined;
    /**
     * Returns the query client for a given connection
     */
    connection(connection?: string, options?: DatabaseClientOptions): QueryClientContract | TransactionClientContract;
    /**
     * Returns the knex query builder
     */
    knexQuery(): import("knex").Knex.QueryBuilder<any, any>;
    /**
     * Returns the knex raw query builder
     */
    knexRawQuery(sql: string, bindings?: any[]): import("knex").Knex.Raw<any>;
    /**
     * Returns query builder. Optionally one can define the mode as well
     */
    query(options?: DatabaseClientOptions): import("@ioc:Adonis/Lucid/Database").DatabaseQueryBuilderContract<any>;
    /**
     * Returns insert query builder. Always has to be dual or write mode and
     * hence it doesn't matter, since in both `dual` and `write` mode,
     * the `write` connection is always used.
     */
    insertQuery(options?: DatabaseClientOptions): import("@ioc:Adonis/Lucid/Database").InsertQueryBuilderContract<any[]>;
    /**
     * Returns a query builder instance for a given model.
     */
    modelQuery(model: any, options?: DatabaseClientOptions): import("@ioc:Adonis/Lucid/Orm").ModelQueryBuilderContract<any, any>;
    /**
     * Returns an instance of raw query builder. Optionally one can
     * defined the `read/write` mode in which to execute the
     * query
     */
    rawQuery(sql: string, bindings?: any, options?: DatabaseClientOptions): import("@ioc:Adonis/Lucid/Database").RawQueryBuilderContract<any>;
    /**
     * Returns an instance of raw builder. This raw builder queries
     * cannot be executed. Use `rawQuery`, if you want to execute
     * queries raw queries.
     */
    raw(sql: string, bindings?: any): RawBuilder;
    /**
     * Returns reference builder.
     */
    ref(reference: string): ReferenceBuilder;
    /**
     * Returns instance of a query builder and selects the table
     */
    from(table: any): import("@ioc:Adonis/Lucid/Database").DatabaseQueryBuilderContract<any>;
    /**
     * Returns insert query builder and selects the table
     */
    table(table: any): import("@ioc:Adonis/Lucid/Database").InsertQueryBuilderContract<any>;
    /**
     * Returns a transaction instance on the default
     * connection
     */
    transaction(callback?: {
        isolationLevel?: IsolationLevels;
    } | ((trx: TransactionClientContract) => Promise<any>), options?: {
        isolationLevel?: IsolationLevels;
    }): Promise<any>;
    /**
     * Invokes `manager.report`
     */
    report(): Promise<import("@ioc:Adonis/Core/HealthCheck").HealthReportEntry & {
        meta: import("@ioc:Adonis/Lucid/Database").ReportNode[];
    }>;
    /**
     * Begin a new global transaction
     */
    beginGlobalTransaction(connectionName?: string, options?: Omit<DatabaseClientOptions, 'mode'>): Promise<TransactionClientContract>;
    /**
     * Commit an existing global transaction
     */
    commitGlobalTransaction(connectionName?: string): Promise<void>;
    /**
     * Rollback an existing global transaction
     */
    rollbackGlobalTransaction(connectionName?: string): Promise<void>;
}
