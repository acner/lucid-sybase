/// <reference path="../../adonis-typings/index.d.ts" />
/// <reference types="@adonisjs/application/build/adonis-typings" />
import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import { ConnectionConfig, FileNode } from '@ioc:Adonis/Lucid/Database';
/**
 * Seeders source exposes the API to read the seeders from disk for a given connection.
 */
export declare class SeedersSource {
    private config;
    private app;
    constructor(config: ConnectionConfig, app: ApplicationContract);
    /**
     * Returns an array of files inside a given directory. Relative
     * paths are resolved from the project root
     */
    private getDirectoryFiles;
    /**
     * Returns an array of seeders paths for a given connection. If paths
     * are not defined, then `database/seeders` fallback is used
     */
    private getSeedersPaths;
    /**
     * Returns an array of files for the defined seed directories
     */
    getSeeders(): Promise<FileNode<unknown>[]>;
}
