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
const QueryBuilder_1 = require("../../src/Orm/Relations/BelongsTo/QueryBuilder");
const test_helpers_1 = require("../../test-helpers");
let db;
let app;
let BaseModel;
japa_1.default.group('Model | BelongsTo | Options', (group) => {
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
            class User extends BaseModel {
            }
            User.boot();
            class Profile extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "user", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                }
            }
            __decorate([
                (0, Decorators_1.belongsTo)(() => User),
                __metadata("design:type", Object)
            ], Profile.prototype, "user", void 0);
            Profile.boot();
            Profile.$getRelation('user').boot();
        }
        catch ({ message }) {
            assert.equal(message, 'E_MISSING_MODEL_ATTRIBUTE: "Profile.user" expects "id" to exist on "User" model, but is missing');
        }
    });
    (0, japa_1.default)('raise error when foreignKey is missing', (assert) => {
        assert.plan(1);
        try {
            class User extends BaseModel {
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
            ], User.prototype, "id", void 0);
            User.boot();
            class Profile extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "user", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                }
            }
            __decorate([
                (0, Decorators_1.belongsTo)(() => User),
                __metadata("design:type", Object)
            ], Profile.prototype, "user", void 0);
            Profile.boot();
            Profile.$getRelation('user').boot();
        }
        catch ({ message }) {
            assert.equal(message, 'E_MISSING_MODEL_ATTRIBUTE: "Profile.user" expects "userId" to exist on "Profile" model, but is missing');
        }
    });
    (0, japa_1.default)('use primary key is as the local key', (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        Profile.$getRelation('user').boot();
        assert.equal(Profile.$getRelation('user')['localKey'], 'id');
    });
    (0, japa_1.default)('use custom defined local key', (assert) => {
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
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User, { localKey: 'uid' }),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        Profile.$getRelation('user').boot();
        assert.equal(Profile.$getRelation('user')['localKey'], 'uid');
    });
    (0, japa_1.default)('compute foreign key from model name and primary key', (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        Profile.$getRelation('user').boot();
        assert.equal(Profile.$getRelation('user')['foreignKey'], 'userId');
    });
    (0, japa_1.default)('use pre defined foreign key', (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userUid", {
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
            (0, Decorators_1.column)({ columnName: 'user_id' }),
            __metadata("design:type", Number)
        ], Profile.prototype, "userUid", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User, { foreignKey: 'userUid' }),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        Profile.$getRelation('user').boot();
        assert.equal(Profile.$getRelation('user')['foreignKey'], 'userUid');
    });
    (0, japa_1.default)('clone relationship instance with options', (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class BaseProfile extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userUid", {
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
            (0, Decorators_1.column)({ columnName: 'user_id' }),
            __metadata("design:type", Number)
        ], BaseProfile.prototype, "userUid", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User, { foreignKey: 'userUid' }),
            __metadata("design:type", Object)
        ], BaseProfile.prototype, "user", void 0);
        class Profile extends BaseProfile {
        }
        Profile.boot();
        Profile.$getRelation('user').boot();
        console.log(Profile.$getRelation('user'));
        assert.deepEqual(Profile.$getRelation('user').relatedModel(), User);
        assert.deepEqual(Profile.$getRelation('user').model, Profile);
        assert.equal(Profile.$getRelation('user')['foreignKey'], 'userUid');
    });
});
japa_1.default.group('Model | BelongsTo | Set Relations', (group) => {
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
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        Profile.$getRelation('user').boot();
        const user = new User();
        user.fill({ id: 1 });
        const profile = new Profile();
        profile.fill({ userId: 1 });
        Profile.$getRelation('user').setRelated(profile, user);
        assert.deepEqual(profile.user, user);
    });
    (0, japa_1.default)('push related model instance', (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        Profile.$getRelation('user').boot();
        const profile = new Profile();
        const user = new User();
        const user1 = new User();
        profile.fill({ userId: 1 });
        user.fill({ id: 1 });
        Profile.$getRelation('user').setRelated(profile, user);
        profile.fill({ userId: 2 });
        user1.fill({ id: 2 });
        Profile.$getRelation('user').pushRelated(profile, user1);
        assert.deepEqual(profile.user, user1);
    });
    (0, japa_1.default)('set many of related instances', (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        Profile.$getRelation('user').boot();
        const profile = new Profile();
        profile.fill({ userId: 1 });
        const profile1 = new Profile();
        profile1.fill({ userId: 2 });
        const profile2 = new Profile();
        const user = new User();
        user.fill({ id: 1 });
        const user1 = new User();
        user1.fill({ id: 2 });
        Profile.$getRelation('user').setRelatedForMany([profile, profile1, profile2], [user, user1]);
        assert.deepEqual(profile.user, user);
        assert.deepEqual(profile1.user, user1);
        assert.isNull(profile2.user);
    });
});
japa_1.default.group('Model | BelongsTo | bulk operations', (group) => {
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
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.table('profiles').insert({ user_id: 4, display_name: 'Hvirk' });
        const profile = await Profile.find(1);
        const { sql, bindings } = profile.related('user').query().toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('users')
            .where('id', 4)
            .limit(1)
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('generate correct sql for selecting many related rows', async (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.table('profiles').multiInsert([
            { display_name: 'virk', user_id: 2 },
            { display_name: 'nikk', user_id: 3 },
        ]);
        const profiles = await Profile.all();
        Profile.$getRelation('user').boot();
        const query = Profile.$getRelation('user').eagerQuery(profiles, db.connection());
        const { sql, bindings } = query.toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('users')
            .whereIn('id', [3, 2])
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('generate correct sql for updating related row', async (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.table('profiles').insert({ user_id: 2, display_name: 'virk' });
        const profile = await Profile.find(1);
        const { sql, bindings } = profile
            .related('user')
            .query()
            .update({
            display_name: 'nikk',
        })
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('users')
            .where('id', 2)
            .update({ display_name: 'nikk' })
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('generate correct sql for deleting related row', async (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.table('profiles').insert({ user_id: 2, display_name: 'virk' });
        const profile = await Profile.find(1);
        const { sql, bindings } = profile.related('user').query().del().toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('users')
            .where('id', 2)
            .del()
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
japa_1.default.group('Model | BelongsTo | sub queries', (group) => {
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
    (0, japa_1.default)('generate correct sub query for selecting rows', async (assert) => {
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
        Profile.boot();
        Profile.$getRelation('user').boot();
        const { sql, bindings } = Profile.$getRelation('user').subQuery(db.connection()).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('users')
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
        Profile.boot();
        Profile.$getRelation('user').boot();
        const { sql, bindings } = Profile.$getRelation('user')
            .subQuery(db.connection())
            .count('* as total')
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('users')
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
        Profile.boot();
        Profile.$getRelation('user').boot();
        const { sql, bindings } = Profile.$getRelation('user')
            .subQuery(db.connection())
            .select('title', 'is_published')
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('users')
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
                Object.defineProperty(this, "child", {
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
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], User.prototype, "child", void 0);
        User.boot();
        User.$getRelation('child').boot();
        const { sql, bindings } = User.$getRelation('child')
            .subQuery(db.connection())
            .select('email')
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('users as adonis_temp_0')
            .select('email')
            .where('adonis_temp_0.id', '=', db.connection().getReadClient().ref('users.user_id'))
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
        Profile.boot();
        Profile.$getRelation('user').boot();
        const exec = () => Profile.$getRelation('user').subQuery(db.connection())['exec']();
        const paginate = () => Profile.$getRelation('user').subQuery(db.connection())['paginate'](1);
        const update = () => Profile.$getRelation('user').subQuery(db.connection())['update']({});
        const del = () => Profile.$getRelation('user').subQuery(db.connection())['del']();
        const first = () => Profile.$getRelation('user').subQuery(db.connection())['first']();
        const firstOrFail = () => Profile.$getRelation('user').subQuery(db.connection())['firstOrFail']();
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
            (0, Decorators_1.belongsTo)(() => User, {
                onQuery: (query) => query.where('isActive', false),
            }),
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
                Object.defineProperty(this, "isActive", {
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
            __metadata("design:type", Boolean)
        ], User.prototype, "isActive", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], User.prototype, "username", void 0);
        Profile.boot();
        Profile.$getRelation('user').boot();
        const { sql, bindings } = Profile.$getRelation('user').subQuery(db.connection()).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('users')
            .where((subquery) => subquery.where('is_active', false))
            .where((subquery) => subquery.where('users.id', '=', db.connection().getReadClient().ref('profiles.user_id')))
            .toSQL();
        assert.deepEqual(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
japa_1.default.group('Model | BelongsTo | preload', (group) => {
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
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: 1 });
        Profile.boot();
        const profiles = await Profile.query().preload('user');
        assert.lengthOf(profiles, 1);
        assert.equal(profiles[0].user.id, profiles[0].userId);
    });
    (0, japa_1.default)('set property value to null when no preload rows were found', async (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: null });
        Profile.boot();
        const profiles = await Profile.query().preload('user');
        assert.lengthOf(profiles, 1);
        assert.isNull(profiles[0].user);
    });
    (0, japa_1.default)('set value to null when serializing', async (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: null });
        Profile.boot();
        const profiles = await Profile.query().preload('user');
        assert.lengthOf(profiles, 1);
        assert.isNull(profiles[0].toJSON().user);
    });
    (0, japa_1.default)('preload relationship for many rows', async (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: 1,
                display_name: 'Hvirk',
            },
            {
                user_id: 1,
                display_name: 'Nikk',
            },
        ]);
        Profile.boot();
        const profiles = await Profile.query().preload('user');
        assert.lengthOf(profiles, 2);
        assert.equal(profiles[0].user.id, profiles[0].userId);
        assert.equal(profiles[1].user.id, profiles[1].userId);
    });
    (0, japa_1.default)('add runtime constraints to related query', async (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: 1,
                display_name: 'Hvirk',
            },
            {
                user_id: 1,
                display_name: 'Nikk',
            },
        ]);
        Profile.boot();
        const profiles = await Profile.query().preload('user', (builder) => builder.where('username', 'foo'));
        assert.lengthOf(profiles, 2);
        assert.isNull(profiles[0].user);
        assert.isNull(profiles[1].user);
    });
    (0, japa_1.default)('cherry pick columns during preload', async (assert) => {
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
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: 1,
                display_name: 'Hvirk',
            },
            {
                user_id: 1,
                display_name: 'Nikk',
            },
        ]);
        Profile.boot();
        const profiles = await Profile.query().preload('user', (builder) => {
            return builder.select('username');
        });
        assert.lengthOf(profiles, 2);
        assert.deepEqual(profiles[0].user.$extras, {});
        assert.deepEqual(profiles[1].user.$extras, {});
    });
    (0, japa_1.default)('do not repeat fk when already defined', async (assert) => {
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
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: 1,
                display_name: 'Hvirk',
            },
            {
                user_id: 1,
                display_name: 'Nikk',
            },
        ]);
        Profile.boot();
        const profiles = await Profile.query().preload('user', (builder) => {
            return builder.select('username', 'id');
        });
        assert.lengthOf(profiles, 2);
        assert.deepEqual(profiles[0].user.$extras, {});
        assert.deepEqual(profiles[1].user.$extras, {});
    });
    (0, japa_1.default)('raise exception when local key is not selected', async (assert) => {
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
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db
            .insertQuery()
            .table('profiles')
            .insert([
            {
                user_id: 1,
                display_name: 'Hvirk',
            },
            {
                user_id: 1,
                display_name: 'Nikk',
            },
        ]);
        Profile.boot();
        try {
            await Profile.query().select('display_name').preload('user');
        }
        catch ({ message }) {
            assert.equal(message, [
                'Cannot preload "user", value of "Profile.userId" is undefined.',
                'Make sure to set "null" as the default value for foreign keys',
            ].join(' '));
        }
    });
    (0, japa_1.default)('preload using model instance', async (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
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
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }]);
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
                user_id: users[0].id,
                display_name: 'virk',
            },
        ]);
        const profile = await Profile.findOrFail(1);
        await profile.load('user');
        assert.instanceOf(profile.user, User);
        assert.equal(profile.user.id, profile.userId);
    });
    (0, japa_1.default)('preload nested relations', async (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
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
        ], Identity.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Identity.prototype, "profileId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Identity.prototype, "identityName", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => Profile),
            __metadata("design:type", Object)
        ], Identity.prototype, "profile", void 0);
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
        const identity = await Identity.query()
            .preload('profile', (builder) => builder.preload('user'))
            .where('identity_name', 'virk')
            .first();
        assert.instanceOf(identity.profile, Profile);
        assert.instanceOf(identity.profile.user, User);
    });
    (0, japa_1.default)('preload nested relations using model instance', async (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
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
        ], Identity.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Identity.prototype, "profileId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Identity.prototype, "identityName", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => Profile),
            __metadata("design:type", Object)
        ], Identity.prototype, "profile", void 0);
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
        const identity = await Identity.query().firstOrFail();
        await identity.load((preloader) => {
            preloader.load('profile', (builder) => builder.preload('user'));
        });
        assert.instanceOf(identity.profile, Profile);
        assert.instanceOf(identity.profile.user, User);
    });
    (0, japa_1.default)('pass main query options down the chain', async (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
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
        ], Identity.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Identity.prototype, "profileId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Identity.prototype, "identityName", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => Profile),
            __metadata("design:type", Object)
        ], Identity.prototype, "profile", void 0);
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
        const query = Identity.query({ connection: 'secondary' })
            .preload('profile', (builder) => builder.preload('user'))
            .where('identity_name', 'virk');
        const identity = await query.first();
        assert.instanceOf(identity.profile, Profile);
        assert.instanceOf(identity.profile.user, User);
        assert.equal(identity.$options.connection, 'secondary');
        assert.equal(identity.profile.$options.connection, 'secondary');
        assert.equal(identity.profile.user.$options.connection, 'secondary');
    });
    (0, japa_1.default)('pass relationship metadata to the profiler', async (assert) => {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        const profiler = app.profiler;
        let profilerPacketIndex = 0;
        profiler.process((packet) => {
            profilerPacketIndex++;
            if (profilerPacketIndex === 4) {
                assert.deepEqual(packet.data.relation, {
                    model: 'Profile',
                    relatedModel: 'User',
                    type: 'belongsTo',
                });
            }
        });
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: 1 });
        await Profile.query({ profiler }).preload('user');
    });
    (0, japa_1.default)('work fine when foreign key is null', async (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: null });
        Profile.boot();
        const profiles = await Profile.query().preload('user');
        assert.lengthOf(profiles, 1);
        assert.isNull(profiles[0].user);
    });
    (0, japa_1.default)('work fine during lazy load when foreign key is null', async (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: null });
        Profile.boot();
        const profiles = await Profile.query();
        assert.lengthOf(profiles, 1);
        await profiles[0].load('user');
        assert.isNull(profiles[0].user);
    });
    (0, japa_1.default)('do not run preload query when parent rows are empty', async (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        Profile.boot();
        const profiles = await Profile.query().preload('user', () => {
            throw new Error('not expected to be here');
        });
        assert.lengthOf(profiles, 0);
    });
});
japa_1.default.group('Model | BelongsTo | withCount', (group) => {
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
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: 1 });
        Profile.boot();
        const profiles = await Profile.query().withCount('user');
        assert.lengthOf(profiles, 1);
        assert.equal(profiles[0].$extras.user_count, 1);
    });
    (0, japa_1.default)('allow cherry picking columns', async (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: 1 });
        Profile.boot();
        const profiles = await Profile.query().select('displayName').withCount('user');
        assert.lengthOf(profiles, 1);
        assert.deepEqual(profiles[0].$attributes, { displayName: 'Hvirk' });
    });
    (0, japa_1.default)('lazy load relationship row', async (assert) => {
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
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
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: 1 });
        Profile.boot();
        const profile = await Profile.query().firstOrFail();
        await profile.loadCount('user');
        assert.equal(profile.$extras.user_count, 1);
    });
});
japa_1.default.group('Model | BelongsTo | has', (group) => {
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
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db
            .insertQuery()
            .table('users')
            .multiInsert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('profiles')
            .multiInsert([{ display_name: 'Virk', user_id: 1 }]);
        Profile.boot();
        const profiles = await Profile.query().has('user');
        assert.lengthOf(profiles, 1);
    });
});
japa_1.default.group('Model | BelongsTo | whereHas', (group) => {
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
        class User extends BaseModel {
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
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
        await db
            .insertQuery()
            .table('users')
            .multiInsert([
            { username: 'virk', points: 10 },
            { username: 'nikk', points: 20 },
        ]);
        await db
            .insertQuery()
            .table('profiles')
            .multiInsert([
            { display_name: 'Virk', user_id: 1 },
            { display_name: 'Nikk', user_id: 2 },
        ]);
        Profile.boot();
        const profiles = await Profile.query().whereHas('user', (query) => {
            query.sum('points');
        }, '>', 15);
        assert.lengthOf(profiles, 1);
        assert.equal(profiles[0].displayName, 'Nikk');
    });
});
japa_1.default.group('Model | BelongsTo | associate', (group) => {
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
    (0, japa_1.default)('associate related instance', async (assert) => {
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
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
        const user = new User();
        user.username = 'virk';
        const profile = new Profile();
        profile.displayName = 'Hvirk';
        await profile.related('user').associate(user);
        assert.isTrue(profile.$isPersisted);
        assert.equal(user.id, profile.userId);
        const profiles = await db.query().from('profiles');
        assert.lengthOf(profiles, 1);
        assert.equal(profiles[0].user_id, user.id);
    });
    (0, japa_1.default)('wrap associate call inside transaction', async (assert) => {
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
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
        const user = new User();
        user.username = 'virk';
        const profile = new Profile();
        try {
            await profile.related('user').associate(user);
        }
        catch (error) {
            assert.exists(error);
        }
        const profiles = await db.query().from('profiles');
        const users = await db.query().from('users');
        assert.lengthOf(profiles, 0);
        assert.lengthOf(users, 0);
    });
});
japa_1.default.group('Model | BelongsTo | dissociate', (group) => {
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
    (0, japa_1.default)('dissociate relation', async (assert) => {
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
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
        const [user] = await db
            .insertQuery()
            .table('users')
            .insert({ username: 'virk' })
            .returning('id');
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: user.id });
        const profile = await Profile.query().first();
        await profile.related('user').dissociate();
        assert.isTrue(profile.$isPersisted);
        assert.isNull(profile.userId);
        const profiles = await db.query().from('profiles');
        assert.lengthOf(profiles, 1);
        assert.isNull(profiles[0].user_id);
    });
});
japa_1.default.group('Model | BelongsTo | bulk operations', (group) => {
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
    (0, japa_1.default)('disallow pagination', async (assert) => {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        await db.table('profiles').insert({ user_id: 4, display_name: 'Hvirk' });
        const profile = await Profile.find(1);
        try {
            await profile.related('user').query().paginate(1);
        }
        catch ({ message }) {
            assert.equal(message, 'Cannot paginate a belongsTo relationship "(user)"');
        }
    });
});
japa_1.default.group('Model | BelongsTo | clone', (group) => {
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
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
        Profile.boot();
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: 1 });
        const profile = await Profile.findOrFail(1);
        const clonedQuery = profile.related('user').query().clone();
        assert.instanceOf(clonedQuery, QueryBuilder_1.BelongsToQueryBuilder);
    });
});
japa_1.default.group('Model | BelongsTo | scopes', (group) => {
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
        Object.defineProperty(User, "fromCountry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, scope_1.scope)((query, countryId) => {
                query.where('country_id', countryId);
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
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
        Profile.boot();
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: 1 });
        const profile = await Profile.query()
            .preload('user', (builder) => {
            builder.apply((scopes) => scopes.fromCountry(1));
        })
            .first();
        const profileWithoutScope = await Profile.query().preload('user').first();
        assert.isNull(profile?.user);
        assert.instanceOf(profileWithoutScope?.user, User);
    });
    (0, japa_1.default)('apply scopes on related query', async (assert) => {
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
        Object.defineProperty(User, "fromCountry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, scope_1.scope)((query, countryId) => {
                query.where('country_id', countryId);
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
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
        Profile.boot();
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: 1 });
        const profile = await Profile.query().firstOrFail();
        const profileUser = await profile
            .related('user')
            .query()
            .apply((scopes) => {
            scopes.fromCountry(1);
        })
            .first();
        const profileUserWithoutScopes = await profile.related('user').query().first();
        assert.isNull(profileUser);
        assert.instanceOf(profileUserWithoutScopes, User);
    });
});
japa_1.default.group('Model | BelongsTo | onQuery', (group) => {
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
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "displayName", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User, {
                onQuery: (builder) => {
                    builder.where('country_id', 1);
                },
            }),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        Profile.boot();
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: 1 });
        const profile = await Profile.query().preload('user').first();
        assert.isNull(profile?.user);
    });
    (0, japa_1.default)('do not run onQuery hook on subqueries', async (assert) => {
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
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "displayName", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User, {
                onQuery: (builder) => {
                    assert.isTrue(true);
                    builder.where('country_id', 1);
                },
            }),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        Profile.boot();
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: 1 });
        const profile = await Profile.query()
            .preload('user', (query) => {
            query.where((_) => { });
        })
            .first();
        assert.isNull(profile?.user);
    });
    (0, japa_1.default)('invoke onQuery method on related query builder', async (assert) => {
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
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "displayName", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User, {
                onQuery: (builder) => {
                    builder.where('country_id', 1);
                },
            }),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        Profile.boot();
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: 1 });
        const profile = await Profile.findOrFail(1);
        const user = await profile.related('user').query().first();
        assert.isNull(user);
    });
    (0, japa_1.default)('do not run onQuery hook on related query builder subqueries', async (assert) => {
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
        class Profile extends BaseModel {
            constructor() {
                super(...arguments);
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Profile.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Profile.prototype, "displayName", void 0);
        __decorate([
            (0, Decorators_1.belongsTo)(() => User, {
                onQuery: (builder) => {
                    builder.where('country_id', 1);
                },
            }),
            __metadata("design:type", Object)
        ], Profile.prototype, "user", void 0);
        Profile.boot();
        await db.insertQuery().table('users').insert({ username: 'virk' });
        await db.insertQuery().table('profiles').insert({ display_name: 'Hvirk', user_id: 1 });
        const profile = await Profile.findOrFail(1);
        const { sql, bindings } = profile
            .related('user')
            .query()
            .where((builder) => {
            builder.where('score', '>', 0);
        })
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .from('users')
            .where((subquery) => {
            subquery.where('country_id', 1).where((query) => query.where('score', '>', 0));
        })
            .where((subquery) => subquery.where('id', 1))
            .limit(1)
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
