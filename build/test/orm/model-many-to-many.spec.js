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
const QueryBuilder_1 = require("../../src/Orm/Relations/ManyToMany/QueryBuilder");
const test_helpers_1 = require("../../test-helpers");
const luxon_1 = require("luxon");
let db;
let app;
let BaseModel;
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
japa_1.default.group('Model | ManyToMany | Options', (group) => {
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
            class Skill extends BaseModel {
            }
            class User extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "skills", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                }
            }
            __decorate([
                (0, Decorators_1.manyToMany)(() => Skill),
                __metadata("design:type", Object)
            ], User.prototype, "skills", void 0);
            User.boot();
            User.$getRelation('skills').boot();
        }
        catch ({ message }) {
            assert.equal(message, 'E_MISSING_MODEL_ATTRIBUTE: "User.skills" expects "id" to exist on "User" model, but is missing');
        }
    });
    (0, japa_1.default)('use primary key as the local key', (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.$getRelation('skills').boot();
        assert.equal(User.$getRelation('skills')['localKey'], 'id');
        assert.equal(User.$getRelation('skills')['localKeyColumnName'], 'id');
    });
    (0, japa_1.default)('use custom defined local key', (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
        ], User.prototype, "uid", void 0);
        __decorate([
            (0, Decorators_1.manyToMany)(() => Skill, { localKey: 'uid' }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        User.$getRelation('skills').boot();
        assert.equal(User.$getRelation('skills')['localKey'], 'uid');
        assert.equal(User.$getRelation('skills')['localKeyColumnName'], 'uid');
    });
    (0, japa_1.default)('raise error when relatedKey is missing', (assert) => {
        assert.plan(1);
        try {
            class Skill extends BaseModel {
            }
            Skill.boot();
            class User extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "skills", {
                        enumerable: true,
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
                (0, Decorators_1.manyToMany)(() => Skill),
                __metadata("design:type", Object)
            ], User.prototype, "skills", void 0);
            User.boot();
            User.$getRelation('skills').boot();
        }
        catch ({ message }) {
            assert.equal(message, 'E_MISSING_MODEL_ATTRIBUTE: "User.skills" expects "id" to exist on "Skill" model, but is missing');
        }
    });
    (0, japa_1.default)('use related model primary key as the related key', (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.$getRelation('skills').boot();
        assert.equal(User.$getRelation('skills')['relatedKey'], 'id');
        assert.equal(User.$getRelation('skills')['relatedKeyColumnName'], 'id');
    });
    (0, japa_1.default)('use custom defined related key', (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Skill.prototype, "uid", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, { relatedKey: 'uid' }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.$getRelation('skills').boot();
        assert.equal(User.$getRelation('skills')['relatedKey'], 'uid');
        assert.equal(User.$getRelation('skills')['relatedKeyColumnName'], 'uid');
    });
    (0, japa_1.default)('compute pivotForeignKey from table name + primary key', (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.$getRelation('skills').boot();
        assert.equal(User.$getRelation('skills')['pivotForeignKey'], 'user_id');
    });
    (0, japa_1.default)('use custom defined pivotForeignKey', (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, { pivotForeignKey: 'user_uid' }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.$getRelation('skills').boot();
        assert.equal(User.$getRelation('skills')['pivotForeignKey'], 'user_uid');
    });
    (0, japa_1.default)('compute relatedPivotForeignKey from related model name + primary key', (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        User.$getRelation('skills').boot();
        assert.equal(User.$getRelation('skills')['pivotRelatedForeignKey'], 'skill_id');
    });
    (0, japa_1.default)('use custom defined relatedPivotForeignKey', (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, { pivotRelatedForeignKey: 'skill_uid' }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        User.$getRelation('skills').boot();
        assert.equal(User.$getRelation('skills')['pivotRelatedForeignKey'], 'skill_uid');
    });
    (0, japa_1.default)('clone relationship instance with options', (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class BaseUser extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, { pivotRelatedForeignKey: 'skill_uid' }),
            __metadata("design:type", Object)
        ], BaseUser.prototype, "skills", void 0);
        class User extends BaseUser {
        }
        User.boot();
        User.$getRelation('skills').boot();
        assert.deepEqual(User.$getRelation('skills').model, User);
        assert.equal(User.$getRelation('skills')['pivotRelatedForeignKey'], 'skill_uid');
    });
});
japa_1.default.group('Model | ManyToMany | Set Relations', (group) => {
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
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.$getRelation('skills').boot();
        const user = new User();
        const skill = new Skill();
        User.$getRelation('skills').setRelated(user, [skill]);
        assert.deepEqual(user.skills, [skill]);
    });
    (0, japa_1.default)('push related model instance', (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.$getRelation('skills').boot();
        const user = new User();
        const skill = new Skill();
        const skill1 = new Skill();
        User.$getRelation('skills').setRelated(user, [skill]);
        User.$getRelation('skills').pushRelated(user, [skill1]);
        assert.deepEqual(user.skills, [skill, skill1]);
    });
    (0, japa_1.default)('set many of related instances', (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "users", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.manyToMany)(() => User),
            __metadata("design:type", Object)
        ], Skill.prototype, "users", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.$getRelation('skills').boot();
        Skill.$getRelation('users').boot();
        const user = new User();
        user.fill({ id: 1 });
        const user1 = new User();
        user1.fill({ id: 2 });
        const user2 = new User();
        user2.fill({ id: 3 });
        const skill = new Skill();
        skill.$extras = {
            pivot_user_id: 1,
        };
        const skill1 = new Skill();
        skill1.$extras = {
            pivot_user_id: 2,
        };
        const skill2 = new Skill();
        skill2.$extras = {
            pivot_user_id: 1,
        };
        User.$getRelation('skills').setRelatedForMany([user, user1, user2], [skill, skill1, skill2]);
        assert.deepEqual(user.skills, [skill, skill2]);
        assert.deepEqual(user1.skills, [skill1]);
        assert.deepEqual(user2.skills, []);
    });
});
japa_1.default.group('Model | ManyToMany | bulk operations', (group) => {
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
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        const user = await User.find(1);
        const { sql, bindings } = user.related('skills').query().toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .select('skills.*', 'skill_user.user_id as pivot_user_id', 'skill_user.skill_id as pivot_skill_id')
            .innerJoin('skill_user', 'skills.id', 'skill_user.skill_id')
            .where('skill_user.user_id', 1)
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('generate correct sql for selecting related for many rows', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').multiInsert([{ username: 'virk' }, { username: 'nikk' }]);
        const users = await User.all();
        User.$getRelation('skills').boot();
        const related = User.$getRelation('skills').eagerQuery(users, db.connection());
        const { sql, bindings } = related.toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .select('skills.*', 'skill_user.user_id as pivot_user_id', 'skill_user.skill_id as pivot_skill_id')
            .innerJoin('skill_user', 'skills.id', 'skill_user.skill_id')
            .whereIn('skill_user.user_id', [2, 1])
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('select extra columns', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, {
                pivotColumns: ['score'],
            }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        const user = await User.find(1);
        const { sql, bindings } = user.related('skills').query().toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .select('skills.*', 'skill_user.user_id as pivot_user_id', 'skill_user.skill_id as pivot_skill_id', 'skill_user.score as pivot_score')
            .innerJoin('skill_user', 'skills.id', 'skill_user.skill_id')
            .where('skill_user.user_id', 1)
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('select extra columns at runtime', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        const user = await User.find(1);
        const { sql, bindings } = user.related('skills').query().pivotColumns(['score']).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .select('skill_user.score as pivot_score', 'skills.*', 'skill_user.user_id as pivot_user_id', 'skill_user.skill_id as pivot_skill_id')
            .innerJoin('skill_user', 'skills.id', 'skill_user.skill_id')
            .where('skill_user.user_id', 1)
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('generate correct sql for updating rows', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        const user = await User.find(1);
        const now = new Date();
        const { sql, bindings } = user.related('skills').query().update({ updated_at: now }).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skill_user')
            .where('skill_user.user_id', 1)
            .update({ updated_at: now })
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('generate correct sql for deleting rows', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        const user = await User.find(1);
        const { sql, bindings } = user.related('skills').query().del().toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skill_user')
            .where('skill_user.user_id', 1)
            .del()
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('convert timestamps instance of Luxon', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, {
                pivotTimestamps: true,
            }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
                created_at: luxon_1.DateTime.local().toFormat(db.connection().dialect.dateTimeFormat),
                updated_at: luxon_1.DateTime.local().toFormat(db.connection().dialect.dateTimeFormat),
            },
        ]);
        const user = await User.find(1);
        const skills = await user.related('skills').query();
        assert.lengthOf(skills, 1);
        assert.equal(skills[0].name, 'Programming');
        assert.equal(skills[0].$extras.pivot_user_id, 1);
        assert.equal(skills[0].$extras.pivot_skill_id, 1);
        assert.instanceOf(skills[0].$extras.pivot_created_at, luxon_1.DateTime);
        assert.instanceOf(skills[0].$extras.pivot_updated_at, luxon_1.DateTime);
    });
});
japa_1.default.group('Model | ManyToMany | sub queries', (group) => {
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
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        User.$getRelation('skills').boot();
        const { sql, bindings } = User.$getRelation('skills').subQuery(db.connection()).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('skills')
            .innerJoin('skill_user', 'skills.id', 'skill_user.skill_id')
            .where('users.id', '=', db.connection().getReadClient().ref('skill_user.user_id'))
            .toSQL();
        assert.deepEqual(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('create aggregate query', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        User.$getRelation('skills').boot();
        const { sql, bindings } = User.$getRelation('skills')
            .subQuery(db.connection())
            .count('* as total')
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .count('* as total')
            .from('skills')
            .innerJoin('skill_user', 'skills.id', 'skill_user.skill_id')
            .where('users.id', '=', db.connection().getReadClient().ref('skill_user.user_id'))
            .toSQL();
        assert.deepEqual(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('allow selecting custom columns', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        User.$getRelation('skills').boot();
        const { sql, bindings } = User.$getRelation('skills')
            .subQuery(db.connection())
            .select('name')
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('skills')
            .select('skills.name')
            .innerJoin('skill_user', 'skills.id', 'skill_user.skill_id')
            .where('users.id', '=', db.connection().getReadClient().ref('skill_user.user_id'))
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
                Object.defineProperty(this, "follows", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => User, {
                pivotTable: 'follows',
                pivotForeignKey: 'user_id',
                pivotRelatedForeignKey: 'following_user_id',
            }),
            __metadata("design:type", Object)
        ], User.prototype, "follows", void 0);
        User.boot();
        User.$getRelation('follows').boot();
        const { sql, bindings } = User.$getRelation('follows').subQuery(db.connection()).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('users as adonis_temp_0')
            .innerJoin('follows', 'adonis_temp_0.id', 'follows.following_user_id')
            .where('users.id', '=', db.connection().getReadClient().ref('follows.user_id'))
            .toSQL();
        assert.deepEqual(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add where pivot clause when self relationship subQuery', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "follows", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => User, {
                pivotTable: 'follows',
                pivotForeignKey: 'user_id',
                pivotRelatedForeignKey: 'following_user_id',
            }),
            __metadata("design:type", Object)
        ], User.prototype, "follows", void 0);
        User.boot();
        User.$getRelation('follows').boot();
        const { sql, bindings } = User.$getRelation('follows')
            .subQuery(db.connection())
            .select('name')
            .wherePivot('following_user_id', 10)
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('users as adonis_temp_0')
            .select('adonis_temp_0.name')
            .innerJoin('follows', 'adonis_temp_0.id', 'follows.following_user_id')
            .where((query) => query.where('follows.following_user_id', 10))
            .where((query) => query.where('users.id', '=', db.connection().getReadClient().ref('follows.user_id')))
            .toSQL();
        assert.deepEqual(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('allow selecting custom pivot columns', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        User.$getRelation('skills').boot();
        const { sql, bindings } = User.$getRelation('skills')
            .subQuery(db.connection())
            .pivotColumns(['proficiency'])
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('skills')
            .select('skill_user.proficiency')
            .innerJoin('skill_user', 'skills.id', 'skill_user.skill_id')
            .where('users.id', '=', db.connection().getReadClient().ref('skill_user.user_id'))
            .toSQL();
        assert.deepEqual(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('run onQuery method when defined', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, {
                onQuery: (query) => query.where('name', 'Programming'),
            }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        User.$getRelation('skills').boot();
        const { sql, bindings } = User.$getRelation('skills').subQuery(db.connection()).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('skills')
            .innerJoin('skill_user', 'skills.id', 'skill_user.skill_id')
            .where((query) => query.where('name', 'Programming'))
            .where((query) => query.where('users.id', '=', db.connection().getReadClient().ref('skill_user.user_id')))
            .toSQL();
        assert.deepEqual(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
japa_1.default.group('Model | Many To Many | aggregates', (group) => {
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
    (0, japa_1.default)('get total of all related rows', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        await db
            .table('skills')
            .multiInsert([{ name: 'Programming' }, { name: 'Cooking' }, { name: 'Dancing' }]);
        await db.table('skill_user').multiInsert([
            { user_id: 1, skill_id: 1 },
            { user_id: 1, skill_id: 2 },
            { user_id: 2, skill_id: 2 },
        ]);
        const user = await User.find(1);
        const total = await user.related('skills').query().count('* as total');
        assert.deepEqual(Number(total[0].$extras.total), 2);
    });
    (0, japa_1.default)('select extra columns with count', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        await db
            .table('skills')
            .multiInsert([{ name: 'Programming' }, { name: 'Cooking' }, { name: 'Dancing' }]);
        await db.table('skill_user').multiInsert([
            { user_id: 1, skill_id: 1 },
            { user_id: 1, skill_id: 2 },
            { user_id: 2, skill_id: 2 },
        ]);
        const user = await User.find(1);
        const total = await user
            .related('skills')
            .query()
            .select('name', 'id')
            .groupBy('skills.name', 'skills.id')
            .count('* as total')
            .orderBy('skills.id', 'desc');
        assert.lengthOf(total, 2);
        assert.equal(total[0].$extras.name, 'Cooking');
        assert.equal(Number(total[0].$extras.total), 1);
        assert.equal(total[1].$extras.name, 'Programming');
        assert.equal(Number(total[1].$extras.total), 1);
    });
    (0, japa_1.default)('select extra pivot columns with count', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        await db
            .table('skills')
            .multiInsert([{ name: 'Programming' }, { name: 'Cooking' }, { name: 'Dancing' }]);
        await db.table('skill_user').multiInsert([
            { user_id: 1, skill_id: 1, proficiency: 'Beginner' },
            { user_id: 1, skill_id: 2, proficiency: 'Advanced' },
            { user_id: 2, skill_id: 2, proficiency: 'Beginner' },
        ]);
        const user = await User.find(1);
        const total = await user
            .related('skills')
            .query()
            .pivotColumns(['proficiency'])
            .select('id')
            .groupBy('skill_user.proficiency', 'skills.id')
            .count('* as total')
            .orderBy('skills.id', 'desc');
        assert.lengthOf(total, 2);
        assert.equal(total[0].$extras.pivot_proficiency, 'Advanced');
        assert.equal(Number(total[0].$extras.total), 1);
        assert.equal(total[1].$extras.pivot_proficiency, 'Beginner');
        assert.equal(Number(total[1].$extras.total), 1);
    });
});
japa_1.default.group('Model | ManyToMany | preload', (group) => {
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
    (0, japa_1.default)('preload relation', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
        ]);
        const users = await User.query().preload('skills');
        assert.lengthOf(users, 1);
        assert.lengthOf(users[0].skills, 1);
        assert.equal(users[0].skills[0].name, 'Programming');
        assert.equal(users[0].skills[0].$extras.pivot_user_id, 1);
        assert.equal(users[0].skills[0].$extras.pivot_skill_id, 1);
    });
    (0, japa_1.default)('convert dates to luxon datetime instance during preload', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, {
                pivotTimestamps: true,
            }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
                created_at: luxon_1.DateTime.local().toFormat(db.connection().dialect.dateTimeFormat),
                updated_at: luxon_1.DateTime.local().toFormat(db.connection().dialect.dateTimeFormat),
            },
        ]);
        const users = await User.query().preload('skills');
        assert.lengthOf(users, 1);
        assert.lengthOf(users[0].skills, 1);
        assert.equal(users[0].skills[0].name, 'Programming');
        assert.equal(users[0].skills[0].$extras.pivot_user_id, 1);
        assert.equal(users[0].skills[0].$extras.pivot_skill_id, 1);
        assert.instanceOf(users[0].skills[0].$extras.pivot_created_at, luxon_1.DateTime);
        assert.instanceOf(users[0].skills[0].$extras.pivot_updated_at, luxon_1.DateTime);
    });
    (0, japa_1.default)('preload relation for many', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
            {
                user_id: 2,
                skill_id: 2,
            },
        ]);
        const users = await User.query().preload('skills');
        assert.lengthOf(users, 2);
        assert.lengthOf(users[0].skills, 2);
        assert.lengthOf(users[1].skills, 1);
        assert.equal(users[0].skills[0].name, 'Programming');
        assert.equal(users[0].skills[0].$extras.pivot_user_id, 1);
        assert.equal(users[0].skills[0].$extras.pivot_skill_id, 1);
        assert.equal(users[0].skills[1].name, 'Dancing');
        assert.equal(users[0].skills[1].$extras.pivot_user_id, 1);
        assert.equal(users[0].skills[1].$extras.pivot_skill_id, 2);
        assert.equal(users[1].skills[0].name, 'Dancing');
        assert.equal(users[1].skills[0].$extras.pivot_user_id, 2);
        assert.equal(users[1].skills[0].$extras.pivot_skill_id, 2);
    });
    (0, japa_1.default)('preload relation using model instance', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
            {
                user_id: 2,
                skill_id: 2,
            },
        ]);
        const users = await User.query().orderBy('id', 'asc');
        assert.lengthOf(users, 2);
        await users[0].load('skills');
        await users[1].load('skills');
        assert.lengthOf(users[0].skills, 2);
        assert.lengthOf(users[1].skills, 1);
        assert.equal(users[0].skills[0].name, 'Programming');
        assert.equal(users[0].skills[0].$extras.pivot_user_id, 1);
        assert.equal(users[0].skills[0].$extras.pivot_skill_id, 1);
        assert.equal(users[0].skills[1].name, 'Dancing');
        assert.equal(users[0].skills[1].$extras.pivot_user_id, 1);
        assert.equal(users[0].skills[1].$extras.pivot_skill_id, 2);
        assert.equal(users[1].skills[0].name, 'Dancing');
        assert.equal(users[1].skills[0].$extras.pivot_user_id, 2);
        assert.equal(users[1].skills[0].$extras.pivot_skill_id, 2);
    });
    (0, japa_1.default)('convert dates to luxon datetime instance when preload using model instance', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, {
                pivotTimestamps: true,
            }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
                created_at: luxon_1.DateTime.local().toFormat(db.connection().dialect.dateTimeFormat),
                updated_at: luxon_1.DateTime.local().toFormat(db.connection().dialect.dateTimeFormat),
            },
        ]);
        const users = await User.query();
        await users[0].load('skills');
        assert.lengthOf(users, 1);
        assert.lengthOf(users[0].skills, 1);
        assert.equal(users[0].skills[0].name, 'Programming');
        assert.equal(users[0].skills[0].$extras.pivot_user_id, 1);
        assert.equal(users[0].skills[0].$extras.pivot_skill_id, 1);
        assert.instanceOf(users[0].skills[0].$extras.pivot_created_at, luxon_1.DateTime);
        assert.instanceOf(users[0].skills[0].$extras.pivot_updated_at, luxon_1.DateTime);
    });
    (0, japa_1.default)('select extra pivot columns', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "proficiency", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "proficiency", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, { pivotColumns: ['proficiency'] }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
                proficiency: 'expert',
            },
            {
                user_id: 1,
                skill_id: 2,
                proficiency: 'beginner',
            },
            {
                user_id: 2,
                skill_id: 2,
                proficiency: 'beginner',
            },
        ]);
        const users = await User.query().preload('skills');
        assert.lengthOf(users, 2);
        assert.lengthOf(users[0].skills, 2);
        assert.lengthOf(users[1].skills, 1);
        assert.equal(users[0].skills[0].name, 'Programming');
        assert.equal(users[0].skills[0].$extras.pivot_user_id, 1);
        assert.equal(users[0].skills[0].$extras.pivot_skill_id, 1);
        assert.equal(users[0].skills[0].$extras.pivot_proficiency, 'expert');
        assert.equal(users[0].skills[1].name, 'Dancing');
        assert.equal(users[0].skills[1].$extras.pivot_user_id, 1);
        assert.equal(users[0].skills[1].$extras.pivot_skill_id, 2);
        assert.equal(users[0].skills[1].$extras.pivot_proficiency, 'beginner');
        assert.equal(users[1].skills[0].name, 'Dancing');
        assert.equal(users[1].skills[0].$extras.pivot_user_id, 2);
        assert.equal(users[1].skills[0].$extras.pivot_skill_id, 2);
        assert.equal(users[1].skills[0].$extras.pivot_proficiency, 'beginner');
    });
    (0, japa_1.default)('select extra pivot columns at runtime', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "proficiency", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "proficiency", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
                proficiency: 'expert',
            },
            {
                user_id: 1,
                skill_id: 2,
                proficiency: 'beginner',
            },
            {
                user_id: 2,
                skill_id: 2,
                proficiency: 'beginner',
            },
        ]);
        const users = await User.query().preload('skills', (builder) => {
            builder.pivotColumns(['proficiency']);
        });
        assert.lengthOf(users, 2);
        assert.lengthOf(users[0].skills, 2);
        assert.lengthOf(users[1].skills, 1);
        assert.equal(users[0].skills[0].name, 'Programming');
        assert.equal(users[0].skills[0].$extras.pivot_user_id, 1);
        assert.equal(users[0].skills[0].$extras.pivot_skill_id, 1);
        assert.equal(users[0].skills[0].$extras.pivot_proficiency, 'expert');
        assert.equal(users[0].skills[1].name, 'Dancing');
        assert.equal(users[0].skills[1].$extras.pivot_user_id, 1);
        assert.equal(users[0].skills[1].$extras.pivot_skill_id, 2);
        assert.equal(users[0].skills[1].$extras.pivot_proficiency, 'beginner');
        assert.equal(users[1].skills[0].name, 'Dancing');
        assert.equal(users[1].skills[0].$extras.pivot_user_id, 2);
        assert.equal(users[1].skills[0].$extras.pivot_skill_id, 2);
        assert.equal(users[1].skills[0].$extras.pivot_proficiency, 'beginner');
    });
    (0, japa_1.default)('cherry pick columns during preload', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
        ]);
        const users = await User.query().preload('skills', (builder) => {
            return builder.select('name');
        });
        assert.lengthOf(users, 1);
        assert.lengthOf(users[0].skills, 1);
        assert.equal(users[0].skills[0].name, 'Programming');
        assert.deepEqual(users[0].skills[0].$extras, { pivot_user_id: 1, pivot_skill_id: 1 });
    });
    (0, japa_1.default)('raise error when local key is not selected', async (assert) => {
        assert.plan(1);
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
            {
                user_id: 2,
                skill_id: 2,
            },
        ]);
        try {
            await User.query().select('username').preload('skills');
        }
        catch ({ message }) {
            assert.equal(message, 'Cannot preload "skills", value of "User.id" is undefined');
        }
    });
    (0, japa_1.default)('do not run preload query when parent rows are empty', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const users = await User.query().preload('skills', () => {
            throw new Error('not expected to be here');
        });
        assert.lengthOf(users, 0);
    });
});
japa_1.default.group('Model | ManyToMany | withCount', (group) => {
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
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
            {
                user_id: 2,
                skill_id: 2,
            },
        ]);
        const users = await User.query().withCount('skills').orderBy('id', 'asc');
        assert.lengthOf(users, 2);
        assert.deepEqual(Number(users[0].$extras.skills_count), 2);
        assert.deepEqual(Number(users[1].$extras.skills_count), 1);
    });
    (0, japa_1.default)('apply constraints to the withCount subquery', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
            {
                user_id: 2,
                skill_id: 2,
            },
        ]);
        const users = await User.query()
            .withCount('skills', (query) => {
            query.where('name', 'Programming');
        })
            .orderBy('id', 'asc');
        assert.lengthOf(users, 2);
        assert.deepEqual(Number(users[0].$extras.skills_count), 1);
        assert.deepEqual(Number(users[1].$extras.skills_count), 0);
    });
    (0, japa_1.default)('allow subquery to have custom aggregates', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
            {
                user_id: 2,
                skill_id: 2,
            },
        ]);
        const users = await User.query()
            .withAggregate('skills', (query) => {
            query.countDistinct('skill_user.user_id').as('skillsCount');
        })
            .orderBy('id', 'asc');
        assert.lengthOf(users, 2);
        assert.deepEqual(Number(users[0].$extras.skillsCount), 1);
        assert.deepEqual(Number(users[1].$extras.skillsCount), 1);
    });
    (0, japa_1.default)('allow cherry picking columns', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
            {
                user_id: 2,
                skill_id: 2,
            },
        ]);
        const users = await User.query().select('username').withCount('skills').orderBy('id', 'asc');
        assert.lengthOf(users, 2);
        assert.deepEqual(users[0].$attributes, { username: 'virk' });
        assert.deepEqual(users[1].$attributes, { username: 'nikk' });
    });
    (0, japa_1.default)('get count of self relationship', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "follows", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => User, {
                pivotTable: 'follows',
                pivotForeignKey: 'user_id',
                pivotRelatedForeignKey: 'following_user_id',
            }),
            __metadata("design:type", Object)
        ], User.prototype, "follows", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .multiInsert([
            { username: 'virk' },
            { username: 'nikk' },
            { username: 'romain' },
            { username: 'joe' },
        ]);
        await db
            .insertQuery()
            .table('follows')
            .insert([
            {
                user_id: 1,
                following_user_id: 2,
            },
            {
                user_id: 1,
                following_user_id: 3,
            },
            {
                user_id: 3,
                following_user_id: 1,
            },
        ]);
        const users = await User.query().withCount('follows').orderBy('id', 'asc');
        assert.lengthOf(users, 4);
        assert.deepEqual(Number(users[0].$extras.follows_count), 2);
        assert.deepEqual(Number(users[1].$extras.follows_count), 0);
        assert.deepEqual(Number(users[2].$extras.follows_count), 1);
        assert.deepEqual(Number(users[3].$extras.follows_count), 0);
    });
    (0, japa_1.default)('define custom alias for the count', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
            {
                user_id: 2,
                skill_id: 2,
            },
        ]);
        const users = await User.query()
            .select('username')
            .withCount('skills', (query) => {
            query.as('mySkills');
        })
            .orderBy('id', 'asc');
        assert.lengthOf(users, 2);
        assert.deepEqual(Number(users[0].$extras.mySkills), 2);
        assert.deepEqual(Number(users[1].$extras.mySkills), 1);
    });
    (0, japa_1.default)('get count of a nested relationship rows', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        class Group extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "users", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Group.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.manyToMany)(() => User),
            __metadata("design:type", Object)
        ], Group.prototype, "users", void 0);
        Group.boot();
        await db
            .insertQuery()
            .table('groups')
            .insert([{ name: 'Tech' }, { name: 'Movie' }]);
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
            {
                user_id: 2,
                skill_id: 2,
            },
        ]);
        await db
            .insertQuery()
            .table('group_user')
            .insert([
            {
                user_id: 1,
                group_id: 1,
            },
            {
                user_id: 2,
                group_id: 1,
            },
            {
                user_id: 2,
                group_id: 2,
            },
        ]);
        const firstGroup = await Group.firstOrFail();
        const query = firstGroup.related('users').query().withCount('skills').orderBy('id', 'asc');
        const { sql, bindings } = query.toSQL();
        const { sql: rawSql, bindings: rawBindings } = db
            .from('users')
            .select('users.*')
            .select(db
            .from('skills')
            .count('*')
            .innerJoin('skill_user', 'skills.id', 'skill_user.skill_id')
            .whereColumn('users.id', 'skill_user.user_id')
            .as('skills_count'))
            .select('group_user.group_id as pivot_group_id')
            .select('group_user.user_id as pivot_user_id')
            .innerJoin('group_user', 'users.id', 'group_user.user_id')
            .where('group_user.group_id', firstGroup.id)
            .orderBy('id', 'asc')
            .toSQL();
        assert.equal(sql, rawSql);
        assert.deepEqual(bindings, rawBindings);
        const users = await query;
        assert.lengthOf(users, 2);
        assert.deepEqual(Number(users[0].$extras.skills_count), 2);
        assert.deepEqual(Number(users[1].$extras.skills_count), 1);
    });
    (0, japa_1.default)('lazy load count of relationship rows', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
        ]);
        const user = await User.query().firstOrFail();
        await user.loadCount('skills');
        assert.deepEqual(Number(user.$extras.skills_count), 2);
    });
    (0, japa_1.default)('apply constraints to the loadCount subquery', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
        ]);
        const user = await User.query().firstOrFail();
        await user.loadCount('skills', (query) => {
            query.where('name', 'Programming');
        });
        assert.deepEqual(Number(user.$extras.skills_count), 1);
    });
});
japa_1.default.group('Model | ManyToMany | has', (group) => {
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
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
        ]);
        const users = await User.query().has('skills').orderBy('id', 'asc');
        assert.lengthOf(users, 1);
        assert.deepEqual(users[0].username, 'virk');
    });
    (0, japa_1.default)('define expected number of rows', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
            {
                user_id: 2,
                skill_id: 2,
            },
        ]);
        const users = await User.query().has('skills', '>', 1).orderBy('id', 'asc');
        assert.lengthOf(users, 1);
        assert.deepEqual(users[0].username, 'virk');
    });
});
japa_1.default.group('Model | ManyToMany | whereHas', (group) => {
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
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
                proficiency: 'Beginner',
            },
            {
                user_id: 1,
                skill_id: 2,
                proficiency: 'Master',
            },
            {
                user_id: 2,
                skill_id: 2,
                proficiency: 'Beginner',
            },
        ]);
        const users = await User.query()
            .whereHas('skills', (query) => {
            query.where('skill_user.proficiency', 'Master');
        })
            .orderBy('id', 'asc');
        assert.lengthOf(users, 1);
        assert.deepEqual(users[0].username, 'virk');
    });
    (0, japa_1.default)('define expected number of rows', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }, { username: 'nikk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
                proficiency: 'Beginner',
            },
            {
                user_id: 1,
                skill_id: 2,
                proficiency: 'Master',
            },
            {
                user_id: 2,
                skill_id: 2,
                proficiency: 'Beginner',
            },
        ]);
        const users = await User.query()
            .whereHas('skills', (query) => {
            query.where('skill_user.proficiency', 'Master');
        }, '>', 1)
            .orderBy('id', 'asc');
        assert.lengthOf(users, 0);
    });
});
if (process.env.DB !== 'mysql_legacy') {
    japa_1.default.group('Model | ManyToMany | Group Limit', (group) => {
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
        (0, japa_1.default)('apply group limit', async (assert) => {
            class Skill extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "name", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                }
            }
            __decorate([
                (0, Decorators_1.column)({ isPrimary: true }),
                __metadata("design:type", Number)
            ], Skill.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", String)
            ], Skill.prototype, "name", void 0);
            class User extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "skills", {
                        enumerable: true,
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
                (0, Decorators_1.manyToMany)(() => Skill),
                __metadata("design:type", Object)
            ], User.prototype, "skills", void 0);
            User.boot();
            await db
                .insertQuery()
                .table('users')
                .insert([{ username: 'virk' }, { username: 'nikk' }]);
            await db
                .insertQuery()
                .table('skills')
                .insert([
                { name: 'Programming' },
                { name: 'Dancing' },
                { name: 'Designing' },
                { name: 'Cooking' },
                { name: 'Singing' },
            ]);
            const skillIds = [1, 2, 3, 4, 5];
            /**
             * User 1 skills
             */
            await db
                .insertQuery()
                .table('skill_user')
                .insert(skillIds.map((id) => {
                return { user_id: 1, skill_id: id };
            }));
            /**
             * User 2 skills
             */
            await db
                .insertQuery()
                .table('skill_user')
                .insert(skillIds.map((id) => {
                return { user_id: 2, skill_id: id };
            }));
            const users = await User.query().preload('skills', (query) => query.groupLimit(2));
            assert.lengthOf(users, 2);
            assert.lengthOf(users[0].skills, 2);
            assert.equal(users[0].skills[0].name, 'Singing');
            assert.equal(users[0].skills[0].$extras.pivot_user_id, 1);
            assert.equal(users[0].skills[0].$extras.pivot_skill_id, 5);
            assert.equal(users[0].skills[1].name, 'Cooking');
            assert.equal(users[0].skills[1].$extras.pivot_user_id, 1);
            assert.equal(users[0].skills[1].$extras.pivot_skill_id, 4);
            assert.equal(users[1].skills[0].name, 'Singing');
            assert.equal(users[1].skills[0].$extras.pivot_user_id, 2);
            assert.equal(users[1].skills[0].$extras.pivot_skill_id, 5);
            assert.equal(users[1].skills[1].name, 'Cooking');
            assert.equal(users[1].skills[1].$extras.pivot_user_id, 2);
            assert.equal(users[1].skills[1].$extras.pivot_skill_id, 4);
        });
        (0, japa_1.default)('apply group limit with extra constraints', async (assert) => {
            class Skill extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "name", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                }
            }
            __decorate([
                (0, Decorators_1.column)({ isPrimary: true }),
                __metadata("design:type", Number)
            ], Skill.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", String)
            ], Skill.prototype, "name", void 0);
            class User extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "skills", {
                        enumerable: true,
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
                (0, Decorators_1.manyToMany)(() => Skill),
                __metadata("design:type", Object)
            ], User.prototype, "skills", void 0);
            User.boot();
            await db
                .insertQuery()
                .table('users')
                .insert([{ username: 'virk' }, { username: 'nikk' }]);
            await db
                .insertQuery()
                .table('skills')
                .insert([
                { name: 'Programming' },
                { name: 'Dancing' },
                { name: 'Designing' },
                { name: 'Cooking' },
                { name: 'Singing' },
            ]);
            /**
             * User 1 skills
             */
            await db
                .insertQuery()
                .table('skill_user')
                .insert([
                {
                    user_id: 1,
                    skill_id: 1,
                    proficiency: 'Master',
                },
                {
                    user_id: 1,
                    skill_id: 2,
                    proficiency: 'Beginner',
                },
                {
                    user_id: 1,
                    skill_id: 3,
                    proficiency: 'Master',
                },
                {
                    user_id: 1,
                    skill_id: 4,
                    proficiency: 'Beginner',
                },
                {
                    user_id: 1,
                    skill_id: 5,
                    proficiency: 'Noob',
                },
            ]);
            /**
             * User 2 skills
             */
            await db
                .insertQuery()
                .table('skill_user')
                .insert([
                {
                    user_id: 2,
                    skill_id: 1,
                    proficiency: 'Beginner',
                },
                {
                    user_id: 2,
                    skill_id: 2,
                    proficiency: 'Beginner',
                },
                {
                    user_id: 2,
                    skill_id: 3,
                    proficiency: 'Master',
                },
                {
                    user_id: 2,
                    skill_id: 4,
                    proficiency: 'Beginner',
                },
                {
                    user_id: 2,
                    skill_id: 5,
                    proficiency: 'Master',
                },
            ]);
            const users = await User.query().preload('skills', (query) => {
                query.groupLimit(2).wherePivot('proficiency', 'Master');
            });
            assert.lengthOf(users, 2);
            assert.lengthOf(users[0].skills, 2);
            assert.equal(users[0].skills[0].name, 'Designing');
            assert.equal(users[0].skills[0].$extras.pivot_user_id, 1);
            assert.equal(users[0].skills[0].$extras.pivot_skill_id, 3);
            assert.equal(users[0].skills[1].name, 'Programming');
            assert.equal(users[0].skills[1].$extras.pivot_user_id, 1);
            assert.equal(users[0].skills[1].$extras.pivot_skill_id, 1);
            assert.equal(users[1].skills[0].name, 'Singing');
            assert.equal(users[1].skills[0].$extras.pivot_user_id, 2);
            assert.equal(users[1].skills[0].$extras.pivot_skill_id, 5);
            assert.equal(users[1].skills[1].name, 'Designing');
            assert.equal(users[1].skills[1].$extras.pivot_user_id, 2);
            assert.equal(users[1].skills[1].$extras.pivot_skill_id, 3);
        });
        (0, japa_1.default)('apply group limit and select custom columns', async (assert) => {
            class Skill extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "name", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                }
            }
            __decorate([
                (0, Decorators_1.column)({ isPrimary: true }),
                __metadata("design:type", Number)
            ], Skill.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", String)
            ], Skill.prototype, "name", void 0);
            class User extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "skills", {
                        enumerable: true,
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
                (0, Decorators_1.manyToMany)(() => Skill),
                __metadata("design:type", Object)
            ], User.prototype, "skills", void 0);
            User.boot();
            await db
                .insertQuery()
                .table('users')
                .insert([{ username: 'virk' }, { username: 'nikk' }]);
            await db
                .insertQuery()
                .table('skills')
                .insert([
                { name: 'Programming' },
                { name: 'Dancing' },
                { name: 'Designing' },
                { name: 'Cooking' },
                { name: 'Singing' },
            ]);
            /**
             * User 1 skills
             */
            await db
                .insertQuery()
                .table('skill_user')
                .insert([
                {
                    user_id: 1,
                    skill_id: 1,
                    proficiency: 'Master',
                },
                {
                    user_id: 1,
                    skill_id: 2,
                    proficiency: 'Beginner',
                },
                {
                    user_id: 1,
                    skill_id: 3,
                    proficiency: 'Master',
                },
                {
                    user_id: 1,
                    skill_id: 4,
                    proficiency: 'Beginner',
                },
                {
                    user_id: 1,
                    skill_id: 5,
                    proficiency: 'Noob',
                },
            ]);
            /**
             * User 2 skills
             */
            await db
                .insertQuery()
                .table('skill_user')
                .insert([
                {
                    user_id: 2,
                    skill_id: 1,
                    proficiency: 'Beginner',
                },
                {
                    user_id: 2,
                    skill_id: 2,
                    proficiency: 'Beginner',
                },
                {
                    user_id: 2,
                    skill_id: 3,
                    proficiency: 'Master',
                },
                {
                    user_id: 2,
                    skill_id: 4,
                    proficiency: 'Beginner',
                },
                {
                    user_id: 2,
                    skill_id: 5,
                    proficiency: 'Master',
                },
            ]);
            const users = await User.query().preload('skills', (query) => {
                query
                    .groupLimit(2)
                    .wherePivot('proficiency', 'Master')
                    .select('name')
                    .pivotColumns(['proficiency']);
            });
            assert.lengthOf(users, 2);
            assert.lengthOf(users[0].skills, 2);
            assert.equal(users[0].skills[0].name, 'Designing');
            assert.equal(users[0].skills[0].$extras.pivot_user_id, 1);
            assert.equal(users[0].skills[0].$extras.pivot_skill_id, 3);
            assert.equal(users[0].skills[0].$extras.pivot_proficiency, 'Master');
            assert.equal(users[0].skills[1].name, 'Programming');
            assert.equal(users[0].skills[1].$extras.pivot_user_id, 1);
            assert.equal(users[0].skills[1].$extras.pivot_skill_id, 1);
            assert.equal(users[0].skills[1].$extras.pivot_proficiency, 'Master');
            assert.equal(users[1].skills[0].name, 'Singing');
            assert.equal(users[1].skills[0].$extras.pivot_user_id, 2);
            assert.equal(users[1].skills[0].$extras.pivot_skill_id, 5);
            assert.equal(users[1].skills[0].$extras.pivot_proficiency, 'Master');
            assert.equal(users[1].skills[1].name, 'Designing');
            assert.equal(users[1].skills[1].$extras.pivot_user_id, 2);
            assert.equal(users[1].skills[1].$extras.pivot_skill_id, 3);
            assert.equal(users[1].skills[1].$extras.pivot_proficiency, 'Master');
        });
        (0, japa_1.default)('define custom order by clause', async (assert) => {
            class Skill extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "name", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                }
            }
            __decorate([
                (0, Decorators_1.column)({ isPrimary: true }),
                __metadata("design:type", Number)
            ], Skill.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", String)
            ], Skill.prototype, "name", void 0);
            class User extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "skills", {
                        enumerable: true,
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
                (0, Decorators_1.manyToMany)(() => Skill),
                __metadata("design:type", Object)
            ], User.prototype, "skills", void 0);
            User.boot();
            await db
                .insertQuery()
                .table('users')
                .insert([{ username: 'virk' }, { username: 'nikk' }]);
            await db
                .insertQuery()
                .table('skills')
                .insert([
                { name: 'Programming' },
                { name: 'Dancing' },
                { name: 'Designing' },
                { name: 'Cooking' },
                { name: 'Singing' },
            ]);
            /**
             * User 1 skills
             */
            await db
                .insertQuery()
                .table('skill_user')
                .insert([
                {
                    user_id: 1,
                    skill_id: 1,
                    proficiency: 'Master',
                },
                {
                    user_id: 1,
                    skill_id: 2,
                    proficiency: 'Beginner',
                },
                {
                    user_id: 1,
                    skill_id: 3,
                    proficiency: 'Master',
                },
                {
                    user_id: 1,
                    skill_id: 4,
                    proficiency: 'Beginner',
                },
                {
                    user_id: 1,
                    skill_id: 5,
                    proficiency: 'Noob',
                },
            ]);
            /**
             * User 2 skills
             */
            await db
                .insertQuery()
                .table('skill_user')
                .insert([
                {
                    user_id: 2,
                    skill_id: 1,
                    proficiency: 'Beginner',
                },
                {
                    user_id: 2,
                    skill_id: 2,
                    proficiency: 'Beginner',
                },
                {
                    user_id: 2,
                    skill_id: 3,
                    proficiency: 'Master',
                },
                {
                    user_id: 2,
                    skill_id: 4,
                    proficiency: 'Beginner',
                },
                {
                    user_id: 2,
                    skill_id: 5,
                    proficiency: 'Master',
                },
            ]);
            const users = await User.query().preload('skills', (query) => {
                query
                    .groupLimit(2)
                    .wherePivot('proficiency', 'Master')
                    .select('name')
                    .pivotColumns(['proficiency'])
                    .groupOrderBy('skills.name', 'asc');
            });
            assert.lengthOf(users, 2);
            assert.lengthOf(users[0].skills, 2);
            assert.equal(users[0].skills[0].name, 'Designing');
            assert.equal(users[0].skills[0].$extras.pivot_user_id, 1);
            assert.equal(users[0].skills[0].$extras.pivot_skill_id, 3);
            assert.equal(users[0].skills[0].$extras.pivot_proficiency, 'Master');
            assert.equal(users[0].skills[1].name, 'Programming');
            assert.equal(users[0].skills[1].$extras.pivot_user_id, 1);
            assert.equal(users[0].skills[1].$extras.pivot_skill_id, 1);
            assert.equal(users[0].skills[1].$extras.pivot_proficiency, 'Master');
            assert.equal(users[1].skills[0].name, 'Designing');
            assert.equal(users[1].skills[0].$extras.pivot_user_id, 2);
            assert.equal(users[1].skills[0].$extras.pivot_skill_id, 3);
            assert.equal(users[1].skills[0].$extras.pivot_proficiency, 'Master');
            assert.equal(users[1].skills[1].name, 'Singing');
            assert.equal(users[1].skills[1].$extras.pivot_user_id, 2);
            assert.equal(users[1].skills[1].$extras.pivot_skill_id, 5);
            assert.equal(users[1].skills[1].$extras.pivot_proficiency, 'Master');
        });
        (0, japa_1.default)('apply standard limit when not eagerloading', async (assert) => {
            class Skill extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "name", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                }
            }
            __decorate([
                (0, Decorators_1.column)({ isPrimary: true }),
                __metadata("design:type", Number)
            ], Skill.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", String)
            ], Skill.prototype, "name", void 0);
            class User extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "skills", {
                        enumerable: true,
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
                (0, Decorators_1.manyToMany)(() => Skill),
                __metadata("design:type", Object)
            ], User.prototype, "skills", void 0);
            User.boot();
            await db
                .insertQuery()
                .table('users')
                .insert([{ username: 'virk' }, { username: 'nikk' }]);
            await db
                .insertQuery()
                .table('skills')
                .insert([
                { name: 'Programming' },
                { name: 'Dancing' },
                { name: 'Designing' },
                { name: 'Cooking' },
                { name: 'Singing' },
            ]);
            const skillIds = [1, 2, 3, 4, 5];
            /**
             * User 1 skills
             */
            await db
                .insertQuery()
                .table('skill_user')
                .insert(skillIds.map((id) => {
                return { user_id: 1, skill_id: id };
            }));
            const user = await User.query().firstOrFail();
            const { sql, bindings } = user.related('skills').query().groupLimit(2).toSQL();
            const { sql: knexSql, bindings: knexBindings } = db
                .query()
                .from('skills')
                .select('skills.*', 'skill_user.user_id as pivot_user_id', 'skill_user.skill_id as pivot_skill_id')
                .innerJoin('skill_user', 'skills.id', 'skill_user.skill_id')
                .where('skill_user.user_id', 1)
                .limit(2)
                .toSQL();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        (0, japa_1.default)('apply standard order by when not eagerloading', async (assert) => {
            class Skill extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "name", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                }
            }
            __decorate([
                (0, Decorators_1.column)({ isPrimary: true }),
                __metadata("design:type", Number)
            ], Skill.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", String)
            ], Skill.prototype, "name", void 0);
            class User extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "skills", {
                        enumerable: true,
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
                (0, Decorators_1.manyToMany)(() => Skill),
                __metadata("design:type", Object)
            ], User.prototype, "skills", void 0);
            User.boot();
            await db
                .insertQuery()
                .table('users')
                .insert([{ username: 'virk' }, { username: 'nikk' }]);
            await db
                .insertQuery()
                .table('skills')
                .insert([
                { name: 'Programming' },
                { name: 'Dancing' },
                { name: 'Designing' },
                { name: 'Cooking' },
                { name: 'Singing' },
            ]);
            const skillIds = [1, 2, 3, 4, 5];
            /**
             * User 1 skills
             */
            await db
                .insertQuery()
                .table('skill_user')
                .insert(skillIds.map((id) => {
                return { user_id: 1, skill_id: id };
            }));
            const user = await User.query().firstOrFail();
            const { sql, bindings } = user
                .related('skills')
                .query()
                .groupLimit(2)
                .groupOrderBy('skill_user.id', 'desc')
                .toSQL();
            const { sql: knexSql, bindings: knexBindings } = db
                .query()
                .from('skills')
                .select('skills.*', 'skill_user.user_id as pivot_user_id', 'skill_user.skill_id as pivot_skill_id')
                .innerJoin('skill_user', 'skills.id', 'skill_user.skill_id')
                .where('skill_user.user_id', 1)
                .limit(2)
                .orderBy('skill_user.id', 'desc')
                .toSQL();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
    });
}
japa_1.default.group('Model | ManyToMany | wherePivot', (group) => {
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
    (0, japa_1.default)('add where clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query.wherePivot('username', 'virk').toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .where('skill_user.username', 'virk')
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add where wrapped clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .where((builder) => builder.wherePivot('username', 'virk'))['toSQL']();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .where((builder) => builder.where('skill_user.username', 'virk'))
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add where clause with operator', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query.wherePivot('age', '>', 22).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .where('skill_user.age', '>', 22)
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add where clause as a raw query', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .wherePivot('age', '>', db.rawQuery('select min_age from ages limit 1;'))
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .where('skill_user.age', '>', db.connection().getWriteClient().raw('select min_age from ages limit 1;'))
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add orWhere clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query.wherePivot('age', '>', 22).orWherePivot('age', 18).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .where('skill_user.age', '>', 22)
            .orWhere('skill_user.age', 18)
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add orWhere wrapped clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .wherePivot('age', '>', 22)
            .orWhere((builder) => {
            builder.wherePivot('age', 18);
        })
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .where('skill_user.age', '>', 22)
            .orWhere((builder) => {
            builder.where('skill_user.age', 18);
        })
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('pass relationship metadata to the profiler', async (assert) => {
        assert.plan(1);
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        await db
            .insertQuery()
            .table('users')
            .insert([{ username: 'virk' }]);
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
        ]);
        const profiler = app.profiler;
        let profilerPacketIndex = 0;
        profiler.process((packet) => {
            if (profilerPacketIndex === 1) {
                assert.deepEqual(packet.data.relation, {
                    model: 'User',
                    relatedModel: 'Skill',
                    pivotTable: 'skill_user',
                    type: 'manyToMany',
                });
            }
            profilerPacketIndex++;
        });
        await User.query({ profiler }).preload('skills');
    });
});
japa_1.default.group('Model | ManyToMany | whereNotPivot', (group) => {
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
    (0, japa_1.default)('add where no clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query.whereNotPivot('username', 'virk').toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereNot('skill_user.username', 'virk')
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add where not clause with operator', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query.whereNotPivot('age', '>', 22).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereNot('skill_user.age', '>', 22)
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add where not clause as a raw query', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .whereNotPivot('age', '>', db.rawQuery('select min_age from ages limit 1;'))
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereNot('skill_user.age', '>', db.connection().getWriteClient().raw('select min_age from ages limit 1;'))
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add orWhereNot clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query.whereNotPivot('age', '>', 22).orWhereNotPivot('age', 18).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereNot('skill_user.age', '>', 22)
            .orWhereNot('skill_user.age', 18)
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
japa_1.default.group('Model | ManyToMany | whereInPivot', (group) => {
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
    (0, japa_1.default)('add whereIn clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query.whereInPivot('username', ['virk', 'nikk']).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereIn('skill_user.username', ['virk', 'nikk'])
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add whereIn as a query callback', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .whereInPivot('username', (builder) => {
            builder.from('accounts');
        })
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereIn('skill_user.username', (builder) => {
            builder.from('accounts');
        })
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add whereIn as a subquery', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .whereInPivot('username', db.query().select('id').from('accounts'))
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereIn('skill_user.username', db.connection().getWriteClient().select('id').from('accounts'))
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add whereIn as a rawquery', async (assert) => {
        const ref = db.connection().getWriteClient().ref.bind(db.connection().getWriteClient());
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .whereInPivot('username', [db.rawQuery(`select ${ref('id')} from ${ref('accounts')}`)])
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereIn('skill_user.username', [
            db
                .connection()
                .getWriteClient()
                .raw(`select ${ref('id')} from ${ref('accounts')}`),
        ])
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add whereIn as a subquery with array of keys', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .whereInPivot(['username', 'email'], db.query().select('username', 'email').from('accounts'))
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereIn(['skill_user.username', 'skill_user.email'], db.connection().getWriteClient().select('username', 'email').from('accounts'))
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add whereIn as a 2d array', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query.whereInPivot(['username', 'email'], [['foo', 'bar']]).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereIn(['skill_user.username', 'skill_user.email'], [['foo', 'bar']])
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add orWhereIn clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .whereInPivot('username', ['virk', 'nikk'])
            .orWhereInPivot('username', ['foo'])
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereIn('skill_user.username', ['virk', 'nikk'])
            .orWhereIn('skill_user.username', ['foo'])
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add orWhereIn as a query callback', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .whereInPivot('username', (builder) => {
            builder.from('accounts');
        })
            .orWhereInPivot('username', (builder) => {
            builder.from('employees');
        })
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereIn('skill_user.username', (builder) => {
            builder.from('accounts');
        })
            .orWhereIn('skill_user.username', (builder) => {
            builder.from('employees');
        })
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
japa_1.default.group('Model | ManyToMany | whereNotInPivot', (group) => {
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
    (0, japa_1.default)('add whereNotIn clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query.whereNotInPivot('username', ['virk', 'nikk']).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereNotIn('skill_user.username', ['virk', 'nikk'])
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add whereNotIn as a query callback', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .whereNotInPivot('username', (builder) => {
            builder.from('accounts');
        })
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereNotIn('skill_user.username', (builder) => {
            builder.from('accounts');
        })
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add whereNotIn as a sub query', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .whereNotInPivot('username', db.query().select('username').from('accounts'))
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereNotIn('skill_user.username', db.connection().getWriteClient().select('username').from('accounts'))
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add whereNotIn as a 2d array', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query.whereNotInPivot(['username', 'email'], [['foo', 'bar']]).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereNotIn(['skill_user.username', 'skill_user.email'], [['foo', 'bar']])
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add orWhereNotIn clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .whereNotInPivot('username', ['virk', 'nikk'])
            .orWhereNotInPivot('username', ['foo'])
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereNotIn('skill_user.username', ['virk', 'nikk'])
            .orWhereNotIn('skill_user.username', ['foo'])
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add orWhereNotIn as a subquery', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .whereNotInPivot('username', (builder) => {
            builder.from('accounts');
        })
            .orWhereNotInPivot('username', (builder) => {
            builder.from('employees');
        })
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereNotIn('skill_user.username', (builder) => {
            builder.from('accounts');
        })
            .orWhereNotIn('skill_user.username', (builder) => {
            builder.from('employees');
        })
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
japa_1.default.group('Model | ManyToMany | whereNullPivot', (group) => {
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
    (0, japa_1.default)('add where null clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query.whereNullPivot('deleted_at').toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereNull('skill_user.deleted_at')
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add where null wrapped clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .where((builder) => builder.whereNullPivot('deleted_at'))['toSQL']();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .where((builder) => builder.whereNull('skill_user.deleted_at'))
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add orWhere null clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .whereNullPivot('deleted_at')
            .orWhereNullPivot('updated_at')
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereNull('skill_user.deleted_at')
            .orWhereNull('skill_user.updated_at')
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add orWhere null wrapped clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .whereNullPivot('deleted_at')
            .orWhere((builder) => {
            builder.whereNullPivot('updated_at');
        })
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereNull('skill_user.deleted_at')
            .orWhere((builder) => {
            builder.whereNull('skill_user.updated_at');
        })
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
japa_1.default.group('Model | ManyToMany | whereNotNullPivot', (group) => {
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
    (0, japa_1.default)('add where not null clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query.whereNotNullPivot('deleted_at').toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereNotNull('skill_user.deleted_at')
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add where not null wrapped clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .where((builder) => builder.whereNotNullPivot('deleted_at'))['toSQL']();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .where((builder) => builder.whereNotNull('skill_user.deleted_at'))
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add orWhere not null clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .whereNotNullPivot('deleted_at')
            .orWhereNotNullPivot('updated_at')
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereNotNull('skill_user.deleted_at')
            .orWhereNotNull('skill_user.updated_at')
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('add orWhere not null wrapped clause', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        User.boot();
        const user = new User();
        const query = user.related('skills').query();
        query['appliedConstraints'] = true;
        const { sql, bindings } = query
            .whereNotNullPivot('deleted_at')
            .orWhere((builder) => {
            builder.whereNotNullPivot('updated_at');
        })
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('skills')
            .whereNotNull('skill_user.deleted_at')
            .orWhere((builder) => {
            builder.whereNotNull('skill_user.updated_at');
        })
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
japa_1.default.group('Model | ManyToMany | save', (group) => {
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
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        await user.related('skills').save(skill);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 1);
        assert.lengthOf(skillUsers, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
    });
    (0, japa_1.default)('save related instance with pivot attributes', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        await user.related('skills').save(skill, true, {
            proficiency: 'Master',
        });
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 1);
        assert.lengthOf(skillUsers, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.equal(skillUsers[0].proficiency, 'Master');
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
    });
    (0, japa_1.default)('do not attach duplicates when save is called more than once', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        await user.related('skills').save(skill);
        await user.related('skills').save(skill);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 1);
        assert.lengthOf(skillUsers, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
    });
    (0, japa_1.default)('perform update with different pivot attributes', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        await user.related('skills').save(skill, true, {
            proficiency: 'Master',
        });
        await user.related('skills').save(skill, true, {
            proficiency: 'Beginner',
        });
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 1);
        assert.lengthOf(skillUsers, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.equal(skillUsers[0].proficiency, 'Beginner');
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
    });
    (0, japa_1.default)('attach duplicates when save is called more than once with with checkExisting = false', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        await user.related('skills').save(skill);
        await user.related('skills').save(skill, false);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 1);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, skill.id);
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
    });
    (0, japa_1.default)('attach duplicates with different pivot attributes and with checkExisting = false', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        await user.related('skills').save(skill, true, {
            proficiency: 'Master',
        });
        await user.related('skills').save(skill, false, {
            proficiency: 'Beginner',
        });
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user').orderBy('id', 'desc');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 1);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.equal(skillUsers[0].proficiency, 'Beginner');
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, skill.id);
        assert.equal(skillUsers[1].proficiency, 'Master');
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
    });
    (0, japa_1.default)('attach when related pivot entry exists but for a different parent @sanityCheck', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const user1 = new User();
        user1.username = 'nikk';
        await user1.save();
        const skill = new Skill();
        skill.name = 'Programming';
        await user.related('skills').save(skill);
        await user1.related('skills').save(skill);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalSkills = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 2);
        assert.equal(totalSkills[0].total, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.equal(skillUsers[1].user_id, user1.id);
        assert.equal(skillUsers[1].skill_id, skill.id);
        assert.isUndefined(user.$trx);
        assert.isUndefined(user1.$trx);
        assert.isUndefined(skill.$trx);
    });
    (0, japa_1.default)('save related instance with timestamps', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, {
                pivotTimestamps: true,
            }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        await user.related('skills').save(skill);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 1);
        assert.lengthOf(skillUsers, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.isNotNull(skillUsers[0].created_at);
        assert.isNotNull(skillUsers[0].updated_at);
        assert.deepEqual(skillUsers[0].created_at, skillUsers[0].updated_at);
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
    });
    (0, japa_1.default)('do not set created_at on update', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, {
                pivotTimestamps: true,
            }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        await user.related('skills').save(skill);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        await sleep(1000);
        await user.related('skills').save(skill, true, {
            proficiency: 'Master',
        });
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 1);
        assert.lengthOf(skillUsers, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.isNotNull(skillUsers[0].created_at);
        assert.isNotNull(skillUsers[0].updated_at);
        assert.notEqual(skillUsers[0].created_at, skillUsers[0].updated_at);
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
    });
    (0, japa_1.default)('do not set updated_at when disabled', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, {
                pivotTimestamps: {
                    createdAt: true,
                    updatedAt: false,
                },
            }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        await user.related('skills').save(skill);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 1);
        assert.lengthOf(skillUsers, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.isNotNull(skillUsers[0].created_at);
        assert.isNull(skillUsers[0].updated_at);
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
    });
    (0, japa_1.default)('do not set created_at when disabled', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, {
                pivotTimestamps: {
                    createdAt: false,
                    updatedAt: true,
                },
            }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        await user.related('skills').save(skill);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 1);
        assert.lengthOf(skillUsers, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.isNull(skillUsers[0].created_at);
        assert.isNotNull(skillUsers[0].updated_at);
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
    });
    (0, japa_1.default)('do not set timestamps when disabled', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        await user.related('skills').save(skill);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 1);
        assert.lengthOf(skillUsers, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.isNull(skillUsers[0].created_at);
        assert.isNull(skillUsers[0].updated_at);
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
    });
});
japa_1.default.group('Model | ManyToMany | saveMany', (group) => {
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
    (0, japa_1.default)('save many of related instance', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        const skill1 = new Skill();
        skill1.name = 'Cooking';
        await user.related('skills').saveMany([skill, skill1]);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 2);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, skill1.id);
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
        assert.isUndefined(skill1.$trx);
    });
    (0, japa_1.default)('save many of related instance with pivot attributes', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        const skill1 = new Skill();
        skill1.name = 'Cooking';
        await user.related('skills').saveMany([skill, skill1], true, [
            {
                proficiency: 'Master',
            },
            {
                proficiency: 'Beginner',
            },
        ]);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 2);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.equal(skillUsers[0].proficiency, 'Master');
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, skill1.id);
        assert.equal(skillUsers[1].proficiency, 'Beginner');
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
        assert.isUndefined(skill1.$trx);
    });
    (0, japa_1.default)('allow pivot rows without custom pivot attributes', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        const skill1 = new Skill();
        skill1.name = 'Cooking';
        await user.related('skills').saveMany([skill, skill1], true, [
            undefined,
            {
                proficiency: 'Beginner',
            },
        ]);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 2);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.isNull(skillUsers[0].proficiency);
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, skill1.id);
        assert.equal(skillUsers[1].proficiency, 'Beginner');
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
        assert.isUndefined(skill1.$trx);
    });
    (0, japa_1.default)('do not attach duplicates when saveMany is called more than once', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        const skill1 = new Skill();
        skill1.name = 'Cooking';
        await user.related('skills').saveMany([skill, skill1]);
        await user.related('skills').saveMany([skill, skill1]);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 2);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, skill1.id);
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
        assert.isUndefined(skill1.$trx);
    });
    (0, japa_1.default)('update pivot row when saveMany is called more than once', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        const skill1 = new Skill();
        skill1.name = 'Cooking';
        await user.related('skills').saveMany([skill, skill1], true, [
            {
                proficiency: 'Master',
            },
            {
                proficiency: 'Beginner',
            },
        ]);
        await user.related('skills').saveMany([skill, skill1], true, [
            {
                proficiency: 'Master',
            },
            {
                proficiency: 'Master',
            },
        ]);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 2);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.equal(skillUsers[0].proficiency, 'Master');
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, skill1.id);
        assert.equal(skillUsers[1].proficiency, 'Master');
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
        assert.isUndefined(skill1.$trx);
    });
    (0, japa_1.default)('attach duplicates when saveMany is called more than once with checkExisting = false', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        const skill1 = new Skill();
        skill1.name = 'Cooking';
        await user.related('skills').saveMany([skill, skill1]);
        await user.related('skills').saveMany([skill, skill1], false);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 2);
        assert.lengthOf(skillUsers, 4);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, skill1.id);
        assert.equal(skillUsers[2].user_id, user.id);
        assert.equal(skillUsers[2].skill_id, skill.id);
        assert.equal(skillUsers[3].user_id, user.id);
        assert.equal(skillUsers[3].skill_id, skill1.id);
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
        assert.isUndefined(skill1.$trx);
    });
    (0, japa_1.default)('attach when related pivot entry exists but for a different parent @sanityCheck', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const user1 = new User();
        user1.username = 'nikk';
        const skill = new Skill();
        skill.name = 'Programming';
        const skill1 = new Skill();
        skill1.name = 'Cooking';
        await user.related('skills').saveMany([skill, skill1]);
        await user1.related('skills').saveMany([skill, skill1]);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        assert.isTrue(user1.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 2);
        assert.equal(totalPosts[0].total, 2);
        assert.lengthOf(skillUsers, 4);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, skill1.id);
        assert.equal(skillUsers[2].user_id, user1.id);
        assert.equal(skillUsers[2].skill_id, skill.id);
        assert.equal(skillUsers[3].user_id, user1.id);
        assert.equal(skillUsers[3].skill_id, skill1.id);
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
        assert.isUndefined(skill1.$trx);
    });
    (0, japa_1.default)('wrap saveMany inside a custom transaction', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const trx = await db.transaction();
        const user = new User();
        user.username = 'virk';
        user.$trx = trx;
        await user.save();
        const user1 = new User();
        user1.$trx = trx;
        user1.username = 'nikk';
        const skill = new Skill();
        skill.name = 'Programming';
        const skill1 = new Skill();
        skill1.name = 'Cooking';
        await user.related('skills').saveMany([skill, skill1]);
        await user1.related('skills').saveMany([skill, skill1]);
        assert.isFalse(user.$trx.isCompleted);
        assert.isFalse(user1.$trx.isCompleted);
        await trx.rollback();
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 0);
        assert.equal(totalPosts[0].total, 0);
        assert.lengthOf(skillUsers, 0);
    });
});
japa_1.default.group('Model | ManyToMany | create', (group) => {
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
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = await user.related('skills').create({ name: 'Programming' });
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 1);
        assert.lengthOf(skillUsers, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
    });
    (0, japa_1.default)('create related instance with pivot attributes', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = await user.related('skills').create({ name: 'Programming' }, {
            proficiency: 'Master',
        });
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 1);
        assert.lengthOf(skillUsers, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.equal(skillUsers[0].proficiency, 'Master');
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
    });
    (0, japa_1.default)('wrap create inside a custom transaction', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const trx = await db.transaction();
        const user = new User();
        user.username = 'virk';
        user.$trx = trx;
        await user.save();
        const skill = await user.related('skills').create({ name: 'Programming' });
        assert.isFalse(user.$trx.isCompleted);
        assert.isFalse(skill.$trx.isCompleted);
        await trx.commit();
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalPosts[0].total, 1);
        assert.lengthOf(skillUsers, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
    });
});
japa_1.default.group('Model | ManyToMany | createMany', (group) => {
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
    (0, japa_1.default)('create many of related instance', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const [skill, skill1] = await user
            .related('skills')
            .createMany([{ name: 'Programming' }, { name: 'Cooking' }]);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        assert.isTrue(skill1.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalSkills = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalSkills[0].total, 2);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, skill1.id);
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
        assert.isUndefined(skill1.$trx);
    });
    (0, japa_1.default)('create many of related instance with pivot attributes', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const [skill, skill1] = await user
            .related('skills')
            .createMany([{ name: 'Programming' }, { name: 'Cooking' }], [{ proficiency: 'Master' }, { proficiency: 'Beginner' }]);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        assert.isTrue(skill1.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalSkills = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalSkills[0].total, 2);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.equal(skillUsers[0].proficiency, 'Master');
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, skill1.id);
        assert.equal(skillUsers[1].proficiency, 'Beginner');
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
        assert.isUndefined(skill1.$trx);
    });
    (0, japa_1.default)('allow pivot entries without custom attributes', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const [skill, skill1] = await user
            .related('skills')
            .createMany([{ name: 'Programming' }, { name: 'Cooking' }], [undefined, { proficiency: 'Beginner' }]);
        assert.isTrue(user.$isPersisted);
        assert.isTrue(skill.$isPersisted);
        assert.isTrue(skill1.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalSkills = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalSkills[0].total, 2);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, skill.id);
        assert.isNull(skillUsers[0].proficiency);
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, skill1.id);
        assert.equal(skillUsers[1].proficiency, 'Beginner');
        assert.isUndefined(user.$trx);
        assert.isUndefined(skill.$trx);
        assert.isUndefined(skill1.$trx);
    });
    (0, japa_1.default)('wrap create many inside a custom transaction', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const trx = await db.transaction();
        const user = new User();
        user.username = 'virk';
        user.$trx = trx;
        await user.save();
        const [skill, skill1] = await user
            .related('skills')
            .createMany([{ name: 'Programming' }, { name: 'Cooking' }]);
        assert.isFalse(user.$trx.isCompleted);
        assert.isFalse(skill.$trx.isCompleted);
        assert.isFalse(skill1.$trx.isCompleted);
        await trx.rollback();
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalPosts = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 0);
        assert.equal(totalPosts[0].total, 0);
        assert.lengthOf(skillUsers, 0);
    });
});
japa_1.default.group('Model | ManyToMany | attach', (group) => {
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
    (0, japa_1.default)('attach one or more ids to the pivot table', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        await user.related('skills').attach([1, 2]);
        assert.isTrue(user.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalSkills = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalSkills[0].total, 0);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, 1);
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, 2);
    });
    (0, japa_1.default)('attach with extra attributes', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        await user.related('skills').attach({
            1: {
                proficiency: 'Beginner',
            },
            2: {
                proficiency: 'Master',
            },
        });
        assert.isTrue(user.$isPersisted);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalSkills = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalSkills[0].total, 0);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, 1);
        assert.equal(skillUsers[0].proficiency, 'Beginner');
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, 2);
        assert.equal(skillUsers[1].proficiency, 'Master');
    });
});
japa_1.default.group('Model | ManyToMany | detach', (group) => {
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
    (0, japa_1.default)('detach one or more ids from the pivot table', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        await db
            .insertQuery()
            .table('skill_user')
            .multiInsert([
            {
                user_id: user.id,
                skill_id: 1,
                proficiency: 'Beginner',
            },
            {
                user_id: user.id,
                skill_id: 2,
                proficiency: 'Beginner',
            },
        ]);
        await user.related('skills').detach([1]);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalSkills = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalSkills[0].total, 0);
        assert.lengthOf(skillUsers, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, 2);
    });
    (0, japa_1.default)('scope detach self to @sanityCheck', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        await db
            .insertQuery()
            .table('skill_user')
            .multiInsert([
            {
                user_id: user.id,
                skill_id: 1,
                proficiency: 'Beginner',
            },
            {
                user_id: 2,
                skill_id: 2,
                proficiency: 'Beginner',
            },
        ]);
        await user.related('skills').detach([2]);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalSkills = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalSkills[0].total, 0);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, 1);
        assert.equal(skillUsers[1].user_id, 2);
        assert.equal(skillUsers[1].skill_id, 2);
    });
});
japa_1.default.group('Model | ManyToMany | sync', (group) => {
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
    (0, japa_1.default)("sync ids by dropping only the missing one's", async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        await db
            .insertQuery()
            .table('skill_user')
            .multiInsert([
            {
                user_id: user.id,
                skill_id: 1,
                proficiency: 'Beginner',
            },
            {
                user_id: user.id,
                skill_id: 2,
                proficiency: 'Master',
            },
            {
                user_id: 2,
                skill_id: 1,
                proficiency: 'Master',
            },
        ]);
        await user.related('skills').sync([1]);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalSkills = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalSkills[0].total, 0);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].id, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, 1);
        assert.equal(skillUsers[1].id, 3);
        assert.equal(skillUsers[1].user_id, 2);
        assert.equal(skillUsers[1].skill_id, 1);
    });
    (0, japa_1.default)('keep duplicates of the id under sync', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        await db
            .insertQuery()
            .table('skill_user')
            .multiInsert([
            {
                user_id: user.id,
                skill_id: 1,
                proficiency: 'Beginner',
            },
            {
                user_id: user.id,
                skill_id: 2,
                proficiency: 'Master',
            },
            {
                user_id: user.id,
                skill_id: 1,
                proficiency: 'Master',
            },
        ]);
        await user.related('skills').sync([1]);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalSkills = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalSkills[0].total, 0);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].id, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, 1);
        assert.equal(skillUsers[1].id, 3);
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, 1);
    });
    (0, japa_1.default)('update pivot rows when additional properties are changed', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        await db
            .insertQuery()
            .table('skill_user')
            .multiInsert([
            {
                user_id: user.id,
                skill_id: 1,
                proficiency: 'Beginner',
            },
            {
                user_id: user.id,
                skill_id: 2,
                proficiency: 'Master',
            },
            {
                user_id: 2,
                skill_id: 1,
                proficiency: 'Master',
            },
        ]);
        await user.related('skills').sync({
            1: {
                proficiency: 'Intermediate',
            },
        });
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalSkills = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user').orderBy('id', 'asc');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalSkills[0].total, 0);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].id, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, 1);
        assert.equal(skillUsers[0].proficiency, 'Intermediate');
        assert.equal(skillUsers[1].id, 3);
        assert.equal(skillUsers[1].user_id, 2);
        assert.equal(skillUsers[1].skill_id, 1);
        assert.equal(skillUsers[1].proficiency, 'Master');
    });
    (0, japa_1.default)('do not update pivot row when no extra properties are defined', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        await db
            .insertQuery()
            .table('skill_user')
            .multiInsert([
            {
                user_id: user.id,
                skill_id: 1,
                proficiency: 'Beginner',
            },
            {
                user_id: user.id,
                skill_id: 2,
                proficiency: 'Master',
            },
            {
                user_id: 2,
                skill_id: 1,
                proficiency: 'Master',
            },
        ]);
        await user.related('skills').sync({ 1: {} });
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalSkills = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalSkills[0].total, 0);
        assert.lengthOf(skillUsers, 2);
        assert.equal(skillUsers[0].id, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, 1);
        assert.equal(skillUsers[0].proficiency, 'Beginner');
        assert.equal(skillUsers[1].id, 3);
        assert.equal(skillUsers[1].user_id, 2);
        assert.equal(skillUsers[1].skill_id, 1);
        assert.equal(skillUsers[1].proficiency, 'Master');
    });
    (0, japa_1.default)('do not remove rows when detach = false', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        await db
            .insertQuery()
            .table('skill_user')
            .multiInsert([
            {
                user_id: user.id,
                skill_id: 1,
                proficiency: 'Beginner',
            },
            {
                user_id: user.id,
                skill_id: 2,
                proficiency: 'Master',
            },
            {
                user_id: 2,
                skill_id: 1,
                proficiency: 'Master',
            },
        ]);
        await user.related('skills').sync([1], false);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalSkills = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalSkills[0].total, 0);
        assert.lengthOf(skillUsers, 3);
        assert.equal(skillUsers[0].id, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, 1);
        assert.equal(skillUsers[0].proficiency, 'Beginner');
        assert.equal(skillUsers[1].id, 2);
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, 2);
        assert.equal(skillUsers[1].proficiency, 'Master');
        assert.equal(skillUsers[2].id, 3);
        assert.equal(skillUsers[2].user_id, 2);
        assert.equal(skillUsers[2].skill_id, 1);
        assert.equal(skillUsers[2].proficiency, 'Master');
    });
    (0, japa_1.default)('do not remove rows when nothing has changed', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        await db
            .insertQuery()
            .table('skill_user')
            .multiInsert([
            {
                user_id: user.id,
                skill_id: 1,
                proficiency: 'Beginner',
            },
            {
                user_id: user.id,
                skill_id: 2,
                proficiency: 'Master',
            },
            {
                user_id: 2,
                skill_id: 1,
                proficiency: 'Master',
            },
        ]);
        await user.related('skills').sync([1, 2]);
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalSkills = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalSkills[0].total, 0);
        assert.lengthOf(skillUsers, 3);
        assert.equal(skillUsers[0].id, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, 1);
        assert.equal(skillUsers[0].proficiency, 'Beginner');
        assert.equal(skillUsers[1].id, 2);
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, 2);
        assert.equal(skillUsers[1].proficiency, 'Master');
        assert.equal(skillUsers[2].id, 3);
        assert.equal(skillUsers[2].user_id, 2);
        assert.equal(skillUsers[2].skill_id, 1);
        assert.equal(skillUsers[2].proficiency, 'Master');
    });
    (0, japa_1.default)('use custom transaction', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        await db
            .insertQuery()
            .table('skill_user')
            .multiInsert([
            {
                user_id: user.id,
                skill_id: 1,
                proficiency: 'Beginner',
            },
            {
                user_id: user.id,
                skill_id: 2,
                proficiency: 'Master',
            },
            {
                user_id: 2,
                skill_id: 1,
                proficiency: 'Master',
            },
        ]);
        const trx = await db.transaction();
        await user.related('skills').sync({
            1: {
                proficiency: 'Intermediate',
            },
            3: {
                proficiency: 'Intermediate',
            },
        }, true, trx);
        await trx.rollback();
        const totalUsers = await db.query().from('users').count('*', 'total');
        const totalSkills = await db.query().from('skills').count('*', 'total');
        const skillUsers = await db.query().from('skill_user');
        assert.equal(totalUsers[0].total, 1);
        assert.equal(totalSkills[0].total, 0);
        assert.lengthOf(skillUsers, 3);
        assert.equal(skillUsers[0].id, 1);
        assert.equal(skillUsers[0].user_id, user.id);
        assert.equal(skillUsers[0].skill_id, 1);
        assert.equal(skillUsers[0].proficiency, 'Beginner');
        assert.equal(skillUsers[1].id, 2);
        assert.equal(skillUsers[1].user_id, user.id);
        assert.equal(skillUsers[1].skill_id, 2);
        assert.equal(skillUsers[1].proficiency, 'Master');
        assert.equal(skillUsers[2].id, 3);
        assert.equal(skillUsers[2].user_id, 2);
        assert.equal(skillUsers[2].skill_id, 1);
        assert.equal(skillUsers[2].proficiency, 'Master');
    });
});
japa_1.default.group('Model | ManyToMany | pagination', (group) => {
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
    (0, japa_1.default)('paginate using related model query builder instance', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }, { name: 'Singing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
        ]);
        const user = await User.find(1);
        const skills = await user.related('skills').query().paginate(1, 1);
        skills.baseUrl('/skills');
        assert.lengthOf(skills.all(), 1);
        assert.instanceOf(skills.all()[0], Skill);
        assert.notProperty(skills.all()[0].$extras, 'total');
        assert.equal(skills.perPage, 1);
        assert.equal(skills.currentPage, 1);
        assert.equal(skills.lastPage, 2);
        assert.isTrue(skills.hasPages);
        assert.isTrue(skills.hasMorePages);
        assert.isFalse(skills.isEmpty);
        assert.equal(skills.total, 2);
        assert.isTrue(skills.hasTotal);
        assert.deepEqual(skills.getMeta(), {
            total: 2,
            per_page: 1,
            current_page: 1,
            last_page: 2,
            first_page: 1,
            first_page_url: '/skills?page=1',
            last_page_url: '/skills?page=2',
            next_page_url: '/skills?page=2',
            previous_page_url: null,
        });
    });
    (0, japa_1.default)('disallow paginate during preload', async (assert) => {
        assert.plan(1);
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }, { name: 'Singing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
        ]);
        try {
            await User.query().preload('skills', (query) => {
                query.paginate(1, 5);
            });
        }
        catch ({ message }) {
            assert.equal(message, 'Cannot paginate relationship "skills" during preload');
        }
    });
});
japa_1.default.group('Model | ManyToMany | clone', (group) => {
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
    (0, japa_1.default)('clone related model query builder', async (assert) => {
        class Skill extends BaseModel {
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
        ], Skill.prototype, "id", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }, { name: 'Singing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
        ]);
        const user = await User.find(1);
        const clonedQuery = user.related('skills').query().clone();
        assert.instanceOf(clonedQuery, QueryBuilder_1.ManyToManyQueryBuilder);
    });
});
japa_1.default.group('Model | ManyToMany | scopes', (group) => {
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
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(Skill, "programmingOnly", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, scope_1.scope)((query) => {
                query.where('name', 'Programming');
            })
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }, { name: 'Singing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
        ]);
        const user = await User.query()
            .preload('skills', (query) => {
            query.apply((scopes) => scopes.programmingOnly());
        })
            .firstOrFail();
        const userWithoutScopes = await User.query().preload('skills').firstOrFail();
        assert.lengthOf(user.skills, 1);
        assert.lengthOf(userWithoutScopes.skills, 2);
        assert.equal(user.skills[0].name, 'Programming');
    });
    (0, japa_1.default)('apply scopes on related query', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        Object.defineProperty(Skill, "programmingOnly", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, scope_1.scope)((query) => {
                query.where('name', 'Programming');
            })
        });
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }, { name: 'Singing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
        ]);
        const user = await User.findOrFail(1);
        const skills = await user
            .related('skills')
            .query()
            .apply((scopes) => scopes.programmingOnly());
        const skillsWithoutScope = await user.related('skills').query();
        assert.lengthOf(skills, 1);
        assert.lengthOf(skillsWithoutScope, 2);
        assert.equal(skills[0].name, 'Programming');
    });
});
japa_1.default.group('Model | ManyToMany | onQuery', (group) => {
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
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, {
                onQuery: (query) => query.where('name', 'Programming'),
            }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }, { name: 'Singing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
        ]);
        const user = await User.query().preload('skills').firstOrFail();
        assert.lengthOf(user.skills, 1);
        assert.equal(user.skills[0].name, 'Programming');
    });
    (0, japa_1.default)('do not invoke onQuery method during preloading subqueries', async (assert) => {
        assert.plan(3);
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, {
                onQuery: (query) => {
                    assert.isTrue(true);
                    query.where('name', 'Programming');
                },
            }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }, { name: 'Singing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
        ]);
        const user = await User.query()
            .preload('skills', (query) => {
            query.where(() => { });
        })
            .firstOrFail();
        assert.lengthOf(user.skills, 1);
        assert.equal(user.skills[0].name, 'Programming');
    });
    (0, japa_1.default)('invoke onQuery method on related query builder', async (assert) => {
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, {
                onQuery: (query) => query.where('name', 'Programming'),
            }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }, { name: 'Singing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
        ]);
        const user = await User.findOrFail(1);
        const skills = await user.related('skills').query();
        assert.lengthOf(skills, 1);
        assert.equal(skills[0].name, 'Programming');
    });
    (0, japa_1.default)('invoke onQuery method on pivot query builder', async (assert) => {
        assert.plan(4);
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill, {
                onQuery: (query) => {
                    assert.isTrue('isPivotOnlyQuery' in query);
                },
            }),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        await db.table('users').insert({ username: 'virk' });
        await db
            .insertQuery()
            .table('skills')
            .insert([{ name: 'Programming' }, { name: 'Dancing' }, { name: 'Singing' }]);
        await db
            .insertQuery()
            .table('skill_user')
            .insert([
            {
                user_id: 1,
                skill_id: 1,
            },
            {
                user_id: 1,
                skill_id: 2,
            },
        ]);
        const user = await User.findOrFail(1);
        const skills = await user.related('skills').pivotQuery();
        assert.lengthOf(skills, 2);
        assert.notInstanceOf(skills[0], Skill);
        assert.notInstanceOf(skills[1], Skill);
    });
});
japa_1.default.group('Model | ManyToMany | delete', (group) => {
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
        class Skill extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Skill.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Skill.prototype, "name", void 0);
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
                Object.defineProperty(this, "skills", {
                    enumerable: true,
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
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const user = new User();
        user.username = 'virk';
        await user.save();
        const skill = new Skill();
        skill.name = 'Programming';
        const skill1 = new Skill();
        skill1.name = 'Dancing';
        await skill.save();
        await user.related('skills').save(skill);
        const { sql, bindings } = user.related('skills').query().del().toSQL();
        const { sql: rawSql, bindings: rawBindings } = db
            .from('skill_user')
            .where('skill_user.user_id', user.id)
            .del()
            .toSQL();
        assert.deepEqual(bindings, rawBindings);
        assert.deepEqual(sql, rawSql);
    });
});
