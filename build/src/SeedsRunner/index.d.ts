/// <reference types="@adonisjs/application/build/adonis-typings" />
import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import { FileNode, DatabaseContract } from '@ioc:Adonis/Lucid/Database';
import { SeederFileNode } from '@ioc:Adonis/Lucid/Seeder';
/**
 * Seeds Runner exposes the API to traverse seeders and execute them
 * in bulk
 */
export declare class SeedsRunner {
    private db;
    private app;
    private connectionName?;
    private client;
    private config;
    constructor(db: DatabaseContract, app: ApplicationContract, connectionName?: string | undefined);
    /**
     * Returns the seeder source by ensuring value is a class constructor
     */
    private getSeederSource;
    /**
     * Returns an array of seeders
     */
    getList(): Promise<FileNode<unknown>[]>;
    /**
     * Executes the seeder
     */
    run(file: FileNode<unknown>): Promise<SeederFileNode>;
}
