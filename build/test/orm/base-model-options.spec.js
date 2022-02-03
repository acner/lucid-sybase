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
const test_helpers_1 = require("../../test-helpers");
let db;
let BaseModel;
let app;
japa_1.default.group('Model options | QueryBuilder', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        BaseModel = (0, test_helpers_1.getBaseModel)((0, test_helpers_1.ormAdapter)(db), app);
        await (0, test_helpers_1.setup)();
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
        await db.manager.closeAll();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.resetTables)();
    });
    (0, japa_1.default)('query builder set model options from the query client', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const users = await User.query().exec();
        assert.lengthOf(users, 1);
        assert.equal(users[0].$options.connection, 'primary');
        assert.deepEqual(users[0].$options.profiler, app.profiler);
    });
    (0, japa_1.default)('query builder set model options when only one row is fetched', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.query().first();
        assert.equal(user.$options.connection, 'primary');
        assert.deepEqual(user.$options.profiler, app.profiler);
    });
    (0, japa_1.default)('query builder use transaction when updating rows', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const trx = await db.transaction();
        const users = await User.query({ client: trx }).exec();
        assert.lengthOf(users, 1);
        users[0].username = 'nikk';
        await users[0].save();
        await trx.rollback();
        const usersFresh = await User.query().exec();
        assert.equal(usersFresh[0].username, 'virk');
    });
    (0, japa_1.default)('cleanup transaction reference after commit or rollback', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const trx = await db.transaction();
        const users = await User.query({ client: trx }).exec();
        assert.lengthOf(users, 1);
        await trx.commit();
        assert.isUndefined(users[0].$trx);
        users[0].username = 'nikk';
        await users[0].save();
        const usersFresh = await User.query().exec();
        assert.equal(usersFresh[0].username, 'nikk');
    });
});
japa_1.default.group('Model options | Adapter', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        BaseModel = (0, test_helpers_1.getBaseModel)((0, test_helpers_1.ormAdapter)(db), app);
        await (0, test_helpers_1.setup)();
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
        await db.manager.closeAll();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.resetTables)();
    });
    (0, japa_1.default)('use correct client when custom connection is defined', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.query({ connection: 'secondary' }).first();
        assert.equal(user.$options.connection, 'secondary');
        assert.deepEqual(user.$options.profiler, app.profiler);
    });
    (0, japa_1.default)('pass profiler to the client when defined explicitly', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const profiler = app.profiler;
        const user = await User.query({ profiler }).first();
        assert.equal(user.$options.connection, 'primary');
        assert.deepEqual(user.$options.profiler, profiler);
    });
    (0, japa_1.default)('pass custom client to query builder', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const client = db.connection();
        const user = await User.query({ client }).first();
        assert.equal(user.$options.connection, 'primary');
    });
    (0, japa_1.default)('pass transaction client to query builder', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const trx = await db.connection('secondary').transaction();
        const user = await User.query({ client: trx }).first();
        await trx.rollback();
        assert.equal(user.$options.connection, 'secondary');
    });
});
japa_1.default.group('Model options | Model.find', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        BaseModel = (0, test_helpers_1.getBaseModel)((0, test_helpers_1.ormAdapter)(db), app);
        await (0, test_helpers_1.setup)();
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
        await db.manager.closeAll();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.resetTables)();
    });
    (0, japa_1.default)('define custom connection', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.find(1, { connection: 'secondary' });
        assert.equal(user.$options.connection, 'secondary');
        assert.deepEqual(user.$options.profiler, app.profiler);
    });
    (0, japa_1.default)('define custom profiler', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const profiler = app.profiler;
        const user = await User.find(1, { profiler });
        assert.deepEqual(user.$options.profiler, profiler);
    });
    (0, japa_1.default)('define custom query client', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const client = db.connection();
        const user = await User.find(1, { client });
        assert.deepEqual(user.$options.profiler, client.profiler);
        assert.deepEqual(user.$options.connection, client.connectionName);
    });
});
japa_1.default.group('Model options | Model.findOrFail', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        BaseModel = (0, test_helpers_1.getBaseModel)((0, test_helpers_1.ormAdapter)(db), app);
        await (0, test_helpers_1.setup)();
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
        await db.manager.closeAll();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.resetTables)();
    });
    (0, japa_1.default)('define custom connection', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.findOrFail(1, { connection: 'secondary' });
        assert.equal(user.$options.connection, 'secondary');
        assert.deepEqual(user.$options.profiler, app.profiler);
    });
    (0, japa_1.default)('define custom profiler', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const customDb = (0, test_helpers_1.getDb)(app);
        await customDb.insertQuery().table('users').insert({ username: 'virk' });
        const profiler = app.profiler;
        const user = await User.findOrFail(1, { profiler });
        assert.deepEqual(user.$options.profiler, profiler);
    });
    (0, japa_1.default)('define custom query client', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const client = db.connection('secondary');
        const user = await User.findOrFail(1, { client });
        assert.deepEqual(user.$options.profiler, client.profiler);
        assert.deepEqual(user.$options.connection, client.connectionName);
    });
});
japa_1.default.group('Model options | Model.findMany', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        BaseModel = (0, test_helpers_1.getBaseModel)((0, test_helpers_1.ormAdapter)(db), app);
        await (0, test_helpers_1.setup)();
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
        await db.manager.closeAll();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.resetTables)();
    });
    (0, japa_1.default)('define custom connection', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const users = await User.findMany([1], { connection: 'secondary' });
        assert.equal(users[0].$options.connection, 'secondary');
        assert.deepEqual(users[0].$options.profiler, app.profiler);
    });
    (0, japa_1.default)('define custom profiler', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const profiler = app.profiler;
        const users = await User.findMany([1], { profiler });
        assert.deepEqual(users[0].$options.profiler, profiler);
    });
    (0, japa_1.default)('define custom query client', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const client = db.connection('secondary');
        const users = await User.findMany([1], { client });
        assert.deepEqual(users[0].$options.profiler, client.profiler);
        assert.deepEqual(users[0].$options.connection, client.connectionName);
    });
});
japa_1.default.group('Model options | Model.firstOrCreate', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        BaseModel = (0, test_helpers_1.getBaseModel)((0, test_helpers_1.ormAdapter)(db), app);
        await (0, test_helpers_1.setup)();
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
        await db.manager.closeAll();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.resetTables)();
    });
    (0, japa_1.default)('define custom connection', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.firstOrCreate({ username: 'virk' }, undefined, {
            connection: 'secondary',
        });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 1);
        assert.equal(user.$options.connection, 'secondary');
        assert.deepEqual(user.$options.profiler, app.profiler);
    });
    (0, japa_1.default)('define custom connection when search fails', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.firstOrCreate({ username: 'nikk' }, undefined, {
            connection: 'secondary',
        });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 2);
        assert.equal(user.$options.connection, 'secondary');
        assert.deepEqual(user.$options.profiler, app.profiler);
    });
    (0, japa_1.default)('define custom profiler', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const profiler = app.profiler;
        const user = await User.firstOrCreate({ username: 'virk' }, undefined, { profiler });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 1);
        assert.equal(user.$options.connection, 'primary');
        assert.deepEqual(user.$options.profiler, profiler);
    });
    (0, japa_1.default)('define custom profiler when search fails', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const profiler = app.profiler;
        const user = await User.firstOrCreate({ username: 'nikk' }, undefined, { profiler });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 2);
        assert.deepEqual(user.$options.profiler, profiler);
    });
    (0, japa_1.default)('define custom client', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const client = db.connection('secondary');
        const user = await User.firstOrCreate({ username: 'virk' }, undefined, { client });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 1);
        assert.deepEqual(user.$options.profiler, client.profiler);
        assert.deepEqual(user.$options.connection, client.connectionName);
    });
    (0, japa_1.default)('define custom client when search fails', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const client = db.connection('secondary');
        const user = await User.firstOrCreate({ username: 'nikk' }, undefined, { client });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 2);
        assert.deepEqual(user.$options.profiler, client.profiler);
        assert.deepEqual(user.$options.connection, client.connectionName);
    });
    (0, japa_1.default)('use transaction', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const client = await db.connection('secondary').transaction();
        const user = await User.firstOrCreate({ username: 'virk' }, undefined, { client });
        await client.commit();
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 1);
        assert.deepEqual(user.$options.profiler, client.profiler);
        assert.deepEqual(user.$options.connection, client.connectionName);
    });
    (0, japa_1.default)('use transaction to save when search fails', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const client = await db.connection('secondary').transaction();
        const user = await User.firstOrCreate({ username: 'virk' }, undefined, { client });
        await client.rollback();
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 0);
        assert.deepEqual(user.$options.profiler, client.profiler);
        assert.deepEqual(user.$options.connection, client.connectionName);
    });
});
japa_1.default.group('Model options | Model.fetchOrCreateMany', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        BaseModel = (0, test_helpers_1.getBaseModel)((0, test_helpers_1.ormAdapter)(db), app);
        await (0, test_helpers_1.setup)();
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
        await db.manager.closeAll();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.resetTables)();
    });
    (0, japa_1.default)('define custom connection', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const [user] = await User.fetchOrCreateMany('username', [{ username: 'virk' }], {
            connection: 'secondary',
        });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 1);
        assert.equal(user.$options.connection, 'secondary');
        assert.deepEqual(user.$options.profiler, app.profiler);
    });
    (0, japa_1.default)('define custom connection when search fails', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const [user] = await User.fetchOrCreateMany('username', [{ username: 'virk' }], {
            connection: 'secondary',
        });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 1);
        assert.equal(user.$options.connection, 'secondary');
        assert.deepEqual(user.$options.profiler, app.profiler);
    });
    (0, japa_1.default)('define custom profiler', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const profiler = app.profiler;
        const [user] = await User.fetchOrCreateMany('username', [{ username: 'virk' }], { profiler });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 1);
        assert.equal(user.$options.connection, 'primary');
        assert.deepEqual(user.$options.profiler, profiler);
    });
    (0, japa_1.default)('define custom profiler when search fails', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const profiler = app.profiler;
        const [user] = await User.fetchOrCreateMany('username', [{ username: 'virk' }], { profiler });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 1);
        assert.equal(user.$options.connection, 'primary');
        assert.deepEqual(user.$options.profiler, profiler);
    });
    (0, japa_1.default)('define custom client', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const client = db.connection('secondary');
        const [user] = await User.fetchOrCreateMany('username', [{ username: 'virk' }], { client });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 1);
        assert.deepEqual(user.$options.profiler, client.profiler);
        assert.deepEqual(user.$options.connection, client.connectionName);
    });
    (0, japa_1.default)('define custom client when search fails', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const client = db.connection('secondary');
        const [user] = await User.fetchOrCreateMany('username', [{ username: 'virk' }], { client });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 1);
        assert.deepEqual(user.$options.profiler, client.profiler);
        assert.deepEqual(user.$options.connection, client.connectionName);
    });
    (0, japa_1.default)('wrap create many calls inside a transaction', async (assert) => {
        assert.plan(2);
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
                Object.defineProperty(this, "email", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        try {
            await User.fetchOrCreateMany('username', [
                { username: 'virk', email: 'foo@bar.com' },
                { username: 'nikk', email: 'foo@bar.com' },
                { username: 'romain', email: 'foo@bar.com' },
            ]);
        }
        catch (error) {
            assert.exists(error);
        }
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 0);
    });
    (0, japa_1.default)('use existing transaction when passed', async (assert) => {
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
                Object.defineProperty(this, "email", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        const trx = await db.transaction();
        trx.transaction = async function () {
            throw new Error('Never expected to be invoked');
        };
        await User.fetchOrCreateMany('username', [{ username: 'virk', email: 'foo@bar.com' }], {
            client: trx,
        });
        assert.isFalse(trx.isCompleted);
        await trx.rollback();
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 0);
    });
});
japa_1.default.group('Model options | Model.updateOrCreateMany', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        BaseModel = (0, test_helpers_1.getBaseModel)((0, test_helpers_1.ormAdapter)(db), app);
        await (0, test_helpers_1.setup)();
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
        await db.manager.closeAll();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.resetTables)();
    });
    (0, japa_1.default)('define custom connection', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const [user] = await User.updateOrCreateMany('username', [{ username: 'virk' }], {
            connection: 'secondary',
        });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 1);
        assert.equal(user.$options.connection, 'secondary');
        assert.isDefined(user.$options.profiler);
        assert.isUndefined(user.$trx);
    });
    (0, japa_1.default)('define custom connection when search fails', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const [user] = await User.updateOrCreateMany('username', [{ username: 'virk' }], {
            connection: 'secondary',
        });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 1);
        assert.equal(user.$options.connection, 'secondary');
        assert.isDefined(user.$options.profiler);
        assert.isUndefined(user.$trx);
    });
    (0, japa_1.default)('define custom profiler', async (assert) => {
        assert.plan(4);
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const profiler = app.profiler;
        const originalCreate = profiler.create.bind(profiler);
        profiler.create = function (label) {
            assert.equal(label, 'trx:begin');
            return originalCreate(label);
        };
        const [user] = await User.updateOrCreateMany('username', [{ username: 'virk' }], { profiler });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 1);
        assert.equal(user.$options.connection, 'primary');
        assert.isUndefined(user.$trx);
    });
    (0, japa_1.default)('define custom profiler when search fails', async (assert) => {
        assert.plan(4);
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const profiler = app.profiler;
        const originalCreate = profiler.create.bind(profiler);
        profiler.create = function (label) {
            assert.equal(label, 'trx:begin');
            return originalCreate(label);
        };
        const [user] = await User.updateOrCreateMany('username', [{ username: 'virk' }], { profiler });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 1);
        assert.equal(user.$options.connection, 'primary');
        assert.isUndefined(user.$trx);
    });
    (0, japa_1.default)('define custom client', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const client = db.connection('secondary');
        const [user] = await User.updateOrCreateMany('username', [{ username: 'virk' }], { client });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 1);
        assert.isDefined(user.$options.profiler);
        assert.deepEqual(user.$options.connection, client.connectionName);
    });
    (0, japa_1.default)('define custom client when search fails', async (assert) => {
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
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const client = db.connection('secondary');
        const [user] = await User.updateOrCreateMany('username', [{ username: 'virk' }], { client });
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 1);
        assert.isDefined(user.$options.profiler);
        assert.deepEqual(user.$options.connection, client.connectionName);
    });
    (0, japa_1.default)('wrap update many calls inside a transaction', async (assert) => {
        assert.plan(2);
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
                Object.defineProperty(this, "email", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        try {
            await User.updateOrCreateMany('username', [
                { username: 'virk', email: 'foo@bar.com' },
                { username: 'nikk', email: 'foo@bar.com' },
                { username: 'romain', email: 'foo@bar.com' },
            ]);
        }
        catch (error) {
            assert.exists(error);
        }
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 0);
    });
    (0, japa_1.default)('use existing transaction when passed', async (assert) => {
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
                Object.defineProperty(this, "email", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "$table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        const trx = await db.transaction();
        trx.transaction = async function () {
            throw new Error('Never expected to be invoked');
        };
        await User.updateOrCreateMany('username', [{ username: 'virk', email: 'foo@bar.com' }], {
            client: trx,
        });
        assert.isFalse(trx.isCompleted);
        await trx.rollback();
        const total = await db.from('users').count('*', 'total');
        assert.equal(total[0].total, 0);
    });
});
japa_1.default.group('Model options | Query Builder Preloads', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        BaseModel = (0, test_helpers_1.getBaseModel)((0, test_helpers_1.ormAdapter)(db), app);
        await (0, test_helpers_1.setup)();
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
        await db.manager.closeAll();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.resetTables)();
    });
    (0, japa_1.default)('pass query options to preloaded models', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "displayName", {
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
        ], Profile.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "displayName", void 0);
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
                Object.defineProperty(this, "profile", {
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
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ user_id: 1, display_name: 'Virk' });
        const users = await User.query({ connection: 'secondary' }).preload('profile').exec();
        assert.lengthOf(users, 1);
        assert.equal(users[0].$options.connection, 'secondary');
        assert.deepEqual(users[0].$options.profiler, app.profiler);
        assert.equal(users[0].profile.$options.connection, 'secondary');
        assert.deepEqual(users[0].profile.$options.profiler, app.profiler);
    });
    (0, japa_1.default)('use transaction client to execute preload queries', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "displayName", {
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
        ], Profile.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "displayName", void 0);
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
                Object.defineProperty(this, "profile", {
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
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ user_id: 1, display_name: 'Virk' });
        const trx = await db.transaction();
        const users = await User.query({ client: trx }).preload('profile').exec();
        await trx.commit();
        assert.lengthOf(users, 1);
        assert.equal(users[0].$options.connection, 'primary');
        assert.deepEqual(users[0].$options.profiler, trx.profiler);
        assert.equal(users[0].profile.$options.connection, 'primary');
        assert.deepEqual(users[0].profile.$options.profiler, trx.profiler);
    });
    (0, japa_1.default)('pass profiler to preload models', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "displayName", {
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
        ], Profile.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "displayName", void 0);
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
                Object.defineProperty(this, "profile", {
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
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ user_id: 1, display_name: 'Virk' });
        const profiler = app.profiler;
        const users = await User.query({ profiler }).preload('profile').exec();
        assert.lengthOf(users, 1);
        assert.equal(users[0].$options.connection, 'primary');
        assert.deepEqual(users[0].$options.profiler, profiler);
        assert.equal(users[0].profile.$options.connection, 'primary');
        assert.deepEqual(users[0].profile.$options.profiler, profiler);
    });
    (0, japa_1.default)('pass sideloaded data to preloads', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "displayName", {
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
        ], Profile.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "displayName", void 0);
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
                Object.defineProperty(this, "profile", {
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
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ user_id: 1, display_name: 'Virk' });
        const users = await User.query().sideload({ id: 1 }).preload('profile').exec();
        assert.lengthOf(users, 1);
        assert.equal(users[0].$options.connection, 'primary');
        assert.deepEqual(users[0].$sideloaded, { id: 1 });
        assert.deepEqual(users[0].profile.$sideloaded, { id: 1 });
    });
    (0, japa_1.default)('custom sideloaded data on preload query must win', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "displayName", {
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
        ], Profile.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "displayName", void 0);
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
                Object.defineProperty(this, "profile", {
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
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ user_id: 1, display_name: 'Virk' });
        const users = await User.query()
            .sideload({ id: 1 })
            .preload('profile', (builder) => {
            builder.sideload({ id: 2 });
        })
            .exec();
        assert.lengthOf(users, 1);
        assert.equal(users[0].$options.connection, 'primary');
        assert.deepEqual(users[0].$sideloaded, { id: 1 });
        assert.deepEqual(users[0].profile.$sideloaded, { id: 2 });
    });
    (0, japa_1.default)('use transaction client to update preloaded rows', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "displayName", {
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
        ], Profile.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "displayName", void 0);
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
                Object.defineProperty(this, "profile", {
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
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ user_id: 1, display_name: 'Virk' });
        const trx = await db.transaction();
        const users = await User.query({ client: trx }).preload('profile').exec();
        assert.lengthOf(users, 1);
        users[0].profile.displayName = 'Nikk';
        await users[0].profile.save();
        await trx.rollback();
        const profiles = await Profile.all();
        assert.lengthOf(profiles, 1);
        assert.equal(profiles[0].displayName, 'Virk');
    });
    (0, japa_1.default)('cleanup transaction reference after commit or rollback', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "displayName", {
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
        ], Profile.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "displayName", void 0);
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
                Object.defineProperty(this, "profile", {
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
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ user_id: 1, display_name: 'Virk' });
        const trx = await db.transaction();
        const users = await User.query({ client: trx }).preload('profile').exec();
        assert.lengthOf(users, 1);
        await trx.commit();
        assert.isUndefined(users[0].$trx);
        assert.isUndefined(users[0].profile.$trx);
        users[0].profile.displayName = 'Nikk';
        await users[0].profile.save();
        const profiles = await Profile.all();
        assert.lengthOf(profiles, 1);
        assert.equal(profiles[0].displayName, 'Nikk');
    });
});
japa_1.default.group('Model options | Model Preloads', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        BaseModel = (0, test_helpers_1.getBaseModel)((0, test_helpers_1.ormAdapter)(db), app);
        await (0, test_helpers_1.setup)();
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
        await db.manager.closeAll();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.resetTables)();
    });
    (0, japa_1.default)('pass query options to preloaded models', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "displayName", {
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
        ], Profile.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "displayName", void 0);
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
                Object.defineProperty(this, "profile", {
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
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ user_id: 1, display_name: 'Virk' });
        const user = await User.query({ connection: 'secondary' }).firstOrFail();
        assert.equal(user.$options.connection, 'secondary');
        await user.load('profile');
        assert.equal(user.profile.$options.connection, 'secondary');
        assert.deepEqual(user.profile.$options.profiler, app.profiler);
    });
    (0, japa_1.default)('pass profiler to preload models', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "displayName", {
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
        ], Profile.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "displayName", void 0);
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
                Object.defineProperty(this, "profile", {
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
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ user_id: 1, display_name: 'Virk' });
        const profiler = app.profiler;
        const user = await User.query({ profiler }).firstOrFail();
        assert.equal(user.$options.connection, 'primary');
        assert.deepEqual(user.$options.profiler, profiler);
        await user.load('profile');
        assert.equal(user.profile.$options.connection, 'primary');
        assert.deepEqual(user.profile.$options.profiler, profiler);
    });
    (0, japa_1.default)('pass sideloaded data to preloads', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "displayName", {
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
        ], Profile.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "displayName", void 0);
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
                Object.defineProperty(this, "profile", {
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
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ user_id: 1, display_name: 'Virk' });
        const user = await User.query().sideload({ id: 1 }).firstOrFail();
        assert.deepEqual(user.$sideloaded, { id: 1 });
        await user.load('profile');
        assert.deepEqual(user.profile.$sideloaded, { id: 1 });
    });
    (0, japa_1.default)('custom sideloaded data on preload query must win', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "displayName", {
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
        ], Profile.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "displayName", void 0);
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
                Object.defineProperty(this, "profile", {
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
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ user_id: 1, display_name: 'Virk' });
        const user = await User.query().sideload({ id: 1 }).firstOrFail();
        assert.deepEqual(user.$sideloaded, { id: 1 });
        await user.load('profile', (query) => query.sideload({ id: 2 }));
        assert.deepEqual(user.profile.$sideloaded, { id: 2 });
    });
});
