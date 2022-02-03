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
require("reflect-metadata");
const path_1 = require("path");
const standalone_1 = require("@adonisjs/core/build/standalone");
const dev_utils_1 = require("@poppinss/dev-utils");
const Database_1 = require("../../src/Database");
const MakeMigration_1 = __importDefault(require("../../commands/MakeMigration"));
const test_helpers_1 = require("../../test-helpers");
let db;
let app;
const templatesFs = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '..', '..', 'templates'));
japa_1.default.group('MakeMigration', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        await (0, test_helpers_1.setup)();
    });
    group.beforeEach(() => {
        app.container.bind('Adonis/Lucid/Database', () => db);
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await (0, test_helpers_1.cleanup)(['adonis_schema', 'schema_users', 'schema_accounts']);
        await test_helpers_1.fs.cleanup();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.resetTables)();
    });
    (0, japa_1.default)('create migration in the default migrations directory', async (assert) => {
        const makeMigration = new MakeMigration_1.default(app, new standalone_1.Kernel(app));
        makeMigration.name = 'users';
        await makeMigration.run();
        assert.lengthOf(makeMigration.ui.testingRenderer.logs, 1);
        const successLog = makeMigration.ui.testingRenderer.logs[0];
        const userSchema = await test_helpers_1.fs.get(successLog.message.replace('green(CREATE:)', '').trim());
        const schemaTemplate = await templatesFs.get('migration-make.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(userSchema), (0, test_helpers_1.toNewlineArray)(schemaTemplate
            .replace('{{#toClassName}}{{ filename }}{{/toClassName}}', 'Users')
            .replace('{{#toTableName}}{{ filename }}{{/toTableName}}', 'users')));
    });
    (0, japa_1.default)('create migration for alter table', async (assert) => {
        const makeMigration = new MakeMigration_1.default(app, new standalone_1.Kernel(app));
        makeMigration.name = 'users';
        makeMigration.table = 'my_users';
        await makeMigration.run();
        assert.lengthOf(makeMigration.ui.testingRenderer.logs, 1);
        const successLog = makeMigration.ui.testingRenderer.logs[0];
        const userSchema = await test_helpers_1.fs.get(successLog.message.replace('green(CREATE:)', '').trim());
        const schemaTemplate = await templatesFs.get('migration-alter.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(userSchema), (0, test_helpers_1.toNewlineArray)(schemaTemplate
            .replace('{{#toClassName}}{{ filename }}{{/toClassName}}', 'MyUsers')
            .replace('{{#toTableName}}{{ filename }}{{/toTableName}}', 'my_users')));
    });
    (0, japa_1.default)('create migration for make table with custom table name', async (assert) => {
        const makeMigration = new MakeMigration_1.default(app, new standalone_1.Kernel(app));
        makeMigration.name = 'users';
        makeMigration.create = 'my_users';
        await makeMigration.run();
        assert.lengthOf(makeMigration.ui.testingRenderer.logs, 1);
        const successLog = makeMigration.ui.testingRenderer.logs[0];
        const userSchema = await test_helpers_1.fs.get(successLog.message.replace('green(CREATE:)', '').trim());
        const schemaTemplate = await templatesFs.get('migration-make.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(userSchema), (0, test_helpers_1.toNewlineArray)(schemaTemplate
            .replace('{{#toClassName}}{{ filename }}{{/toClassName}}', 'MyUsers')
            .replace('{{#toTableName}}{{ filename }}{{/toTableName}}', 'my_users')));
    });
    (0, japa_1.default)('create nested migration file', async (assert) => {
        const makeMigration = new MakeMigration_1.default(app, new standalone_1.Kernel(app));
        makeMigration.name = 'profile/users';
        await makeMigration.run();
        assert.lengthOf(makeMigration.ui.testingRenderer.logs, 1);
        const successLog = makeMigration.ui.testingRenderer.logs[0];
        const userSchema = await test_helpers_1.fs.get(successLog.message.replace('green(CREATE:)', '').trim());
        const schemaTemplate = await templatesFs.get('migration-make.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(userSchema), (0, test_helpers_1.toNewlineArray)(schemaTemplate
            .replace('{{#toClassName}}{{ filename }}{{/toClassName}}', 'Users')
            .replace('{{#toTableName}}{{ filename }}{{/toTableName}}', 'users')));
    });
    (0, japa_1.default)('raise error when defined connection is invalid', async (assert) => {
        const makeMigration = new MakeMigration_1.default(app, new standalone_1.Kernel(app));
        makeMigration.name = 'profile/users';
        makeMigration.connection = 'foo';
        await makeMigration.run();
        assert.deepEqual(makeMigration.ui.testingRenderer.logs, [
            {
                stream: 'stderr',
                message: '[ red(error) ]  foo is not a valid connection name. Double check config/database file',
            },
        ]);
    });
    (0, japa_1.default)('prompt for migration paths when multiple paths are defined', async (assert) => {
        const config = {
            connection: 'primary',
            connections: {
                primary: Object.assign({
                    migrations: {
                        paths: ['database/a', 'database/b'],
                    },
                }, (0, test_helpers_1.getConfig)()),
            },
        };
        const customDb = new Database_1.Database(config, app.logger, app.profiler, app.container.use('Adonis/Core/Event'));
        app.container.bind('Adonis/Lucid/Database', () => customDb);
        const makeMigration = new MakeMigration_1.default(app, new standalone_1.Kernel(app));
        makeMigration.name = 'users';
        makeMigration.prompt.on('prompt', (prompt) => {
            prompt.select(1);
        });
        await makeMigration.run();
        const successLog = makeMigration.ui.testingRenderer.logs[0];
        const userSchema = await test_helpers_1.fs.get(successLog.message.replace('green(CREATE:)', '').trim());
        const schemaTemplate = await templatesFs.get('migration-make.txt');
        assert.isTrue(successLog.message.startsWith('green(CREATE:) database/b'));
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(userSchema), (0, test_helpers_1.toNewlineArray)(schemaTemplate
            .replace('{{#toClassName}}{{ filename }}{{/toClassName}}', 'Users')
            .replace('{{#toTableName}}{{ filename }}{{/toTableName}}', 'users')));
        await customDb.manager.closeAll();
    });
    (0, japa_1.default)('use custom directory when defined', async (assert) => {
        const config = {
            connection: 'primary',
            connections: {
                primary: Object.assign({
                    migrations: {
                        paths: ['database/a', 'database/b'],
                    },
                }, (0, test_helpers_1.getConfig)()),
            },
        };
        const customDb = new Database_1.Database(config, app.logger, app.profiler, app.container.use('Adonis/Core/Event'));
        app.container.bind('Adonis/Lucid/Database', () => customDb);
        const makeMigration = new MakeMigration_1.default(app, new standalone_1.Kernel(app));
        makeMigration.name = 'users';
        makeMigration.folder = 'database/c';
        await makeMigration.run();
        const successLog = makeMigration.ui.testingRenderer.logs[0].message;
        const userSchema = await test_helpers_1.fs.get(successLog.replace('green(CREATE:)', '').trim());
        const schemaTemplate = await templatesFs.get('migration-make.txt');
        assert.isTrue(successLog.startsWith('green(CREATE:) database/c'));
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(userSchema), (0, test_helpers_1.toNewlineArray)(schemaTemplate
            .replace('{{#toClassName}}{{ filename }}{{/toClassName}}', 'Users')
            .replace('{{#toTableName}}{{ filename }}{{/toTableName}}', 'users')));
        await customDb.manager.closeAll();
    });
});
