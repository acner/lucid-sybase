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
japa_1.default.group('Factory | HasMany | make', (group) => {
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
        class Post extends BaseModel {
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
                Object.defineProperty(this, "title", {
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
        ], Post.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Post.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Post.prototype, "title", void 0);
        Post.boot();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        __decorate([
            (0, Decorators_1.hasMany)(() => Post),
            __metadata("design:type", Object)
        ], User.prototype, "posts", void 0);
        const postFactory = new FactoryModel(Post, () => {
            return {
                title: 'Adonis 101',
            };
        }, factoryManager).build();
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .relation('posts', () => postFactory)
            .build();
        const user = await factory.with('posts').makeStubbed();
        assert.isFalse(user.$isPersisted);
        assert.exists(user.id);
        assert.lengthOf(user.posts, 1);
        assert.instanceOf(user.posts[0], Post);
        assert.exists(user.posts[0].id);
        assert.isFalse(user.posts[0].$isPersisted);
        assert.equal(user.posts[0].userId, user.id);
    });
    (0, japa_1.default)('pass custom attributes to relationship', async (assert) => {
        class Post extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "title", {
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
        ], Post.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Post.prototype, "title", void 0);
        Post.boot();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        __decorate([
            (0, Decorators_1.hasMany)(() => Post),
            __metadata("design:type", Object)
        ], User.prototype, "posts", void 0);
        const postFactory = new FactoryModel(Post, () => {
            return {
                title: 'Adonis 101',
            };
        }, factoryManager).build();
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .relation('posts', () => postFactory)
            .build();
        const user = await factory
            .with('posts', 1, (related) => related.merge({ title: 'Lucid 101' }))
            .makeStubbed();
        assert.isFalse(user.$isPersisted);
        assert.lengthOf(user.posts, 1);
        assert.instanceOf(user.posts[0], Post);
        assert.isFalse(user.posts[0].$isPersisted);
        assert.equal(user.posts[0].userId, user.id);
        assert.equal(user.posts[0].title, 'Lucid 101');
    });
    (0, japa_1.default)('make many relationship', async (assert) => {
        class Post extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "title", {
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
        ], Post.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Post.prototype, "title", void 0);
        Post.boot();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        __decorate([
            (0, Decorators_1.hasMany)(() => Post),
            __metadata("design:type", Object)
        ], User.prototype, "posts", void 0);
        const postFactory = new FactoryModel(Post, () => {
            return {
                title: 'Adonis 101',
            };
        }, factoryManager).build();
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .relation('posts', () => postFactory)
            .build();
        const user = await factory
            .with('posts', 2, (related) => related.merge({ title: 'Lucid 101' }))
            .makeStubbed();
        assert.isFalse(user.$isPersisted);
        assert.lengthOf(user.posts, 2);
        assert.instanceOf(user.posts[0], Post);
        assert.isFalse(user.posts[0].$isPersisted);
        assert.isFalse(user.posts[1].$isPersisted);
        assert.equal(user.posts[0].userId, user.id);
        assert.equal(user.posts[1].userId, user.id);
        assert.equal(user.posts[0].title, 'Lucid 101');
        assert.equal(user.posts[1].title, 'Lucid 101');
    });
});
japa_1.default.group('Factory | HasMany | create', (group) => {
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
        class Post extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "title", {
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
        ], Post.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Post.prototype, "title", void 0);
        Post.boot();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        __decorate([
            (0, Decorators_1.hasMany)(() => Post),
            __metadata("design:type", Object)
        ], User.prototype, "posts", void 0);
        const postFactory = new FactoryModel(Post, () => {
            return {
                title: 'Adonis 101',
            };
        }, factoryManager).build();
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .relation('posts', () => postFactory)
            .build();
        const user = await factory.with('posts').create();
        assert.isTrue(user.$isPersisted);
        assert.lengthOf(user.posts, 1);
        assert.instanceOf(user.posts[0], Post);
        assert.isTrue(user.posts[0].$isPersisted);
        assert.equal(user.posts[0].userId, user.id);
        const users = await db.from('users').select('*');
        const posts = await db.from('posts').select('*');
        assert.lengthOf(posts, 1);
        assert.lengthOf(users, 1);
        assert.equal(posts[0].user_id, users[0].id);
    });
    (0, japa_1.default)('pass custom attributes to relationship', async (assert) => {
        class Post extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "title", {
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
        ], Post.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Post.prototype, "title", void 0);
        Post.boot();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        __decorate([
            (0, Decorators_1.hasMany)(() => Post),
            __metadata("design:type", Object)
        ], User.prototype, "posts", void 0);
        const postFactory = new FactoryModel(Post, () => {
            return {
                title: 'Adonis 101',
            };
        }, factoryManager).build();
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .relation('posts', () => postFactory)
            .build();
        const user = await factory
            .with('posts', 1, (related) => related.merge({ title: 'Lucid 101' }))
            .create();
        assert.isTrue(user.$isPersisted);
        assert.lengthOf(user.posts, 1);
        assert.instanceOf(user.posts[0], Post);
        assert.isTrue(user.posts[0].$isPersisted);
        assert.equal(user.posts[0].userId, user.id);
        assert.equal(user.posts[0].title, 'Lucid 101');
    });
    (0, japa_1.default)('create many relationship', async (assert) => {
        class Post extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "title", {
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
        ], Post.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Post.prototype, "title", void 0);
        Post.boot();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        __decorate([
            (0, Decorators_1.hasMany)(() => Post),
            __metadata("design:type", Object)
        ], User.prototype, "posts", void 0);
        const postFactory = new FactoryModel(Post, () => {
            return {
                title: 'Adonis 101',
            };
        }, factoryManager).build();
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .relation('posts', () => postFactory)
            .build();
        const user = await factory
            .with('posts', 2, (related) => related.merge({ title: 'Lucid 101' }))
            .create();
        assert.isTrue(user.$isPersisted);
        assert.lengthOf(user.posts, 2);
        assert.instanceOf(user.posts[0], Post);
        assert.isTrue(user.posts[0].$isPersisted);
        assert.equal(user.posts[0].userId, user.id);
        assert.equal(user.posts[0].title, 'Lucid 101');
        assert.instanceOf(user.posts[1], Post);
        assert.isTrue(user.posts[1].$isPersisted);
        assert.equal(user.posts[1].userId, user.id);
        assert.equal(user.posts[1].title, 'Lucid 101');
    });
    (0, japa_1.default)('create relationship with custom foreign key', async (assert) => {
        class Post extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "authorId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "title", {
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
        ], Post.prototype, "authorId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Post.prototype, "title", void 0);
        Post.boot();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        __decorate([
            (0, Decorators_1.hasMany)(() => Post, { foreignKey: 'authorId' }),
            __metadata("design:type", Object)
        ], User.prototype, "posts", void 0);
        const postFactory = new FactoryModel(Post, () => {
            return {
                title: 'Adonis 101',
            };
        }, factoryManager).build();
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .relation('posts', () => postFactory)
            .build();
        const user = await factory
            .with('posts', 1, (related) => related.merge({ title: 'Lucid 101' }))
            .create();
        assert.isTrue(user.$isPersisted);
        assert.lengthOf(user.posts, 1);
        assert.instanceOf(user.posts[0], Post);
        assert.isTrue(user.posts[0].$isPersisted);
        assert.equal(user.posts[0].authorId, user.id);
        assert.equal(user.posts[0].title, 'Lucid 101');
    });
    (0, japa_1.default)('rollback changes on error', async (assert) => {
        assert.plan(3);
        class Post extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "title", {
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
        ], Post.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Post.prototype, "title", void 0);
        Post.boot();
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "points", void 0);
        __decorate([
            (0, Decorators_1.hasMany)(() => Post),
            __metadata("design:type", Object)
        ], User.prototype, "posts", void 0);
        const postFactory = new FactoryModel(Post, () => {
            return {};
        }, factoryManager).build();
        const factory = new FactoryModel(User, () => {
            return {};
        }, factoryManager)
            .relation('posts', () => postFactory)
            .build();
        try {
            await factory.with('posts').create();
        }
        catch (error) {
            assert.exists(error);
        }
        const users = await db.from('users').exec();
        const posts = await db.from('posts').exec();
        assert.lengthOf(users, 0);
        assert.lengthOf(posts, 0);
    });
});
