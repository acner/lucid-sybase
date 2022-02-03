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
const scope_1 = require("../../src/Helpers/scope");
const Decorators_1 = require("../../src/Orm/Decorators");
const QueryBuilder_1 = require("../../src/Orm/Relations/HasOne/QueryBuilder");
const test_helpers_1 = require("../../test-helpers");
let db;
let app;
let BaseModel;
japa_1.default.group('Model | HasOne | Options', (group) => {
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
    (0, japa_1.default)('raise error when localKey is missing', (assert) => {
        assert.plan(1);
        try {
            class Profile extends BaseModel {
            }
            class User extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "profile", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                }
            }
            __decorate([
                (0, Decorators_1.hasOne)(() => Profile),
                __metadata("design:type", Object)
            ], User.prototype, "profile", void 0);
            User.boot();
            User.$getRelation('profile').boot();
        }
        catch ({ message }) {
            assert.equal(message, 'E_MISSING_MODEL_ATTRIBUTE: "User.profile" expects "id" to exist on "User" model, but is missing');
        }
    });
    (0, japa_1.default)('raise error when foreignKey is missing', (assert) => {
        assert.plan(1);
        try {
            class Profile extends BaseModel {
            }
            Profile.boot();
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
            User.boot();
            User.$getRelation('profile').boot();
        }
        catch ({ message }) {
            assert.equal(message, 'E_MISSING_MODEL_ATTRIBUTE: "User.profile" expects "userId" to exist on "Profile" model, but is missing');
        }
    });
    (0, japa_1.default)('use primary key is as the local key', (assert) => {
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
        Profile.boot();
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
        User.boot();
        User.$getRelation('profile').boot();
        assert.equal(User.$getRelation('profile')['localKey'], 'id');
    });
    (0, japa_1.default)('use custom defined local key', (assert) => {
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
        Profile.boot();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "uid", {
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
            (0, Decorators_1.column)({ columnName: 'user_uid' }),
            __metadata("design:type", Number)
        ], User.prototype, "uid", void 0);
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile, { localKey: 'uid' }),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        User.boot();
        User.$getRelation('profile').boot();
        assert.equal(User.$getRelation('profile')['localKey'], 'uid');
    });
    (0, japa_1.default)('compute foreign key from model name and primary key', (assert) => {
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
        Profile.boot();
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
        User.boot();
        User.$getRelation('profile').boot();
        assert.equal(User.$getRelation('profile')['foreignKey'], 'userId');
    });
    (0, japa_1.default)('use pre defined foreign key', (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userUid", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ columnName: 'user_id' }),
            __metadata("design:type", Number)
        ], Profile.prototype, "userUid", void 0);
        Profile.boot();
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
            (0, Decorators_1.hasOne)(() => Profile, { foreignKey: 'userUid' }),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        User.boot();
        User.$getRelation('profile').boot();
        assert.equal(User.$getRelation('profile')['foreignKey'], 'userUid');
    });
    (0, japa_1.default)('clone relationship instance with options', (assert) => {
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userUid", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ columnName: 'user_id' }),
            __metadata("design:type", Number)
        ], Profile.prototype, "userUid", void 0);
        Profile.boot();
        class BaseUser extends BaseModel {
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
        ], BaseUser.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile, { foreignKey: 'userUid' }),
            __metadata("design:type", Object)
        ], BaseUser.prototype, "profile", void 0);
        class User extends BaseUser {
        }
        User.boot();
        User.$getRelation('profile').boot();
        assert.equal(User.$getRelation('profile')['foreignKey'], 'userUid');
        assert.deepEqual(User.$getRelation('profile').model, User);
    });
});
japa_1.default.group('Model | HasOne | Set Relations', (group) => {
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
    (0, japa_1.default)('set related model instance', (assert) => {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        User.boot();
        User.$getRelation('profile').boot();
        const user = new User();
        const profile = new Profile();
        User.$getRelation('profile').setRelated(user, profile);
        assert.deepEqual(user.profile, profile);
    });
    (0, japa_1.default)('push related model instance', (assert) => {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        User.boot();
        User.$getRelation('profile').boot();
        const user = new User();
        const profile = new Profile();
        User.$getRelation('profile').pushRelated(user, profile);
        assert.deepEqual(user.profile, profile);
    });
    (0, japa_1.default)('set many of related instances', (assert) => {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        User.boot();
        User.$getRelation('profile').boot();
        const user = new User();
        user.fill({ id: 1 });
        const user1 = new User();
        user1.fill({ id: 2 });
        const user2 = new User();
        user2.fill({ id: 3 });
        const profile = new Profile();
        profile.fill({ userId: 1 });
        const profile1 = new Profile();
        profile1.fill({ userId: 2 });
        User.$getRelation('profile').setRelatedForMany([user, user1, user2], [profile, profile1]);
        assert.deepEqual(user.profile, profile);
        assert.deepEqual(user1.profile, profile1);
        assert.isNull(user2.profile);
    });
});
japa_1.default.group('Model | HasOne | bulk operations', (group) => {
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
    (0, japa_1.default)('generate correct sql for selecting related rows', async (assert) => {
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
        await db.table('users').insert({ username: 'virk' });
        const user = await User.find(1);
        const { sql, bindings } = user.related('profile').query().toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('profiles')
            .where('user_id', 1)
            .limit(1)
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('generate correct sql for selecting related many rows', async (assert) => {
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
        await db.table('users').multiInsert([{ username: 'virk' }, { username: 'nikk' }]);
        const users = await User.all();
        User.$getRelation('profile').boot();
        const related = User.$getRelation('profile').eagerQuery(users, db.connection());
        const { sql, bindings } = related.toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('profiles')
            .whereIn('user_id', [2, 1])
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('generate correct sql for updating related row', async (assert) => {
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
        await db.table('users').insert({ username: 'virk' });
        const user = await User.find(1);
        const { sql, bindings } = user
            .related('profile')
            .query()
            .update({
            username: 'nikk',
        })
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('profiles')
            .where('user_id', 1)
            .update({ username: 'nikk' })
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('generate correct sql for deleting related row', async (assert) => {
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
        await db.table('users').insert({ username: 'virk' });
        const user = await User.find(1);
        const { sql, bindings } = user.related('profile').query().del().toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('profiles')
            .where('user_id', 1)
            .del()
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
japa_1.default.group('Model | HasOne | sub queries', (group) => {
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
    (0, japa_1.default)('generate correct subquery for selecting rows', async (assert) => {
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
        User.boot();
        User.$getRelation('profile').boot();
        const { sql, bindings } = User.$getRelation('profile').subQuery(db.connection()).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('profiles')
            .where('users.id', '=', db.connection().getReadClient().ref('profiles.user_id'))
            .toSQL();
        assert.deepEqual(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('create aggregate query', async (assert) => {
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
        User.boot();
        User.$getRelation('profile').boot();
        const { sql, bindings } = User.$getRelation('profile')
            .subQuery(db.connection())
            .count('* as total')
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('profiles')
            .count('* as total')
            .where('users.id', '=', db.connection().getReadClient().ref('profiles.user_id'))
            .toSQL();
        assert.deepEqual(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('allow selecting custom columns', async (assert) => {
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
        User.boot();
        User.$getRelation('profile').boot();
        const { sql, bindings } = User.$getRelation('profile')
            .subQuery(db.connection())
            .select('title', 'is_published')
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('profiles')
            .select('title', 'is_published')
            .where('users.id', '=', db.connection().getReadClient().ref('profiles.user_id'))
            .toSQL();
        assert.deepEqual(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('generate correct self relationship subquery', async (assert) => {
        class User extends BaseModel {
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
                Object.defineProperty(this, "username", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "parent", {
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
            __metadata("design:type", Number)
        ], User.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.hasOne)(() => User),
            __metadata("design:type", Object)
        ], User.prototype, "parent", void 0);
        User.boot();
        User.$getRelation('parent').boot();
        const { sql, bindings } = User.$getRelation('parent')
            .subQuery(db.connection())
            .select('email')
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('users as adonis_temp_0')
            .select('email')
            .where('users.id', '=', db.connection().getReadClient().ref('adonis_temp_0.user_id'))
            .toSQL();
        assert.deepEqual(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('raise exception when trying to execute the query', async (assert) => {
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
        User.boot();
        User.$getRelation('profile').boot();
        const exec = () => User.$getRelation('profile').subQuery(db.connection())['exec']();
        const paginate = () => User.$getRelation('profile').subQuery(db.connection())['paginate'](1);
        const update = () => User.$getRelation('profile').subQuery(db.connection())['update']({});
        const del = () => User.$getRelation('profile').subQuery(db.connection())['del']();
        const first = () => User.$getRelation('profile').subQuery(db.connection())['first']();
        const firstOrFail = () => User.$getRelation('profile').subQuery(db.connection())['firstOrFail']();
        assert.throw(exec, 'Cannot execute relationship subqueries');
        assert.throw(paginate, 'Cannot execute relationship subqueries');
        assert.throw(update, 'Cannot execute relationship subqueries');
        assert.throw(del, 'Cannot execute relationship subqueries');
        assert.throw(first, 'Cannot execute relationship subqueries');
        assert.throw(firstOrFail, 'Cannot execute relationship subqueries');
    });
    (0, japa_1.default)('run onQuery method when defined', async (assert) => {
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
                Object.defineProperty(this, "accountType", {
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
        ], Profile.prototype, "accountType", void 0);
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
            (0, Decorators_1.hasOne)(() => Profile, {
                onQuery: (query) => query.where('accountType', 'twitter'),
            }),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        User.boot();
        User.$getRelation('profile').boot();
        const { sql, bindings } = User.$getRelation('profile').subQuery(db.connection()).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('profiles')
            .where((query) => query.where('account_type', 'twitter'))
            .where((query) => query.where('users.id', '=', db.connection().getReadClient().ref('profiles.user_id')))
            .toSQL();
        assert.deepEqual(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
japa_1.default.group('Model | HasOne | preload', (group) => {
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
    (0, japa_1.default)('preload relationship', async (assert) => {
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const [user0, user1] = await db.query().from('users');
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: user0.id,
                display_name: 'virk',
            },
            {
                user_id: user1.id,
                display_name: 'nikk',
            },
        ]);
        User.boot();
        const users = await User.query().preload('profile');
        assert.lengthOf(users, 2);
        assert.equal(users[0].profile.userId, users[0].id);
        assert.equal(users[1].profile.userId, users[1].id);
    });
    (0, japa_1.default)('set relationship property value to null when no related rows were found', async (assert) => {
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        User.boot();
        const users = await User.query().preload('profile');
        assert.lengthOf(users, 2);
        assert.isNull(users[0].profile);
        assert.isNull(users[1].profile);
    });
    (0, japa_1.default)('preload nested relations', async (assert) => {
        class Identity extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "profileId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "identityName", {
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
        ], Identity.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Identity.prototype, "profileId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Identity.prototype, "identityName", void 0);
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
                Object.defineProperty(this, "identity", {
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
        __decorate([
            (0, Decorators_1.hasOne)(() => Identity),
            __metadata("design:type", Object)
        ], Profile.prototype, "identity", void 0);
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: 1,
                display_name: 'virk',
            },
            {
                user_id: 2,
                display_name: 'nikk',
            },
        ]);
        await db
            .insertQuery()
            .table('identities')
            .insert([
            {
                profile_id: 1,
                identity_name: 'virk',
            },
            {
                profile_id: 2,
                identity_name: 'nikk',
            },
        ]);
        User.boot();
        const user = await User.query()
            .preload('profile', (builder) => builder.preload('identity'))
            .where('username', 'virk')
            .first();
        assert.instanceOf(user.profile, Profile);
        assert.instanceOf(user.profile.identity, Identity);
    });
    (0, japa_1.default)('preload self referenced relationship', async (assert) => {
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
                Object.defineProperty(this, "user", {
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const [user0, user1] = await db.query().from('users');
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: user0.id,
                display_name: 'virk',
            },
            {
                user_id: user1.id,
                display_name: 'nikk',
            },
        ]);
        User.boot();
        const users = await User.query().preload('profile', (builder) => builder.preload('user'));
        assert.lengthOf(users, 2);
        assert.deepEqual(users[0].profile.user.id, users[0].id);
        assert.deepEqual(users[1].profile.user.id, users[1].id);
    });
    (0, japa_1.default)('add constraints during preload', async (assert) => {
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const [user0, user1] = await db.query().from('users');
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: user0.id,
                display_name: 'virk',
            },
            {
                user_id: user1.id,
                display_name: 'nikk',
            },
        ]);
        User.boot();
        const users = await User.query().preload('profile', (builder) => builder.where('display_name', 'foo'));
        assert.lengthOf(users, 2);
        assert.isNull(users[0].profile);
        assert.isNull(users[1].profile);
    });
    (0, japa_1.default)('cherry pick columns during preload', async (assert) => {
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const [user0, user1] = await db.query().from('users');
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: user0.id,
                display_name: 'virk',
            },
            {
                user_id: user1.id,
                display_name: 'nikk',
            },
        ]);
        User.boot();
        const users = await User.query().preload('profile', (builder) => {
            return builder.select('display_name');
        });
        assert.lengthOf(users, 2);
        assert.deepEqual(users[0].profile.$extras, {});
        assert.deepEqual(users[1].profile.$extras, {});
    });
    (0, japa_1.default)('do not repeat fk when already defined', async (assert) => {
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const [user0, user1] = await db.query().from('users');
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: user0.id,
                display_name: 'virk',
            },
            {
                user_id: user1.id,
                display_name: 'nikk',
            },
        ]);
        User.boot();
        const users = await User.query().preload('profile', (builder) => {
            return builder.select('display_name', 'user_id');
        });
        assert.lengthOf(users, 2);
        assert.deepEqual(users[0].profile.$extras, {});
        assert.deepEqual(users[1].profile.$extras, {});
    });
    (0, japa_1.default)('pass sideloaded attributes to the relationship', async (assert) => {
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const [user0, user1] = await db.query().from('users');
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: user0.id,
                display_name: 'virk',
            },
            {
                user_id: user1.id,
                display_name: 'nikk',
            },
        ]);
        User.boot();
        const users = await User.query().preload('profile').sideload({ id: 1 });
        assert.lengthOf(users, 2);
        assert.deepEqual(users[0].$sideloaded, { id: 1 });
        assert.deepEqual(users[1].$sideloaded, { id: 1 });
        assert.deepEqual(users[0].profile.$sideloaded, { id: 1 });
        assert.deepEqual(users[1].profile.$sideloaded, { id: 1 });
    });
    (0, japa_1.default)('preload using model instance', async (assert) => {
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: 1,
                display_name: 'virk',
            },
            {
                user_id: 2,
                display_name: 'nikk',
            },
        ]);
        User.boot();
        const users = await User.all();
        assert.lengthOf(users, 2);
        await users[0].load('profile');
        await users[1].load('profile');
        assert.equal(users[0].profile.userId, users[0].id);
        assert.equal(users[1].profile.userId, users[1].id);
    });
    (0, japa_1.default)('raise exception when local key is not selected', async (assert) => {
        assert.plan(1);
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const users = await db.query().from('users');
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: users[0].id,
                display_name: 'virk',
            },
            {
                user_id: users[1].id,
                display_name: 'nikk',
            },
        ]);
        try {
            await User.query().select('username').preload('profile').where('username', 'virk').first();
        }
        catch ({ message }) {
            assert.equal(message, 'Cannot preload "profile", value of "User.id" is undefined');
        }
    });
    (0, japa_1.default)('preload nested relations using model instance', async (assert) => {
        class Identity extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "profileId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "identityName", {
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
        ], Identity.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Identity.prototype, "profileId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Identity.prototype, "identityName", void 0);
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
                Object.defineProperty(this, "identity", {
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
        __decorate([
            (0, Decorators_1.hasOne)(() => Identity),
            __metadata("design:type", Object)
        ], Profile.prototype, "identity", void 0);
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: 1,
                display_name: 'virk',
            },
            {
                user_id: 2,
                display_name: 'nikk',
            },
        ]);
        await db
            .insertQuery()
            .table('identities')
            .insert([
            {
                profile_id: 1,
                identity_name: 'virk',
            },
            {
                profile_id: 2,
                identity_name: 'nikk',
            },
        ]);
        User.boot();
        const users = await User.all();
        assert.lengthOf(users, 2);
        await users[0].load((preloader) => {
            preloader.load('profile', (builder) => builder.preload('identity'));
        });
        await users[1].load((preloader) => {
            preloader.load('profile', (builder) => builder.preload('identity'));
        });
        assert.instanceOf(users[0].profile, Profile);
        assert.instanceOf(users[0].profile.identity, Identity);
        assert.instanceOf(users[1].profile, Profile);
        assert.instanceOf(users[1].profile.identity, Identity);
    });
    (0, japa_1.default)('pass main query options down the chain', async (assert) => {
        class Identity extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "profileId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "identityName", {
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
        ], Identity.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Identity.prototype, "profileId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Identity.prototype, "identityName", void 0);
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
                Object.defineProperty(this, "identity", {
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
        __decorate([
            (0, Decorators_1.hasOne)(() => Identity),
            __metadata("design:type", Object)
        ], Profile.prototype, "identity", void 0);
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: 1,
                display_name: 'virk',
            },
            {
                user_id: 2,
                display_name: 'nikk',
            },
        ]);
        await db
            .insertQuery()
            .table('identities')
            .insert([
            {
                profile_id: 1,
                identity_name: 'virk',
            },
            {
                profile_id: 2,
                identity_name: 'nikk',
            },
        ]);
        User.boot();
        const query = User.query({ connection: 'secondary' })
            .preload('profile', (builder) => builder.preload('identity'))
            .where('username', 'virk');
        const user = await query.first();
        assert.instanceOf(user.profile, Profile);
        assert.instanceOf(user.profile.identity, Identity);
        assert.equal(user.$options.connection, 'secondary');
        assert.equal(user.profile.$options.connection, 'secondary');
        assert.equal(user.profile.identity.$options.connection, 'secondary');
    });
    (0, japa_1.default)('pass relationship metadata to the profiler', async (assert) => {
        assert.plan(1);
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const [user0, user1] = await db.query().from('users');
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: user0.id,
                display_name: 'virk',
            },
            {
                user_id: user1.id,
                display_name: 'nikk',
            },
        ]);
        const profiler = app.profiler;
        let profilerPacketIndex = 0;
        profiler.process((packet) => {
            if (profilerPacketIndex === 1) {
                assert.deepEqual(packet.data.relation, {
                    model: 'User',
                    relatedModel: 'Profile',
                    type: 'hasOne',
                });
            }
            profilerPacketIndex++;
        });
        User.boot();
        await User.query({ profiler }).preload('profile');
    });
    (0, japa_1.default)('do not run preload query when parent rows are empty', async (assert) => {
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
        User.boot();
        const users = await User.query().preload('profile', () => {
            throw new Error('not expected to be here');
        });
        assert.lengthOf(users, 0);
    });
});
japa_1.default.group('Model | HasOne | withCount', (group) => {
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
    (0, japa_1.default)('get count of a relationship rows', async (assert) => {
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const [user0, user1] = await db.query().from('users');
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: user0.id,
                display_name: 'virk',
            },
            {
                user_id: user1.id,
                display_name: 'nikk',
            },
        ]);
        User.boot();
        const users = await User.query().withCount('profile');
        assert.lengthOf(users, 2);
        assert.equal(users[0].$extras.profile_count, 1);
        assert.equal(users[1].$extras.profile_count, 1);
    });
    (0, japa_1.default)('allow cherry picking columns', async (assert) => {
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
            __metadata("design:type", Number)
        ], User.prototype, "username", void 0);
        __decorate([
            (0, Decorators_1.hasOne)(() => Profile),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const [user0, user1] = await db.query().from('users');
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: user0.id,
                display_name: 'virk',
            },
            {
                user_id: user1.id,
                display_name: 'nikk',
            },
        ]);
        User.boot();
        const users = await User.query().select('username').withCount('profile').orderBy('id', 'asc');
        assert.lengthOf(users, 2);
        assert.deepEqual(users[0].$attributes, { username: 'virk' });
        assert.deepEqual(users[1].$attributes, { username: 'nikk' });
    });
    (0, japa_1.default)('lazy load related count', async (assert) => {
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const [user0, user1] = await db.query().from('users');
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: user0.id,
                display_name: 'virk',
            },
            {
                user_id: user1.id,
                display_name: 'nikk',
            },
        ]);
        User.boot();
        const user = await User.firstOrFail();
        await user.loadCount('profile');
        assert.deepEqual(Number(user.$extras.profile_count), 1);
    });
    (0, japa_1.default)('lazy load count of self referenced relationship', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "parentId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "manager", {
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
            __metadata("design:type", Number)
        ], User.prototype, "parentId", void 0);
        __decorate([
            (0, Decorators_1.hasOne)(() => User, { foreignKey: 'parentId' }),
            __metadata("design:type", Object)
        ], User.prototype, "manager", void 0);
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk', parent_id: 1 }]);
        User.boot();
        const user = await User.firstOrFail();
        await user.loadCount('manager');
        assert.deepEqual(Number(user.$extras.manager_count), 1);
    });
});
japa_1.default.group('Model | HasOne | has', (group) => {
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
    (0, japa_1.default)('limit rows to the existance of relationship', async (assert) => {
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const [user0] = await db.query().from('users').orderBy('id', 'asc');
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: user0.id,
                display_name: 'virk',
            },
        ]);
        User.boot();
        const users = await User.query().has('profile');
        assert.lengthOf(users, 1);
        assert.equal(users[0].username, 'virk');
    });
});
japa_1.default.group('Model | HasOne | whereHas', (group) => {
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
    (0, japa_1.default)('limit rows to the existance of relationship', async (assert) => {
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        const [user0, user1] = await db.query().from('users').orderBy('id', 'asc');
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: user0.id,
                display_name: 'Virk',
                type: 'personal',
            },
            {
                user_id: user1.id,
                display_name: '@nikk',
                type: 'social',
            },
            {
                user_id: user1.id,
                display_name: 'Nikk',
                type: 'personal',
            },
        ]);
        User.boot();
        const users = await User.query().whereHas('profile', (query) => {
            query.where('type', 'social');
        });
        assert.lengthOf(users, 1);
        assert.equal(users[0].username, 'nikk');
    });
});
japa_1.default.group('Model | HasOne | save', (group) => {
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
    (0, japa_1.default)('save related instance', async (assert) => {
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
        const user = new User();
        user.username = 'virk';
        await user.save();
        const profile = new Profile();
        profile.displayName = 'Hvirk';
        await user.related('profile').save(profile);
        assert.isTrue(profile.$isPersisted);
        assert.equal(user.id, profile.userId);
    });
    (0, japa_1.default)('wrap save calls inside a managed transaction', async (assert) => {
        assert.plan(3);
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
        const user = new User();
        user.username = 'virk';
        try {
            const profile = new Profile();
            await user.related('profile').save(profile);
        }
        catch (error) {
            assert.exists(error);
        }
        const users = await db.query().from('users');
        const profiles = await db.query().from('profiles');
        assert.lengthOf(users, 0);
        assert.lengthOf(profiles, 0);
    });
    (0, japa_1.default)('use parent model transaction when its defined', async (assert) => {
        assert.plan(4);
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
        const trx = await db.transaction();
        const user = new User();
        user.username = 'virk';
        user.$trx = trx;
        try {
            const profile = new Profile();
            await user.related('profile').save(profile);
        }
        catch (error) {
            assert.exists(error);
        }
        assert.isFalse(user.$trx.isCompleted);
        await trx.rollback();
        const users = await db.query().from('users');
        const profiles = await db.query().from('profiles');
        assert.lengthOf(users, 0);
        assert.lengthOf(profiles, 0);
    });
});
japa_1.default.group('Model | HasOne | create', (group) => {
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
    (0, japa_1.default)('create related instance', async (assert) => {
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
        const user = new User();
        user.username = 'virk';
        await user.save();
        const profile = await user.related('profile').create({
            displayName: 'Hvirk',
        });
        assert.isTrue(profile.$isPersisted);
        assert.equal(user.id, profile.userId);
    });
    (0, japa_1.default)('wrap create call inside a managed transaction', async (assert) => {
        assert.plan(3);
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
        const user = new User();
        user.username = 'virk';
        try {
            await user.related('profile').create({});
        }
        catch (error) {
            assert.exists(error);
        }
        const users = await db.query().from('users');
        const profiles = await db.query().from('profiles');
        assert.lengthOf(users, 0);
        assert.lengthOf(profiles, 0);
    });
    (0, japa_1.default)('use parent model transaction during create', async (assert) => {
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
        const trx = await db.transaction();
        const user = new User();
        user.username = 'virk';
        user.$trx = trx;
        const profile = await user.related('profile').create({ displayName: 'Hvirk' });
        assert.isFalse(user.$trx.isCompleted);
        await trx.rollback();
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalProfiles = await db.query().from('profiles').count('*', 'total');
        assert.equal(totalUsers[0].total, 0);
        assert.equal(totalProfiles[0].total, 0);
        assert.isUndefined(user.$trx);
        assert.isUndefined(profile.$trx);
    });
});
japa_1.default.group('Model | HasOne | firstOrCreate', (group) => {
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
    (0, japa_1.default)("create related instance when there isn't any existing row", async (assert) => {
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
        const user = new User();
        user.username = 'virk';
        await user.save();
        const profile = await user.related('profile').firstOrCreate({}, {
            displayName: 'Hvirk',
        });
        assert.isTrue(profile.$isPersisted);
        assert.isTrue(profile.$isLocal);
        assert.equal(user.id, profile.userId);
        assert.equal(profile.displayName, 'Hvirk');
    });
    (0, japa_1.default)('return the existing row vs creating a new one', async (assert) => {
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
        const user = new User();
        user.username = 'virk';
        await user.save();
        await db.insertQuery().table('profiles').insert({ user_id: user.id, display_name: 'Hvirk' });
        const profile = await user.related('profile').firstOrCreate({}, {
            displayName: 'Hvirk',
        });
        assert.isTrue(profile.$isPersisted);
        assert.isFalse(profile.$isLocal);
        assert.equal(user.id, profile.userId);
        assert.equal(profile.displayName, 'Hvirk');
        const profiles = await db.query().from('profiles');
        assert.lengthOf(profiles, 1);
    });
});
japa_1.default.group('Model | HasOne | updateOrCreate', (group) => {
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
    (0, japa_1.default)("create related instance when there isn't any existing row", async (assert) => {
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
        const user = new User();
        user.username = 'virk';
        await user.save();
        const profile = await user.related('profile').updateOrCreate({}, {
            displayName: 'Virk',
        });
        assert.isTrue(profile.$isPersisted);
        assert.isTrue(profile.$isLocal);
        assert.equal(user.id, profile.userId);
        assert.equal(profile.displayName, 'Virk');
        const profiles = await db.query().from('profiles');
        assert.lengthOf(profiles, 1);
        assert.equal(profiles[0].display_name, 'Virk');
    });
    (0, japa_1.default)('update the existing row vs creating a new one', async (assert) => {
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
        const user = new User();
        user.username = 'virk';
        await user.save();
        await db.insertQuery().table('profiles').insert({ user_id: user.id, display_name: 'Hvirk' });
        const profile = await user.related('profile').updateOrCreate({}, {
            displayName: 'Virk',
        });
        assert.isTrue(profile.$isPersisted);
        assert.isFalse(profile.$isLocal);
        assert.equal(user.id, profile.userId);
        assert.equal(profile.displayName, 'Virk');
        const profiles = await db.query().from('profiles');
        assert.lengthOf(profiles, 1);
        assert.equal(profiles[0].display_name, 'Virk');
    });
});
japa_1.default.group('Model | HasOne | pagination', (group) => {
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
    (0, japa_1.default)('dis-allow pagination', async (assert) => {
        assert.plan(1);
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
        await db.table('users').insert({ username: 'virk' });
        const user = await User.find(1);
        try {
            await user.related('profile').query().paginate(1);
        }
        catch ({ message }) {
            assert.equal(message, 'Cannot paginate a hasOne relationship "(profile)"');
        }
    });
});
japa_1.default.group('Model | HasOne | clone', (group) => {
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
    (0, japa_1.default)('clone related query builder', async (assert) => {
        assert.plan(1);
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
        await db.table('users').insert({ username: 'virk' });
        const user = await User.find(1);
        const clonedQuery = user.related('profile').query().clone();
        assert.instanceOf(clonedQuery, QueryBuilder_1.HasOneQueryBuilder);
    });
});
japa_1.default.group('Model | HasOne | scopes', (group) => {
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
    (0, japa_1.default)('apply scopes during eagerload', async (assert) => {
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
        Object.defineProperty(Profile, "twitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, scope_1.scope)((query) => {
                query.where('type', 'twitter');
            })
        });
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
        const [userId] = await db.table('users').insert({ username: 'virk' }).returning('id');
        await db
            .table('profiles')
            .multiInsert([{ user_id: userId, display_name: 'virk', type: 'github' }]);
        const user = await User.query()
            .preload('profile', (query) => {
            query.apply((scopes) => scopes.twitter());
        })
            .firstOrFail();
        const userWithScopes = await User.query().preload('profile').firstOrFail();
        assert.isNull(user.profile);
        assert.instanceOf(userWithScopes.profile, Profile);
    });
    (0, japa_1.default)('apply scopes on related query', async (assert) => {
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
        Object.defineProperty(Profile, "twitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, scope_1.scope)((query) => {
                query.where('type', 'twitter');
            })
        });
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
        const [userId] = await db.table('users').insert({ username: 'virk' }).returning('id');
        await db
            .table('profiles')
            .multiInsert([{ user_id: userId, display_name: 'virk', type: 'github' }]);
        const user = await User.findOrFail(1);
        const profile = await user
            .related('profile')
            .query()
            .apply((scopes) => scopes.twitter())
            .first();
        const profileWithoutScopes = await user.related('profile').query().first();
        assert.isNull(profile);
        assert.instanceOf(profileWithoutScopes, Profile);
    });
});
japa_1.default.group('Model | HasOne | onQuery', (group) => {
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
    (0, japa_1.default)('invoke onQuery method when preloading relationship', async (assert) => {
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
            (0, Decorators_1.hasOne)(() => Profile, {
                onQuery: (query) => query.where('type', 'twitter'),
            }),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const [userId] = await db.table('users').insert({ username: 'virk' }).returning('id');
        await db
            .table('profiles')
            .multiInsert([{ user_id: userId, display_name: 'virk', type: 'github' }]);
        const user = await User.query().preload('profile').firstOrFail();
        assert.isNull(user.profile);
    });
    (0, japa_1.default)('do not invoke onQuery method on preloading subqueries', async (assert) => {
        assert.plan(2);
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
            (0, Decorators_1.hasOne)(() => Profile, {
                onQuery: (query) => {
                    assert.isTrue(true);
                    query.where('type', 'twitter');
                },
            }),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const [userId] = await db.table('users').insert({ username: 'virk' }).returning('id');
        await db
            .table('profiles')
            .multiInsert([{ user_id: userId, display_name: 'virk', type: 'github' }]);
        const user = await User.query()
            .preload('profile', (query) => query.where(() => { }))
            .firstOrFail();
        assert.isNull(user.profile);
    });
    (0, japa_1.default)('invoke onQuery method on related query builder', async (assert) => {
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
            (0, Decorators_1.hasOne)(() => Profile, {
                onQuery: (query) => query.where('type', 'twitter'),
            }),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const [userId] = await db.table('users').insert({ username: 'virk' }).returning('id');
        await db
            .table('profiles')
            .multiInsert([{ user_id: userId, display_name: 'virk', type: 'github' }]);
        const user = await User.findOrFail(1);
        const profile = await user.related('profile').query().first();
        assert.isNull(profile);
    });
    (0, japa_1.default)('do not invoke onQuery method on related query builder subqueries', async (assert) => {
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
            (0, Decorators_1.hasOne)(() => Profile, {
                onQuery: (query) => query.where('type', 'twitter'),
            }),
            __metadata("design:type", Object)
        ], User.prototype, "profile", void 0);
        const [userId] = await db.table('users').insert({ username: 'virk' }).returning('id');
        await db
            .table('profiles')
            .multiInsert([{ user_id: userId, display_name: 'virk', type: 'github' }]);
        const user = await User.findOrFail(1);
        const { sql, bindings } = user
            .related('profile')
            .query()
            .where((query) => {
            query.whereNotNull('created_at');
        })
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .from('profiles')
            .where((query) => {
            query.where('type', 'twitter').where((subquery) => subquery.whereNotNull('created_at'));
        })
            .where((query) => {
            query.where('user_id', 1);
        })
            .limit(1)
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
japa_1.default.group('Model | HasOne | delete', (group) => {
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
    (0, japa_1.default)('delete related instance', async (assert) => {
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
        const user = new User();
        user.username = 'virk';
        await user.save();
        const profile = new Profile();
        profile.displayName = 'Hvirk';
        await user.related('profile').save(profile);
        const { sql, bindings } = user.related('profile').query().del().toSQL();
        const { sql: rawSql, bindings: rawBindings } = db
            .from('profiles')
            .where('user_id', user.id)
            .del()
            .toSQL();
        assert.deepEqual(bindings, rawBindings);
        assert.deepEqual(sql, rawSql);
    });
});
