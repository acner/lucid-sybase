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
const test_helpers_1 = require("../../test-helpers");
let db;
let app;
japa_1.default.group('Schema', (group) => {
    group.beforeEach(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        await (0, test_helpers_1.setup)();
    });
    group.afterEach(async () => {
        await db.manager.closeAll();
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
    });
    (0, japa_1.default)('get schema queries defined inside the up method in dry run', async (assert) => {
        class UsersSchema extends (0, test_helpers_1.getBaseSchema)() {
            up() {
                this.schema.createTable('users', (table) => {
                    table.increments('id');
                    table.string('username');
                });
            }
        }
        const schema = new UsersSchema(db.connection(), 'users.ts', true);
        const queries = await schema.execUp();
        const knexSchema = db
            .connection()
            .schema.createTable('users', (table) => {
            table.increments('id');
            table.string('username');
        })
            .toQuery();
        assert.deepEqual(queries, [knexSchema]);
    });
    (0, japa_1.default)('get schema queries defined inside the down method in dry run', async (assert) => {
        class UsersSchema extends (0, test_helpers_1.getBaseSchema)() {
            down() {
                this.schema.dropTable('users');
            }
        }
        const schema = new UsersSchema(db.connection(), 'users.ts', true);
        const queries = await schema.execDown();
        const knexSchema = db.connection().schema.dropTable('users').toQuery();
        assert.deepEqual(queries, [knexSchema]);
    });
    (0, japa_1.default)('get knex raw query builder using now method', async (assert) => {
        class UsersSchema extends (0, test_helpers_1.getBaseSchema)() {
            up() {
                this.schema.createTable('users', (table) => {
                    table.increments('id');
                    table.string('username');
                });
            }
        }
        const schema = new UsersSchema(db.connection(), 'users.ts', true);
        assert.equal(schema.now().toQuery(), 'CURRENT_TIMESTAMP');
    });
    (0, japa_1.default)('do not execute defer calls in dry run', async (assert) => {
        assert.plan(1);
        class UsersSchema extends (0, test_helpers_1.getBaseSchema)() {
            up() {
                assert.isTrue(true);
                this.defer(() => {
                    throw new Error('Not expected to be invoked');
                });
            }
        }
        const schema = new UsersSchema(db.connection(), 'foo.ts', true);
        await schema.execUp();
    });
    (0, japa_1.default)('execute up method queries on a given connection', async (assert) => {
        class UsersSchema extends (0, test_helpers_1.getBaseSchema)() {
            up() {
                this.schema.createTable('schema_users', (table) => {
                    table.increments('id');
                    table.string('username');
                });
                this.schema.createTable('schema_accounts', (table) => {
                    table.increments('id');
                    table.integer('user_id').unsigned().references('schema_users.id');
                });
            }
        }
        const trx = await db.transaction();
        const schema = new UsersSchema(trx, 'users.ts', false);
        try {
            await schema.execUp();
            await trx.commit();
        }
        catch (error) {
            await trx.rollback();
        }
        const hasUsers = await db.connection().schema.hasTable('schema_users');
        const hasAccounts = await db.connection().schema.hasTable('schema_accounts');
        await db.connection().schema.dropTable('schema_accounts');
        await db.connection().schema.dropTable('schema_users');
        assert.isTrue(hasUsers);
        assert.isTrue(hasAccounts);
    });
    (0, japa_1.default)('execute up method deferred actions in correct sequence', async (assert) => {
        class UsersSchema extends (0, test_helpers_1.getBaseSchema)() {
            up() {
                this.schema.createTable('schema_users', (table) => {
                    table.increments('id');
                    table.string('username');
                });
                this.defer(async () => {
                    await this.db.table('schema_users').insert({ username: 'virk' });
                });
                this.schema.createTable('schema_accounts', (table) => {
                    table.increments('id');
                    table.integer('user_id').unsigned().references('schema_users.id');
                });
            }
        }
        const trx = await db.transaction();
        const schema = new UsersSchema(trx, 'users.ts', false);
        try {
            await schema.execUp();
            await trx.commit();
        }
        catch (error) {
            await trx.rollback();
        }
        const user = await db.connection().query().from('schema_users').first();
        assert.equal(user.username, 'virk');
        await db.connection().schema.dropTable('schema_accounts');
        await db.connection().schema.dropTable('schema_users');
    });
    (0, japa_1.default)('execute down method queries on a given connection', async (assert) => {
        class UsersSchema extends (0, test_helpers_1.getBaseSchema)() {
            up() {
                this.schema.createTable('schema_users', (table) => {
                    table.increments('id');
                    table.string('username');
                });
                this.schema.createTable('schema_accounts', (table) => {
                    table.increments('id');
                    table.integer('user_id').unsigned().references('schema_users.id');
                });
            }
            down() {
                if (this.db.dialect.name !== 'sqlite3') {
                    this.schema.table('schema_accounts', (table) => {
                        table.dropForeign(['user_id']);
                    });
                }
                this.schema.dropTable('schema_users');
                this.schema.dropTable('schema_accounts');
            }
        }
        await new UsersSchema(db.connection(), 'users.ts', false).execUp();
        const trx = await db.transaction();
        const schema = new UsersSchema(trx, 'users.ts', false);
        try {
            await schema.execDown();
            await trx.commit();
        }
        catch (error) {
            await trx.rollback();
            console.log(error);
        }
        const hasUsers = await db.connection().schema.hasTable('schema_users');
        const hasAccounts = await db.connection().schema.hasTable('schema_accounts');
        assert.isFalse(hasUsers);
        assert.isFalse(hasAccounts);
    });
    (0, japa_1.default)('use now helper to define default timestamp', async (assert) => {
        class UsersSchema extends (0, test_helpers_1.getBaseSchema)() {
            up() {
                this.schema.createTable('users', (table) => {
                    table.increments('id');
                    table.timestamp('created_at').defaultTo(this.now());
                });
            }
        }
        const schema = new UsersSchema(db.connection(), 'users.ts', true);
        const queries = await schema.execUp();
        const knexSchema = db
            .connection()
            .schema.createTable('users', (table) => {
            table.increments('id');
            table.timestamp('created_at').defaultTo(db.connection().getWriteClient().fn.now());
        })
            .toQuery();
        assert.deepEqual(queries, [knexSchema]);
    });
    (0, japa_1.default)('emit db:query event when schema instructions are executed', async (assert) => {
        assert.plan(10);
        class UsersSchema extends (0, test_helpers_1.getBaseSchema)() {
            up() {
                this.schema.createTable('schema_users', (table) => {
                    table.increments('id');
                    table.string('username');
                });
                this.schema.createTable('schema_accounts', (table) => {
                    table.increments('id');
                    table.integer('user_id').unsigned().references('schema_users.id');
                });
            }
        }
        const trx = await db.transaction();
        trx.debug = true;
        const schema = new UsersSchema(trx, 'users.ts', false);
        app.container.use('Adonis/Core/Event').on('db:query', (query) => {
            assert.property(query, 'sql');
            assert.isTrue(query.inTransaction);
            assert.equal(query.connection, 'primary');
            assert.property(query, 'duration');
            assert.equal(query.method, 'create');
        });
        try {
            await schema.execUp();
            await trx.commit();
        }
        catch (error) {
            await trx.rollback();
        }
        await db.connection().schema.dropTable('schema_accounts');
        await db.connection().schema.dropTable('schema_users');
    });
    (0, japa_1.default)('do not emit db:query debugging is turned off', async () => {
        class UsersSchema extends (0, test_helpers_1.getBaseSchema)() {
            up() {
                this.schema.createTable('schema_users', (table) => {
                    table.increments('id');
                    table.string('username');
                });
                this.schema.createTable('schema_accounts', (table) => {
                    table.increments('id');
                    table.integer('user_id').unsigned().references('schema_users.id');
                });
            }
        }
        const trx = await db.transaction();
        trx.debug = false;
        const schema = new UsersSchema(trx, 'users.ts', false);
        app.container.use('Adonis/Core/Event').on('db:query', () => {
            throw new Error('Never expected to reach here');
        });
        try {
            await schema.execUp();
            await trx.commit();
        }
        catch (error) {
            await trx.rollback();
        }
        await db.connection().schema.dropTable('schema_accounts');
        await db.connection().schema.dropTable('schema_users');
    });
    (0, japa_1.default)('emit db:query when enabled on the schema', async (assert) => {
        assert.plan(10);
        class UsersSchema extends (0, test_helpers_1.getBaseSchema)() {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "debug", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: true
                });
            }
            up() {
                this.schema.createTable('schema_users', (table) => {
                    table.increments('id');
                    table.string('username');
                });
                this.schema.createTable('schema_accounts', (table) => {
                    table.increments('id');
                    table.integer('user_id').unsigned().references('schema_users.id');
                });
            }
        }
        const trx = await db.transaction();
        const schema = new UsersSchema(trx, 'users.ts', false);
        app.container.use('Adonis/Core/Event').on('db:query', (query) => {
            assert.property(query, 'sql');
            assert.isTrue(query.inTransaction);
            assert.equal(query.connection, 'primary');
            assert.property(query, 'duration');
            assert.equal(query.method, 'create');
        });
        try {
            await schema.execUp();
            await trx.commit();
        }
        catch (error) {
            await trx.rollback();
        }
        await db.connection().schema.dropTable('schema_accounts');
        await db.connection().schema.dropTable('schema_users');
    });
});
