"use strict";
/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../adonis-typings/index.ts" />
const japa_1 = __importDefault(require("japa"));
const Decorators_1 = require("../../src/Orm/Decorators");
const scope_1 = require("../../src/Helpers/scope");
const QueryBuilder_1 = require("../../src/Orm/QueryBuilder");
const test_helpers_1 = require("../../test-helpers");
let db;
let app;
let BaseModel;
japa_1.default.group('Model query builder', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        BaseModel = (0, test_helpers_1.getBaseModel)((0, test_helpers_1.ormAdapter)(db), app);
        await (0, test_helpers_1.setup)();
    });
    group.after(async () => {
        await db.manager.closeAll();
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.resetTables)();
    });
    (0, japa_1.default)('get instance of query builder for the given model', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        assert.instanceOf(User.query(), QueryBuilder_1.ModelQueryBuilder);
    });
    (0, japa_1.default)('pre select the table for the query builder instance', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        assert.equal(User.query().knexQuery['_single'].table, 'users');
    });
    (0, japa_1.default)('execute select queries', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const users = await User.query().where('username', 'virk');
        assert.lengthOf(users, 1);
        assert.instanceOf(users[0], User);
        assert.deepEqual(users[0].$attributes, { id: 1, username: 'virk' });
    });
    (0, japa_1.default)('pass custom connection to the model instance', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const users = await User.query({ connection: 'secondary' }).where('username', 'virk');
        assert.lengthOf(users, 1);
        assert.instanceOf(users[0], User);
        assert.deepEqual(users[0].$attributes, { id: 1, username: 'virk' });
        assert.deepEqual(users[0].$options.connection, 'secondary');
    });
    (0, japa_1.default)('pass sideloaded attributes to the model instance', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const users = await User.query({ connection: 'secondary' })
            .where('username', 'virk')
            .sideload({ loggedInUser: { id: 1 } });
        assert.lengthOf(users, 1);
        assert.instanceOf(users[0], User);
        assert.deepEqual(users[0].$attributes, { id: 1, username: 'virk' });
        assert.deepEqual(users[0].$sideloaded, { loggedInUser: { id: 1 } });
    });
    (0, japa_1.default)('pass custom profiler to the model instance', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const profiler = app.profiler;
        const users = await User.query({ profiler }).where('username', 'virk');
        assert.lengthOf(users, 1);
        assert.instanceOf(users[0], User);
        assert.deepEqual(users[0].$attributes, { id: 1, username: 'virk' });
        assert.deepEqual(users[0].$options.profiler, profiler);
    });
    (0, japa_1.default)('perform update using model query builder', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const rows = await User.query().where('username', 'virk').update({ username: 'hvirk' });
        assert.lengthOf(rows, 1);
        assert.deepEqual(rows, [1]);
        const user = await db.from('users').where('username', 'hvirk').first();
        assert.equal(user.username, 'hvirk');
    });
    (0, japa_1.default)('perform increment using model query builder', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk', points: 1 }]);
        const rows = await User.query().where('username', 'virk').increment('points', 1);
        assert.lengthOf(rows, 1);
        assert.deepEqual(rows, [1]);
        const user = await db.from('users').where('username', 'virk').first();
        assert.equal(user.points, 2);
    });
    (0, japa_1.default)('perform decrement using model query builder', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk', points: 3 }]);
        const rows = await User.query().where('username', 'virk').decrement('points', 1);
        assert.lengthOf(rows, 1);
        assert.deepEqual(rows, [1]);
        const user = await db.from('users').where('username', 'virk').first();
        assert.equal(user.points, 2);
    });
    (0, japa_1.default)('delete in bulk', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const rows = await User.query().where('username', 'virk').del();
        assert.lengthOf(rows, 1);
        assert.deepEqual(rows, [1]);
        const user = await db.from('users').where('username', 'virk').first();
        assert.isNull(user);
    });
    (0, japa_1.default)('clone query builder', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        const query = User.query();
        const clonedQuery = query.clone();
        assert.instanceOf(clonedQuery, QueryBuilder_1.ModelQueryBuilder);
    });
    (0, japa_1.default)('clone query builder with internal flags', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        const query = User.query().groupBy('id');
        const clonedQuery = query.clone();
        assert.isTrue(clonedQuery.hasGroupBy);
    });
    (0, japa_1.default)('pass sideloaded data to cloned query', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk', points: 3 }]);
        const query = User.query().sideload({ username: 'virk' });
        const user = await query.clone().firstOrFail();
        assert.deepEqual(user.$sideloaded, { username: 'virk' });
    });
    (0, japa_1.default)('apply scopes', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "active", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, scope_1.scope)((query) => {
                query.where('is_active', true);
            })
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        const { sql, bindings } = User.query()
            .apply((scopes) => {
            scopes.active();
        })
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('users')
            .where('is_active', true)
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('apply scopes inside a sub query', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "active", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, scope_1.scope)((query) => {
                query.where('is_active', true);
            })
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        const { sql, bindings } = User.query()
            .where((builder) => {
            builder.apply((scopes) => scopes.active());
        })
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('users')
            .where((builder) => builder.where('is_active', true))
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('make aggregate queries with the model query builder', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const users = await User.query().count('* as total');
        assert.equal(Number(users[0].$extras.total), 2);
    });
});
