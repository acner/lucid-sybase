"use strict";
/*
 * @poppinss/data-models
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
const luxon_1 = require("luxon");
const utils_1 = require("@poppinss/utils");
const QueryBuilder_1 = require("../../src/Orm/QueryBuilder");
const Decorators_1 = require("../../src/Orm/Decorators");
const test_helpers_1 = require("../../test-helpers");
const Paginator_1 = require("../../src/Orm/Paginator");
const SimplePaginator_1 = require("../../src/Database/Paginator/SimplePaginator");
const SnakeCase_1 = require("../../src/Orm/NamingStrategies/SnakeCase");
let db;
let BaseModel;
let app;
japa_1.default.group('Base model | boot', (group) => {
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
    (0, japa_1.default)('ensure save method is chainable', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        User.$adapter = adapter;
        const user = new User();
        user.username = 'virk';
        user.age = 22;
        const chained = await user.save();
        assert.instanceOf(chained, User);
    });
    (0, japa_1.default)('ensure fill method is chainable', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        const user = new User();
        const chained = user.fill({
            username: 'virk',
            age: 22,
        });
        assert.instanceOf(chained, User);
    });
    (0, japa_1.default)('ensure merge method is chainable', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        const user = new User();
        const chained = user.merge({
            username: 'virk',
            age: 22,
        });
        assert.instanceOf(chained, User);
    });
    (0, japa_1.default)('ensure refresh method is chainable', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        User.$adapter = adapter;
        const user = new User();
        const chained = await user.refresh();
        assert.instanceOf(chained, User);
    });
    (0, japa_1.default)('compute table name from model name', async (assert) => {
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
        assert.equal(User.table, 'users');
    });
    (0, japa_1.default)('allow overriding table name', async (assert) => {
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
        Object.defineProperty(User, "table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'my_users'
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
        assert.equal(User.table, 'my_users');
    });
    (0, japa_1.default)('initiate all required static properties', async (assert) => {
        class User extends BaseModel {
        }
        User.boot();
        assert.deepEqual((0, test_helpers_1.mapToObj)(User.$columnsDefinitions), {});
        assert.deepEqual((0, test_helpers_1.mapToObj)(User.$relationsDefinitions), {});
        assert.deepEqual((0, test_helpers_1.mapToObj)(User.$computedDefinitions), {});
    });
    (0, japa_1.default)('resolve column name from attribute name', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "$increments", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "userName", void 0);
        User.boot();
        assert.deepEqual(User.$keys.attributesToColumns.get('userName'), 'user_name');
    });
    (0, japa_1.default)('resolve serializeAs name from the attribute name', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "$increments", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "userName", void 0);
        User.boot();
        assert.deepEqual(User.$keys.attributesToSerialized.get('userName'), 'user_name');
    });
    (0, japa_1.default)('resolve attribute name from column name', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "$increments", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "userName", void 0);
        User.boot();
        assert.deepEqual(User.$keys.columnsToAttributes.get('user_name'), 'userName');
    });
    (0, japa_1.default)('resolve serializeAs name from column name', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "$increments", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "userName", void 0);
        User.boot();
        assert.deepEqual(User.$keys.columnsToSerialized.get('user_name'), 'user_name');
    });
    (0, japa_1.default)('resolve attribute name from serializeAs name', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "$increments", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "userName", void 0);
        User.boot();
        assert.deepEqual(User.$keys.serializedToAttributes.get('user_name'), 'userName');
    });
    (0, japa_1.default)('resolve column name from serializeAs name', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "$increments", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "userName", void 0);
        User.boot();
        assert.deepEqual(User.$keys.serializedToColumns.get('user_name'), 'user_name');
    });
});
japa_1.default.group('Base Model | options', (group) => {
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
    (0, japa_1.default)('set connection using useConnection method', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.username = 'virk';
        user.useConnection('foo');
        assert.deepEqual(user.$options, { connection: 'foo' });
    });
    (0, japa_1.default)('set connection do not overwrite profiler from the options', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.username = 'virk';
        const profiler = app.profiler;
        user.$options = { profiler: profiler };
        user.useConnection('foo');
        assert.deepEqual(user.$options, { connection: 'foo', profiler: profiler });
    });
});
japa_1.default.group('Base Model | getter-setters', (group) => {
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
    (0, japa_1.default)('set property on $attributes when defined on model instance', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.$attributes, { username: 'virk' });
    });
    (0, japa_1.default)('pass value to setter when defined', (assert) => {
        class User extends BaseModel {
            set username(value) {
                this.$setAttribute('username', value.toUpperCase());
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [Object])
        ], User.prototype, "username", null);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.$attributes, { username: 'VIRK' });
    });
    (0, japa_1.default)('set value on model instance when is not a column', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        User.boot();
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.$attributes, {});
        assert.equal(user.username, 'virk');
    });
    (0, japa_1.default)('get value from attributes', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.$attributes = { username: 'virk' };
        assert.equal(user.username, 'virk');
    });
    (0, japa_1.default)('rely on getter when column is defined as a getter', (assert) => {
        class User extends BaseModel {
            get username() {
                return this.$getAttribute('username').toUpperCase();
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], User.prototype, "username", null);
        const user = new User();
        user.$attributes = { username: 'virk' };
        assert.equal(user.username, 'VIRK');
    });
    (0, japa_1.default)('get value from model instance when is not a column', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: 'virk'
                });
            }
        }
        User.boot();
        const user = new User();
        assert.equal(user.username, 'virk');
    });
    (0, japa_1.default)('get value for primary key', (assert) => {
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
        const user = new User();
        user.$attributes = { username: 'virk', id: 1 };
        assert.deepEqual(user.$primaryKeyValue, 1);
    });
    (0, japa_1.default)('invoke getter when accessing value using primaryKeyValue', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            get id() {
                return String(this.$getAttribute('id'));
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], User.prototype, "id", null);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.$attributes = { username: 'virk', id: 1 };
        assert.deepEqual(user.$primaryKeyValue, '1');
    });
    (0, japa_1.default)('invoke column serialize method when serializing model', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            get id() {
                return String(this.$getAttribute('id'));
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], User.prototype, "id", null);
        __decorate([
            (0, Decorators_1.column)({
                serialize(value) {
                    return value.toUpperCase();
                },
            }),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.$attributes = { username: 'virk', id: 1 };
        assert.equal(user.username, 'virk');
        assert.equal(user.toJSON().username, 'VIRK');
    });
    (0, japa_1.default)('implement custom merge strategies using getters and setters', (assert) => {
        class User extends BaseModel {
            get preferences() {
                return this.$getAttribute('preferences');
            }
            set preferences(value) {
                this.$setAttribute('preferences', utils_1.lodash.merge(this.preferences, value));
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [Object])
        ], User.prototype, "preferences", null);
        const user = new User();
        /**
         * Define and check property
         */
        user.preferences = {
            theme: 'dark',
        };
        assert.deepEqual(user.preferences, { theme: 'dark' });
        /**
         * Hydrate originals as if persisted
         */
        user.$hydrateOriginals();
        user.$isPersisted = true;
        /**
         * Ensure $original is same as $attributes and nothing
         * is dirty
         */
        assert.deepEqual(user.$original, { preferences: { theme: 'dark' } });
        assert.deepEqual(user.$original, user.$attributes);
        assert.deepEqual(user.$dirty, {});
        user.merge({ preferences: { notifications: true } });
        assert.deepEqual(user.preferences, { theme: 'dark', notifications: true });
        assert.deepEqual(user.$dirty, { preferences: { theme: 'dark', notifications: true } });
    });
});
japa_1.default.group('Base Model | dirty', (group) => {
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
    (0, japa_1.default)('get dirty properties on a fresh model', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.$dirty, { username: 'virk' });
        assert.isTrue(user.$isDirty);
    });
    (0, japa_1.default)('get empty object when model is not dirty', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.$attributes = { username: 'virk' };
        user.$original = { username: 'virk' };
        user.$isPersisted = true;
        assert.deepEqual(user.$dirty, {});
        assert.isFalse(user.$isDirty);
    });
    (0, japa_1.default)('get empty object when model is not dirty with null values', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.$attributes = { username: null };
        user.$original = { username: null };
        user.$isPersisted = true;
        assert.deepEqual(user.$dirty, {});
        assert.isFalse(user.$isDirty);
    });
    (0, japa_1.default)('get empty object when model is not dirty with false values', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.$attributes = { username: false };
        user.$original = { username: false };
        user.$isPersisted = true;
        assert.deepEqual(user.$dirty, {});
        assert.isFalse(user.$isDirty);
    });
    (0, japa_1.default)('get values removed as a side-effect of fill as dirty', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        User.$adapter = adapter;
        const user = new User();
        user.username = 'virk';
        user.age = 22;
        await user.save();
        assert.deepEqual(user.$dirty, {});
        assert.isFalse(user.$isDirty);
        assert.isTrue(user.$isPersisted);
        user.fill({ username: 'virk' });
        assert.deepEqual(user.$dirty, { age: null });
    });
});
japa_1.default.group('Base Model | persist', (group) => {
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
    (0, japa_1.default)('persist model with the column name', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "fullName", {
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
            (0, Decorators_1.column)({ columnName: 'full_name' }),
            __metadata("design:type", String)
        ], User.prototype, "fullName", void 0);
        User.$adapter = adapter;
        adapter.on('insert', (model) => {
            model.$consumeAdapterResult({ id: 1 });
        });
        const user = new User();
        user.username = 'virk';
        user.fullName = 'H virk';
        await user.save();
        assert.isTrue(user.$isPersisted);
        assert.isFalse(user.$isDirty);
        assert.deepEqual(adapter.operations, [
            {
                type: 'insert',
                instance: user,
                attributes: { username: 'virk', full_name: 'H virk' },
            },
        ]);
        assert.deepEqual(user.$attributes, { username: 'virk', fullName: 'H virk', id: 1 });
        assert.deepEqual(user.$original, { username: 'virk', fullName: 'H virk', id: 1 });
    });
    (0, japa_1.default)('merge adapter insert return value with attributes', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        User.$adapter = adapter;
        adapter.on('insert', (model) => {
            model.$consumeAdapterResult({ id: 1 });
        });
        const user = new User();
        user.username = 'virk';
        await user.save();
        assert.isTrue(user.$isPersisted);
        assert.isFalse(user.$isDirty);
        assert.deepEqual(adapter.operations, [
            {
                type: 'insert',
                instance: user,
                attributes: { username: 'virk' },
            },
        ]);
        assert.deepEqual(user.$attributes, { username: 'virk', id: 1 });
        assert.deepEqual(user.$original, { username: 'virk', id: 1 });
    });
    (0, japa_1.default)('do not merge adapter results when not part of model columns', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.$adapter = adapter;
        adapter.on('insert', () => {
            return { id: 1 };
        });
        const user = new User();
        user.username = 'virk';
        await user.save();
        assert.isTrue(user.$isPersisted);
        assert.isFalse(user.$isDirty);
        assert.deepEqual(adapter.operations, [
            {
                type: 'insert',
                instance: user,
                attributes: { username: 'virk' },
            },
        ]);
        assert.deepEqual(user.$attributes, { username: 'virk' });
        assert.deepEqual(user.$original, { username: 'virk' });
    });
    (0, japa_1.default)('issue update when model has already been persisted', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.$adapter = adapter;
        const user = new User();
        user.username = 'virk';
        user.$isPersisted = true;
        await user.save();
        assert.isTrue(user.$isPersisted);
        assert.isFalse(user.$isDirty);
        assert.deepEqual(adapter.operations, [
            {
                type: 'update',
                instance: user,
                attributes: { username: 'virk' },
            },
        ]);
        assert.deepEqual(user.$attributes, { username: 'virk' });
        assert.deepEqual(user.$original, { username: 'virk' });
    });
    (0, japa_1.default)('merge return values from update', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "updatedAt", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'updated_at' }),
            __metadata("design:type", String)
        ], User.prototype, "updatedAt", void 0);
        adapter.on('update', (model) => {
            return model.$consumeAdapterResult({ updated_at: '2019-11-20' });
        });
        User.$adapter = adapter;
        const user = new User();
        user.username = 'virk';
        user.$isPersisted = true;
        await user.save();
        assert.isTrue(user.$isPersisted);
        assert.isFalse(user.$isDirty);
        assert.deepEqual(adapter.operations, [
            {
                type: 'update',
                instance: user,
                attributes: { username: 'virk' },
            },
        ]);
        assert.deepEqual(user.$attributes, { username: 'virk', updatedAt: '2019-11-20' });
        assert.deepEqual(user.$original, { username: 'virk', updatedAt: '2019-11-20' });
    });
    (0, japa_1.default)('do not issue update when model is not dirty', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "updatedAt", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'updated_at' }),
            __metadata("design:type", String)
        ], User.prototype, "updatedAt", void 0);
        User.$adapter = adapter;
        const user = new User();
        user.$isPersisted = true;
        await user.save();
        assert.isTrue(user.$isPersisted);
        assert.isFalse(user.$isDirty);
        assert.deepEqual(adapter.operations, []);
        assert.deepEqual(user.$attributes, {});
        assert.deepEqual(user.$original, {});
    });
    (0, japa_1.default)('refresh model instance', async (assert) => {
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
                Object.defineProperty(this, "createdAt", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "updatedAt", {
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
            __metadata("design:type", String)
        ], User.prototype, "createdAt", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'updated_at' }),
            __metadata("design:type", String)
        ], User.prototype, "updatedAt", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        assert.isTrue(user.$isPersisted);
        assert.isFalse(user.$isDirty);
        assert.isUndefined(user.updatedAt);
        await user.refresh();
        assert.isTrue(user.$isPersisted);
        assert.isFalse(user.$isDirty);
        assert.isDefined(user.updatedAt);
    });
    (0, japa_1.default)('refresh model instance inside a transaction', async (assert) => {
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
                Object.defineProperty(this, "createdAt", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "updatedAt", {
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
            __metadata("design:type", String)
        ], User.prototype, "createdAt", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'updated_at' }),
            __metadata("design:type", String)
        ], User.prototype, "updatedAt", void 0);
        /**
         * Create user
         */
        const user = new User();
        user.username = 'virk';
        await user.save();
        /**
         * Update inside transaction
         */
        const trx = await db.transaction();
        user.useTransaction(trx);
        user.username = 'romain';
        await user.save();
        assert.equal(user.username, 'romain');
        /**
         * Refresh inside transaction
         */
        await user.refresh();
        assert.equal(user.username, 'romain');
        /**
         * Refresh outside transaction
         */
        await trx.rollback();
        await user.refresh();
        assert.equal(user.username, 'virk');
    });
    (0, japa_1.default)('raise exception when attempted to refresh deleted row', async (assert) => {
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
                Object.defineProperty(this, "createdAt", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "updatedAt", {
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
            __metadata("design:type", String)
        ], User.prototype, "createdAt", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'updated_at' }),
            __metadata("design:type", String)
        ], User.prototype, "updatedAt", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        assert.isTrue(user.$isPersisted);
        assert.isFalse(user.$isDirty);
        assert.isUndefined(user.updatedAt);
        await db.from('users').del();
        try {
            await user.refresh();
        }
        catch ({ message }) {
            assert.equal(message, '"Model.refresh" failed. Unable to lookup "users" table where "id" = 1');
        }
    });
    (0, japa_1.default)('invoke column prepare method before passing values to the adapter', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "fullName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'full_name', prepare: (value) => value.toUpperCase() }),
            __metadata("design:type", String)
        ], User.prototype, "fullName", void 0);
        User.$adapter = adapter;
        const user = new User();
        user.username = 'virk';
        user.fullName = 'H virk';
        await user.save();
        assert.isTrue(user.$isPersisted);
        assert.isFalse(user.$isDirty);
        assert.deepEqual(adapter.operations, [
            {
                type: 'insert',
                instance: user,
                attributes: { username: 'virk', full_name: 'H VIRK' },
            },
        ]);
        assert.deepEqual(user.$attributes, { username: 'virk', fullName: 'H virk' });
        assert.deepEqual(user.$original, { username: 'virk', fullName: 'H virk' });
    });
    (0, japa_1.default)('send values mutated by the hooks to the adapter', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "fullName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            static touchValues(model) {
                model.fullName = 'Foo';
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
            (0, Decorators_1.column)({ columnName: 'full_name' }),
            __metadata("design:type", String)
        ], User.prototype, "fullName", void 0);
        __decorate([
            (0, Decorators_1.beforeUpdate)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [User]),
            __metadata("design:returntype", void 0)
        ], User, "touchValues", null);
        User.$adapter = adapter;
        adapter.on('update', (_, attributes) => {
            assert.deepEqual(attributes, { full_name: 'Foo' });
        });
        const user = new User();
        user.$isPersisted = true;
        await user.save();
        assert.deepEqual(user.$attributes, { fullName: 'Foo' });
        assert.deepEqual(user.$original, { fullName: 'Foo' });
    });
    (0, japa_1.default)('allow datetime column value to be null', async (assert) => {
        assert.plan(3);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "createdAt", {
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
            __metadata("design:type", Object)
        ], User.prototype, "createdAt", void 0);
        User.$adapter = adapter;
        adapter.on('update', (_, attributes) => {
            assert.deepEqual(attributes, { created_at: null });
        });
        const user = new User();
        await user.save();
        user.createdAt = null;
        await user.save();
        assert.deepEqual(user.$attributes, { createdAt: null });
        assert.deepEqual(user.$original, { createdAt: null });
    });
    (0, japa_1.default)('assign local id to the model', async (assert) => {
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
                Object.defineProperty(this, "createdAt", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "updatedAt", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'uuid_users'
        });
        Object.defineProperty(User, "selfAssignPrimaryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", String)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "createdAt", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'updated_at' }),
            __metadata("design:type", String)
        ], User.prototype, "updatedAt", void 0);
        User.boot();
        const uuid = '2da96a33-57a0-4752-9d56-0e2485d4d2a4';
        const user = new User();
        user.id = uuid;
        user.username = 'virk';
        await user.save();
        assert.isTrue(user.$isPersisted);
        assert.isFalse(user.$isDirty);
        assert.isUndefined(user.updatedAt);
        assert.equal(user.id, uuid);
        await user.refresh();
        assert.isTrue(user.$isPersisted);
        assert.isFalse(user.$isDirty);
        assert.isDefined(user.updatedAt);
        assert.equal(user.id.toLocaleLowerCase(), uuid);
    });
    (0, japa_1.default)('perform update query when local primary key is updated', async (assert) => {
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
                Object.defineProperty(this, "createdAt", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "updatedAt", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'uuid_users'
        });
        Object.defineProperty(User, "selfAssignPrimaryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", String)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "createdAt", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'updated_at' }),
            __metadata("design:type", String)
        ], User.prototype, "updatedAt", void 0);
        User.boot();
        const uuid = '2da96a33-57a0-4752-9d56-0e2485d4d2a4';
        const user = new User();
        user.id = uuid;
        user.username = 'virk';
        await user.save();
        const newUuid = '4da96a33-57a0-4752-9d56-0e2485d4d2a1';
        user.id = newUuid;
        await user.save();
        const users = await User.all();
        assert.lengthOf(users, 1);
        assert.equal(users[0].id.toLowerCase(), newUuid);
    });
});
japa_1.default.group('Self assign primary key', () => {
    (0, japa_1.default)('send primary value during insert to the adapter', async (assert) => {
        assert.plan(1);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "fullName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "selfAssignPrimaryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", String)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'full_name' }),
            __metadata("design:type", String)
        ], User.prototype, "fullName", void 0);
        User.$adapter = adapter;
        adapter.on('insert', (_, attributes) => {
            assert.deepEqual(attributes, {
                id: '12345',
                username: 'virk',
                full_name: 'H virk',
            });
        });
        const user = new User();
        user.id = '12345';
        user.username = 'virk';
        user.fullName = 'H virk';
        await user.save();
    });
    (0, japa_1.default)('update primary key when changed', async (assert) => {
        assert.plan(3);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "fullName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "selfAssignPrimaryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", String)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'full_name' }),
            __metadata("design:type", String)
        ], User.prototype, "fullName", void 0);
        User.$adapter = adapter;
        adapter.on('insert', (_, attributes) => {
            assert.deepEqual(attributes, {
                id: '12345',
                username: 'virk',
                full_name: 'H virk',
            });
        });
        adapter.on('update', (_, dirty) => {
            assert.deepEqual(dirty, {
                id: '3456',
            });
        });
        const user = new User();
        user.id = '12345';
        user.username = 'virk';
        user.fullName = 'H virk';
        await user.save();
        user.id = '3456';
        await user.save();
        assert.isFalse(user.$isDirty);
    });
});
japa_1.default.group('Base Model | create from adapter results', (group) => {
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
    (0, japa_1.default)('create model instance using $createFromAdapterResult method', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "fullName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'full_name' }),
            __metadata("design:type", String)
        ], User.prototype, "fullName", void 0);
        const user = User.$createFromAdapterResult({ username: 'virk' });
        user.username = 'virk';
        assert.isTrue(user.$isPersisted);
        assert.isFalse(user.$isDirty);
        assert.isFalse(user.$isLocal);
        assert.deepEqual(user.$attributes, { username: 'virk' });
        assert.deepEqual(user.$original, { username: 'virk' });
    });
    (0, japa_1.default)('set options on model instance passed to $createFromAdapterResult', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "fullName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'full_name' }),
            __metadata("design:type", String)
        ], User.prototype, "fullName", void 0);
        const user = User.$createFromAdapterResult({ username: 'virk' }, [], { connection: 'foo' });
        assert.deepEqual(user.$options, { connection: 'foo' });
        assert.isTrue(user.$isPersisted);
        assert.isFalse(user.$isDirty);
        assert.isFalse(user.$isLocal);
        assert.deepEqual(user.$attributes, { username: 'virk' });
        assert.deepEqual(user.$original, { username: 'virk' });
    });
    (0, japa_1.default)('return null from $createFromAdapterResult when input is not object', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "fullName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'full_name' }),
            __metadata("design:type", String)
        ], User.prototype, "fullName", void 0);
        const user = User.$createFromAdapterResult([]);
        assert.isNull(user);
    });
    (0, japa_1.default)('create multiple model instance using $createMultipleFromAdapterResult', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "fullName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'full_name' }),
            __metadata("design:type", String)
        ], User.prototype, "fullName", void 0);
        const users = User.$createMultipleFromAdapterResult([
            { username: 'virk', full_name: 'H virk' },
            { username: 'prasan' },
        ]);
        assert.lengthOf(users, 2);
        assert.isTrue(users[0].$isPersisted);
        assert.isFalse(users[0].$isDirty);
        assert.isFalse(users[0].$isLocal);
        assert.deepEqual(users[0].$attributes, { username: 'virk', fullName: 'H virk' });
        assert.deepEqual(users[0].$original, { username: 'virk', fullName: 'H virk' });
        assert.isTrue(users[1].$isPersisted);
        assert.isFalse(users[1].$isDirty);
        assert.isFalse(users[1].$isLocal);
        assert.deepEqual(users[1].$attributes, { username: 'prasan' });
        assert.deepEqual(users[1].$original, { username: 'prasan' });
    });
    (0, japa_1.default)('pass model options via $createMultipleFromAdapterResult', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "fullName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'full_name' }),
            __metadata("design:type", String)
        ], User.prototype, "fullName", void 0);
        const users = User.$createMultipleFromAdapterResult([{ username: 'virk', full_name: 'H virk' }, { username: 'prasan' }], [], { connection: 'foo' });
        assert.lengthOf(users, 2);
        assert.isTrue(users[0].$isPersisted);
        assert.isFalse(users[0].$isDirty);
        assert.isFalse(users[0].$isLocal);
        assert.deepEqual(users[0].$options, { connection: 'foo' });
        assert.deepEqual(users[0].$attributes, { username: 'virk', fullName: 'H virk' });
        assert.deepEqual(users[0].$original, { username: 'virk', fullName: 'H virk' });
        assert.isTrue(users[1].$isPersisted);
        assert.isFalse(users[1].$isDirty);
        assert.isFalse(users[1].$isLocal);
        assert.deepEqual(users[1].$options, { connection: 'foo' });
        assert.deepEqual(users[1].$attributes, { username: 'prasan' });
        assert.deepEqual(users[1].$original, { username: 'prasan' });
    });
    (0, japa_1.default)('skip rows that are not valid objects inside array', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "fullName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'full_name' }),
            __metadata("design:type", String)
        ], User.prototype, "fullName", void 0);
        const users = User.$createMultipleFromAdapterResult([
            { username: 'virk', full_name: 'H virk' },
            null,
        ]);
        assert.lengthOf(users, 1);
        assert.isTrue(users[0].$isPersisted);
        assert.isFalse(users[0].$isDirty);
        assert.isFalse(users[0].$isLocal);
        assert.deepEqual(users[0].$attributes, { username: 'virk', fullName: 'H virk' });
        assert.deepEqual(users[0].$original, { username: 'virk', fullName: 'H virk' });
    });
    (0, japa_1.default)('invoke column consume method', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "fullName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)({
                consume: (value) => value.toUpperCase(),
            }),
            __metadata("design:type", String)
        ], User.prototype, "fullName", void 0);
        const user = User.$createFromAdapterResult({ full_name: 'virk' });
        assert.isTrue(user.$isPersisted);
        assert.isFalse(user.$isDirty);
        assert.isFalse(user.$isLocal);
        assert.deepEqual(user.$attributes, { fullName: 'VIRK' });
        assert.deepEqual(user.$original, { fullName: 'VIRK' });
    });
    (0, japa_1.default)('original and attributes should not be shared', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "user", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "fullName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Object)
        ], User.prototype, "user", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'full_name' }),
            __metadata("design:type", String)
        ], User.prototype, "fullName", void 0);
        const user = User.$createFromAdapterResult({
            user: {
                username: 'virk',
            },
        });
        user.user.username = 'nikk';
        assert.isTrue(user.$isDirty);
        assert.deepEqual(user.$dirty, { user: { username: 'nikk' } });
    });
});
japa_1.default.group('Base Model | delete', (group) => {
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
    (0, japa_1.default)('delete model instance using adapter', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.$adapter = adapter;
        const user = new User();
        await user.delete();
        assert.deepEqual(adapter.operations, [
            {
                type: 'delete',
                instance: user,
            },
        ]);
        assert.isTrue(user.$isDeleted);
    });
    (0, japa_1.default)('raise exception when trying to mutate model after deletion', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        assert.plan(1);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.$adapter = adapter;
        const user = new User();
        await user.delete();
        try {
            user.username = 'virk';
        }
        catch ({ message }) {
            assert.equal(message, 'E_MODEL_DELETED: Cannot mutate delete model instance');
        }
    });
});
japa_1.default.group('Base Model | serializeAttributes', () => {
    (0, japa_1.default)('serialize attributes', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.serializeAttributes(), { username: 'virk' });
    });
    (0, japa_1.default)('invoke custom serialize method when serializing attributes', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ serialize: (value) => value.toUpperCase() }),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.serializeAttributes(), { username: 'VIRK' });
    });
    (0, japa_1.default)('use custom serializeAs key', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ serializeAs: 'uname' }),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.serializeAttributes(), { uname: 'virk' });
    });
    (0, japa_1.default)('do not serialize when serializeAs key is null', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ serializeAs: null }),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.serializeAttributes(), {});
    });
    (0, japa_1.default)('pick fields during serialization', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "id", void 0);
        const user = new User();
        user.username = 'virk';
        user.id = '1';
        assert.deepEqual(user.serializeAttributes(['id']), { id: '1' });
    });
    (0, japa_1.default)('ignore fields under omit', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "id", void 0);
        const user = new User();
        user.username = 'virk';
        user.id = '1';
        assert.deepEqual(user.serializeAttributes({
            omit: ['username'],
        }), { id: '1' });
    });
    (0, japa_1.default)('use omit and pick together', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "id", void 0);
        const user = new User();
        user.username = 'virk';
        user.id = '1';
        assert.deepEqual(user.serializeAttributes({
            pick: ['id', 'username'],
            omit: ['username'],
        }), { id: '1' });
    });
    (0, japa_1.default)('ignore fields that has serializeAs = null, even when part of pick array', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)({ serializeAs: null }),
            __metadata("design:type", String)
        ], User.prototype, "id", void 0);
        const user = new User();
        user.username = 'virk';
        user.id = '1';
        assert.deepEqual(user.serializeAttributes(['id']), {});
    });
    (0, japa_1.default)('do not invoke custom serialize method when raw flag is on', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ serialize: (value) => value.toUpperCase() }),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.serializeAttributes(undefined, true), { username: 'virk' });
    });
    (0, japa_1.default)('use custom serializeAs key when raw flag is on', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ serializeAs: 'uname' }),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.serializeAttributes(undefined, true), { uname: 'virk' });
    });
    (0, japa_1.default)('do not serialize with serializeAs = null, when raw flag is on', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ serializeAs: null }),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.serializeAttributes(undefined, true), {});
    });
    (0, japa_1.default)('cherry pick fields in raw mode', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "id", void 0);
        const user = new User();
        user.username = 'virk';
        user.id = '1';
        assert.deepEqual(user.serializeAttributes(['id'], true), { id: '1' });
    });
    (0, japa_1.default)('ignore fields under omit array in raw mode', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "id", void 0);
        const user = new User();
        user.username = 'virk';
        user.id = '1';
        assert.deepEqual(user.serializeAttributes({
            pick: ['id', 'username'],
            omit: ['username'],
        }, true), { id: '1' });
    });
});
japa_1.default.group('Base Model | serializeRelations', () => {
    (0, japa_1.default)('serialize relations', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const user = new User();
        const profile = new Profile();
        profile.username = 'virk';
        profile.userId = 1;
        user.$setRelated('profile', profile);
        assert.deepEqual(user.serializeRelations(), {
            profile: {
                username: 'virk',
                user_id: 1,
            },
        });
    });
    (0, japa_1.default)('use custom serializeAs key when raw flag is on', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.hasOne)(() => Profile, { serializeAs: 'userProfile' }),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const user = new User();
        const profile = new Profile();
        profile.username = 'virk';
        profile.userId = 1;
        user.$setRelated('profile', profile);
        assert.deepEqual(user.serializeRelations(), {
            userProfile: {
                username: 'virk',
                user_id: 1,
            },
        });
    });
    (0, japa_1.default)('do not serialize relations when serializeAs is null', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.hasOne)(() => Profile, { serializeAs: null }),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const user = new User();
        const profile = new Profile();
        profile.username = 'virk';
        profile.userId = 1;
        user.$setRelated('profile', profile);
        assert.deepEqual(user.serializeRelations(), {});
    });
    (0, japa_1.default)('do not recursively serialize relations when raw is true', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const user = new User();
        const profile = new Profile();
        profile.username = 'virk';
        profile.userId = 1;
        user.$setRelated('profile', profile);
        assert.deepEqual(user.serializeRelations(undefined, true), {
            profile: profile,
        });
    });
    (0, japa_1.default)('use custom serializeAs key when raw flag is on', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.hasOne)(() => Profile, { serializeAs: 'userProfile' }),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const user = new User();
        const profile = new Profile();
        profile.username = 'virk';
        profile.userId = 1;
        user.$setRelated('profile', profile);
        assert.deepEqual(user.serializeRelations(undefined, true), {
            userProfile: profile,
        });
    });
    (0, japa_1.default)('do not serialize relations with serializeAs is null when raw flag is on', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.hasOne)(() => Profile, { serializeAs: null }),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const user = new User();
        const profile = new Profile();
        profile.username = 'virk';
        profile.userId = 1;
        user.$setRelated('profile', profile);
        assert.deepEqual(user.serializeRelations(undefined, true), {});
    });
    (0, japa_1.default)('cherry pick relationship fields', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const user = new User();
        const profile = new Profile();
        profile.username = 'virk';
        profile.userId = 1;
        user.$setRelated('profile', profile);
        assert.deepEqual(user.serializeRelations({
            profile: {
                fields: ['user_id'],
            },
        }), {
            profile: {
                user_id: 1,
            },
        });
    });
    (0, japa_1.default)('select all fields when no custom fields are defined for a relationship', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const user = new User();
        const profile = new Profile();
        profile.username = 'virk';
        profile.userId = 1;
        user.$setRelated('profile', profile);
        assert.deepEqual(user.serializeRelations({
            profile: {},
        }), {
            profile: {
                user_id: 1,
                username: 'virk',
            },
        });
    });
    (0, japa_1.default)('do not select any fields when relationship fields is an empty array', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const user = new User();
        const profile = new Profile();
        profile.username = 'virk';
        profile.userId = 1;
        user.$setRelated('profile', profile);
        assert.deepEqual(user.serializeRelations({
            profile: {
                fields: [],
            },
        }), {
            profile: {},
        });
    });
});
japa_1.default.group('Base Model | toJSON', (group) => {
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
    (0, japa_1.default)('convert model to its JSON representation', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.toJSON(), { username: 'virk' });
    });
    (0, japa_1.default)('use serializeAs key when converting model to JSON', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ serializeAs: 'theUsername' }),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.toJSON(), { theUsername: 'virk' });
    });
    (0, japa_1.default)('do not serialize when serializeAs is set to null', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ serializeAs: null }),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.toJSON(), {});
    });
    (0, japa_1.default)('add computed properties to toJSON result', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            get fullName() {
                return this.username.toUpperCase();
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.computed)(),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], User.prototype, "fullName", null);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.toJSON(), { username: 'virk', fullName: 'VIRK' });
    });
    (0, japa_1.default)('do not add computed property when it returns undefined', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            get fullName() {
                return undefined;
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.computed)(),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], User.prototype, "fullName", null);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.toJSON(), { username: 'virk' });
    });
    (0, japa_1.default)('cherry pick keys during serialization', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            get fullName() {
                return this.username.toUpperCase();
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.computed)(),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], User.prototype, "fullName", null);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.serialize({
            fields: ['username'],
        }), { username: 'virk' });
    });
    (0, japa_1.default)('serialize extras', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "serializeExtras", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: true
                });
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            get fullName() {
                return this.username.toUpperCase();
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.computed)(),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], User.prototype, "fullName", null);
        const user = new User();
        user.username = 'virk';
        user.$extras = { postsCount: 10 };
        assert.deepEqual(user.toJSON(), {
            username: 'virk',
            fullName: 'VIRK',
            meta: {
                postsCount: 10,
            },
        });
    });
    (0, japa_1.default)('define serialize extras as a function', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            serializeExtras() {
                return {
                    posts: {
                        count: this.$extras.postsCount,
                    },
                };
            }
            get fullName() {
                return this.username.toUpperCase();
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.computed)(),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], User.prototype, "fullName", null);
        const user = new User();
        user.username = 'virk';
        user.$extras = { postsCount: 10 };
        assert.deepEqual(user.toJSON(), {
            username: 'virk',
            fullName: 'VIRK',
            posts: {
                count: 10,
            },
        });
    });
    (0, japa_1.default)('do not serialize undefined values', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.toJSON(), { username: 'virk' });
    });
    (0, japa_1.default)('serialize null values', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Object)
        ], User.prototype, "age", void 0);
        const user = new User();
        user.username = 'virk';
        user.age = null;
        assert.deepEqual(user.toJSON(), { username: 'virk', age: null });
    });
});
japa_1.default.group('BaseModel | cache', (group) => {
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
    (0, japa_1.default)('cache getter value', (assert) => {
        let invokedCounter = 0;
        class User extends BaseModel {
            get username() {
                return this.$getAttributeFromCache('username', (value) => {
                    invokedCounter++;
                    return value.toUpperCase();
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], User.prototype, "username", null);
        const user = new User();
        user.$attributes = { username: 'virk' };
        assert.equal(user.username, 'VIRK');
        assert.equal(user.username, 'VIRK');
        assert.equal(user.username, 'VIRK');
        assert.equal(user.username, 'VIRK');
        assert.equal(user.username, 'VIRK');
        assert.equal(invokedCounter, 1);
    });
    (0, japa_1.default)('re-call getter function when attribute value changes', (assert) => {
        let invokedCounter = 0;
        class User extends BaseModel {
            get username() {
                return this.$getAttributeFromCache('username', (value) => {
                    invokedCounter++;
                    return value.toUpperCase();
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], User.prototype, "username", null);
        const user = new User();
        user.$attributes = { username: 'virk' };
        assert.equal(user.username, 'VIRK');
        user.$attributes.username = 'Prasanjit';
        assert.equal(user.username, 'PRASANJIT');
        assert.equal(user.username, 'PRASANJIT');
        assert.equal(user.username, 'PRASANJIT');
        assert.equal(user.username, 'PRASANJIT');
        assert.equal(invokedCounter, 2);
    });
});
japa_1.default.group('BaseModel | fill/merge', (group) => {
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
    (0, japa_1.default)('fill model instance with bulk attributes', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.fill({ username: 'virk' });
        assert.deepEqual(user.$attributes, { username: 'virk' });
    });
    (0, japa_1.default)('raise error when extra properties are defined', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        const fn = () => user.fill({ username: 'virk', isAdmin: true });
        assert.throw(fn, 'Cannot define "isAdmin" on "User" model, since it is not defined as a model property');
    });
    (0, japa_1.default)('set extra properties via fill when allowExtraProperties is true', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.fill({ username: 'virk', isAdmin: true }, true);
        assert.deepEqual(user.$attributes, { username: 'virk' });
        assert.deepEqual(user.$extras, { isAdmin: true });
    });
    (0, japa_1.default)('overwrite existing values when using fill', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        const user = new User();
        user.age = 22;
        assert.deepEqual(user.$attributes, { age: 22 });
        user.fill({ username: 'virk' });
        assert.deepEqual(user.$attributes, { username: 'virk' });
    });
    (0, japa_1.default)('merge to existing when using merge instead of fill', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        const user = new User();
        user.age = 22;
        assert.deepEqual(user.$attributes, { age: 22 });
        user.merge({ username: 'virk' });
        assert.deepEqual(user.$attributes, { username: 'virk', age: 22 });
    });
    (0, japa_1.default)('set properties with explicit undefined values', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        const user = new User();
        user.age = 22;
        assert.deepEqual(user.$attributes, { age: 22 });
        user.merge({ username: 'virk', age: undefined });
        assert.deepEqual(user.$attributes, { username: 'virk', age: undefined });
    });
    (0, japa_1.default)('invoke setter when using fill', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            get age() {
                return this.$getAttribute('age');
            }
            set age(age) {
                this.$setAttribute('age', age + 1);
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number),
            __metadata("design:paramtypes", [Number])
        ], User.prototype, "age", null);
        const user = new User();
        user.age = 22;
        assert.deepEqual(user.$attributes, { age: 23 });
        user.fill({ username: 'virk', age: 22 });
        assert.deepEqual(user.$attributes, { username: 'virk', age: 23 });
    });
    (0, japa_1.default)('fill using the column name', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "firstName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "firstName", void 0);
        const user = new User();
        user.fill({ first_name: 'virk' });
        assert.deepEqual(user.$attributes, { firstName: 'virk' });
    });
    (0, japa_1.default)('invoke setter during fill when using column name', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            get age() {
                return this.$getAttribute('age');
            }
            set age(age) {
                this.$setAttribute('age', age + 1);
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'user_age' }),
            __metadata("design:type", Number),
            __metadata("design:paramtypes", [Number])
        ], User.prototype, "age", null);
        const user = new User();
        user.fill({ user_age: 22 });
        assert.deepEqual(user.$attributes, { age: 23 });
    });
    (0, japa_1.default)('merge set non-column model properties', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "foo", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        const user = new User();
        user.age = 22;
        assert.deepEqual(user.$attributes, { age: 22 });
        user.merge({ username: 'virk', foo: 'bar' });
        assert.deepEqual(user.$attributes, { username: 'virk', age: 22 });
        assert.equal(user.foo, 'bar');
    });
    (0, japa_1.default)('merge set non-column model properties with inheritance', (assert) => {
        class Super extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "foo", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        class User extends Super {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        const user = new User();
        user.age = 22;
        assert.deepEqual(user.$attributes, { age: 22 });
        user.merge({ username: 'virk', foo: 'bar' });
        assert.deepEqual(user.$attributes, { username: 'virk', age: 22 });
        assert.equal(user.foo, 'bar');
    });
});
japa_1.default.group('Base | apdater', (group) => {
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
    (0, japa_1.default)('pass model instance with attributes to the adapter insert method', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.$adapter = adapter;
        const user = new User();
        user.username = 'virk';
        await user.save();
        assert.deepEqual(adapter.operations, [
            {
                type: 'insert',
                instance: user,
                attributes: { username: 'virk' },
            },
        ]);
    });
    (0, japa_1.default)('pass model instance with attributes to the adapter update method', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.$adapter = adapter;
        const user = new User();
        user.username = 'virk';
        await user.save();
        user.username = 'nikk';
        await user.save();
        assert.deepEqual(adapter.operations, [
            {
                type: 'insert',
                instance: user,
                attributes: { username: 'virk' },
            },
            {
                type: 'update',
                instance: user,
                attributes: { username: 'nikk' },
            },
        ]);
    });
    (0, japa_1.default)('pass model instance to the adapter delete method', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        User.$adapter = adapter;
        const user = new User();
        user.username = 'virk';
        await user.save();
        await user.delete();
        assert.deepEqual(adapter.operations, [
            {
                type: 'insert',
                instance: user,
                attributes: { username: 'virk' },
            },
            {
                type: 'delete',
                instance: user,
            },
        ]);
    });
    (0, japa_1.default)('fill model instance with bulk attributes via column name is different', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "firstName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ columnName: 'first_name' }),
            __metadata("design:type", String)
        ], User.prototype, "firstName", void 0);
        User.$adapter = adapter;
        const user = new User();
        user.fill({ firstName: 'virk' });
        await user.save();
        assert.deepEqual(adapter.operations, [
            {
                type: 'insert',
                instance: user,
                attributes: { first_name: 'virk' },
            },
        ]);
    });
});
japa_1.default.group('Base Model | sideloaded', (group) => {
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
    (0, japa_1.default)('define sideloaded properties using $consumeAdapterResults method', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.$consumeAdapterResult({ username: 'virk' }, { loggedInUser: { id: 1 } });
        assert.deepEqual(user.$attributes, { username: 'virk' });
        assert.deepEqual(user.$sideloaded, { loggedInUser: { id: 1 } });
    });
    (0, japa_1.default)('define sideloaded properties using $createFromAdapterResult method', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = User.$createFromAdapterResult({ username: 'virk' }, { loggedInUser: { id: 1 } });
        assert.deepEqual(user.$attributes, { username: 'virk' });
        assert.deepEqual(user.$sideloaded, { loggedInUser: { id: 1 } });
    });
    (0, japa_1.default)('define sideloaded properties using $createMultipleFromAdapterResult method', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const users = User.$createMultipleFromAdapterResult([{ username: 'virk' }, { username: 'nikk' }], { loggedInUser: { id: 1 } });
        assert.deepEqual(users[0].$attributes, { username: 'virk' });
        assert.deepEqual(users[0].$sideloaded, { loggedInUser: { id: 1 } });
        assert.deepEqual(users[1].$attributes, { username: 'nikk' });
        assert.deepEqual(users[1].$sideloaded, { loggedInUser: { id: 1 } });
    });
    // @todo: PASS SIDELOADED PROPERTIES TO RELATIONSHIPS AS WELL
});
japa_1.default.group('Base Model | relations', (group) => {
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
    (0, japa_1.default)('set hasOne relation', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const user = new User();
        Profile.$adapter = adapter;
        user.$consumeAdapterResult({ id: 1 });
        user.$setRelated('profile', await Profile.create({ username: 'virk' }));
        assert.deepEqual(user.profile.username, 'virk');
        assert.instanceOf(user.$preloaded.profile, Profile);
    });
    (0, japa_1.default)('return undefined when relation is not preloaded', (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const user = new User();
        user.$consumeAdapterResult({
            id: 1,
        });
        assert.isUndefined(user.profile);
        assert.deepEqual(user.$preloaded, {});
    });
    (0, japa_1.default)('serialize relation toJSON', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const user = new User();
        Profile.$adapter = adapter;
        user.$consumeAdapterResult({ id: 1 });
        user.$setRelated('profile', await Profile.create({ username: 'virk' }));
        assert.deepEqual(user.toJSON(), {
            id: 1,
            profile: {
                username: 'virk',
            },
        });
    });
    (0, japa_1.default)('cherry pick relationship keys during serialize', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const user = new User();
        Profile.$adapter = adapter;
        user.$consumeAdapterResult({ id: 1 });
        const profile = await Profile.create({ username: 'virk' });
        user.$setRelated('profile', profile);
        profile.userId = 1;
        assert.deepEqual(user.serialize({
            fields: ['id'],
            relations: {
                profile: {
                    fields: ['username'],
                },
            },
        }), {
            id: 1,
            profile: {
                username: 'virk',
            },
        });
    });
    (0, japa_1.default)('cherry pick nested relationship keys during serialize', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
                Object.defineProperty(this, "user", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        Profile.$adapter = adapter;
        const user = new User();
        user.$consumeAdapterResult({ id: 1, email: 'virk@adonisjs.com' });
        const profileUser = new User();
        profileUser.$consumeAdapterResult({ id: 1, email: 'virk@adonisjs.com' });
        const profile = await Profile.create({ username: 'virk' });
        user.$setRelated('profile', profile);
        profile.$setRelated('user', profileUser);
        profile.userId = 1;
        assert.deepEqual(user.serialize({
            fields: ['id'],
            relations: {
                profile: {
                    fields: ['username'],
                    relations: {
                        user: {
                            fields: ['email'],
                        },
                    },
                },
            },
        }), {
            id: 1,
            profile: {
                username: 'virk',
                user: {
                    email: 'virk@adonisjs.com',
                },
            },
        });
    });
    (0, japa_1.default)('serialize relation toJSON with custom serializeAs key', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.hasOne)(() => Profile, { serializeAs: 'social' }),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const user = new User();
        Profile.$adapter = adapter;
        user.$consumeAdapterResult({ id: 1 });
        user.$setRelated('profile', await Profile.create({ username: 'virk' }));
        assert.deepEqual(user.toJSON(), {
            id: 1,
            social: {
                username: 'virk',
            },
        });
    });
    (0, japa_1.default)('push relationship', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "profiles", {
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
            (0, Decorators_1.hasMany)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profiles", void 0);
        const user = new User();
        Profile.$adapter = adapter;
        user.$consumeAdapterResult({ id: 1 });
        user.$pushRelated('profiles', await Profile.create({ username: 'nikk' }));
        assert.deepEqual(user.toJSON(), {
            id: 1,
            profiles: [
                {
                    username: 'nikk',
                },
            ],
        });
    });
    (0, japa_1.default)('push relationship to existing list', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "profiles", {
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
            (0, Decorators_1.hasMany)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profiles", void 0);
        const user = new User();
        Profile.$adapter = adapter;
        user.$consumeAdapterResult({ id: 1 });
        user.$setRelated('profiles', [await Profile.create({ username: 'virk' })]);
        user.$pushRelated('profiles', await Profile.create({ username: 'nikk' }));
        assert.deepEqual(user.toJSON(), {
            id: 1,
            profiles: [
                {
                    username: 'virk',
                },
                {
                    username: 'nikk',
                },
            ],
        });
    });
    (0, japa_1.default)('push an array of relationships', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "profiles", {
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
            (0, Decorators_1.hasMany)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profiles", void 0);
        const user = new User();
        Profile.$adapter = adapter;
        user.$consumeAdapterResult({ id: 1 });
        user.$pushRelated('profiles', [
            await Profile.create({ username: 'virk' }),
            await Profile.create({ username: 'nikk' }),
        ]);
        assert.deepEqual(user.toJSON(), {
            id: 1,
            profiles: [
                {
                    username: 'virk',
                },
                {
                    username: 'nikk',
                },
            ],
        });
    });
    (0, japa_1.default)('raise error when pushing an array of relationships for hasOne', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const user = new User();
        Profile.$adapter = adapter;
        user.$consumeAdapterResult({ id: 1 });
        const profile = await Profile.create({ username: 'virk' });
        const profile1 = await Profile.create({ username: 'virk' });
        const fn = () => user.$pushRelated('profile', [profile, profile1]);
        assert.throw(fn, '"User.profile" cannot reference more than one instance of "Profile" model');
    });
    (0, japa_1.default)('raise error when setting single relationships for hasMany', async (assert) => {
        const adapter = new test_helpers_1.FakeAdapter();
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "profiles", {
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
            (0, Decorators_1.hasMany)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profiles", void 0);
        const user = new User();
        Profile.$adapter = adapter;
        user.$consumeAdapterResult({ id: 1 });
        const profile = await Profile.create({ username: 'virk' });
        const fn = () => user.$setRelated('profiles', profile);
        assert.throw(fn, '"User.profiles" must be an array when setting "hasMany" relationship');
    });
});
japa_1.default.group('Base Model | fetch', (group) => {
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
    (0, japa_1.default)('find using the primary key', async (assert) => {
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
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.find(1);
        assert.instanceOf(user, User);
        assert.equal(user.$primaryKeyValue, 1);
    });
    (0, japa_1.default)('raise exception when row is not found', async (assert) => {
        assert.plan(1);
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
            await User.findOrFail(1);
        }
        catch ({ message }) {
            assert.equal(message, 'E_ROW_NOT_FOUND: Row not found');
        }
    });
    (0, japa_1.default)('find many using the primary key', async (assert) => {
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
        await db
            .insertQuery()
            .table('users')
            .multiInsert([{ username: 'virk' }, { username: 'nikk' }]);
        const users = await User.findMany([1, 2]);
        assert.lengthOf(users, 2);
        assert.equal(users[0].$primaryKeyValue, 2);
        assert.equal(users[1].$primaryKeyValue, 1);
    });
    (0, japa_1.default)('return the existing row when search criteria matches', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userName", {
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
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'username' }),
            __metadata("design:type", String)
        ], User.prototype, "userName", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.firstOrCreate({ userName: 'virk' });
        const totalUsers = await db.query().from('users').count('*', 'total');
        assert.equal(totalUsers[0].total, 1);
        assert.isTrue(user.$isPersisted);
        assert.instanceOf(user, User);
        assert.equal(user.$primaryKeyValue, 1);
    });
    (0, japa_1.default)("create new row when search criteria doesn't match", async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userName", {
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
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'username' }),
            __metadata("design:type", String)
        ], User.prototype, "userName", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.firstOrCreate({ userName: 'nikk' }, { email: 'nikk@gmail.com' });
        const totalUsers = await db.query().from('users').count('*', 'total');
        assert.equal(totalUsers[0].total, 2);
        assert.instanceOf(user, User);
        assert.equal(user.$primaryKeyValue, 2);
        assert.isTrue(user.$isPersisted);
        assert.equal(user.email, 'nikk@gmail.com');
        assert.equal(user.userName, 'nikk');
    });
    (0, japa_1.default)('return the existing row when search criteria matches using firstOrNew', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userName", {
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
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'username' }),
            __metadata("design:type", String)
        ], User.prototype, "userName", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.firstOrNew({ userName: 'virk' });
        const totalUsers = await db.query().from('users').count('*', 'total');
        assert.equal(totalUsers[0].total, 1);
        assert.instanceOf(user, User);
        assert.isTrue(user.$isPersisted);
        assert.equal(user.$primaryKeyValue, 1);
    });
    (0, japa_1.default)("instantiate new row when search criteria doesn't match using firstOrNew", async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userName", {
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
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'username' }),
            __metadata("design:type", String)
        ], User.prototype, "userName", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.firstOrNew({ userName: 'nikk' }, { email: 'nikk@gmail.com' });
        const totalUsers = await db.query().from('users').count('*', 'total');
        assert.equal(totalUsers[0].total, 1);
        assert.instanceOf(user, User);
        assert.isUndefined(user.$primaryKeyValue);
        assert.isFalse(user.$isPersisted);
        assert.equal(user.email, 'nikk@gmail.com');
        assert.equal(user.userName, 'nikk');
    });
    (0, japa_1.default)('update the existing row when search criteria matches', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userName", {
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
            (0, Decorators_1.column)({ columnName: 'username' }),
            __metadata("design:type", String)
        ], User.prototype, "userName", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.updateOrCreate({ userName: 'virk' }, { points: 20 });
        assert.isTrue(user.$isPersisted);
        assert.equal(user.points, 20);
        assert.equal(user.userName, 'virk');
        const users = await db.query().from('users');
        assert.lengthOf(users, 1);
        assert.equal(users[0].points, 20);
    });
    (0, japa_1.default)('lock row for update to handle concurrent requests', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userName", {
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
                Object.defineProperty(this, "points", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            static boot() {
                if (this.booted) {
                    return;
                }
                super.boot();
                this.before('update', (model) => {
                    model.points += 1;
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'username' }),
            __metadata("design:type", String)
        ], User.prototype, "userName", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk', points: 20 });
        /**
         * The update or create method will first fetch the row and then performs
         * an update using the model instance. The model hook will use the original
         * database value to increment the points by 1.
         *
         * However, both reads will be performed concurrently, each instance will
         * receive the original `20` points and update will reflect `21` and not
         * expected `22`.
         *
         * To fix the above issue, we must lock the row for update, since we can
         * guarantee that an update will always be performed.
         */
        await Promise.all([
            User.updateOrCreate({ userName: 'virk' }, { email: 'virk-1@adonisjs.com' }),
            User.updateOrCreate({ userName: 'virk' }, { email: 'virk-2@adonisjs.com' }),
        ]);
        const users = await db.query().from('users');
        assert.lengthOf(users, 1);
        assert.equal(users[0].points, 22);
    });
    (0, japa_1.default)('execute updateOrCreate update action inside a transaction', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userName", {
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
            (0, Decorators_1.column)({ columnName: 'username' }),
            __metadata("design:type", String)
        ], User.prototype, "userName", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const trx = await db.transaction();
        const user = await User.updateOrCreate({ userName: 'virk' }, { points: 20 }, { client: trx });
        assert.isTrue(user.$isPersisted);
        assert.equal(user.points, 20);
        assert.equal(user.userName, 'virk');
        await trx.rollback();
        const users = await db.query().from('users');
        assert.lengthOf(users, 1);
        assert.equal(users[0].username, 'virk');
        assert.equal(users[0].points, 0);
    });
    (0, japa_1.default)('create a new row when search criteria fails', async (assert) => {
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.updateOrCreate({ username: 'nikk' }, { points: 20 });
        assert.isTrue(user.$isPersisted);
        assert.equal(user.points, 20);
        assert.equal(user.username, 'nikk');
        const users = await db.query().from('users');
        assert.lengthOf(users, 2);
        assert.equal(users[0].username, 'virk');
        assert.equal(users[0].points, 0);
        assert.equal(users[1].username, 'nikk');
        assert.equal(users[1].points, 20);
    });
    (0, japa_1.default)('execute updateOrCreate create action inside a transaction', async (assert) => {
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const trx = await db.transaction();
        const user = await User.updateOrCreate({ username: 'nikk' }, { points: 20 }, { client: trx });
        assert.isTrue(user.$isPersisted);
        assert.equal(user.points, 20);
        assert.equal(user.username, 'nikk');
        await trx.rollback();
        const users = await db.query().from('users');
        assert.lengthOf(users, 1);
        assert.equal(users[0].username, 'virk');
        assert.equal(users[0].points, 0);
    });
    (0, japa_1.default)('persist records to db when find call returns zero rows', async (assert) => {
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const users = await User.fetchOrCreateMany('username', [
            {
                username: 'virk',
                email: 'virk@adonisjs.com',
            },
            {
                username: 'nikk',
                email: 'nikk@adonisjs.com',
            },
            {
                username: 'romain',
                email: 'romain@adonisjs.com',
            },
        ]);
        assert.lengthOf(users, 3);
        assert.isTrue(users[0].$isPersisted);
        assert.equal(users[0].username, 'virk');
        assert.equal(users[0].email, 'virk@adonisjs.com');
        assert.isTrue(users[1].$isPersisted);
        assert.equal(users[1].username, 'nikk');
        assert.equal(users[1].email, 'nikk@adonisjs.com');
        assert.isTrue(users[2].$isPersisted);
        assert.equal(users[2].username, 'romain');
        assert.equal(users[2].email, 'romain@adonisjs.com');
        const usersList = await db.query().from('users');
        assert.lengthOf(usersList, 3);
    });
    (0, japa_1.default)('sync records by avoiding duplicates', async (assert) => {
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        await db.insertQuery().table('users').insert({
            username: 'virk',
            email: 'virk@adonisjs.com',
            points: 10,
        });
        const users = await User.fetchOrCreateMany('username', [
            {
                username: 'virk',
                email: 'virk@adonisjs.com',
            },
            {
                username: 'nikk',
                email: 'nikk@adonisjs.com',
            },
            {
                username: 'romain',
                email: 'romain@adonisjs.com',
            },
        ]);
        assert.lengthOf(users, 3);
        assert.isTrue(users[0].$isPersisted);
        assert.equal(users[0].username, 'virk');
        assert.equal(users[0].email, 'virk@adonisjs.com');
        assert.equal(users[0].points, 10);
        assert.isTrue(users[1].$isPersisted);
        assert.equal(users[1].username, 'nikk');
        assert.equal(users[1].email, 'nikk@adonisjs.com');
        assert.isUndefined(users[1].points);
        assert.isTrue(users[2].$isPersisted);
        assert.equal(users[2].username, 'romain');
        assert.equal(users[2].email, 'romain@adonisjs.com');
        assert.isUndefined(users[2].points);
        const usersList = await db.query().from('users');
        assert.lengthOf(usersList, 3);
    });
    (0, japa_1.default)('wrap create calls inside a transaction', async (assert) => {
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        await db.insertQuery().table('users').insert({
            username: 'virk',
            email: 'virk@adonisjs.com',
            points: 10,
        });
        const trx = await db.transaction();
        await User.fetchOrCreateMany('username', [
            {
                username: 'virk',
                email: 'virk@adonisjs.com',
            },
            {
                username: 'nikk',
                email: 'nikk@adonisjs.com',
            },
            {
                username: 'romain',
                email: 'romain@adonisjs.com',
            },
        ], {
            client: trx,
        });
        await trx.rollback();
        const usersList = await db.query().from('users');
        assert.lengthOf(usersList, 1);
    });
    (0, japa_1.default)('handle columns with different cast key name', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "userName", {
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
            (0, Decorators_1.column)({ columnName: 'username' }),
            __metadata("design:type", String)
        ], User.prototype, "userName", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        await db.insertQuery().table('users').insert({
            username: 'virk',
            email: 'virk@adonisjs.com',
            points: 10,
        });
        const users = await User.fetchOrCreateMany('userName', [
            {
                userName: 'virk',
                email: 'virk@adonisjs.com',
            },
            {
                userName: 'nikk',
                email: 'nikk@adonisjs.com',
            },
            {
                userName: 'romain',
                email: 'romain@adonisjs.com',
            },
        ]);
        assert.lengthOf(users, 3);
        assert.isTrue(users[0].$isPersisted);
        assert.equal(users[0].userName, 'virk');
        assert.equal(users[0].email, 'virk@adonisjs.com');
        assert.equal(users[0].points, 10);
        assert.isTrue(users[1].$isPersisted);
        assert.equal(users[1].userName, 'nikk');
        assert.equal(users[1].email, 'nikk@adonisjs.com');
        assert.isUndefined(users[1].points);
        assert.isTrue(users[2].$isPersisted);
        assert.equal(users[2].userName, 'romain');
        assert.equal(users[2].email, 'romain@adonisjs.com');
        assert.isUndefined(users[2].points);
        const usersList = await db.query().from('users');
        assert.lengthOf(usersList, 3);
    });
    (0, japa_1.default)('raise exception when one or more rows fails', async (assert) => {
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        await db.insertQuery().table('users').insert({
            username: 'virk',
            email: 'virk@adonisjs.com',
            points: 10,
        });
        const trx = await db.transaction();
        try {
            await User.fetchOrCreateMany('username', [
                {
                    username: 'nikk',
                    email: 'virk@adonisjs.com',
                },
                {
                    username: 'romain',
                    email: 'romain@adonisjs.com',
                },
            ], {
                client: trx,
            });
        }
        catch (error) {
            assert.exists(error);
            await trx.rollback();
        }
        const usersList = await db.query().from('users');
        assert.lengthOf(usersList, 1);
    });
    (0, japa_1.default)('raise exception when value of unique key inside payload is undefined', async (assert) => {
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        await db.insertQuery().table('users').insert({
            username: 'virk',
            email: 'virk@adonisjs.com',
            points: 10,
        });
        try {
            await User.fetchOrCreateMany('username', [
                {
                    email: 'virk@adonisjs.com',
                },
                {
                    username: 'romain',
                    email: 'romain@adonisjs.com',
                },
            ]);
        }
        catch ({ message }) {
            assert.equal(message, 'Value for the "username" is null or undefined inside "fetchOrCreateMany" payload');
        }
        const usersList = await db.query().from('users');
        assert.lengthOf(usersList, 1);
    });
    (0, japa_1.default)('raise exception when key is not defined on the model', async (assert) => {
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
                Object.defineProperty(this, "email", {
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
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        await db.insertQuery().table('users').insert({
            username: 'virk',
            email: 'virk@adonisjs.com',
            points: 10,
        });
        try {
            await User.fetchOrCreateMany('username', [
                {
                    email: 'virk@adonisjs.com',
                },
                {
                    username: 'romain',
                    email: 'romain@adonisjs.com',
                },
            ]);
        }
        catch ({ message }) {
            assert.equal(message, 'Value for the "username" is null or undefined inside "fetchOrCreateMany" payload');
        }
        const usersList = await db.query().from('users');
        assert.lengthOf(usersList, 1);
    });
    (0, japa_1.default)('persist records to db when find call returns zero rows', async (assert) => {
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        const users = await User.updateOrCreateMany('username', [
            {
                username: 'virk',
                email: 'virk@adonisjs.com',
            },
            {
                username: 'nikk',
                email: 'nikk@adonisjs.com',
            },
            {
                username: 'romain',
                email: 'romain@adonisjs.com',
            },
        ]);
        assert.lengthOf(users, 3);
        assert.isTrue(users[0].$isPersisted);
        assert.equal(users[0].username, 'virk');
        assert.equal(users[0].email, 'virk@adonisjs.com');
        assert.isTrue(users[1].$isPersisted);
        assert.equal(users[1].username, 'nikk');
        assert.equal(users[1].email, 'nikk@adonisjs.com');
        assert.isTrue(users[2].$isPersisted);
        assert.equal(users[2].username, 'romain');
        assert.equal(users[2].email, 'romain@adonisjs.com');
        const usersList = await db.query().from('users');
        assert.lengthOf(usersList, 3);
    });
    (0, japa_1.default)('update records and avoid duplicates', async (assert) => {
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        await db.insertQuery().table('users').insert({
            username: 'virk',
            email: 'virk@adonisjs.com',
            points: 10,
        });
        const users = await User.updateOrCreateMany('username', [
            {
                username: 'virk',
                email: 'virk@adonisjs.com',
                points: 4,
            },
            {
                username: 'nikk',
                email: 'nikk@adonisjs.com',
            },
            {
                username: 'romain',
                email: 'romain@adonisjs.com',
            },
        ]);
        assert.lengthOf(users, 3);
        assert.isTrue(users[0].$isPersisted);
        assert.equal(users[0].username, 'virk');
        assert.equal(users[0].email, 'virk@adonisjs.com');
        assert.equal(users[0].points, 4);
        assert.isTrue(users[1].$isPersisted);
        assert.equal(users[1].username, 'nikk');
        assert.equal(users[1].email, 'nikk@adonisjs.com');
        assert.isUndefined(users[1].points);
        assert.isTrue(users[2].$isPersisted);
        assert.equal(users[2].username, 'romain');
        assert.equal(users[2].email, 'romain@adonisjs.com');
        assert.isUndefined(users[2].points);
        const usersList = await db.query().from('users');
        assert.lengthOf(usersList, 3);
    });
    (0, japa_1.default)('use multiple keys to predicate a row as unique', async (assert) => {
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
                Object.defineProperty(this, "countryId", {
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        await db.insertQuery().table('users').insert({
            username: 'virk',
            email: 'virk@adonisjs.com',
            country_id: 1,
            points: 10,
        });
        const users = await User.updateOrCreateMany(['points', 'countryId'], [
            {
                username: 'virk1',
                email: 'virk1@adonisjs.com',
                countryId: 1,
                points: 11,
            },
            {
                username: 'nikk',
                email: 'nikk@adonisjs.com',
                countryId: 2,
                points: 10,
            },
            {
                username: 'romain',
                email: 'romain@adonisjs.com',
                countryId: 3,
                points: 10,
            },
        ]);
        assert.lengthOf(users, 3);
        assert.isTrue(users[0].$isPersisted);
        assert.equal(users[0].countryId, 1);
        assert.equal(users[0].points, 11);
        assert.isTrue(users[1].$isPersisted);
        assert.equal(users[1].countryId, 2);
        assert.equal(users[1].points, 10);
        assert.isTrue(users[2].$isPersisted);
        assert.equal(users[2].countryId, 3);
        assert.equal(users[2].points, 10);
        const usersList = await db.query().from('users');
        assert.lengthOf(usersList, 4);
    });
    (0, japa_1.default)('wrap create calls inside a transaction using updateOrCreateMany', async (assert) => {
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        await db.insertQuery().table('users').insert({
            username: 'virk',
            email: 'virk@adonisjs.com',
            points: 10,
        });
        const trx = await db.transaction();
        await User.updateOrCreateMany('username', [
            {
                username: 'virk',
                email: 'virk@adonisjs.com',
            },
            {
                username: 'nikk',
                email: 'nikk@adonisjs.com',
            },
            {
                username: 'romain',
                email: 'romain@adonisjs.com',
            },
        ], {
            client: trx,
        });
        await trx.rollback();
        const usersList = await db.query().from('users');
        assert.lengthOf(usersList, 1);
    });
    (0, japa_1.default)('wrap update calls inside a custom transaction using updateOrCreateMany', async (assert) => {
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        await db.insertQuery().table('users').insert({
            username: 'virk',
            email: 'virk@adonisjs.com',
            points: 10,
        });
        const trx = await db.transaction();
        await User.updateOrCreateMany('username', [
            {
                username: 'virk',
                email: 'virk@adonisjs.com',
                points: 4,
            },
            {
                username: 'nikk',
                email: 'nikk@adonisjs.com',
            },
            {
                username: 'romain',
                email: 'romain@adonisjs.com',
            },
        ], {
            client: trx,
        });
        await trx.rollback();
        const usersList = await db.query().from('users');
        assert.lengthOf(usersList, 1);
        assert.equal(usersList[0].points, 10);
    });
    (0, japa_1.default)('handle concurrent update calls using updateOrCreateMany', async (assert) => {
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
                Object.defineProperty(this, "points", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            static boot() {
                if (this.booted) {
                    return;
                }
                super.boot();
                this.before('update', (model) => {
                    model.points += 1;
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        await db.insertQuery().table('users').insert({
            username: 'virk',
            email: 'virk@adonisjs.com',
            points: 0,
        });
        await Promise.all([
            User.updateOrCreateMany('username', [
                {
                    username: 'virk',
                    email: 'virk-1@adonisjs.com',
                },
            ]),
            User.updateOrCreateMany('username', [
                {
                    username: 'virk',
                    email: 'virk-1@adonisjs.com',
                },
            ]),
        ]);
        const usersList = await db.query().from('users');
        assert.lengthOf(usersList, 1);
        assert.equal(usersList[0].points, 2);
    });
});
japa_1.default.group('Base Model | hooks', (group) => {
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
    (0, japa_1.default)('invoke before and after create hooks', async (assert) => {
        assert.plan(9);
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
                Object.defineProperty(this, "email", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            static beforeCreateHook(model) {
                stack.push('beforeCreateHook');
                assert.instanceOf(model, User);
                assert.isFalse(model.$isPersisted);
            }
            static beforeSaveHook(model) {
                stack.push('beforeSaveHook');
                assert.instanceOf(model, User);
                assert.isFalse(model.$isPersisted);
            }
            static afterCreateHook(model) {
                stack.push('afterCreateHook');
                assert.instanceOf(model, User);
                assert.isTrue(model.$isPersisted);
            }
            static afterSaveHook(model) {
                stack.push('afterSaveHook');
                assert.instanceOf(model, User);
                assert.isTrue(model.$isPersisted);
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.beforeCreate)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [User]),
            __metadata("design:returntype", void 0)
        ], User, "beforeCreateHook", null);
        __decorate([
            (0, Decorators_1.beforeSave)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [User]),
            __metadata("design:returntype", void 0)
        ], User, "beforeSaveHook", null);
        __decorate([
            (0, Decorators_1.afterCreate)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [User]),
            __metadata("design:returntype", void 0)
        ], User, "afterCreateHook", null);
        __decorate([
            (0, Decorators_1.afterSave)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [User]),
            __metadata("design:returntype", void 0)
        ], User, "afterSaveHook", null);
        const user = new User();
        user.username = 'virk';
        await user.save();
        assert.deepEqual(stack, [
            'beforeCreateHook',
            'beforeSaveHook',
            'afterCreateHook',
            'afterSaveHook',
        ]);
    });
    (0, japa_1.default)('abort create when before hook raises exception', async (assert) => {
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
                Object.defineProperty(this, "email", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            static boot() {
                if (this.booted) {
                    return;
                }
                super.boot();
                this.before('create', (model) => {
                    assert.instanceOf(model, User);
                    assert.isFalse(model.$isPersisted);
                    throw new Error('Wait');
                });
                this.before('save', (model) => {
                    assert.instanceOf(model, User);
                    assert.isFalse(model.$isPersisted);
                });
                this.after('create', (model) => {
                    assert.instanceOf(model, User);
                    assert.isTrue(model.$isPersisted);
                });
                this.after('save', (model) => {
                    assert.instanceOf(model, User);
                    assert.isTrue(model.$isPersisted);
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        const user = new User();
        user.username = 'virk';
        try {
            await user.save();
        }
        catch ({ message }) {
            assert.equal(message, 'Wait');
        }
    });
    (0, japa_1.default)('listen for trx on after save commit', async (assert) => {
        assert.plan(1);
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
            static afterSaveHook(model) {
                if (model.$trx) {
                    model.$trx.on('commit', () => {
                        assert.isTrue(true);
                    });
                }
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.afterSave)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [User]),
            __metadata("design:returntype", void 0)
        ], User, "afterSaveHook", null);
        const trx = await db.transaction();
        const user = new User();
        user.username = 'virk';
        user.$trx = trx;
        await user.save();
        await trx.commit();
    });
    (0, japa_1.default)('listen for trx on after save rollback', async (assert) => {
        assert.plan(1);
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
            static afterSaveHook(model) {
                if (model.$trx) {
                    model.$trx.on('rollback', () => {
                        assert.isTrue(true);
                    });
                }
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.afterSave)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [User]),
            __metadata("design:returntype", void 0)
        ], User, "afterSaveHook", null);
        const trx = await db.transaction();
        const user = new User();
        user.username = 'virk';
        user.$trx = trx;
        await user.save();
        await trx.rollback();
    });
    (0, japa_1.default)('invoke before and after update hooks', async (assert) => {
        assert.plan(10);
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
            static beforeUpdateHook(model) {
                assert.instanceOf(model, User);
                assert.isTrue(model.$isDirty);
            }
            static beforeSaveHook(model) {
                assert.instanceOf(model, User);
                assert.isTrue(model.$isDirty);
            }
            static afterUpdateHook(model) {
                assert.instanceOf(model, User);
                assert.isFalse(model.$isDirty);
            }
            static afterSaveHook(model) {
                assert.instanceOf(model, User);
                assert.isFalse(model.$isDirty);
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.beforeUpdate)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [User]),
            __metadata("design:returntype", void 0)
        ], User, "beforeUpdateHook", null);
        __decorate([
            (0, Decorators_1.beforeSave)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [User]),
            __metadata("design:returntype", void 0)
        ], User, "beforeSaveHook", null);
        __decorate([
            (0, Decorators_1.afterUpdate)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [User]),
            __metadata("design:returntype", void 0)
        ], User, "afterUpdateHook", null);
        __decorate([
            (0, Decorators_1.afterSave)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [User]),
            __metadata("design:returntype", void 0)
        ], User, "afterSaveHook", null);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.findOrFail(1);
        user.username = 'nikk';
        await user.save();
        const users = await db.from('users');
        assert.lengthOf(users, 1);
        assert.equal(users[0].username, 'nikk');
    });
    (0, japa_1.default)('abort update when before hook raises exception', async (assert) => {
        assert.plan(5);
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
            static boot() {
                if (this.booted) {
                    return;
                }
                super.boot();
                this.before('update', (model) => {
                    assert.instanceOf(model, User);
                    assert.isTrue(model.$isDirty);
                    throw new Error('Wait');
                });
                this.before('save', (model) => {
                    assert.instanceOf(model, User);
                    assert.isTrue(model.$isDirty);
                });
                this.after('update', (model) => {
                    assert.instanceOf(model, User);
                    assert.isFalse(model.$isDirty);
                });
                this.after('save', (model) => {
                    assert.instanceOf(model, User);
                    assert.isFalse(model.$isDirty);
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.findOrFail(1);
        user.username = 'nikk';
        try {
            await user.save();
        }
        catch ({ message }) {
            assert.equal(message, 'Wait');
        }
        const users = await db.from('users');
        assert.lengthOf(users, 1);
        assert.equal(users[0].username, 'virk');
    });
    (0, japa_1.default)('invoke before and after delete hooks', async (assert) => {
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
                Object.defineProperty(this, "email", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            static beforeDeleteHook(model) {
                assert.instanceOf(model, User);
            }
            static afterDeleteHook(model) {
                assert.instanceOf(model, User);
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.beforeDelete)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [User]),
            __metadata("design:returntype", void 0)
        ], User, "beforeDeleteHook", null);
        __decorate([
            (0, Decorators_1.afterDelete)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [User]),
            __metadata("design:returntype", void 0)
        ], User, "afterDeleteHook", null);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.findOrFail(1);
        await user.delete();
        const usersCount = await db.from('users').count('*', 'total');
        assert.equal(usersCount[0].total, 0);
    });
    (0, japa_1.default)('abort delete when before hook raises exception', async (assert) => {
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
                Object.defineProperty(this, "email", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            static boot() {
                if (this.booted) {
                    return;
                }
                super.boot();
                this.before('delete', (model) => {
                    assert.instanceOf(model, User);
                    throw new Error('Wait');
                });
                this.after('delete', (model) => {
                    assert.instanceOf(model, User);
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.findOrFail(1);
        try {
            await user.delete();
        }
        catch ({ message }) {
            assert.equal(message, 'Wait');
        }
        const usersCount = await db.from('users').count('*', 'total');
        assert.equal(usersCount[0].total, 1);
    });
    (0, japa_1.default)('invoke before and after fetch hooks', async (assert) => {
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
                Object.defineProperty(this, "email", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            static beforeFetchHook(query) {
                assert.instanceOf(query, QueryBuilder_1.ModelQueryBuilder);
            }
            static afterFetchHook(users) {
                assert.lengthOf(users, 1);
                assert.equal(users[0].username, 'virk');
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.beforeFetch)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [QueryBuilder_1.ModelQueryBuilder]),
            __metadata("design:returntype", void 0)
        ], User, "beforeFetchHook", null);
        __decorate([
            (0, Decorators_1.afterFetch)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Array]),
            __metadata("design:returntype", void 0)
        ], User, "afterFetchHook", null);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await User.query();
    });
    (0, japa_1.default)('@regression do not invoke after fetch hooks when updating rows', async () => {
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
            static beforeFetchHook() {
                throw new Error('Never expected to reach here');
            }
            static afterFetchHook() {
                throw new Error('Never expected to reach here');
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.beforeFetch)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], User, "beforeFetchHook", null);
        __decorate([
            (0, Decorators_1.afterFetch)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], User, "afterFetchHook", null);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await User.query().update({ username: 'nikk' });
    });
    (0, japa_1.default)('@regression do not invoke after fetch hooks when deleting rows', async () => {
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
            static beforeFetchHook() {
                throw new Error('Never expected to reach here');
            }
            static afterFetchHook() {
                throw new Error('Never expected to reach here');
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.beforeFetch)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], User, "beforeFetchHook", null);
        __decorate([
            (0, Decorators_1.afterFetch)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], User, "afterFetchHook", null);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await User.query().del();
    });
    (0, japa_1.default)('invoke before and after find hooks', async (assert) => {
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
            static beforeFindHook(query) {
                assert.instanceOf(query, QueryBuilder_1.ModelQueryBuilder);
            }
            static afterFindHook(user) {
                assert.equal(user.username, 'virk');
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.beforeFind)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [QueryBuilder_1.ModelQueryBuilder]),
            __metadata("design:returntype", void 0)
        ], User, "beforeFindHook", null);
        __decorate([
            (0, Decorators_1.afterFind)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [User]),
            __metadata("design:returntype", void 0)
        ], User, "afterFindHook", null);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await User.find(1);
    });
    (0, japa_1.default)('invoke before and after find hooks when .first method is used', async (assert) => {
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
            static beforeFindHook(query) {
                assert.instanceOf(query, QueryBuilder_1.ModelQueryBuilder);
            }
            static afterFindHook(user) {
                assert.equal(user.username, 'virk');
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.beforeFind)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [QueryBuilder_1.ModelQueryBuilder]),
            __metadata("design:returntype", void 0)
        ], User, "beforeFindHook", null);
        __decorate([
            (0, Decorators_1.afterFind)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [User]),
            __metadata("design:returntype", void 0)
        ], User, "afterFindHook", null);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await User.query().where('id', 1).first();
    });
    (0, japa_1.default)('invoke before and after paginate hooks', async (assert) => {
        assert.plan(5);
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
            static beforePaginateHook([countQuery, query]) {
                assert.instanceOf(query, QueryBuilder_1.ModelQueryBuilder);
                assert.instanceOf(countQuery, QueryBuilder_1.ModelQueryBuilder);
                assert.notDeepEqual(countQuery, query);
            }
            static afterPaginateHook(paginator) {
                assert.equal(paginator.total, 1);
                assert.equal(paginator.all()[0].username, 'virk');
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.beforePaginate)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Array]),
            __metadata("design:returntype", void 0)
        ], User, "beforePaginateHook", null);
        __decorate([
            (0, Decorators_1.afterPaginate)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [SimplePaginator_1.SimplePaginator]),
            __metadata("design:returntype", void 0)
        ], User, "afterPaginateHook", null);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await User.query().paginate(1);
    });
    (0, japa_1.default)('invoke before and after fetch hooks on paginate', async (assert) => {
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
            static beforeFetchHook(query) {
                assert.instanceOf(query, QueryBuilder_1.ModelQueryBuilder);
            }
            static afterFetchHook(users) {
                assert.equal(users[0].username, 'virk');
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.beforeFetch)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [QueryBuilder_1.ModelQueryBuilder]),
            __metadata("design:returntype", void 0)
        ], User, "beforeFetchHook", null);
        __decorate([
            (0, Decorators_1.afterFetch)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Array]),
            __metadata("design:returntype", void 0)
        ], User, "afterFetchHook", null);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await User.query().paginate(1);
    });
    (0, japa_1.default)('do not invoke before and after paginate hooks when using pojo', async () => {
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
            static beforePaginateHook() {
                throw new Error('Never expected to reached here');
            }
            static afterPaginateHook() {
                throw new Error('Never expected to reached here');
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
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        __decorate([
            (0, Decorators_1.beforePaginate)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], User, "beforePaginateHook", null);
        __decorate([
            (0, Decorators_1.afterPaginate)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], User, "afterPaginateHook", null);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await User.query().pojo().paginate(1);
    });
    (0, japa_1.default)('@regression resolve update keys when an object is passed', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "theUserName", {
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
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'username' }),
            __metadata("design:type", String)
        ], User.prototype, "theUserName", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        await db.table('users').insert({ username: 'virk' });
        await User.query().update({ theUserName: 'nikk' });
        const users = await db.from('users').select('*');
        assert.equal(users[0].username, 'nikk');
    });
    (0, japa_1.default)('@regression resolve update keys when a key value pair is passed', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "theUserName", {
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
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)({ columnName: 'username' }),
            __metadata("design:type", String)
        ], User.prototype, "theUserName", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "email", void 0);
        await db.table('users').insert({ username: 'virk' });
        await User.query().update('theUserName', 'nikk');
        const users = await db.from('users').select('*');
        assert.equal(users[0].username, 'nikk');
    });
});
japa_1.default.group('Base model | extend', (group) => {
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
    (0, japa_1.default)('extend model query builder', async (assert) => {
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
        db.ModelQueryBuilder.macro('whereActive', function () {
            this.where('is_active', true);
            return this;
        });
        const knexClient = db.connection().getReadClient();
        const { sql, bindings } = User.query()['whereActive']().toSQL();
        const { sql: knexSql, bindings: knexBindings } = knexClient
            .from('users')
            .where('is_active', true)
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('extend model insert query builder', async (assert) => {
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
            $getQueryFor(_, client) {
                return client.insertQuery().table('users').withId();
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
        db.InsertQueryBuilder.macro('withId', function () {
            this.returning('id');
            return this;
        });
        const knexClient = db.connection().getReadClient();
        const user = new User();
        const { sql, bindings } = user.$getQueryFor('insert', db.connection()).insert({ id: 1 }).toSQL();
        const { sql: knexSql, bindings: knexBindings } = knexClient
            .from('users')
            .returning('id')
            .insert({ id: 1 })
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
japa_1.default.group('Base Model | aggregates', (group) => {
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
    (0, japa_1.default)('count *', async (assert) => {
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
        await db
            .insertQuery()
            .table('users')
            .multiInsert([{ username: 'virk' }, { username: 'nikk' }]);
        const usersCount = await User.query().count('* as total');
        assert.deepEqual(usersCount.map((row) => {
            return {
                total: Number(row.$extras.total),
            };
        }), [{ total: 2 }]);
    });
    (0, japa_1.default)('count * distinct', async (assert) => {
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
        await db
            .insertQuery()
            .table('users')
            .multiInsert([{ username: 'virk' }, { username: 'nikk' }]);
        const usersCount = await User.query().countDistinct('username as total');
        assert.deepEqual(usersCount.map((row) => {
            return {
                total: Number(row.$extras.total),
            };
        }), [{ total: 2 }]);
    });
});
japa_1.default.group('Base Model | date', (group) => {
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
    (0, japa_1.default)('define date column', async (assert) => {
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.date(),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        assert.deepEqual(User.$getColumn('dob').meta, {
            autoCreate: false,
            autoUpdate: false,
            type: 'date',
        });
    });
    (0, japa_1.default)('define date column and turn on autoCreate flag', async (assert) => {
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.date({ autoCreate: true }),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        assert.deepEqual(User.$getColumn('dob').meta, {
            autoCreate: true,
            autoUpdate: false,
            type: 'date',
        });
    });
    (0, japa_1.default)('define date column and turn on autoUpdate flag', async (assert) => {
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.date({ autoUpdate: true }),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        assert.deepEqual(User.$getColumn('dob').meta, {
            autoCreate: false,
            autoUpdate: true,
            type: 'date',
        });
    });
    (0, japa_1.default)('initiate date column values with current date when missing', async (assert) => {
        assert.plan(1);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.date({ autoCreate: true }),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        const user = new User();
        User.$adapter = adapter;
        adapter.on('insert', (model) => {
            assert.instanceOf(model.dob, luxon_1.DateTime);
        });
        user.username = 'virk';
        await user.save();
    });
    (0, japa_1.default)('do initiate date column values with current date when autoCreate is off', async (assert) => {
        assert.plan(2);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "dob", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "createdAt", {
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
            Decorators_1.column.date({ autoCreate: true }),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        __decorate([
            Decorators_1.column.date(),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "createdAt", void 0);
        const user = new User();
        User.$adapter = adapter;
        adapter.on('insert', (model) => {
            assert.instanceOf(model.dob, luxon_1.DateTime);
            assert.isUndefined(model.createdAt);
        });
        user.username = 'virk';
        await user.save();
    });
    (0, japa_1.default)('always update date column value when autoUpdate is on', async (assert) => {
        assert.plan(1);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "updatedAt", {
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
            Decorators_1.column.date({ autoUpdate: true }),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "updatedAt", void 0);
        const user = new User();
        User.$adapter = adapter;
        adapter.on('update', (model) => {
            assert.instanceOf(model.updatedAt, luxon_1.DateTime);
        });
        user.username = 'virk';
        await user.save();
        user.username = 'nikk';
        await user.save();
    });
    (0, japa_1.default)('format date instance to string before sending to the adapter', async (assert) => {
        assert.plan(1);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.date({ autoCreate: true }),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        const user = new User();
        User.$adapter = adapter;
        adapter.on('insert', (_, attributes) => {
            assert.deepEqual(attributes, { username: 'virk', dob: luxon_1.DateTime.local().toISODate() });
        });
        user.username = 'virk';
        await user.save();
    });
    (0, japa_1.default)('leave date untouched when it is defined as string', async (assert) => {
        assert.plan(1);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.date(),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        const user = new User();
        User.$adapter = adapter;
        adapter.on('insert', (_, attributes) => {
            assert.deepEqual(attributes, { username: 'virk', dob: '2010-11-20' });
        });
        user.username = 'virk';
        user.dob = '2010-11-20';
        await user.save();
    });
    (0, japa_1.default)('do not attempt to format undefined values', async (assert) => {
        assert.plan(1);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.date(),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        const user = new User();
        User.$adapter = adapter;
        adapter.on('insert', (_, attributes) => {
            assert.deepEqual(attributes, { username: 'virk' });
        });
        user.username = 'virk';
        await user.save();
    });
    (0, japa_1.default)('raise error when date column value is unprocessable', async (assert) => {
        assert.plan(1);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.date(),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        const user = new User();
        User.$adapter = adapter;
        user.username = 'virk';
        user.dob = 10;
        try {
            await user.save();
        }
        catch ({ message }) {
            assert.equal(message, 'E_INVALID_DATE_COLUMN_VALUE: The value for "User.dob" must be an instance of "luxon.DateTime"');
        }
    });
    (0, japa_1.default)('raise error when datetime is invalid', async (assert) => {
        assert.plan(1);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.date(),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        const user = new User();
        user.dob = luxon_1.DateTime.fromISO('hello-world');
        User.$adapter = adapter;
        user.username = 'virk';
        try {
            await user.save();
        }
        catch ({ message }) {
            assert.equal(message, 'E_INVALID_DATE_COLUMN_VALUE: Invalid value for "User.dob". unparsable');
        }
    });
    (0, japa_1.default)('allow overriding prepare method', async (assert) => {
        assert.plan(1);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.date({
                autoCreate: true,
                prepare: (value) => value.toISOWeekDate(),
            }),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        const user = new User();
        User.$adapter = adapter;
        adapter.on('insert', (_, attributes) => {
            assert.deepEqual(attributes, { username: 'virk', dob: luxon_1.DateTime.local().toISOWeekDate() });
        });
        user.username = 'virk';
        await user.save();
    });
    (0, japa_1.default)('convert date to datetime instance during fetch', async (assert) => {
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
                Object.defineProperty(this, "createdAt", {
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
            Decorators_1.column.date(),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "createdAt", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.find(1);
        assert.instanceOf(user.createdAt, luxon_1.DateTime);
    });
    (0, japa_1.default)('ignore null or empty values during fetch', async (assert) => {
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
                Object.defineProperty(this, "updatedAt", {
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
            Decorators_1.column.date(),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "updatedAt", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.find(1);
        assert.isNull(user.updatedAt);
    });
    (0, japa_1.default)('convert date to toISODate during serialize', async (assert) => {
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
                Object.defineProperty(this, "createdAt", {
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
            Decorators_1.column.date(),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "createdAt", void 0);
        await db.insertQuery().table('users').insert({
            username: 'virk',
            created_at: luxon_1.DateTime.local().toISODate(),
        });
        const user = await User.find(1);
        assert.match(user.toJSON().created_at, /\d{4}-\d{2}-\d{2}/);
    });
    (0, japa_1.default)('do not attempt to serialize, when already a string', async (assert) => {
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
                Object.defineProperty(this, "createdAt", {
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
            Decorators_1.column.date({
                consume: (value) => typeof value === 'string'
                    ? luxon_1.DateTime.fromSQL(value).minus({ days: 1 }).toISODate()
                    : luxon_1.DateTime.fromJSDate(value).minus({ days: 1 }).toISODate(),
            }),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "createdAt", void 0);
        await db.insertQuery().table('users').insert({
            username: 'virk',
            created_at: luxon_1.DateTime.local().toISODate(),
        });
        const user = await User.find(1);
        assert.equal(user.toJSON().created_at, luxon_1.DateTime.local().minus({ days: 1 }).toISODate());
    });
});
japa_1.default.group('Base Model | datetime', (group) => {
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
    (0, japa_1.default)('define datetime column', async (assert) => {
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.dateTime(),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        assert.deepEqual(User.$getColumn('dob').meta, {
            autoCreate: false,
            autoUpdate: false,
            type: 'datetime',
        });
    });
    (0, japa_1.default)('define datetime column and turn on autoCreate flag', async (assert) => {
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.dateTime({ autoCreate: true }),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        assert.deepEqual(User.$getColumn('dob').meta, {
            autoCreate: true,
            autoUpdate: false,
            type: 'datetime',
        });
    });
    (0, japa_1.default)('define datetime column and turn on autoUpdate flag', async (assert) => {
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.dateTime({ autoUpdate: true }),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        assert.deepEqual(User.$getColumn('dob').meta, {
            autoCreate: false,
            autoUpdate: true,
            type: 'datetime',
        });
    });
    (0, japa_1.default)('initiate datetime column values with current date when missing', async (assert) => {
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
                Object.defineProperty(this, "joinedAt", {
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
            Decorators_1.column.dateTime({ autoCreate: true }),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "joinedAt", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        assert.instanceOf(user.joinedAt, luxon_1.DateTime);
        const createdUser = await db.from('users').select('*').first();
        const clientDateFormat = User.query().client.dialect.dateTimeFormat;
        const fetchedJoinedAt = createdUser.joined_at instanceof Date
            ? luxon_1.DateTime.fromJSDate(createdUser.joined_at)
            : luxon_1.DateTime.fromSQL(createdUser.joined_at);
        assert.equal(fetchedJoinedAt.toFormat(clientDateFormat), user.joinedAt.toFormat(clientDateFormat));
    });
    (0, japa_1.default)('ignore undefined values', async (assert) => {
        assert.plan(1);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.dateTime(),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        const user = new User();
        User.$adapter = adapter;
        adapter.on('insert', (_, attributes) => {
            assert.isUndefined(attributes.dob);
        });
        user.username = 'virk';
        await user.save();
    });
    (0, japa_1.default)('ignore string values', async (assert) => {
        assert.plan(1);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.dateTime(),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        const user = new User();
        User.$adapter = adapter;
        adapter.on('insert', (_, attributes) => {
            assert.equal(attributes.dob, localTime);
        });
        const localTime = luxon_1.DateTime.local().toISO();
        user.username = 'virk';
        user.dob = localTime;
        await user.save();
    });
    (0, japa_1.default)('raise error when datetime column value is unprocessable', async (assert) => {
        assert.plan(1);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.dateTime(),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        const user = new User();
        User.$adapter = adapter;
        user.username = 'virk';
        user.dob = 10;
        try {
            await user.save();
        }
        catch ({ message }) {
            assert.equal(message, 'E_INVALID_DATETIME_COLUMN_VALUE: The value for "User.dob" must be an instance of "luxon.DateTime"');
        }
    });
    (0, japa_1.default)('allow overriding prepare method', async (assert) => {
        assert.plan(1);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "dob", {
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
            Decorators_1.column.dateTime({
                autoCreate: true,
                prepare: (value) => value.toISOWeekDate(),
            }),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "dob", void 0);
        const user = new User();
        User.$adapter = adapter;
        adapter.on('insert', (_, attributes) => {
            assert.deepEqual(attributes, { username: 'virk', dob: luxon_1.DateTime.local().toISOWeekDate() });
        });
        user.username = 'virk';
        await user.save();
    });
    (0, japa_1.default)('convert timestamp to datetime instance during fetch', async (assert) => {
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
                Object.defineProperty(this, "createdAt", {
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
            Decorators_1.column.dateTime(),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "createdAt", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.find(1);
        assert.instanceOf(user.createdAt, luxon_1.DateTime);
    });
    (0, japa_1.default)('ignore null or empty values during fetch', async (assert) => {
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
                Object.defineProperty(this, "updatedAt", {
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
            Decorators_1.column.dateTime(),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "updatedAt", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        const user = await User.find(1);
        assert.isNull(user.updatedAt);
    });
    (0, japa_1.default)('always set datetime value when autoUpdate is true', async (assert) => {
        assert.plan(2);
        const adapter = new test_helpers_1.FakeAdapter();
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
                Object.defineProperty(this, "joinedAt", {
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
            Decorators_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "joinedAt", void 0);
        User.$adapter = adapter;
        adapter.on('update', (_, attributes) => {
            assert.property(attributes, 'username');
            assert.property(attributes, 'joined_at');
        });
        const user = new User();
        user.username = 'virk';
        await user.save();
        user.username = 'nikk';
        await user.save();
    });
    (0, japa_1.default)('do not set autoUpdate field datetime when model is not dirty', async (assert) => {
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
                Object.defineProperty(this, "joinedAt", {
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
            Decorators_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "joinedAt", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const originalDateTimeString = user.joinedAt.toString();
        await user.save();
        assert.equal(originalDateTimeString, user.joinedAt.toString());
    });
    (0, japa_1.default)('set datetime when model is dirty but after invoking a hook', async (assert) => {
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
                Object.defineProperty(this, "joinedAt", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            static updateUserName(model) {
                if (!model.$isPersisted) {
                    return;
                }
                model.username = 'nikk';
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
            Decorators_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "joinedAt", void 0);
        __decorate([
            (0, Decorators_1.beforeSave)(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [User]),
            __metadata("design:returntype", void 0)
        ], User, "updateUserName", null);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const originalDateTimeString = user.joinedAt.toString();
        await user.save();
        assert.notEqual(originalDateTimeString, user.joinedAt.toString());
    }).retry(3);
    (0, japa_1.default)('convert datetime to toISO during serialize', async (assert) => {
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
                Object.defineProperty(this, "joinedAt", {
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
            Decorators_1.column.dateTime(),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "joinedAt", void 0);
        await db
            .insertQuery()
            .table('users')
            .insert({
            username: 'virk',
            joined_at: luxon_1.DateTime.local().toFormat(db.connection().dialect.dateTimeFormat),
        });
        const user = await User.find(1);
        assert.match(user.toJSON().joined_at, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}(\+|\-)\d{2}:\d{2}/);
    });
    (0, japa_1.default)('do not attempt to serialize, when already a string', async (assert) => {
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
                Object.defineProperty(this, "joinedAt", {
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
            Decorators_1.column.dateTime({
                consume: (value) => typeof value === 'string'
                    ? luxon_1.DateTime.fromSQL(value).minus({ days: 1 }).toISODate()
                    : luxon_1.DateTime.fromJSDate(value).minus({ days: 1 }).toISODate(),
            }),
            __metadata("design:type", luxon_1.DateTime)
        ], User.prototype, "joinedAt", void 0);
        await db
            .insertQuery()
            .table('users')
            .insert({
            username: 'virk',
            joined_at: luxon_1.DateTime.local().toFormat(db.connection().dialect.dateTimeFormat),
        });
        const user = await User.find(1);
        assert.equal(user.toJSON().joined_at, luxon_1.DateTime.local().minus({ days: 1 }).toISODate());
    });
});
japa_1.default.group('Base Model | paginate', (group) => {
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
    (0, japa_1.default)('paginate through rows', async (assert) => {
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
        await db.insertQuery().table('users').multiInsert((0, test_helpers_1.getUsers)(18));
        const users = await User.query().paginate(1, 5);
        users.baseUrl('/users');
        assert.instanceOf(users, Paginator_1.ModelPaginator);
        assert.lengthOf(users.all(), 5);
        assert.instanceOf(users.all()[0], User);
        assert.equal(users.perPage, 5);
        assert.equal(users.currentPage, 1);
        assert.equal(users.lastPage, 4);
        assert.isTrue(users.hasPages);
        assert.isTrue(users.hasMorePages);
        assert.isFalse(users.isEmpty);
        assert.equal(users.total, 18);
        assert.isTrue(users.hasTotal);
        assert.deepEqual(users.getMeta(), {
            total: 18,
            per_page: 5,
            current_page: 1,
            last_page: 4,
            first_page: 1,
            first_page_url: '/users?page=1',
            last_page_url: '/users?page=4',
            next_page_url: '/users?page=2',
            previous_page_url: null,
        });
    });
    (0, japa_1.default)('serialize from model paginator', async (assert) => {
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
        await db.insertQuery().table('users').multiInsert((0, test_helpers_1.getUsers)(18));
        const users = await User.query().paginate(1, 5);
        users.baseUrl('/users');
        assert.instanceOf(users, Paginator_1.ModelPaginator);
        const { meta, data } = users.serialize({
            fields: ['username'],
        });
        data.forEach((row) => {
            assert.notProperty(row, 'email');
            assert.notProperty(row, 'id');
        });
        assert.deepEqual(meta, {
            total: 18,
            per_page: 5,
            current_page: 1,
            last_page: 4,
            first_page: 1,
            first_page_url: '/users?page=1',
            last_page_url: '/users?page=4',
            next_page_url: '/users?page=2',
            previous_page_url: null,
        });
    });
    (0, japa_1.default)('return simple paginator instance when using pojo', async (assert) => {
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
        await db.insertQuery().table('users').multiInsert((0, test_helpers_1.getUsers)(18));
        const users = await User.query().pojo().paginate(1, 5);
        users.baseUrl('/users');
        assert.instanceOf(users, SimplePaginator_1.SimplePaginator);
        assert.lengthOf(users.all(), 5);
        assert.notInstanceOf(users.all()[0], User);
        assert.equal(users.perPage, 5);
        assert.equal(users.currentPage, 1);
        assert.equal(users.lastPage, 4);
        assert.isTrue(users.hasPages);
        assert.isTrue(users.hasMorePages);
        assert.isFalse(users.isEmpty);
        assert.equal(users.total, 18);
        assert.isTrue(users.hasTotal);
        assert.deepEqual(users.getMeta(), {
            total: 18,
            per_page: 5,
            current_page: 1,
            last_page: 4,
            first_page: 1,
            first_page_url: '/users?page=1',
            last_page_url: '/users?page=4',
            next_page_url: '/users?page=2',
            previous_page_url: null,
        });
    });
    (0, japa_1.default)('use model naming strategy for pagination properties', async (assert) => {
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
        User.namingStrategy = new SnakeCase_1.SnakeCaseNamingStrategy();
        User.namingStrategy.paginationMetaKeys = () => {
            return {
                total: 'total',
                perPage: 'perPage',
                currentPage: 'currentPage',
                lastPage: 'lastPage',
                firstPage: 'firstPage',
                firstPageUrl: 'firstPageUrl',
                lastPageUrl: 'lastPageUrl',
                nextPageUrl: 'nextPageUrl',
                previousPageUrl: 'previousPageUrl',
            };
        };
        await db.insertQuery().table('users').multiInsert((0, test_helpers_1.getUsers)(18));
        const users = await User.query().paginate(1, 5);
        users.baseUrl('/users');
        assert.lengthOf(users.all(), 5);
        assert.instanceOf(users.all()[0], User);
        assert.equal(users.perPage, 5);
        assert.equal(users.currentPage, 1);
        assert.equal(users.lastPage, 4);
        assert.isTrue(users.hasPages);
        assert.isTrue(users.hasMorePages);
        assert.isFalse(users.isEmpty);
        assert.equal(users.total, 18);
        assert.isTrue(users.hasTotal);
        assert.deepEqual(users.getMeta(), {
            total: 18,
            perPage: 5,
            currentPage: 1,
            lastPage: 4,
            firstPage: 1,
            firstPageUrl: '/users?page=1',
            lastPageUrl: '/users?page=4',
            nextPageUrl: '/users?page=2',
            previousPageUrl: null,
        });
    });
    (0, japa_1.default)('use table aliases', async (assert) => {
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
        const usersList = (0, test_helpers_1.getUsers)(18);
        await db.insertQuery().table('users').multiInsert(usersList);
        const users = await User.query()
            .from({ u: User.table })
            .where('u.username', usersList[0].username)
            .paginate(1, 5);
        users.baseUrl('/users');
        assert.instanceOf(users, Paginator_1.ModelPaginator);
        assert.lengthOf(users.all(), 1);
        assert.instanceOf(users.all()[0], User);
        assert.equal(users.perPage, 5);
        assert.equal(users.currentPage, 1);
        assert.equal(users.lastPage, 1);
        assert.isFalse(users.hasPages);
        assert.isFalse(users.hasMorePages);
        assert.isFalse(users.isEmpty);
        assert.equal(users.total, 1);
        assert.isTrue(users.hasTotal);
        assert.deepEqual(users.getMeta(), {
            total: 1,
            per_page: 5,
            current_page: 1,
            last_page: 1,
            first_page: 1,
            first_page_url: '/users?page=1',
            last_page_url: '/users?page=1',
            next_page_url: null,
            previous_page_url: null,
        });
    });
});
japa_1.default.group('Base Model | toObject', (group) => {
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
    (0, japa_1.default)('convert model to its object representation', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.toObject(), { username: 'virk', $extras: {} });
    });
    (0, japa_1.default)('use model property key when converting model to object', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ serializeAs: 'theUserName', columnName: 'user_name' }),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.toObject(), { username: 'virk', $extras: {} });
    });
    (0, japa_1.default)('add computed properties to toObject result', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            get fullName() {
                return this.username.toUpperCase();
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.computed)(),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], User.prototype, "fullName", null);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.toObject(), { username: 'virk', fullName: 'VIRK', $extras: {} });
    });
    (0, japa_1.default)('do not add computed property when it returns undefined', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
            get fullName() {
                return undefined;
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.computed)(),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], User.prototype, "fullName", null);
        const user = new User();
        user.username = 'virk';
        assert.deepEqual(user.toObject(), { username: 'virk', $extras: {} });
    });
    (0, japa_1.default)('add preloaded hasOne relationship to toObject result', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
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
        const user = new User();
        user.username = 'virk';
        user.$setRelated('profile', new Profile());
        assert.deepEqual(user.toObject(), {
            username: 'virk',
            profile: {
                $extras: {},
            },
            $extras: {},
        });
    });
    (0, japa_1.default)('add preloaded hasMany relationship to toObject result', async (assert) => {
        class Comment extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "body", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "postId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Comment.prototype, "body", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Comment.prototype, "postId", void 0);
        class Post extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "title", {
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
                Object.defineProperty(this, "comments", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Post.prototype, "title", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Post.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.hasMany)(() => Comment),
            __metadata("design:type", Object)
        ], Post.prototype, "comments", void 0);
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
                Object.defineProperty(this, "posts", {
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
            (0, Decorators_1.hasMany)(() => Post),
            __metadata("design:type", Object)
        ], User.prototype, "posts", void 0);
        const user = new User();
        user.username = 'virk';
        const post = new Post();
        post.title = 'Adonis 101';
        const comment = new Comment();
        comment.body = 'Nice post';
        post.$setRelated('comments', [comment]);
        user.$setRelated('posts', [post]);
        assert.deepEqual(user.toObject(), {
            username: 'virk',
            posts: [
                {
                    title: 'Adonis 101',
                    comments: [
                        {
                            body: 'Nice post',
                            $extras: {},
                        },
                    ],
                    $extras: {},
                },
            ],
            $extras: {},
        });
    });
});
japa_1.default.group('Base model | inheritance', (group) => {
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
    (0, japa_1.default)('inherit primary key from the base model', async (assert) => {
        class MyBaseModel extends BaseModel {
        }
        Object.defineProperty(MyBaseModel, "primaryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'user_id'
        });
        class User extends MyBaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        MyBaseModel.boot();
        User.boot();
        assert.equal(User.primaryKey, 'user_id');
    });
    (0, japa_1.default)('use explicitly defined primary key', async (assert) => {
        class MyBaseModel extends BaseModel {
        }
        Object.defineProperty(MyBaseModel, "primaryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'user_id'
        });
        class User extends MyBaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(User, "primaryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'the_user_id'
        });
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        MyBaseModel.boot();
        User.boot();
        assert.equal(User.primaryKey, 'the_user_id');
    });
    (0, japa_1.default)('do not inherit table from the base model', async (assert) => {
        class MyBaseModel extends BaseModel {
        }
        Object.defineProperty(MyBaseModel, "table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'foo'
        });
        class User extends MyBaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        MyBaseModel.boot();
        User.boot();
        assert.equal(User.table, 'users');
    });
    (0, japa_1.default)('inherting a model should copy columns', async (assert) => {
        class MyBaseModel extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], MyBaseModel.prototype, "id", void 0);
        class User extends MyBaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        MyBaseModel.boot();
        User.boot();
        assert.deepEqual(User.$columnsDefinitions, new Map([
            [
                'age',
                {
                    columnName: 'age',
                    consume: undefined,
                    hasGetter: false,
                    hasSetter: false,
                    isPrimary: false,
                    meta: undefined,
                    prepare: undefined,
                    serialize: undefined,
                    serializeAs: 'age',
                },
            ],
            [
                'id',
                {
                    columnName: 'id',
                    consume: undefined,
                    hasGetter: false,
                    hasSetter: false,
                    isPrimary: true,
                    meta: undefined,
                    prepare: undefined,
                    serialize: undefined,
                    serializeAs: 'id',
                },
            ],
            [
                'username',
                {
                    columnName: 'username',
                    consume: undefined,
                    hasGetter: false,
                    hasSetter: false,
                    isPrimary: false,
                    meta: undefined,
                    prepare: undefined,
                    serialize: undefined,
                    serializeAs: 'username',
                },
            ],
        ]));
        assert.deepEqual(User.$keys.attributesToColumns.all(), {
            age: 'age',
            id: 'id',
            username: 'username',
        });
        assert.deepEqual(MyBaseModel.$columnsDefinitions, new Map([
            [
                'id',
                {
                    columnName: 'id',
                    consume: undefined,
                    hasGetter: false,
                    hasSetter: false,
                    isPrimary: true,
                    meta: undefined,
                    prepare: undefined,
                    serialize: undefined,
                    serializeAs: 'id',
                },
            ],
        ]));
        assert.deepEqual(MyBaseModel.$keys.attributesToColumns.all(), {
            id: 'id',
        });
    });
    (0, japa_1.default)('allow overwriting column', async (assert) => {
        class MyBaseModel extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", String)
        ], MyBaseModel.prototype, "userId", void 0);
        class User extends MyBaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true, columnName: 'user_uuid' }),
            __metadata("design:type", String)
        ], User.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        MyBaseModel.boot();
        User.boot();
        assert.deepEqual(User.$columnsDefinitions, new Map([
            [
                'age',
                {
                    columnName: 'age',
                    consume: undefined,
                    hasGetter: false,
                    hasSetter: false,
                    isPrimary: false,
                    meta: undefined,
                    prepare: undefined,
                    serialize: undefined,
                    serializeAs: 'age',
                },
            ],
            [
                'userId',
                {
                    columnName: 'user_uuid',
                    consume: undefined,
                    hasGetter: false,
                    hasSetter: false,
                    isPrimary: true,
                    meta: undefined,
                    prepare: undefined,
                    serialize: undefined,
                    serializeAs: 'user_id',
                },
            ],
            [
                'username',
                {
                    columnName: 'username',
                    consume: undefined,
                    hasGetter: false,
                    hasSetter: false,
                    isPrimary: false,
                    meta: undefined,
                    prepare: undefined,
                    serialize: undefined,
                    serializeAs: 'username',
                },
            ],
        ]));
        assert.deepEqual(User.$keys.attributesToColumns.all(), {
            age: 'age',
            userId: 'user_uuid',
            username: 'username',
        });
        assert.deepEqual(MyBaseModel.$columnsDefinitions, new Map([
            [
                'userId',
                {
                    columnName: 'user_id',
                    consume: undefined,
                    hasGetter: false,
                    hasSetter: false,
                    isPrimary: true,
                    meta: undefined,
                    prepare: undefined,
                    serialize: undefined,
                    serializeAs: 'user_id',
                },
            ],
        ]));
        assert.deepEqual(MyBaseModel.$keys.attributesToColumns.all(), {
            userId: 'user_id',
        });
    });
    (0, japa_1.default)('inherting a model should copy computed properties', async (assert) => {
        class MyBaseModel extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "fullName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.computed)(),
            __metadata("design:type", String)
        ], MyBaseModel.prototype, "fullName", void 0);
        class User extends MyBaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "score", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        __decorate([
            (0, Decorators_1.computed)(),
            __metadata("design:type", Number)
        ], User.prototype, "score", void 0);
        MyBaseModel.boot();
        User.boot();
        assert.deepEqual(User.$columnsDefinitions, new Map([
            [
                'age',
                {
                    columnName: 'age',
                    consume: undefined,
                    hasGetter: false,
                    hasSetter: false,
                    isPrimary: false,
                    meta: undefined,
                    prepare: undefined,
                    serialize: undefined,
                    serializeAs: 'age',
                },
            ],
            [
                'username',
                {
                    columnName: 'username',
                    consume: undefined,
                    hasGetter: false,
                    hasSetter: false,
                    isPrimary: false,
                    meta: undefined,
                    prepare: undefined,
                    serialize: undefined,
                    serializeAs: 'username',
                },
            ],
        ]));
        assert.deepEqual(User.$computedDefinitions, new Map([
            [
                'fullName',
                {
                    meta: undefined,
                    serializeAs: 'fullName',
                },
            ],
            [
                'score',
                {
                    meta: undefined,
                    serializeAs: 'score',
                },
            ],
        ]));
        assert.deepEqual(User.$keys.attributesToColumns.all(), {
            age: 'age',
            username: 'username',
        });
        assert.deepEqual(MyBaseModel.$columnsDefinitions, new Map([]));
        assert.deepEqual(MyBaseModel.$computedDefinitions, new Map([
            [
                'fullName',
                {
                    meta: undefined,
                    serializeAs: 'fullName',
                },
            ],
        ]));
        assert.deepEqual(MyBaseModel.$keys.attributesToColumns.all(), {});
    });
    (0, japa_1.default)('allow overwriting computed properties', async (assert) => {
        class MyBaseModel extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "fullName", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.computed)(),
            __metadata("design:type", String)
        ], MyBaseModel.prototype, "fullName", void 0);
        class User extends MyBaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "age", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "age", void 0);
        __decorate([
            (0, Decorators_1.computed)({ serializeAs: 'name' }),
            __metadata("design:type", String)
        ], User.prototype, "fullName", void 0);
        MyBaseModel.boot();
        User.boot();
        assert.deepEqual(User.$columnsDefinitions, new Map([
            [
                'age',
                {
                    columnName: 'age',
                    consume: undefined,
                    hasGetter: false,
                    hasSetter: false,
                    isPrimary: false,
                    meta: undefined,
                    prepare: undefined,
                    serialize: undefined,
                    serializeAs: 'age',
                },
            ],
            [
                'username',
                {
                    columnName: 'username',
                    consume: undefined,
                    hasGetter: false,
                    hasSetter: false,
                    isPrimary: false,
                    meta: undefined,
                    prepare: undefined,
                    serialize: undefined,
                    serializeAs: 'username',
                },
            ],
        ]));
        assert.deepEqual(User.$computedDefinitions, new Map([
            [
                'fullName',
                {
                    meta: undefined,
                    serializeAs: 'name',
                },
            ],
        ]));
        assert.deepEqual(User.$keys.attributesToColumns.all(), {
            age: 'age',
            username: 'username',
        });
        assert.deepEqual(MyBaseModel.$columnsDefinitions, new Map([]));
        assert.deepEqual(MyBaseModel.$computedDefinitions, new Map([
            [
                'fullName',
                {
                    meta: undefined,
                    serializeAs: 'fullName',
                },
            ],
        ]));
        assert.deepEqual(MyBaseModel.$keys.attributesToColumns.all(), {});
    });
    (0, japa_1.default)('inherting a model should copy relationships', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class Email extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Email.prototype, "userId", void 0);
        Profile.boot();
        Email.boot();
        class MyBaseModel extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], MyBaseModel.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], MyBaseModel.prototype, "profile", void 0);
        class User extends MyBaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "emails", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.hasMany)(() => Email),
            __metadata("design:type", Object)
        ], User.prototype, "emails", void 0);
        MyBaseModel.boot();
        User.boot();
        assert.isTrue(User.$relationsDefinitions.has('emails'));
        assert.isTrue(User.$relationsDefinitions.has('profile'));
        assert.isTrue(MyBaseModel.$relationsDefinitions.has('profile'));
        assert.isFalse(MyBaseModel.$relationsDefinitions.has('emails'));
    });
    (0, japa_1.default)('overwrite relationship during relationsip', async (assert) => {
        class SocialProfile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "socialParentId", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], SocialProfile.prototype, "socialParentId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], SocialProfile.prototype, "userId", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class Email extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Email.prototype, "userId", void 0);
        SocialProfile.boot();
        Profile.boot();
        Email.boot();
        class MyBaseModel extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], MyBaseModel.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], MyBaseModel.prototype, "profile", void 0);
        class User extends MyBaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "emails", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.hasMany)(() => Email),
            __metadata("design:type", Object)
        ], User.prototype, "emails", void 0);
        __decorate([
            (0, Decorators_1.hasOne)(() => SocialProfile, { foreignKey: 'socialParentId' }),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        MyBaseModel.boot();
        User.boot();
        assert.deepEqual(User.$getRelation('profile').relatedModel(), SocialProfile);
        assert.deepEqual(User.$getRelation('profile').model, User);
        assert.deepEqual(MyBaseModel.$getRelation('profile').relatedModel(), Profile);
        assert.deepEqual(MyBaseModel.$getRelation('profile').model, MyBaseModel);
    });
    (0, japa_1.default)('allow overwriting relationships', async (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        class Email extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Email.prototype, "userId", void 0);
        Profile.boot();
        Email.boot();
        class MyBaseModel extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], MyBaseModel.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], MyBaseModel.prototype, "profile", void 0);
        class User extends MyBaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "emails", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile, {
                onQuery() { },
            }),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        __decorate([
            (0, Decorators_1.hasMany)(() => Email),
            __metadata("design:type", Object)
        ], User.prototype, "emails", void 0);
        MyBaseModel.boot();
        User.boot();
        assert.isTrue(User.$relationsDefinitions.has('emails'));
        assert.isTrue(User.$relationsDefinitions.has('profile'));
        assert.isTrue(MyBaseModel.$relationsDefinitions.has('profile'));
        assert.isFalse(MyBaseModel.$relationsDefinitions.has('emails'));
        assert.isFunction(User.$relationsDefinitions.get('profile')['onQueryHook']);
        assert.isUndefined(MyBaseModel.$relationsDefinitions.get('profile')['onQueryHook']);
    });
    (0, japa_1.default)('inherting a model should copy hooks', async (assert) => {
        function hook1() { }
        function hook2() { }
        class MyBaseModel extends BaseModel {
            static boot() {
                const isBooted = MyBaseModel.hasOwnProperty('booted') && MyBaseModel.booted === true;
                super.boot();
                if (!isBooted) {
                    this.before('create', hook1);
                }
            }
        }
        class User extends MyBaseModel {
            static boot() {
                super.boot();
                this.before('create', hook2);
            }
        }
        MyBaseModel.boot();
        User.boot();
        assert.isTrue(User.$hooks.has('before', 'create', hook1));
        assert.isTrue(User.$hooks.has('before', 'create', hook2));
        assert.isTrue(MyBaseModel.$hooks.has('before', 'create', hook1));
        assert.isFalse(MyBaseModel.$hooks.has('before', 'create', hook2));
    });
});
