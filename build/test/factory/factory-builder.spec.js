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
const index_1 = require("../../src/Factory/index");
const FactoryContext_1 = require("../../src/Factory/FactoryContext");
const FactoryBuilder_1 = require("../../src/Factory/FactoryBuilder");
const test_helpers_1 = require("../../test-helpers");
let db;
let app;
let BaseModel;
const FactoryModel = (0, test_helpers_1.getFactoryModel)();
const factoryManager = new index_1.FactoryManager();
japa_1.default.group('Factory | Factory Builder | make', (group) => {
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
    (0, japa_1.default)('apply factory model state', async (assert) => {
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .state('withPoints', (user) => (user.points = 10))
            .build();
        const user = await factory.apply('withPoints').makeStubbed();
        assert.equal(user.points, 10);
        assert.exists(user.id);
        assert.isFalse(user.$isPersisted);
    });
    (0, japa_1.default)('applying a state twice must be a noop', async (assert) => {
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
                Object.defineProperty(this, "points", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: 0
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .state('withPoints', (user) => {
            user.points += 10;
        })
            .build();
        const user = await factory.apply('withPoints').apply('withPoints').makeStubbed();
        assert.equal(user.points, 10);
        assert.exists(user.id);
        assert.isFalse(user.$isPersisted);
    });
    (0, japa_1.default)('merge custom attributes', async (assert) => {
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {
                username: 'virk',
            };
        }, factoryManager).build();
        const user = await factory.merge({ username: 'nikk' }).makeStubbed();
        assert.equal(user.username, 'nikk');
        assert.exists(user.id);
        assert.isFalse(user.$isPersisted);
    });
    (0, japa_1.default)('define custom merge function', async (assert) => {
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {
                username: 'virk',
            };
        }, factoryManager)
            .merge(() => { })
            .build();
        const user = await factory.merge({ username: 'nikk' }).makeStubbed();
        assert.equal(user.username, 'virk');
        assert.exists(user.id);
        assert.isFalse(user.$isPersisted);
    });
    (0, japa_1.default)('define custom newUp function', async (assert) => {
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {
                username: 'virk',
            };
        }, factoryManager)
            .newUp((attributes) => {
            const user = new User();
            user.fill(attributes);
            user.$extras = { invoked: true };
            return user;
        })
            .merge(() => { })
            .build();
        const user = await factory.makeStubbed();
        assert.equal(user.username, 'virk');
        assert.exists(user.id);
        assert.deepEqual(user.$extras, { invoked: true });
        assert.isFalse(user.$isPersisted);
    });
    (0, japa_1.default)('use 0 index elements when attributes are defined as an array', async (assert) => {
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {
                username: 'virk',
            };
        }, factoryManager).build();
        const user = await factory.merge([{ username: 'nikk' }, { username: 'romain' }]).makeStubbed();
        assert.equal(user.username, 'nikk');
        assert.exists(user.id);
        assert.isFalse(user.$isPersisted);
    });
    (0, japa_1.default)('invoke after make hook', async (assert) => {
        assert.plan(6);
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {
                username: 'virk',
            };
        }, factoryManager)
            .after('make', (_, user, ctx) => {
            assert.instanceOf(_, FactoryBuilder_1.FactoryBuilder);
            assert.instanceOf(user, User);
            assert.instanceOf(ctx, FactoryContext_1.FactoryContext);
        })
            .build();
        const user = await factory.makeStubbed();
        assert.equal(user.username, 'virk');
        assert.exists(user.id);
        assert.isFalse(user.$isPersisted);
    });
    (0, japa_1.default)('invoke after makeStubbed hook', async (assert) => {
        assert.plan(6);
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {
                username: 'virk',
            };
        }, factoryManager)
            .after('makeStubbed', (_, user, ctx) => {
            assert.instanceOf(_, FactoryBuilder_1.FactoryBuilder);
            assert.instanceOf(user, User);
            assert.instanceOf(ctx, FactoryContext_1.FactoryContext);
        })
            .build();
        const user = await factory.makeStubbed();
        assert.equal(user.username, 'virk');
        assert.exists(user.id);
        assert.isFalse(user.$isPersisted);
    });
    (0, japa_1.default)('define custom id inside make hook', async (assert) => {
        assert.plan(3);
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {
                username: 'virk',
            };
        }, factoryManager)
            .after('make', (_, user, ctx) => {
            if (ctx.isStubbed) {
                user.id = 100;
            }
        })
            .build();
        const user = await factory.makeStubbed();
        assert.equal(user.username, 'virk');
        assert.equal(user.id, 100);
        assert.isFalse(user.$isPersisted);
    });
});
japa_1.default.group('Factory | Factory Builder | makeMany', (group) => {
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
    (0, japa_1.default)('apply factory model state', async (assert) => {
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .state('withPoints', (user) => (user.points = 10))
            .build();
        const users = await factory.apply('withPoints').makeStubbedMany(2);
        assert.lengthOf(users, 2);
        assert.exists(users[0].id);
        assert.equal(users[0].points, 10);
        assert.isFalse(users[0].$isPersisted);
        assert.exists(users[1].id);
        assert.equal(users[1].points, 10);
        assert.isFalse(users[1].$isPersisted);
    });
    (0, japa_1.default)('applying a state twice must be a noop', async (assert) => {
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
                Object.defineProperty(this, "points", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: 0
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .state('withPoints', (user) => (user.points += 10))
            .build();
        const users = await factory.apply('withPoints').apply('withPoints').makeStubbedMany(2);
        assert.lengthOf(users, 2);
        assert.exists(users[0].id);
        assert.equal(users[0].points, 10);
        assert.isFalse(users[0].$isPersisted);
        assert.exists(users[1].id);
        assert.equal(users[1].points, 10);
        assert.isFalse(users[1].$isPersisted);
    });
    (0, japa_1.default)('define custom attributes accepted by the newUp method', async (assert) => {
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {
                username: 'virk',
            };
        }, factoryManager).build();
        const users = await factory.merge({ username: 'nikk' }).makeStubbedMany(2);
        assert.lengthOf(users, 2);
        assert.exists(users[0].id);
        assert.equal(users[0].username, 'nikk');
        assert.isFalse(users[0].$isPersisted);
        assert.exists(users[1].id);
        assert.equal(users[1].username, 'nikk');
        assert.isFalse(users[1].$isPersisted);
    });
    (0, japa_1.default)('define index specific attributes for makeMany', async (assert) => {
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {
                username: 'virk',
            };
        }, factoryManager).build();
        const users = await factory
            .merge([{ username: 'nikk' }, { username: 'romain' }])
            .makeStubbedMany(2);
        assert.lengthOf(users, 2);
        assert.exists(users[0].id);
        assert.equal(users[0].username, 'nikk');
        assert.isFalse(users[0].$isPersisted);
        assert.exists(users[1].id);
        assert.equal(users[1].username, 'romain');
        assert.isFalse(users[1].$isPersisted);
    });
    (0, japa_1.default)('run makeStubbed hook for all the model instances', async (assert) => {
        assert.plan(15);
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .after('makeStubbed', (_, user, ctx) => {
            assert.instanceOf(_, FactoryBuilder_1.FactoryBuilder);
            assert.instanceOf(user, User);
            assert.instanceOf(ctx, FactoryContext_1.FactoryContext);
            assert.equal(user.points, 10);
        })
            .state('withPoints', (user) => (user.points = 10))
            .build();
        const users = await factory.apply('withPoints').makeStubbedMany(2);
        assert.lengthOf(users, 2);
        assert.exists(users[0].id);
        assert.equal(users[0].points, 10);
        assert.isFalse(users[0].$isPersisted);
        assert.exists(users[1].id);
        assert.equal(users[1].points, 10);
        assert.isFalse(users[1].$isPersisted);
    });
    (0, japa_1.default)('run make hook for all the model instances', async (assert) => {
        assert.plan(15);
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .after('make', (_, user, ctx) => {
            assert.instanceOf(_, FactoryBuilder_1.FactoryBuilder);
            assert.instanceOf(user, User);
            assert.instanceOf(ctx, FactoryContext_1.FactoryContext);
            assert.equal(user.points, 10);
        })
            .state('withPoints', (user) => (user.points = 10))
            .build();
        const users = await factory.apply('withPoints').makeStubbedMany(2);
        assert.lengthOf(users, 2);
        assert.exists(users[0].id);
        assert.equal(users[0].points, 10);
        assert.isFalse(users[0].$isPersisted);
        assert.exists(users[1].id);
        assert.equal(users[1].points, 10);
        assert.isFalse(users[1].$isPersisted);
    });
});
japa_1.default.group('Factory | Factory Builder | create', (group) => {
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
    (0, japa_1.default)('apply factory model state', async (assert) => {
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .state('withPoints', (user) => (user.points = 10))
            .build();
        const user = await factory.apply('withPoints').create();
        assert.equal(user.points, 10);
        assert.isTrue(user.$isPersisted);
    });
    (0, japa_1.default)('applying a state twice must be a noop', async (assert) => {
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
                Object.defineProperty(this, "points", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: 0
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .state('withPoints', (user) => (user.points += 10))
            .build();
        const user = await factory.apply('withPoints').apply('withPoints').create();
        assert.equal(user.points, 10);
        assert.isTrue(user.$isPersisted);
    });
    (0, japa_1.default)('define custom attributes accepted by the newUp method', async (assert) => {
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {
                username: 'virk',
            };
        }, factoryManager).build();
        const user = await factory.merge({ username: 'nikk' }).create();
        assert.equal(user.username, 'nikk');
        assert.isTrue(user.$isPersisted);
    });
    (0, japa_1.default)('use index 0 elements when attributes are defined as an array', async (assert) => {
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {
                username: 'virk',
            };
        }, factoryManager).build();
        const user = await factory.merge([{ username: 'nikk' }, { username: 'romain' }]).create();
        assert.equal(user.username, 'nikk');
        assert.isTrue(user.$isPersisted);
    });
    (0, japa_1.default)('invoke before and after create hook', async (assert) => {
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .before('create', (_, user) => {
            assert.isFalse(user.$isPersisted);
        })
            .after('create', (_, user) => {
            assert.isTrue(user.$isPersisted);
        })
            .state('withPoints', (user) => (user.points = 10))
            .build();
        const user = await factory.apply('withPoints').create();
        assert.equal(user.points, 10);
        assert.isTrue(user.$isPersisted);
    });
    (0, japa_1.default)('invoke after make hook', async (assert) => {
        assert.plan(6);
        const stack = [];
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .before('create', (_, user) => {
            stack.push('beforeCreate');
            assert.isFalse(user.$isPersisted);
        })
            .after('make', (_, user) => {
            stack.push('afterMake');
            assert.isFalse(user.$isPersisted);
        })
            .after('create', (_, user) => {
            stack.push('afterCreate');
            assert.isTrue(user.$isPersisted);
        })
            .state('withPoints', (user) => (user.points = 10))
            .build();
        const user = await factory.apply('withPoints').create();
        assert.equal(user.points, 10);
        assert.isTrue(user.$isPersisted);
        assert.deepEqual(stack, ['afterMake', 'beforeCreate', 'afterCreate']);
    });
    (0, japa_1.default)('define custom connection', async (assert) => {
        assert.plan(3);
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .state('withPoints', (user) => (user.points = 10))
            .build();
        const user = await factory
            .connection('secondary')
            .apply('withPoints')
            .create((_, { $trx }) => {
            assert.equal($trx?.connectionName, 'secondary');
        });
        assert.equal(user.points, 10);
        assert.isTrue(user.$isPersisted);
    });
    (0, japa_1.default)('define custom query client', async (assert) => {
        assert.plan(3);
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .state('withPoints', (user) => (user.points = 10))
            .build();
        const client = db.connection('secondary');
        const user = await factory
            .client(client)
            .apply('withPoints')
            .create((_, { $trx }) => {
            assert.equal($trx?.connectionName, 'secondary');
        });
        assert.equal(user.points, 10);
        assert.isTrue(user.$isPersisted);
    });
});
japa_1.default.group('Factory | Factory Builder | createMany', (group) => {
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
    (0, japa_1.default)('apply factory model state', async (assert) => {
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .state('withPoints', (user) => (user.points = 10))
            .build();
        const users = await factory.apply('withPoints').createMany(2);
        assert.lengthOf(users, 2);
        assert.equal(users[0].points, 10);
        assert.isTrue(users[0].$isPersisted);
        assert.equal(users[1].points, 10);
        assert.isTrue(users[1].$isPersisted);
    });
    (0, japa_1.default)('applying a state twice must be a noop', async (assert) => {
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
                Object.defineProperty(this, "points", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: 0
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .state('withPoints', (user) => (user.points += 10))
            .build();
        const users = await factory.apply('withPoints').apply('withPoints').createMany(2);
        assert.lengthOf(users, 2);
        assert.equal(users[0].points, 10);
        assert.isTrue(users[0].$isPersisted);
        assert.equal(users[1].points, 10);
        assert.isTrue(users[1].$isPersisted);
    });
    (0, japa_1.default)('define custom attributes accepted by the newUp method', async (assert) => {
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {
                username: `u-${new Date().getTime()}`,
                points: 0,
            };
        }, factoryManager).build();
        const users = await factory.merge({ points: 10 }).createMany(2);
        assert.lengthOf(users, 2);
        assert.equal(users[0].points, 10);
        assert.isTrue(users[0].$isPersisted);
        assert.equal(users[1].points, 10);
        assert.isTrue(users[1].$isPersisted);
    });
    (0, japa_1.default)('define index specific attributes for makeMany', async (assert) => {
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
                Object.defineProperty(this, "points", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const factory = new FactoryModel(User, () => {
            return {
                username: 'virk',
            };
        }, factoryManager).build();
        const users = await factory.merge([{ username: 'nikk' }, { username: 'romain' }]).createMany(2);
        assert.lengthOf(users, 2);
        assert.equal(users[0].username, 'nikk');
        assert.isTrue(users[0].$isPersisted);
        assert.equal(users[1].username, 'romain');
        assert.isTrue(users[1].$isPersisted);
    });
});
