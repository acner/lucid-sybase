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
const Connection_1 = require("../../src/Connection");
const QueryClient_1 = require("../../src/QueryClient");
const test_helpers_1 = require("../../test-helpers");
let app;
japa_1.default.group('Query client | drop tables', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        await (0, test_helpers_1.setup)();
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)(['temp_posts', 'temp_users']);
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
    });
    (0, japa_1.default)('drop all tables', async (assert) => {
        await test_helpers_1.fs.fsExtra.ensureDir((0, path_1.join)(test_helpers_1.fs.basePath, 'temp'));
        const connection = new Connection_1.Connection('primary', (0, test_helpers_1.getConfig)(), app.logger);
        connection.connect();
        await connection.client.schema.createTableIfNotExists('temp_users', (table) => {
            table.increments('id');
        });
        await connection.client.schema.createTableIfNotExists('temp_posts', (table) => {
            table.increments('id');
            table.integer('temp_users_id').unsigned().references('id').inTable('temp_users');
        });
        const client = new QueryClient_1.QueryClient('dual', connection, app.container.use('Adonis/Core/Event'));
        await client.dialect.dropAllTables(['public']);
        assert.isFalse(await connection.client.schema.hasTable('temp_users'));
        assert.isFalse(await connection.client.schema.hasTable('temp_posts'));
        assert.isFalse(await connection.client.schema.hasTable('users'));
        assert.isFalse(await connection.client.schema.hasTable('uuid_users'));
        assert.isFalse(await connection.client.schema.hasTable('follows'));
        assert.isFalse(await connection.client.schema.hasTable('friends'));
        assert.isFalse(await connection.client.schema.hasTable('countries'));
        assert.isFalse(await connection.client.schema.hasTable('skills'));
        assert.isFalse(await connection.client.schema.hasTable('skill_user'));
        assert.isFalse(await connection.client.schema.hasTable('posts'));
        assert.isFalse(await connection.client.schema.hasTable('comments'));
        assert.isFalse(await connection.client.schema.hasTable('profiles'));
        assert.isFalse(await connection.client.schema.hasTable('identities'));
    });
});
