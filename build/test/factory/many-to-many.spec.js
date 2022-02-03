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
const index_1 = require("../../src/Factory/index");
const Decorators_1 = require("../../src/Orm/Decorators");
const test_helpers_1 = require("../../test-helpers");
let db;
let app;
let BaseModel;
const FactoryModel = (0, test_helpers_1.getFactoryModel)();
const factoryManager = new index_1.FactoryManager();
japa_1.default.group('Factory | ManyToMany | make', (group) => {
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
    (0, japa_1.default)('make model with relationship', async (assert) => {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        __decorate([
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const postFactory = new FactoryModel(Skill, () => {
            return {
                name: 'Programming',
            };
        }, factoryManager).build();
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .relation('skills', () => postFactory)
            .build();
        const user = await factory.with('skills').makeStubbed();
        assert.exists(user.id);
        assert.isFalse(user.$isPersisted);
        assert.lengthOf(user.skills, 1);
        assert.exists(user.skills[0].id);
        assert.instanceOf(user.skills[0], Skill);
        assert.deepEqual(user.skills[0].$extras, {});
        assert.isFalse(user.skills[0].$isPersisted);
    });
    (0, japa_1.default)('pass custom attributes to relationship', async (assert) => {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        __decorate([
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const postFactory = new FactoryModel(Skill, () => {
            return {
                name: 'Programming',
            };
        }, factoryManager).build();
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .relation('skills', () => postFactory)
            .build();
        const user = await factory
            .with('skills', 1, (related) => {
            related.merge({ name: 'Dancing' });
        })
            .makeStubbed();
        assert.isFalse(user.$isPersisted);
        assert.lengthOf(user.skills, 1);
        assert.instanceOf(user.skills[0], Skill);
        assert.isFalse(user.skills[0].$isPersisted);
        assert.equal(user.skills[0].name, 'Dancing');
    });
    (0, japa_1.default)('make many relationship', async (assert) => {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        __decorate([
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const postFactory = new FactoryModel(Skill, () => {
            return {
                name: 'Programming',
            };
        }, factoryManager).build();
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .relation('skills', () => postFactory)
            .build();
        const user = await factory
            .with('skills', 2, (related) => {
            related.merge({ name: 'Dancing' });
        })
            .makeStubbed();
        assert.isFalse(user.$isPersisted);
        assert.lengthOf(user.skills, 2);
        assert.instanceOf(user.skills[0], Skill);
        assert.isFalse(user.skills[0].$isPersisted);
        assert.equal(user.skills[0].name, 'Dancing');
        assert.instanceOf(user.skills[1], Skill);
        assert.isFalse(user.skills[1].$isPersisted);
        assert.equal(user.skills[1].name, 'Dancing');
    });
});
japa_1.default.group('Factory | ManyToMany | create', (group) => {
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
    (0, japa_1.default)('create model with relationship', async (assert) => {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        __decorate([
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const postFactory = new FactoryModel(Skill, () => {
            return {
                name: 'Programming',
            };
        }, factoryManager).build();
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .relation('skills', () => postFactory)
            .build();
        const user = await factory.with('skills').create();
        assert.isTrue(user.$isPersisted);
        assert.lengthOf(user.skills, 1);
        assert.instanceOf(user.skills[0], Skill);
        assert.isTrue(user.skills[0].$isPersisted);
        const users = await db.from('users').select('*');
        const skills = await db.from('skills').select('*');
        const skillUsers = await db.from('skill_user').select('*');
        assert.lengthOf(skills, 1);
        assert.lengthOf(users, 1);
        assert.equal(skillUsers[0].user_id, users[0].id);
        assert.equal(skillUsers[0].skill_id, skills[0].id);
    });
    (0, japa_1.default)('pass custom attributes', async (assert) => {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        __decorate([
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const postFactory = new FactoryModel(Skill, () => {
            return {
                name: 'Programming',
            };
        }, factoryManager).build();
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .relation('skills', () => postFactory)
            .build();
        const user = await factory
            .with('skills', 1, (related) => related.merge({ name: 'Dancing' }))
            .create();
        assert.isTrue(user.$isPersisted);
        assert.lengthOf(user.skills, 1);
        assert.instanceOf(user.skills[0], Skill);
        assert.isTrue(user.skills[0].$isPersisted);
        assert.equal(user.skills[0].name, 'Dancing');
    });
    (0, japa_1.default)('create many relationships', async (assert) => {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        __decorate([
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const postFactory = new FactoryModel(Skill, () => {
            return {
                name: 'Programming',
            };
        }, factoryManager).build();
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .relation('skills', () => postFactory)
            .build();
        const user = await factory
            .with('skills', 2, (related) => related.merge([{ name: 'Dancing' }, { name: 'Programming' }]))
            .create();
        assert.isTrue(user.$isPersisted);
        assert.lengthOf(user.skills, 2);
        assert.instanceOf(user.skills[0], Skill);
        assert.isTrue(user.skills[0].$isPersisted);
        assert.equal(user.skills[0].name, 'Dancing');
        assert.instanceOf(user.skills[1], Skill);
        assert.isTrue(user.skills[1].$isPersisted);
        assert.equal(user.skills[1].name, 'Programming');
    });
    (0, japa_1.default)('rollback changes on error', async (assert) => {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        __decorate([
            (0, Decorators_1.manyToMany)(() => Skill),
            __metadata("design:type", Object)
        ], User.prototype, "skills", void 0);
        const postFactory = new FactoryModel(Skill, () => {
            return {};
        }, factoryManager).build();
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .relation('skills', () => postFactory)
            .build();
        try {
            await factory.with('skills').create();
        }
        catch (error) {
            assert.exists(error);
        }
        const users = await db.from('users').exec();
        const skills = await db.from('skills').exec();
        const userSkills = await db.from('skill_user').exec();
        assert.lengthOf(users, 0);
        assert.lengthOf(skills, 0);
        assert.lengthOf(userSkills, 0);
    });
});
