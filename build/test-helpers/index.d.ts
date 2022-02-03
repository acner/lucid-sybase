/// <reference path="../adonis-typings/index.d.ts" />
/// <reference path="../adonis-typings/querybuilder.d.ts" />
/// <reference path="../adonis-typings/database.d.ts" />
/// <reference types="@adonisjs/application/build/adonis-typings" />
import { Knex } from 'knex';
import { Filesystem } from '@poppinss/dev-utils';
import { Application } from '@adonisjs/core/build/standalone';
import { ConnectionConfig, DatabaseContract, ConnectionContract, QueryClientContract, RawQueryBuilderContract, InsertQueryBuilderContract, DatabaseQueryBuilderContract } from '@ioc:Adonis/Lucid/Database';
import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import { SchemaConstructorContract } from '@ioc:Adonis/Lucid/Schema';
import { MigratorContract, MigratorOptions } from '@ioc:Adonis/Lucid/Migrator';
import { LucidRow, LucidModel, AdapterContract } from '@ioc:Adonis/Lucid/Orm';
import { DefineCallback, FactoryModelContract, FactoryManagerContract } from '@ioc:Adonis/Lucid/Factory';
import { Adapter } from '../src/Orm/Adapter';
export declare const fs: Filesystem;
/**
 * Returns config based upon DB set in environment variables
 */
export declare function getConfig(): ConnectionConfig;
/**
 * Does base setup by creating databases
 */
export declare function setup(destroyDb?: boolean): Promise<void>;
/**
 * Does cleanup removes database
 */
export declare function cleanup(customTables?: string[]): Promise<void>;
/**
 * Reset database tables
 */
export declare function resetTables(): Promise<void>;
/**
 * Returns the query client typed to it's interface
 */
export declare function getQueryClient(connection: ConnectionContract, application: ApplicationContract, mode?: 'read' | 'write' | 'dual'): QueryClientContract;
/**
 * Returns query builder instance for a given connection
 */
export declare function getQueryBuilder(client: QueryClientContract): DatabaseQueryBuilderContract<import("@ioc:Adonis/Lucid/Database").Dictionary<any, string>>;
/**
 * Returns raw query builder instance for a given connection
 */
export declare function getRawQueryBuilder(client: QueryClientContract, sql: string, bindings?: any[]): RawQueryBuilderContract<any>;
/**
 * Returns query builder instance for a given connection
 */
export declare function getInsertBuilder(client: QueryClientContract): InsertQueryBuilderContract<any>;
/**
 * Returns the database instance
 */
export declare function getDb(application: ApplicationContract): DatabaseContract;
/**
 * Returns the orm adapter
 */
export declare function ormAdapter(db: DatabaseContract): Adapter;
/**
 * Returns the base model with the adapter attached to it
 */
export declare function getBaseModel(adapter: AdapterContract, application: ApplicationContract): LucidModel;
/**
 * Returns the factory model
 */
export declare function getFactoryModel(): new <Model extends LucidModel>(model: Model, callback: DefineCallback<Model>, manager: FactoryManagerContract) => FactoryModelContract<Model>;
/**
 * Fake adapter implementation
 */
export declare class FakeAdapter implements AdapterContract {
    operations: any[];
    private _handlers;
    private _invokeHandler;
    query(): any;
    on(action: 'insert', handler: (model: LucidRow, attributes: any) => void): void;
    on(action: 'update', handler: (model: LucidRow, attributes: any) => void): void;
    on(action: 'delete', handler: (model: LucidRow) => void): void;
    on(action: 'refresh', handler: (model: LucidRow) => void): void;
    on(action: 'find', handler: (model: LucidModel, options?: any) => void): void;
    on(action: 'findAll', handler: (model: LucidModel, options?: any) => void): void;
    modelClient(): any;
    modelConstructorClient(): any;
    insert(instance: LucidRow, attributes: any): Promise<any>;
    refresh(instance: LucidRow): Promise<any>;
    delete(instance: LucidRow): Promise<any>;
    update(instance: LucidRow, attributes: any): Promise<any>;
    find(model: LucidModel, key: string, value: any, options?: any): Promise<any>;
    findAll(model: LucidModel, options?: any): Promise<any>;
}
/**
 * Converts a map to an object
 */
export declare function mapToObj<T extends any>(collection: Map<any, any>): T;
/**
 * Returns the base schema class typed to it's interface
 */
export declare function getBaseSchema(): SchemaConstructorContract;
/**
 * Returns instance of migrator
 */
export declare function getMigrator(db: DatabaseContract, app: ApplicationContract, config: MigratorOptions): MigratorContract;
/**
 * Split string to an array using cross platform new lines
 */
export declare function toNewlineArray(contents: string): string[];
/**
 * Returns an array of users filled with random data
 */
export declare function getUsers(count: number): {
    username: any;
    email: any;
}[];
/**
 * Returns an array of posts for a given user, filled with random data
 */
export declare function getPosts(count: number, userId: number): {
    user_id: number;
    title: any;
}[];
/**
 * Setup application
 */
export declare function setupApplication(dbConfig?: any, additionalProviders?: string[], environment?: 'web' | 'repl' | 'test'): Promise<Application>;
export declare function setupReplicaDb(connection: Knex, datatoInsert: {
    username: string;
}[]): Promise<void>;
export declare function cleanupReplicaDb(connection: Knex): Promise<void>;
