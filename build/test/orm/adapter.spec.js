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
japa_1.default.group('Adapter', (group) => {
    group.beforeEach(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        BaseModel = (0, test_helpers_1.getBaseModel)((0, test_helpers_1.ormAdapter)(db), app);
        await (0, test_helpers_1.setup)();
    });
    group.afterEach(async () => {
        await db.manager.closeAll();
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
    });
    (0, japa_1.default)('make insert call using a model', async (assert) => {
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
        User.boot();
        const user = new User();
        user.username = 'virk';
        await user.save();
        assert.exists(user.id);
        assert.deepEqual(user.$attributes, { username: 'virk', id: user.id });
        assert.isFalse(user.$isDirty);
        assert.isTrue(user.$isPersisted);
    });
    (0, japa_1.default)('make update call using a model', async (assert) => {
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
        User.boot();
        const user = new User();
        user.username = 'virk';
        await user.save();
        assert.exists(user.id);
        assert.deepEqual(user.$attributes, { username: 'virk', id: user.id });
        assert.isFalse(user.$isDirty);
        assert.isTrue(user.$isPersisted);
        user.username = 'nikk';
        assert.isTrue(user.$isDirty);
        assert.deepEqual(user.$dirty, { username: 'nikk' });
        await user.save();
    });
    (0, japa_1.default)('make delete call using a model', async (assert) => {
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
        User.boot();
        const user = new User();
        user.username = 'virk';
        await user.save();
        assert.exists(user.id);
        assert.deepEqual(user.$attributes, { username: 'virk', id: user.id });
        assert.isFalse(user.$isDirty);
        assert.isTrue(user.$isPersisted);
        await user.delete();
        assert.isTrue(user.$isDeleted);
        const users = await db.from('users').select('*');
        assert.lengthOf(users, 0);
    });
    (0, japa_1.default)('get array of model instances using the all call', async (assert) => {
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
        User.boot();
        await db
            .table('users')
            .returning('id')
            .multiInsert([{ username: 'virk' }, { username: 'nikk' }]);
        const users = await User.all();
        assert.lengthOf(users, 2);
        assert.instanceOf(users[0], User);
        assert.instanceOf(users[1], User);
        assert.isFalse(users[0].$isDirty);
        assert.isFalse(users[1].$isDirty);
        assert.deepEqual(users[0].$attributes, { id: 2, username: 'nikk' });
        assert.deepEqual(users[1].$attributes, { id: 1, username: 'virk' });
    });
    (0, japa_1.default)('use transaction client set on the model for the insert', async (assert) => {
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
        User.boot();
        const trx = await db.transaction();
        const user = new User();
        user.$trx = trx;
        user.username = 'virk';
        await user.save();
        await trx.commit();
        const totalUsers = await db.from('users').count('*', 'total');
        assert.equal(totalUsers[0].total, 1);
        assert.exists(user.id);
        assert.isUndefined(user.$trx);
        assert.deepEqual(user.$attributes, { username: 'virk', id: user.id });
        assert.isFalse(user.$isDirty);
        assert.isTrue(user.$isPersisted);
    });
    (0, japa_1.default)('do not insert when transaction rollbacks', async (assert) => {
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
        User.boot();
        const trx = await db.transaction();
        const user = new User();
        user.$trx = trx;
        user.username = 'virk';
        await user.save();
        await trx.rollback();
        const totalUsers = await db.from('users').count('*', 'total');
        assert.equal(totalUsers[0].total, 0);
        assert.exists(user.id);
        assert.isUndefined(user.$trx);
        assert.deepEqual(user.$attributes, { username: 'virk', id: user.id });
        assert.isFalse(user.$isDirty);
        assert.isTrue(user.$isPersisted);
    });
    (0, japa_1.default)('cleanup old trx event listeners when transaction is updated', async (assert) => {
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
        User.boot();
        const trx = await db.transaction();
        const trx1 = await trx.transaction();
        const user = new User();
        user.$trx = trx1;
        user.$trx = trx;
        user.username = 'virk';
        await trx1.rollback();
        assert.deepEqual(user.$trx, trx);
        await trx.rollback();
    });
    (0, japa_1.default)('use transaction client set on the model for the update', async (assert) => {
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
        User.boot();
        const user = new User();
        user.username = 'virk';
        await user.save();
        assert.exists(user.id);
        assert.deepEqual(user.$attributes, { username: 'virk', id: user.id });
        assert.isFalse(user.$isDirty);
        assert.isTrue(user.$isPersisted);
        const trx = await db.transaction();
        user.$trx = trx;
        user.username = 'nikk';
        await user.save();
        await trx.rollback();
        const users = await db.from('users');
        assert.lengthOf(users, 1);
        assert.equal(users[0].username, 'virk');
    });
    (0, japa_1.default)('use transaction client set on the model for the delete', async (assert) => {
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
        User.boot();
        const user = new User();
        user.username = 'virk';
        await user.save();
        assert.exists(user.id);
        assert.deepEqual(user.$attributes, { username: 'virk', id: user.id });
        assert.isFalse(user.$isDirty);
        assert.isTrue(user.$isPersisted);
        const trx = await db.transaction();
        user.$trx = trx;
        await user.delete();
        await trx.rollback();
        const users = await db.from('users').select('*');
        assert.lengthOf(users, 1);
    });
    (0, japa_1.default)('set primary key value when colun name is different from attribute name', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userId", {
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
            (0, Decorators_1.column)({ isPrimary: true, columnName: 'id' }),
            __metadata("design:type", Number)
        ], User.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.boot();
        const user = new User();
        user.username = 'virk';
        await user.save();
        assert.exists(user.userId);
        assert.deepEqual(user.$attributes, { username: 'virk', userId: user.userId });
        assert.isFalse(user.$isDirty);
        assert.isTrue(user.$isPersisted);
    });
});
