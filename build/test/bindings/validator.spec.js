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
const Rules_1 = require("@adonisjs/validator/build/src/Rules");
const Schema_1 = require("@adonisjs/validator/build/src/Schema");
const Validator_1 = require("../../src/Bindings/Validator");
const Validator_2 = require("@adonisjs/validator/build/src/Validator");
const test_helpers_1 = require("../../test-helpers");
const luxon_1 = require("luxon");
let app;
let db;
japa_1.default.group('Validator | exists', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        await (0, test_helpers_1.setup)();
        (0, Validator_1.extendValidator)(Validator_2.validator, db, app.logger);
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
        await db.manager.closeAll();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.resetTables)();
        db.connection().getReadClient().removeAllListeners();
    });
    (0, japa_1.default)("must fail when row doesn't exists in the table", async (assert) => {
        assert.plan(1);
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.exists({
                            table: 'users',
                            column: 'id',
                        }),
                    ]),
                }),
                data: { id: 1 },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['exists validation failure'],
            });
        }
    });
    (0, japa_1.default)('work fine when row exists', async (assert) => {
        assert.plan(2);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        await Validator_2.validator.validate({
            schema: Schema_1.schema.create({
                id: Schema_1.schema.number([
                    Rules_1.rules.exists({
                        table: 'users',
                        column: 'id',
                    }),
                ]),
            }),
            data: { id: userId },
        });
    });
    (0, japa_1.default)('add where contraints', async (assert) => {
        assert.plan(3);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .where('username', 'nikk')
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.exists({
                            table: 'users',
                            column: 'id',
                            where: {
                                username: 'nikk',
                            },
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['exists validation failure'],
            });
        }
    });
    (0, japa_1.default)('add where contraints with refs', async (assert) => {
        assert.plan(3);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .where('username', 'nikk')
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            const refs = Schema_1.schema.refs({
                username: 'nikk',
            });
            await Validator_2.validator.validate({
                refs,
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.exists({
                            table: 'users',
                            column: 'id',
                            where: {
                                username: refs.username,
                            },
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['exists validation failure'],
            });
        }
    });
    (0, japa_1.default)('add wherein contraints', async (assert) => {
        assert.plan(3);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .whereIn('username', ['nikk', 'romain'])
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.exists({
                            table: 'users',
                            column: 'id',
                            where: {
                                username: ['nikk', 'romain'],
                            },
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['exists validation failure'],
            });
        }
    });
    (0, japa_1.default)('add wherein contraints with refs', async (assert) => {
        assert.plan(3);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .whereIn('username', ['nikk', 'romain'])
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            const refs = Schema_1.schema.refs({
                username: ['nikk', 'romain'],
            });
            await Validator_2.validator.validate({
                refs,
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.exists({
                            table: 'users',
                            column: 'id',
                            where: {
                                username: refs.username,
                            },
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['exists validation failure'],
            });
        }
    });
    (0, japa_1.default)('add where not constraints', async (assert) => {
        assert.plan(3);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .whereNot('username', 'virk')
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.exists({
                            table: 'users',
                            column: 'id',
                            whereNot: {
                                username: 'virk',
                            },
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['exists validation failure'],
            });
        }
    });
    (0, japa_1.default)('add where not constraints with refs', async (assert) => {
        assert.plan(3);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .whereNot('username', 'virk')
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            const refs = Schema_1.schema.refs({
                username: 'virk',
            });
            await Validator_2.validator.validate({
                refs,
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.exists({
                            table: 'users',
                            column: 'id',
                            whereNot: {
                                username: refs.username,
                            },
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['exists validation failure'],
            });
        }
    });
    (0, japa_1.default)('add where not in constraints', async (assert) => {
        assert.plan(3);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .whereNotIn('username', ['virk', 'nikk'])
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.exists({
                            table: 'users',
                            column: 'id',
                            whereNot: {
                                username: ['virk', 'nikk'],
                            },
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['exists validation failure'],
            });
        }
    });
    (0, japa_1.default)('add where not in constraints with refs', async (assert) => {
        assert.plan(3);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .whereNotIn('username', ['virk', 'nikk'])
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            const refs = Schema_1.schema.refs({
                username: ['virk', 'nikk'],
            });
            await Validator_2.validator.validate({
                refs,
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.exists({
                            table: 'users',
                            column: 'id',
                            whereNot: {
                                username: refs.username,
                            },
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['exists validation failure'],
            });
        }
    });
    (0, japa_1.default)('perform case-insensitive query', async (assert) => {
        assert.plan(2);
        await db.table('users').returning('id').insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .whereRaw(`lower(username) = ?`, [db.connection().knexRawQuery(`lower(?)`, ['VIRK'])])
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        await Validator_2.validator.validate({
            schema: Schema_1.schema.create({
                username: Schema_1.schema.string({}, [
                    Rules_1.rules.exists({
                        table: 'users',
                        caseInsensitive: true,
                        column: 'username',
                    }),
                ]),
            }),
            data: { username: 'VIRK' },
        });
    });
    (0, japa_1.default)('do not report SQL errors to the validator', async (assert) => {
        assert.plan(1);
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    username: Schema_1.schema.string({}, [
                        Rules_1.rules.exists({
                            table: 'invalid_users',
                            caseInsensitive: true,
                            column: 'username',
                        }),
                    ]),
                }),
                data: { username: 'VIRK' },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                username: ['exists validation failure'],
            });
        }
    });
    (0, japa_1.default)('make correct sql query schema field is of date type', async (assert) => {
        assert.plan(3);
        let sql;
        let bindings;
        let knexSql;
        let knexBindings;
        db.connection()
            .getReadClient()
            .on('query', (query) => {
            sql = query.sql;
            bindings = query.bindings;
            const client = db.connection();
            const knexQuery = client
                .getReadClient()
                .select(1)
                .from('users')
                .where('created_at', luxon_1.DateTime.fromISO('2020-10-20').toFormat(client.dialect.dateTimeFormat))
                .limit(1)
                .toSQL()
                .toNative();
            knexSql = knexQuery.sql;
            knexBindings = knexQuery.bindings;
        });
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.date({}, [
                        Rules_1.rules.exists({
                            table: 'users',
                            column: 'created_at',
                        }),
                    ]),
                }),
                data: { id: '2020-10-20' },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['exists validation failure'],
            });
        }
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('define custom format datetime values', async (assert) => {
        assert.plan(3);
        let sql;
        let bindings;
        let knexSql;
        let knexBindings;
        db.connection()
            .getReadClient()
            .on('query', (query) => {
            sql = query.sql;
            bindings = query.bindings;
            const knexQuery = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('created_at', '2020-10-20')
                .limit(1)
                .toSQL()
                .toNative();
            knexSql = knexQuery.sql;
            knexBindings = knexQuery.bindings;
        });
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.date({}, [
                        Rules_1.rules.exists({
                            table: 'users',
                            dateFormat: 'yyyy-LL-dd',
                            column: 'created_at',
                        }),
                    ]),
                }),
                data: { id: '2020-10-20' },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['exists validation failure'],
            });
        }
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
japa_1.default.group('Validator | unique', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        await (0, test_helpers_1.setup)();
        (0, Validator_1.extendValidator)(Validator_2.validator, db, app.logger);
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
        await db.manager.closeAll();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.resetTables)();
        db.connection().getReadClient().removeAllListeners();
    });
    (0, japa_1.default)('must fail when row already exists in the table', async (assert) => {
        assert.plan(1);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk' });
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.unique({
                            table: 'users',
                            column: 'id',
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['unique validation failure'],
            });
        }
    });
    (0, japa_1.default)('work fine when row is missing', async () => {
        await Validator_2.validator.validate({
            schema: Schema_1.schema.create({
                id: Schema_1.schema.number([
                    Rules_1.rules.unique({
                        table: 'users',
                        column: 'id',
                    }),
                ]),
            }),
            data: { id: 1 },
        });
    });
    (0, japa_1.default)('add where contraints', async (assert) => {
        assert.plan(3);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .where('username', 'virk')
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.unique({
                            table: 'users',
                            column: 'id',
                            where: {
                                username: 'virk',
                            },
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['unique validation failure'],
            });
        }
    });
    (0, japa_1.default)('add where contraints with refs', async (assert) => {
        assert.plan(3);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .where('username', 'virk')
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            const refs = Schema_1.schema.refs({
                username: 'virk',
            });
            await Validator_2.validator.validate({
                refs,
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.unique({
                            table: 'users',
                            column: 'id',
                            where: {
                                username: refs.username,
                            },
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['unique validation failure'],
            });
        }
    });
    (0, japa_1.default)('add where in contraints', async (assert) => {
        assert.plan(3);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .whereIn('username', ['virk', 'nikk'])
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.unique({
                            table: 'users',
                            column: 'id',
                            where: {
                                username: ['virk', 'nikk'],
                            },
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['unique validation failure'],
            });
        }
    });
    (0, japa_1.default)('add where in contraints with refs', async (assert) => {
        assert.plan(3);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .whereIn('username', ['virk', 'nikk'])
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            const refs = Schema_1.schema.refs({
                username: ['virk', 'nikk'],
            });
            await Validator_2.validator.validate({
                refs,
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.unique({
                            table: 'users',
                            column: 'id',
                            where: {
                                username: refs.username,
                            },
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['unique validation failure'],
            });
        }
    });
    (0, japa_1.default)('add whereNot contraints', async (assert) => {
        assert.plan(3);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .whereNot('username', 'nikk')
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.unique({
                            table: 'users',
                            column: 'id',
                            whereNot: {
                                username: 'nikk',
                            },
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['unique validation failure'],
            });
        }
    });
    (0, japa_1.default)('add whereNot contraints with refs', async (assert) => {
        assert.plan(3);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .whereNot('username', 'nikk')
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            const refs = Schema_1.schema.refs({
                username: 'nikk',
            });
            await Validator_2.validator.validate({
                refs,
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.unique({
                            table: 'users',
                            column: 'id',
                            whereNot: {
                                username: refs.username,
                            },
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['unique validation failure'],
            });
        }
    });
    (0, japa_1.default)('add whereNot in contraints', async (assert) => {
        assert.plan(3);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk', country_id: 4 });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .whereNotIn('country_id', [1, 2])
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.unique({
                            table: 'users',
                            column: 'id',
                            whereNot: {
                                country_id: [1, 2],
                            },
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['unique validation failure'],
            });
        }
    });
    (0, japa_1.default)('add whereNot in contraints with refs', async (assert) => {
        assert.plan(3);
        const [userId] = await db
            .table('users')
            .returning('id')
            .insert({ email: 'virk@adonisjs.com', username: 'virk', country_id: 4 });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('id', userId)
                .whereNotIn('country_id', [1, 2])
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            const refs = Schema_1.schema.refs({
                country: [1, 2],
            });
            await Validator_2.validator.validate({
                refs,
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.number([
                        Rules_1.rules.unique({
                            table: 'users',
                            column: 'id',
                            whereNot: {
                                country_id: refs.country,
                            },
                        }),
                    ]),
                }),
                data: { id: userId },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['unique validation failure'],
            });
        }
    });
    (0, japa_1.default)('perform case-insensitive check', async (assert) => {
        assert.plan(3);
        await db.table('users').returning('id').insert({ email: 'virk@adonisjs.com', username: 'virk' });
        db.connection()
            .getReadClient()
            .on('query', ({ sql, bindings }) => {
            const { sql: knexSql, bindings: knexBindings } = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .whereRaw(`lower(username) = ?`, [db.connection().knexRawQuery(`lower(?)`, ['VIRK'])])
                .limit(1)
                .toSQL()
                .toNative();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    username: Schema_1.schema.string({}, [
                        Rules_1.rules.unique({
                            table: 'users',
                            column: 'username',
                            caseInsensitive: true,
                        }),
                    ]),
                }),
                data: { username: 'VIRK' },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                username: ['unique validation failure'],
            });
        }
    });
    (0, japa_1.default)('do not report SQL errors to the validator', async (assert) => {
        assert.plan(1);
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    username: Schema_1.schema.string({}, [
                        Rules_1.rules.unique({
                            table: 'invalid_users',
                            column: 'username',
                            caseInsensitive: true,
                        }),
                    ]),
                }),
                data: { username: 'VIRK' },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                username: ['unique validation failure'],
            });
        }
    });
    (0, japa_1.default)('make correct sql query schema field is of date type', async (assert) => {
        assert.plan(3);
        await db
            .table('users')
            .insert({ email: 'virk@adonisjs.com', username: 'virk', created_at: '2020-10-20 00:00:00' });
        let sql;
        let bindings;
        let knexSql;
        let knexBindings;
        db.connection()
            .getReadClient()
            .on('query', (query) => {
            sql = query.sql;
            bindings = query.bindings;
            const client = db.connection();
            const knexQuery = client
                .getReadClient()
                .select(1)
                .from('users')
                .where('created_at', luxon_1.DateTime.fromISO('2020-10-20').toFormat(client.dialect.dateTimeFormat))
                .limit(1)
                .toSQL()
                .toNative();
            knexSql = knexQuery.sql;
            knexBindings = knexQuery.bindings;
        });
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.date({}, [
                        Rules_1.rules.unique({
                            table: 'users',
                            column: 'created_at',
                        }),
                    ]),
                }),
                data: { id: '2020-10-20' },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['unique validation failure'],
            });
        }
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('define custom format datetime values', async (assert) => {
        assert.plan(3);
        await db
            .table('users')
            .insert({ email: 'virk@adonisjs.com', username: 'virk', created_at: '2020-10-20' });
        let sql;
        let bindings;
        let knexSql;
        let knexBindings;
        db.connection()
            .getReadClient()
            .on('query', (query) => {
            sql = query.sql;
            bindings = query.bindings;
            const knexQuery = db
                .connection()
                .getReadClient()
                .select(1)
                .from('users')
                .where('created_at', '2020-10-20')
                .limit(1)
                .toSQL()
                .toNative();
            knexSql = knexQuery.sql;
            knexBindings = knexQuery.bindings;
        });
        try {
            await Validator_2.validator.validate({
                schema: Schema_1.schema.create({
                    id: Schema_1.schema.date({}, [
                        Rules_1.rules.unique({
                            table: 'users',
                            dateFormat: 'yyyy-LL-dd',
                            column: 'created_at',
                        }),
                    ]),
                }),
                data: { id: '2020-10-20' },
            });
        }
        catch (error) {
            assert.deepEqual(error.messages, {
                id: ['unique validation failure'],
            });
        }
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
