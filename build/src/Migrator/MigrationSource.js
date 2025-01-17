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
exports.MigrationSource = void 0;
const utils_1 = require("../utils");
/**
 * Migration source exposes the API to read the migration files
 * from disk for a given connection.
 */
class MigrationSource {
    constructor(config, app) {
        this.config = config;
        this.app = app;
    }
    /**
     * Returns an array of files inside a given directory. Relative
     * paths are resolved from the project root
     */
    async getDirectoryFiles(directoryPath) {
        const { files } = await utils_1.sourceFiles(this.app.appRoot, directoryPath);
        return files;
    }
    /**
     * Returns an array of migrations paths for a given connection. If paths
     * are not defined, then `database/migrations` fallback is used
     */
    getMigrationsPath() {
        const directories = (this.config.migrations || {}).paths;
        const defaultDirectory = this.app.directoriesMap.get('migrations') || 'database/migrations';
        return directories && directories.length ? directories : [`./${defaultDirectory}`];
    }
    /**
     * Returns an array of files for all defined directories
     */
    async getMigrations() {
        const migrationPaths = this.getMigrationsPath();
        const directories = await Promise.all(migrationPaths.map((directoryPath) => {
            return this.getDirectoryFiles(directoryPath);
        }));
        return directories.reduce((result, directory) => {
            result = result.concat(directory);
            return result;
        }, []);
    }
}
exports.MigrationSource = MigrationSource;
