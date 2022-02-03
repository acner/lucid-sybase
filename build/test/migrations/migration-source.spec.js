"use strict";
/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../adonis-typings/index.ts" />
const japa_1 = __importDefault(require("japa"));
const path_1 = require("path");
const MigrationSource_1 = require("../../src/Migrator/MigrationSource");
const test_helpers_1 = require("../../test-helpers");
let app;
let db;
japa_1.default.group('MigrationSource', (group) => {
    group.beforeEach(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        await (0, test_helpers_1.setup)();
    });
    group.afterEach(async () => {
        await db.manager.closeAll();
        await (0, test_helpers_1.resetTables)();
        await test_helpers_1.fs.cleanup();
    });
    (0, japa_1.default)('get list of migration files from database/migrations.js', async (assert) => {
        const migrationSource = new MigrationSource_1.MigrationSource(db.getRawConnection('primary').config, app);
        await test_helpers_1.fs.add('database/migrations/foo.js', 'module.exports = class Foo {}');
        await test_helpers_1.fs.add('database/migrations/bar.js', 'module.exports = class Bar {}');
        const directories = await migrationSource.getMigrations();
        assert.deepEqual(directories.map((file) => {
            return { absPath: file.absPath, name: file.name };
        }), [
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/migrations/bar.js'),
                name: 'database/migrations/bar',
            },
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/migrations/foo.js'),
                name: 'database/migrations/foo',
            },
        ]);
    });
    (0, japa_1.default)('only use javascript files for migration', async (assert) => {
        const migrationSource = new MigrationSource_1.MigrationSource(db.getRawConnection('primary').config, app);
        await test_helpers_1.fs.add('database/migrations/foo.js', 'module.exports = class Foo {}');
        await test_helpers_1.fs.add('database/migrations/foo.js.map', '{}');
        const directories = await migrationSource.getMigrations();
        assert.deepEqual(directories.map((file) => {
            return { absPath: file.absPath, name: file.name };
        }), [
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/migrations/foo.js'),
                name: 'database/migrations/foo',
            },
        ]);
    });
    (0, japa_1.default)('sort multiple migration directories seperately', async (assert) => {
        const config = Object.assign({}, db.getRawConnection('primary').config, {
            migrations: {
                paths: ['./database/secondary', './database/primary'],
            },
        });
        const migrationSource = new MigrationSource_1.MigrationSource(config, app);
        await test_helpers_1.fs.add('database/secondary/a.js', 'module.exports = class Foo {}');
        await test_helpers_1.fs.add('database/secondary/c.js', 'module.exports = class Bar {}');
        await test_helpers_1.fs.add('database/primary/b.js', 'module.exports = class Foo {}');
        await test_helpers_1.fs.add('database/primary/d.js', 'module.exports = class Bar {}');
        const files = await migrationSource.getMigrations();
        assert.deepEqual(files.map((file) => {
            return { absPath: file.absPath, name: file.name };
        }), [
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/secondary/a.js'),
                name: 'database/secondary/a',
            },
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/secondary/c.js'),
                name: 'database/secondary/c',
            },
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/primary/b.js'),
                name: 'database/primary/b',
            },
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/primary/d.js'),
                name: 'database/primary/d',
            },
        ]);
    });
    (0, japa_1.default)('handle esm default exports properly', async (assert) => {
        const migrationSource = new MigrationSource_1.MigrationSource(db.getRawConnection('primary').config, app);
        await test_helpers_1.fs.add('database/migrations/foo.ts', 'export default class Foo {}');
        await test_helpers_1.fs.add('database/migrations/bar.ts', 'export default class Bar {}');
        await test_helpers_1.fs.add('database/migrations/baz.ts', 'export default class Baz {}');
        const directories = await migrationSource.getMigrations();
        assert.equal(directories[0].getSource().name, 'Bar');
        assert.equal(directories[1].getSource().name, 'Baz');
        assert.equal(directories[2].getSource().name, 'Foo');
    });
});
