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
const japa_1 = __importDefault(require("japa"));
const Connection_1 = require("../../src/Connection");
const test_helpers_1 = require("../../test-helpers");
let app;
japa_1.default.group('Query Builder | insert', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        await (0, test_helpers_1.setup)();
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
    });
    (0, japa_1.default)('perform insert', async (assert) => {
        const connection = new Connection_1.Connection('primary', (0, test_helpers_1.getConfig)(), app.logger);
        connection.connect();
        const db = (0, test_helpers_1.getInsertBuilder)((0, test_helpers_1.getQueryClient)(connection, app));
        const { sql, bindings } = db.table('users').insert({ username: 'virk' }).toSQL();
        const { sql: knexSql, bindings: knexBindings } = connection
            .client.from('users')
            .insert({ username: 'virk' })
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
        await connection.disconnect();
    });
    (0, japa_1.default)('perform multi insert', async (assert) => {
        const connection = new Connection_1.Connection('primary', (0, test_helpers_1.getConfig)(), app.logger);
        connection.connect();
        const db = (0, test_helpers_1.getInsertBuilder)((0, test_helpers_1.getQueryClient)(connection, app));
        const { sql, bindings } = db
            .table('users')
            .multiInsert([{ username: 'virk' }, { username: 'nikk' }])
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = connection
            .client.from('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }])
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
        await connection.disconnect();
    });
    (0, japa_1.default)('define returning columns', async (assert) => {
        const connection = new Connection_1.Connection('primary', (0, test_helpers_1.getConfig)(), app.logger);
        connection.connect();
        const db = (0, test_helpers_1.getInsertBuilder)((0, test_helpers_1.getQueryClient)(connection, app));
        const { sql, bindings } = db
            .table('users')
            .returning(['id', 'username'])
            .multiInsert([{ username: 'virk' }, { username: 'nikk' }])
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = connection
            .client.from('users')
            .returning(['id', 'username'])
            .insert([{ username: 'virk' }, { username: 'nikk' }])
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
        await connection.disconnect();
    });
    (0, japa_1.default)('derive key value from raw query', async (assert) => {
        const connection = new Connection_1.Connection('primary', (0, test_helpers_1.getConfig)(), app.logger);
        connection.connect();
        const db = (0, test_helpers_1.getInsertBuilder)((0, test_helpers_1.getQueryClient)(connection, app));
        const { sql, bindings } = db
            .table('users')
            .insert({
            username: (0, test_helpers_1.getRawQueryBuilder)((0, test_helpers_1.getQueryClient)(connection, app), `ST_GeomFromText(POINT('row.lat_lng'))`),
        })
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = connection
            .client.from('users')
            .insert({
            username: connection.client.raw(`ST_GeomFromText(POINT('row.lat_lng'))`),
        })
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
        await connection.disconnect();
    });
});
