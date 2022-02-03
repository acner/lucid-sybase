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
const QueryBuilder_1 = require("../../src/Orm/Relations/HasManyThrough/QueryBuilder");
const test_helpers_1 = require("../../test-helpers");
let db;
let app;
let BaseModel;
japa_1.default.group('Model | Has Many Through | Options', (group) => {
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
            class Post extends BaseModel {
            }
            Post.boot();
            class Country extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "posts", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                }
            }
            __decorate([
                (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
                __metadata("design:type", Object)
            ], Country.prototype, "posts", void 0);
            Country.boot();
            Country.$getRelation('posts').boot();
        }
        catch ({ message }) {
            assert.equal(message, 'E_MISSING_MODEL_ATTRIBUTE: "Country.posts" expects "id" to exist on "Country" model, but is missing');
        }
    });
    (0, japa_1.default)('raise error when foreignKey is missing', (assert) => {
        assert.plan(1);
        try {
            class User extends BaseModel {
            }
            User.boot();
            class Post extends BaseModel {
            }
            Post.boot();
            class Country extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
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
            ], Country.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
                __metadata("design:type", Object)
            ], Country.prototype, "posts", void 0);
            Country.boot();
            Country.$getRelation('posts').boot();
        }
        catch ({ message }) {
            assert.equal(message, 'E_MISSING_MODEL_ATTRIBUTE: "Country.posts" expects "countryId" to exist on "User" model, but is missing');
        }
    });
    (0, japa_1.default)('raise error when through local key is missing', (assert) => {
        assert.plan(1);
        try {
            class User extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "countryId", {
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
            ], User.prototype, "countryId", void 0);
            User.boot();
            class Post extends BaseModel {
            }
            Post.boot();
            class Country extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
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
            ], Country.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
                __metadata("design:type", Object)
            ], Country.prototype, "posts", void 0);
            Country.boot();
            Country.$getRelation('posts').boot();
        }
        catch ({ message }) {
            assert.equal(message, 'E_MISSING_MODEL_ATTRIBUTE: "Country.posts" expects "id" to exist on "User" model, but is missing');
        }
    });
    (0, japa_1.default)('raise error when through foreign key is missing', (assert) => {
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
                    Object.defineProperty(this, "countryId", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
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
            ], User.prototype, "countryId", void 0);
            User.boot();
            class Post extends BaseModel {
            }
            Post.boot();
            class Country extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
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
            ], Country.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
                __metadata("design:type", Object)
            ], Country.prototype, "posts", void 0);
            Country.boot();
            Country.$getRelation('posts').boot();
        }
        catch ({ message }) {
            assert.equal(message, 'E_MISSING_MODEL_ATTRIBUTE: "Country.posts" expects "userId" to exist on "Post" model, but is missing');
        }
    });
    (0, japa_1.default)('compute all required keys', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        const relation = Country.$getRelation('posts');
        relation.boot();
        assert.equal(relation['localKey'], 'id');
        assert.equal(relation['localKeyColumnName'], 'id');
        assert.equal(relation['foreignKey'], 'countryId');
        assert.equal(relation['foreignKeyColumnName'], 'country_id');
        assert.equal(relation['throughLocalKey'], 'id');
        assert.equal(relation['throughLocalKeyColumnName'], 'id');
        assert.equal(relation['throughForeignKey'], 'userId');
        assert.equal(relation['throughForeignKeyColumnName'], 'user_id');
    });
    (0, japa_1.default)('compute custom keys', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "uid", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "countryUid", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "uid", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryUid", void 0);
        User.boot();
        class Post extends BaseModel {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Post.prototype, "userUid", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "uid", {
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
        ], Country.prototype, "uid", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User], {
                throughForeignKey: 'userUid',
                throughLocalKey: 'uid',
                foreignKey: 'countryUid',
                localKey: 'uid',
            }),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        const relation = Country.$getRelation('posts');
        relation.boot();
        assert.equal(relation['localKey'], 'uid');
        assert.equal(relation['localKeyColumnName'], 'uid');
        assert.equal(relation['foreignKey'], 'countryUid');
        assert.equal(relation['foreignKeyColumnName'], 'country_uid');
        assert.equal(relation['throughLocalKey'], 'uid');
        assert.equal(relation['throughLocalKeyColumnName'], 'uid');
        assert.equal(relation['throughForeignKey'], 'userUid');
        assert.equal(relation['throughForeignKeyColumnName'], 'user_uid');
    });
    (0, japa_1.default)('clone relationship instance with options', (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "uid", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "countryUid", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "uid", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryUid", void 0);
        User.boot();
        class Post extends BaseModel {
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
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Post.prototype, "userUid", void 0);
        Post.boot();
        class BaseCountry extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "uid", {
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
        ], BaseCountry.prototype, "uid", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User], {
                throughForeignKey: 'userUid',
                throughLocalKey: 'uid',
                foreignKey: 'countryUid',
                localKey: 'uid',
            }),
            __metadata("design:type", Object)
        ], BaseCountry.prototype, "posts", void 0);
        class Country extends BaseCountry {
        }
        Country.boot();
        const relation = Country.$getRelation('posts');
        relation.boot();
        assert.deepEqual(relation.model, Country);
        assert.equal(relation['localKey'], 'uid');
        assert.equal(relation['localKeyColumnName'], 'uid');
        assert.equal(relation['foreignKey'], 'countryUid');
        assert.equal(relation['foreignKeyColumnName'], 'country_uid');
        assert.equal(relation['throughLocalKey'], 'uid');
        assert.equal(relation['throughLocalKeyColumnName'], 'uid');
        assert.equal(relation['throughForeignKey'], 'userUid');
        assert.equal(relation['throughForeignKeyColumnName'], 'user_uid');
    });
});
japa_1.default.group('Model | Has Many Through | Set Relations', (group) => {
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        Country.$getRelation('posts').boot();
        const country = new Country();
        const post = new Post();
        Country.$getRelation('posts').setRelated(country, [post]);
        assert.deepEqual(country.posts, [post]);
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        Country.$getRelation('posts').boot();
        const country = new Country();
        const post = new Post();
        const post1 = new Post();
        Country.$getRelation('posts').setRelated(country, [post]);
        Country.$getRelation('posts').pushRelated(country, [post1]);
        assert.deepEqual(country.posts, [post, post1]);
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        Country.$getRelation('posts').boot();
        const country = new Country();
        country.fill({ id: 1 });
        const country1 = new Country();
        country1.fill({ id: 2 });
        const country2 = new Country();
        country2.fill({ id: 3 });
        const post = new Post();
        post.fill({ userId: 1 });
        post.$extras = {
            through_country_id: 1,
        };
        const post1 = new Post();
        post1.fill({ userId: 2 });
        post1.$extras = {
            through_country_id: 2,
        };
        const post2 = new Post();
        post2.fill({ userId: 3 });
        post2.$extras = {
            through_country_id: 1,
        };
        Country.$getRelation('posts').setRelatedForMany([country, country1, country2], [post, post1, post2]);
        assert.deepEqual(country.posts, [post, post2]);
        assert.deepEqual(country1.posts, [post1]);
        assert.deepEqual(country2.posts, []);
    });
});
japa_1.default.group('Model | Has Many Through | bulk operations', (group) => {
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db.table('countries').insert({ name: 'India' });
        const country = await Country.find(1);
        const { sql, bindings } = country.related('posts').query().toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('posts')
            .select('posts.*', 'users.country_id as through_country_id')
            .innerJoin('users', 'users.id', 'posts.user_id')
            .where('users.country_id', 1)
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db.table('countries').multiInsert([{ name: 'India' }, { name: 'UK' }]);
        const countries = await Country.all();
        Country.$getRelation('posts').boot();
        const query = Country.$getRelation('posts').eagerQuery(countries, db.connection());
        const { sql, bindings } = query.toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('posts')
            .select('posts.*', 'users.country_id as through_country_id')
            .innerJoin('users', 'users.id', 'posts.user_id')
            .whereIn('users.country_id', [2, 1])
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('generate correct sql for updating related rows', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db.table('countries').insert({ name: 'India' });
        const country = await Country.find(1);
        const now = new Date();
        const { sql, bindings } = country
            .related('posts')
            .query()
            .update({
            updated_at: now,
        })
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('posts')
            .update({ updated_at: now })
            .whereIn('posts.user_id', (builder) => {
            builder.from('users').where('users.country_id', 1);
        })
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('generate correct sql for deleting related rows', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db.table('countries').insert({ name: 'India' });
        const country = await Country.find(1);
        const { sql, bindings } = country.related('posts').query().del().toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .getWriteClient()
            .from('posts')
            .del()
            .whereIn('posts.user_id', (builder) => {
            builder.from('users').where('users.country_id', 1);
        })
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
japa_1.default.group('Model | HasMany | sub queries', (group) => {
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
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        Country.$getRelation('posts').boot();
        const { sql, bindings } = Country.$getRelation('posts').subQuery(db.connection()).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('posts')
            .innerJoin('users', 'users.id', 'posts.user_id')
            .where('countries.id', '=', db.connection().getReadClient().ref('users.country_id'))
            .toSQL();
        assert.deepEqual(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('create aggregate query', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        Country.$getRelation('posts').boot();
        const { sql, bindings } = Country.$getRelation('posts')
            .subQuery(db.connection())
            .count('* as total')
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('posts')
            .count('* as total')
            .innerJoin('users', 'users.id', 'posts.user_id')
            .where('countries.id', '=', db.connection().getReadClient().ref('users.country_id'))
            .toSQL();
        assert.deepEqual(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('allow selecting custom columns', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        Country.$getRelation('posts').boot();
        const { sql, bindings } = Country.$getRelation('posts')
            .subQuery(db.connection())
            .select('title', 'is_published')
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('posts')
            .select('posts.title', 'posts.is_published')
            .innerJoin('users', 'users.id', 'posts.user_id')
            .where('countries.id', '=', db.connection().getReadClient().ref('users.country_id'))
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Country extends BaseModel {
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
                /**
                 * Funny relationship, but just ignore it
                 */
                Object.defineProperty(this, "countries", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Country.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Country, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "countries", void 0);
        Country.boot();
        Country.$getRelation('countries').boot();
        const { sql, bindings } = Country.$getRelation('countries')
            .subQuery(db.connection())
            .select('name')
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('countries as adonis_temp_0')
            .select('adonis_temp_0.name')
            .innerJoin('users', 'users.id', 'adonis_temp_0.user_id')
            .where('countries.id', '=', db.connection().getReadClient().ref('users.country_id'))
            .toSQL();
        assert.deepEqual(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
    (0, japa_1.default)('raise exception when trying to execute the query', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        Country.$getRelation('posts').boot();
        const exec = () => Country.$getRelation('posts').subQuery(db.connection())['exec']();
        const paginate = () => Country.$getRelation('posts').subQuery(db.connection())['paginate'](1);
        const update = () => Country.$getRelation('posts').subQuery(db.connection())['update']({});
        const del = () => Country.$getRelation('posts').subQuery(db.connection())['del']();
        const first = () => Country.$getRelation('posts').subQuery(db.connection())['first']();
        const firstOrFail = () => Country.$getRelation('posts').subQuery(db.connection())['firstOrFail']();
        assert.throw(exec, 'Cannot execute relationship subqueries');
        assert.throw(paginate, 'Cannot execute relationship subqueries');
        assert.throw(update, 'Cannot execute relationship subqueries');
        assert.throw(del, 'Cannot execute relationship subqueries');
        assert.throw(first, 'Cannot execute relationship subqueries');
        assert.throw(firstOrFail, 'Cannot execute relationship subqueries');
    });
    (0, japa_1.default)('run onQuery method when defined', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "userId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "isPublished", {
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
            __metadata("design:type", Boolean)
        ], Post.prototype, "isPublished", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User], {
                onQuery: (query) => query.where('isPublished', true),
            }),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        Country.$getRelation('posts').boot();
        const { sql, bindings } = Country.$getRelation('posts').subQuery(db.connection()).toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .knexQuery()
            .from('posts')
            .innerJoin('users', 'users.id', 'posts.user_id')
            .where('is_published', true)
            .where('countries.id', '=', db.connection().getReadClient().ref('users.country_id'))
            .toSQL();
        assert.deepEqual(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
japa_1.default.group('Model | Has Many Through | aggregates', (group) => {
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
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db.table('countries').insert({ name: 'India' });
        await db.table('users').insert({
            username: 'virk',
            country_id: 1,
        });
        await db.table('posts').multiInsert([
            {
                user_id: 1,
                title: 'Adonis 101',
            },
            {
                user_id: 1,
                title: 'Lucid 101',
            },
            {
                user_id: 2,
                title: 'Profiler 101',
            },
        ]);
        const country = await Country.find(1);
        const total = await country.related('posts').query().count('* as total');
        assert.deepEqual(Number(total[0].$extras.total), 2);
    });
    (0, japa_1.default)('select extra columns with count', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db.table('countries').insert({ name: 'India' });
        await db.table('users').insert({
            username: 'virk',
            country_id: 1,
        });
        await db.table('posts').multiInsert([
            {
                user_id: 1,
                title: 'Adonis 101',
            },
            {
                user_id: 1,
                title: 'Lucid 101',
            },
            {
                user_id: 2,
                title: 'Profiler 101',
            },
        ]);
        const country = await Country.find(1);
        const total = await country
            .related('posts')
            .query()
            .select('title')
            .groupBy('posts.title')
            .count('* as total');
        assert.lengthOf(total, 2);
        assert.deepEqual(Number(total[0].$extras.total), 1);
        assert.equal(total[0].$extras.title, 'Adonis 101');
        assert.deepEqual(Number(total[0].$extras.total), 1);
        assert.equal(total[1].$extras.title, 'Lucid 101');
    });
});
japa_1.default.group('Model | Has Many Through | preload', (group) => {
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
    (0, japa_1.default)('preload through relationships', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }]);
        await db
            .insertQuery()
            .table('users')
            .insert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 1 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .insert([
            { title: 'Adonis 101', user_id: 1 },
            { title: 'Lucid 101', user_id: 1 },
            { title: 'Adonis5', user_id: 2 },
        ]);
        const countries = await Country.query().preload('posts');
        assert.lengthOf(countries, 1);
        assert.lengthOf(countries[0].posts, 3);
        assert.equal(countries[0].posts[0].title, 'Adonis 101');
        assert.equal(countries[0].posts[0].$extras.through_country_id, 1);
        assert.equal(countries[0].posts[1].title, 'Lucid 101');
        assert.equal(countries[0].posts[1].$extras.through_country_id, 1);
        assert.equal(countries[0].posts[2].title, 'Adonis5');
        assert.equal(countries[0].posts[2].$extras.through_country_id, 1);
    });
    (0, japa_1.default)('preload many relationships', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }, { name: 'USA' }]);
        await db
            .insertQuery()
            .table('users')
            .insert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 2 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .insert([
            { title: 'Adonis 101', user_id: 1 },
            { title: 'Lucid 101', user_id: 1 },
            { title: 'Adonis5', user_id: 2 },
        ]);
        const countries = await Country.query().preload('posts');
        assert.lengthOf(countries, 2);
        assert.lengthOf(countries[0].posts, 2);
        assert.lengthOf(countries[1].posts, 1);
        assert.equal(countries[0].posts[0].title, 'Adonis 101');
        assert.equal(countries[0].posts[0].$extras.through_country_id, 1);
        assert.equal(countries[0].posts[1].title, 'Lucid 101');
        assert.equal(countries[0].posts[1].$extras.through_country_id, 1);
        assert.equal(countries[1].posts[0].title, 'Adonis5');
        assert.equal(countries[1].posts[0].$extras.through_country_id, 2);
    });
    (0, japa_1.default)('preload many relationships using model instance', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }, { name: 'USA' }]);
        await db
            .insertQuery()
            .table('users')
            .insert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 2 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .insert([
            { title: 'Adonis 101', user_id: 1 },
            { title: 'Lucid 101', user_id: 1 },
            { title: 'Adonis5', user_id: 2 },
        ]);
        const countries = await Country.query().orderBy('id', 'asc');
        assert.lengthOf(countries, 2);
        await countries[0].load('posts');
        await countries[1].load('posts');
        assert.lengthOf(countries[0].posts, 2);
        assert.lengthOf(countries[1].posts, 1);
        assert.equal(countries[0].posts[0].title, 'Adonis 101');
        assert.equal(countries[0].posts[0].$extras.through_country_id, 1);
        assert.equal(countries[0].posts[1].title, 'Lucid 101');
        assert.equal(countries[0].posts[1].$extras.through_country_id, 1);
        assert.equal(countries[1].posts[0].title, 'Adonis5');
        assert.equal(countries[1].posts[0].$extras.through_country_id, 2);
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }, { name: 'USA' }]);
        await db
            .insertQuery()
            .table('users')
            .insert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 2 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .insert([
            { title: 'Adonis 101', user_id: 1 },
            { title: 'Lucid 101', user_id: 1 },
            { title: 'Adonis5', user_id: 2 },
        ]);
        const countries = await Country.query().preload('posts', (builder) => {
            builder.select('title');
        });
        assert.lengthOf(countries, 2);
        assert.lengthOf(countries[0].posts, 2);
        assert.lengthOf(countries[1].posts, 1);
        assert.equal(countries[0].posts[0].title, 'Adonis 101');
        assert.deepEqual(countries[0].posts[0].$extras, { through_country_id: 1 });
        assert.equal(countries[0].posts[1].title, 'Lucid 101');
        assert.deepEqual(countries[0].posts[1].$extras, { through_country_id: 1 });
        assert.equal(countries[1].posts[0].title, 'Adonis5');
        assert.deepEqual(countries[1].posts[0].$extras, { through_country_id: 2 });
    });
    (0, japa_1.default)('raise error when local key is not selected', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }, { name: 'USA' }]);
        await db
            .insertQuery()
            .table('users')
            .insert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 2 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .insert([
            { title: 'Adonis 101', user_id: 1 },
            { title: 'Lucid 101', user_id: 1 },
            { title: 'Adonis5', user_id: 2 },
        ]);
        try {
            await Country.query().select('name').preload('posts');
        }
        catch ({ message }) {
            assert.equal(message, 'Cannot preload "posts", value of "Country.id" is undefined');
        }
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }]);
        await db
            .insertQuery()
            .table('users')
            .insert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 1 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .insert([
            { title: 'Adonis 101', user_id: 1 },
            { title: 'Lucid 101', user_id: 1 },
            { title: 'Adonis5', user_id: 2 },
        ]);
        const profiler = app.profiler;
        let profilerPacketIndex = 0;
        profiler.process((packet) => {
            if (profilerPacketIndex === 1) {
                assert.deepEqual(packet.data.relation, {
                    model: 'Country',
                    relatedModel: 'Post',
                    throughModel: 'User',
                    type: 'hasManyThrough',
                });
            }
            profilerPacketIndex++;
        });
        await Country.query({ profiler }).preload('posts');
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        const countries = await Country.query().preload('posts', () => {
            throw new Error('not expected to be here');
        });
        assert.lengthOf(countries, 0);
    });
});
japa_1.default.group('Model | Has Many Through | withCount', (group) => {
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db
            .insertQuery()
            .table('users')
            .multiInsert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 1 },
            { username: 'romain', country_id: 2 },
            { username: 'joe', country_id: 2 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .multiInsert([
            { title: 'Adonis 101', user_id: 1 },
            { title: 'Lucid 101', user_id: 1 },
            { title: 'Adonis5', user_id: 2 },
            { title: 'Validations 101', user_id: 3 },
            { title: 'Assets 101', user_id: 4 },
        ]);
        const countries = await Country.query().withCount('posts').orderBy('id', 'asc');
        assert.lengthOf(countries, 2);
        assert.equal(countries[0].$extras.posts_count, 3);
        assert.equal(countries[1].$extras.posts_count, 2);
    });
    (0, japa_1.default)('apply constraints to the withCount subquery', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db
            .insertQuery()
            .table('users')
            .multiInsert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 1 },
            { username: 'romain', country_id: 2 },
            { username: 'joe', country_id: 2 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .multiInsert([
            { title: 'Adonis 101', user_id: 1 },
            { title: 'Lucid 101', user_id: 1 },
            { title: 'Adonis5', user_id: 2 },
            { title: 'Validations 101', user_id: 3 },
            { title: 'Assets 101', user_id: 4 },
        ]);
        const countries = await Country.query()
            .withCount('posts', (query) => {
            query.whereIn('title', ['Adonis 101', 'Assets 101']);
        })
            .orderBy('id', 'asc');
        assert.lengthOf(countries, 2);
        assert.equal(countries[0].$extras.posts_count, 1);
        assert.equal(countries[1].$extras.posts_count, 1);
    });
    (0, japa_1.default)('allow subquery to have custom aggregates', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db
            .insertQuery()
            .table('users')
            .multiInsert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 1 },
            { username: 'romain', country_id: 2 },
            { username: 'joe', country_id: 2 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .multiInsert([
            { title: 'Adonis 101', user_id: 1 },
            { title: 'Lucid 101', user_id: 1 },
            { title: 'Adonis5', user_id: 2 },
            { title: 'Validations 101', user_id: 3 },
            { title: 'Assets 101', user_id: 4 },
        ]);
        const countries = await Country.query()
            .withAggregate('posts', (query) => {
            query.countDistinct('posts.user_id').as('postsCount');
        })
            .orderBy('id', 'asc');
        assert.lengthOf(countries, 2);
        assert.equal(countries[0].$extras.postsCount, 2);
        assert.equal(countries[1].$extras.postsCount, 2);
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Country.prototype, "name", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db
            .insertQuery()
            .table('users')
            .multiInsert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 1 },
            { username: 'romain', country_id: 2 },
            { username: 'joe', country_id: 2 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .multiInsert([
            { title: 'Adonis 101', user_id: 1 },
            { title: 'Lucid 101', user_id: 1 },
            { title: 'Adonis5', user_id: 2 },
            { title: 'Validations 101', user_id: 3 },
            { title: 'Assets 101', user_id: 4 },
        ]);
        const countries = await Country.query().select('name').withCount('posts').orderBy('id', 'asc');
        assert.lengthOf(countries, 2);
        assert.deepEqual(countries[0].$attributes, { name: 'India' });
        assert.deepEqual(countries[1].$attributes, { name: 'Switzerland' });
    });
    (0, japa_1.default)('define custom alias for the count', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Country.prototype, "name", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db
            .insertQuery()
            .table('users')
            .multiInsert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 1 },
            { username: 'romain', country_id: 2 },
            { username: 'joe', country_id: 2 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .multiInsert([
            { title: 'Adonis 101', user_id: 1 },
            { title: 'Lucid 101', user_id: 1 },
            { title: 'Adonis5', user_id: 2 },
            { title: 'Validations 101', user_id: 3 },
            { title: 'Assets 101', user_id: 4 },
        ]);
        const countries = await Country.query()
            .select('name')
            .withCount('posts', (query) => {
            query.as('countryPosts');
        })
            .orderBy('id', 'asc');
        assert.lengthOf(countries, 2);
        assert.deepEqual(Number(countries[0].$extras.countryPosts), 3);
        assert.deepEqual(Number(countries[1].$extras.countryPosts), 2);
    });
    (0, japa_1.default)('lazy load relationship rows', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }]);
        await db
            .insertQuery()
            .table('users')
            .multiInsert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 1 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .multiInsert([
            { title: 'Adonis 101', user_id: 1 },
            { title: 'Lucid 101', user_id: 1 },
            { title: 'Adonis5', user_id: 2 },
            { title: 'Validations 101', user_id: 3 },
            { title: 'Assets 101', user_id: 4 },
        ]);
        const country = await Country.query().orderBy('id', 'asc').firstOrFail();
        await country.loadCount('posts');
        assert.equal(Number(country.$extras.posts_count), 3);
    });
    (0, japa_1.default)('apply constraints to the loadCount subquery', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db
            .insertQuery()
            .table('users')
            .multiInsert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 1 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .multiInsert([
            { title: 'Adonis 101', user_id: 1 },
            { title: 'Lucid 101', user_id: 1 },
            { title: 'Adonis5', user_id: 2 },
            { title: 'Validations 101', user_id: 3 },
            { title: 'Assets 101', user_id: 4 },
        ]);
        const country = await Country.query().orderBy('id', 'asc').firstOrFail();
        await country.loadCount('posts', (query) => {
            query.whereIn('title', ['Adonis 101', 'Assets 101']);
        });
        assert.equal(country.$extras.posts_count, 1);
    });
});
japa_1.default.group('Model | Has Many Through | has', (group) => {
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Country.prototype, "name", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db
            .insertQuery()
            .table('users')
            .multiInsert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 1 },
            { username: 'romain', country_id: 2 },
            { username: 'joe', country_id: 2 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .multiInsert([
            { title: 'Adonis 101', user_id: 1 },
            { title: 'Lucid 101', user_id: 1 },
            { title: 'Adonis5', user_id: 2 },
        ]);
        const countries = await Country.query().has('posts').orderBy('id', 'asc');
        assert.lengthOf(countries, 1);
        assert.equal(countries[0].name, 'India');
    });
    (0, japa_1.default)('define expected number of rows', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Country.prototype, "name", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db
            .insertQuery()
            .table('users')
            .multiInsert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 1 },
            { username: 'romain', country_id: 2 },
            { username: 'joe', country_id: 2 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .multiInsert([
            { title: 'Adonis 101', user_id: 1 },
            { title: 'Lucid 101', user_id: 1 },
            { title: 'Adonis5', user_id: 2 },
            { title: 'Validations 101', user_id: 3 },
            { title: 'Assets 101', user_id: 4 },
        ]);
        const countries = await Country.query().has('posts', '>', 2).orderBy('id', 'asc');
        assert.lengthOf(countries, 1);
        assert.equal(countries[0].name, 'India');
    });
});
japa_1.default.group('Model | Has Many Through | whereHas', (group) => {
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Country.prototype, "name", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db
            .insertQuery()
            .table('users')
            .multiInsert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 1 },
            { username: 'romain', country_id: 2 },
            { username: 'joe', country_id: 2 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .multiInsert([
            { title: 'Adonis 101', user_id: 1, is_published: false },
            { title: 'Lucid 101', user_id: 1, is_published: true },
            { title: 'Adonis5', user_id: 2, is_published: true },
            { title: 'Validations 101', user_id: 3, is_published: false },
            { title: 'Assets 101', user_id: 4, is_published: false },
        ]);
        const countries = await Country.query()
            .whereHas('posts', (query) => {
            query.where('is_published', true);
        })
            .orderBy('id', 'asc');
        assert.lengthOf(countries, 1);
        assert.equal(countries[0].name, 'India');
    });
    (0, japa_1.default)('define expected number of rows', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
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
            (0, Decorators_1.column)({ isPrimary: true }),
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
        class Country extends BaseModel {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Country.prototype, "name", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db
            .insertQuery()
            .table('countries')
            .insert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db
            .insertQuery()
            .table('users')
            .multiInsert([
            { username: 'virk', country_id: 1 },
            { username: 'nikk', country_id: 1 },
            { username: 'romain', country_id: 2 },
            { username: 'joe', country_id: 2 },
        ]);
        await db
            .insertQuery()
            .table('posts')
            .multiInsert([
            { title: 'Adonis 101', user_id: 1, is_published: false },
            { title: 'Lucid 101', user_id: 1, is_published: true },
            { title: 'Adonis5', user_id: 2, is_published: true },
            { title: 'Validations 101', user_id: 3, is_published: true },
            { title: 'Assets 101', user_id: 4, is_published: false },
        ]);
        const countries = await Country.query()
            .whereHas('posts', (query) => {
            query.where('is_published', true);
        }, '>', 1)
            .orderBy('id', 'asc');
        assert.lengthOf(countries, 1);
        assert.equal(countries[0].name, 'India');
    });
});
if (process.env.DB !== 'mysql_legacy') {
    japa_1.default.group('Model | Has Many Through | Group Limit', (group) => {
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
            class User extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
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
                }
            }
            __decorate([
                (0, Decorators_1.column)({ isPrimary: true }),
                __metadata("design:type", Number)
            ], User.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", Number)
            ], User.prototype, "countryId", void 0);
            User.boot();
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
                (0, Decorators_1.column)({ isPrimary: true }),
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
            class Country extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
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
            ], Country.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
                __metadata("design:type", Object)
            ], Country.prototype, "posts", void 0);
            Country.boot();
            await db
                .insertQuery()
                .table('countries')
                .insert([{ name: 'India' }, { name: 'Switzerland' }]);
            await db
                .insertQuery()
                .table('users')
                .insert([
                { username: 'virk', country_id: 1 },
                { username: 'nikk', country_id: 1 },
                { username: 'romain', country_id: 2 },
            ]);
            /**
             * Country 1 posts
             */
            await db
                .insertQuery()
                .table('posts')
                .insert([
                { title: 'Adonis 101', user_id: 1 },
                { title: 'Adonis 102', user_id: 1 },
                { title: 'Adonis 103', user_id: 2 },
                { title: 'Adonis 104', user_id: 2 },
                { title: 'Adonis 105', user_id: 1 },
            ]);
            /**
             * Country 2 posts
             */
            await db
                .insertQuery()
                .table('posts')
                .insert([
                { title: 'Lucid 101', user_id: 3 },
                { title: 'Lucid 102', user_id: 3 },
                { title: 'Lucid 103', user_id: 3 },
                { title: 'Lucid 104', user_id: 3 },
                { title: 'Lucid 105', user_id: 3 },
            ]);
            const countries = await Country.query().preload('posts', (query) => query.groupLimit(2));
            assert.lengthOf(countries, 2);
            assert.lengthOf(countries[0].posts, 2);
            assert.equal(countries[0].posts[0].title, 'Adonis 105');
            assert.equal(countries[0].posts[0].$extras.through_country_id, 1);
            assert.equal(countries[0].posts[1].title, 'Adonis 104');
            assert.equal(countries[0].posts[1].$extras.through_country_id, 1);
            assert.lengthOf(countries[1].posts, 2);
            assert.equal(countries[1].posts[0].title, 'Lucid 105');
            assert.equal(countries[1].posts[0].$extras.through_country_id, 2);
            assert.equal(countries[1].posts[1].title, 'Lucid 104');
            assert.equal(countries[1].posts[1].$extras.through_country_id, 2);
        });
        (0, japa_1.default)('apply group limit with custom constraints', async (assert) => {
            class User extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
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
                }
            }
            __decorate([
                (0, Decorators_1.column)({ isPrimary: true }),
                __metadata("design:type", Number)
            ], User.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", Number)
            ], User.prototype, "countryId", void 0);
            User.boot();
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
                (0, Decorators_1.column)({ isPrimary: true }),
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
            class Country extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
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
            ], Country.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
                __metadata("design:type", Object)
            ], Country.prototype, "posts", void 0);
            Country.boot();
            await db
                .insertQuery()
                .table('countries')
                .insert([{ name: 'India' }, { name: 'Switzerland' }]);
            await db
                .insertQuery()
                .table('users')
                .insert([
                { username: 'virk', country_id: 1 },
                { username: 'nikk', country_id: 1 },
                { username: 'romain', country_id: 2 },
            ]);
            /**
             * Country 1 posts
             */
            await db
                .insertQuery()
                .table('posts')
                .insert([
                { title: 'Adonis 101', user_id: 1, created_at: new Date() },
                { title: 'Adonis 102', user_id: 1 },
                { title: 'Adonis 103', user_id: 2 },
                { title: 'Adonis 104', user_id: 2, created_at: new Date() },
                { title: 'Adonis 105', user_id: 1 },
            ]);
            /**
             * Country 2 posts
             */
            await db
                .insertQuery()
                .table('posts')
                .insert([
                { title: 'Lucid 101', user_id: 3 },
                { title: 'Lucid 102', user_id: 3, created_at: new Date() },
                { title: 'Lucid 103', user_id: 3, created_at: new Date() },
                { title: 'Lucid 104', user_id: 3 },
                { title: 'Lucid 105', user_id: 3, created_at: new Date() },
            ]);
            const countries = await Country.query().preload('posts', (query) => {
                query.groupLimit(2).whereNotNull('posts.created_at');
            });
            assert.lengthOf(countries, 2);
            assert.lengthOf(countries[0].posts, 2);
            assert.equal(countries[0].posts[0].title, 'Adonis 104');
            assert.equal(countries[0].posts[0].$extras.through_country_id, 1);
            assert.equal(countries[0].posts[1].title, 'Adonis 101');
            assert.equal(countries[0].posts[1].$extras.through_country_id, 1);
            assert.lengthOf(countries[1].posts, 2);
            assert.equal(countries[1].posts[0].title, 'Lucid 105');
            assert.equal(countries[1].posts[0].$extras.through_country_id, 2);
            assert.equal(countries[1].posts[1].title, 'Lucid 103');
            assert.equal(countries[1].posts[1].$extras.through_country_id, 2);
        });
        (0, japa_1.default)('apply group limit and cherry pick fields', async (assert) => {
            class User extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
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
                }
            }
            __decorate([
                (0, Decorators_1.column)({ isPrimary: true }),
                __metadata("design:type", Number)
            ], User.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", Number)
            ], User.prototype, "countryId", void 0);
            User.boot();
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
            ], Post.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", Number)
            ], Post.prototype, "userId", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", String)
            ], Post.prototype, "title", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", Date)
            ], Post.prototype, "createdAt", void 0);
            Post.boot();
            class Country extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
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
            ], Country.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
                __metadata("design:type", Object)
            ], Country.prototype, "posts", void 0);
            Country.boot();
            await db
                .insertQuery()
                .table('countries')
                .insert([{ name: 'India' }, { name: 'Switzerland' }]);
            await db
                .insertQuery()
                .table('users')
                .insert([
                { username: 'virk', country_id: 1 },
                { username: 'nikk', country_id: 1 },
                { username: 'romain', country_id: 2 },
            ]);
            /**
             * Country 1 posts
             */
            await db
                .insertQuery()
                .table('posts')
                .insert([
                { title: 'Adonis 101', user_id: 1, created_at: new Date() },
                { title: 'Adonis 102', user_id: 1 },
                { title: 'Adonis 103', user_id: 2 },
                { title: 'Adonis 104', user_id: 2, created_at: new Date() },
                { title: 'Adonis 105', user_id: 1 },
            ]);
            /**
             * Country 2 posts
             */
            await db
                .insertQuery()
                .table('posts')
                .insert([
                { title: 'Lucid 101', user_id: 3 },
                { title: 'Lucid 102', user_id: 3, created_at: new Date() },
                { title: 'Lucid 103', user_id: 3, created_at: new Date() },
                { title: 'Lucid 104', user_id: 3 },
                { title: 'Lucid 105', user_id: 3, created_at: new Date() },
            ]);
            const countries = await Country.query().preload('posts', (query) => {
                query.groupLimit(2).select('title');
            });
            assert.lengthOf(countries, 2);
            assert.lengthOf(countries[0].posts, 2);
            assert.equal(countries[0].posts[0].title, 'Adonis 105');
            assert.isUndefined(countries[0].posts[0].createdAt);
            assert.equal(countries[0].posts[0].$extras.through_country_id, 1);
            assert.equal(countries[0].posts[1].title, 'Adonis 104');
            assert.isUndefined(countries[0].posts[1].createdAt);
            assert.equal(countries[0].posts[1].$extras.through_country_id, 1);
            assert.lengthOf(countries[1].posts, 2);
            assert.equal(countries[1].posts[0].title, 'Lucid 105');
            assert.isUndefined(countries[1].posts[0].createdAt);
            assert.equal(countries[1].posts[0].$extras.through_country_id, 2);
            assert.equal(countries[1].posts[1].title, 'Lucid 104');
            assert.isUndefined(countries[1].posts[1].createdAt);
            assert.equal(countries[1].posts[1].$extras.through_country_id, 2);
        });
        (0, japa_1.default)('apply group limit with custom order', async (assert) => {
            class User extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
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
                }
            }
            __decorate([
                (0, Decorators_1.column)({ isPrimary: true }),
                __metadata("design:type", Number)
            ], User.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", Number)
            ], User.prototype, "countryId", void 0);
            User.boot();
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
            ], Post.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", Number)
            ], Post.prototype, "userId", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", String)
            ], Post.prototype, "title", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", Date)
            ], Post.prototype, "createdAt", void 0);
            Post.boot();
            class Country extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
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
            ], Country.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
                __metadata("design:type", Object)
            ], Country.prototype, "posts", void 0);
            Country.boot();
            await db
                .insertQuery()
                .table('countries')
                .insert([{ name: 'India' }, { name: 'Switzerland' }]);
            await db
                .insertQuery()
                .table('users')
                .insert([
                { username: 'virk', country_id: 1 },
                { username: 'nikk', country_id: 1 },
                { username: 'romain', country_id: 2 },
            ]);
            /**
             * Country 1 posts
             */
            await db
                .insertQuery()
                .table('posts')
                .insert([
                { title: 'Adonis 101', user_id: 1, created_at: new Date() },
                { title: 'Adonis 102', user_id: 1 },
                { title: 'Adonis 103', user_id: 2 },
                { title: 'Adonis 104', user_id: 2, created_at: new Date() },
                { title: 'Adonis 105', user_id: 1 },
            ]);
            /**
             * Country 2 posts
             */
            await db
                .insertQuery()
                .table('posts')
                .insert([
                { title: 'Lucid 101', user_id: 3 },
                { title: 'Lucid 102', user_id: 3, created_at: new Date() },
                { title: 'Lucid 103', user_id: 3, created_at: new Date() },
                { title: 'Lucid 104', user_id: 3 },
                { title: 'Lucid 105', user_id: 3, created_at: new Date() },
            ]);
            const countries = await Country.query().preload('posts', (query) => {
                query.groupLimit(2).groupOrderBy('posts.title', 'asc');
            });
            assert.lengthOf(countries, 2);
            assert.lengthOf(countries[0].posts, 2);
            assert.equal(countries[0].posts[0].title, 'Adonis 101');
            assert.isDefined(countries[0].posts[0].createdAt);
            assert.equal(countries[0].posts[0].$extras.through_country_id, 1);
            assert.equal(countries[0].posts[1].title, 'Adonis 102');
            assert.isDefined(countries[0].posts[1].createdAt);
            assert.equal(countries[0].posts[1].$extras.through_country_id, 1);
            assert.lengthOf(countries[1].posts, 2);
            assert.equal(countries[1].posts[0].title, 'Lucid 101');
            assert.isDefined(countries[1].posts[0].createdAt);
            assert.equal(countries[1].posts[0].$extras.through_country_id, 2);
            assert.equal(countries[1].posts[1].title, 'Lucid 102');
            assert.isDefined(countries[1].posts[1].createdAt);
            assert.equal(countries[1].posts[1].$extras.through_country_id, 2);
        });
        (0, japa_1.default)('apply standard limit when not eagerloading', async (assert) => {
            class User extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
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
                }
            }
            __decorate([
                (0, Decorators_1.column)({ isPrimary: true }),
                __metadata("design:type", Number)
            ], User.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", Number)
            ], User.prototype, "countryId", void 0);
            User.boot();
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
                (0, Decorators_1.column)({ isPrimary: true }),
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
            class Country extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
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
            ], Country.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
                __metadata("design:type", Object)
            ], Country.prototype, "posts", void 0);
            Country.boot();
            await db
                .insertQuery()
                .table('countries')
                .insert([{ name: 'India' }]);
            await db
                .insertQuery()
                .table('users')
                .insert([
                { username: 'virk', country_id: 1 },
                { username: 'nikk', country_id: 1 },
            ]);
            /**
             * Country 1 posts
             */
            await db
                .insertQuery()
                .table('posts')
                .insert([
                { title: 'Adonis 101', user_id: 1 },
                { title: 'Adonis 102', user_id: 1 },
                { title: 'Adonis 103', user_id: 2 },
                { title: 'Adonis 104', user_id: 2 },
                { title: 'Adonis 105', user_id: 1 },
            ]);
            const country = await Country.firstOrFail();
            const { sql, bindings } = country.related('posts').query().groupLimit(2).toSQL();
            const { sql: knexSql, bindings: knexBindings } = db
                .query()
                .from('posts')
                .select('posts.*', 'users.country_id as through_country_id')
                .innerJoin('users', 'users.id', 'posts.user_id')
                .where('users.country_id', 1)
                .limit(2)
                .toSQL();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
        (0, japa_1.default)('apply standard order by when not eagerloading', async (assert) => {
            class User extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
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
                }
            }
            __decorate([
                (0, Decorators_1.column)({ isPrimary: true }),
                __metadata("design:type", Number)
            ], User.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.column)(),
                __metadata("design:type", Number)
            ], User.prototype, "countryId", void 0);
            User.boot();
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
                (0, Decorators_1.column)({ isPrimary: true }),
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
            class Country extends BaseModel {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "id", {
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
            ], Country.prototype, "id", void 0);
            __decorate([
                (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
                __metadata("design:type", Object)
            ], Country.prototype, "posts", void 0);
            Country.boot();
            await db
                .insertQuery()
                .table('countries')
                .insert([{ name: 'India' }]);
            await db
                .insertQuery()
                .table('users')
                .insert([
                { username: 'virk', country_id: 1 },
                { username: 'nikk', country_id: 1 },
            ]);
            /**
             * Country 1 posts
             */
            await db
                .insertQuery()
                .table('posts')
                .insert([
                { title: 'Adonis 101', user_id: 1 },
                { title: 'Adonis 102', user_id: 1 },
                { title: 'Adonis 103', user_id: 2 },
                { title: 'Adonis 104', user_id: 2 },
                { title: 'Adonis 105', user_id: 1 },
            ]);
            const country = await Country.firstOrFail();
            const { sql, bindings } = country
                .related('posts')
                .query()
                .groupLimit(2)
                .groupOrderBy('users.country_id', 'desc')
                .toSQL();
            const { sql: knexSql, bindings: knexBindings } = db
                .query()
                .from('posts')
                .select('posts.*', 'users.country_id as through_country_id')
                .innerJoin('users', 'users.id', 'posts.user_id')
                .where('users.country_id', 1)
                .limit(2)
                .orderBy('users.country_id', 'desc')
                .toSQL();
            assert.equal(sql, knexSql);
            assert.deepEqual(bindings, knexBindings);
        });
    });
}
japa_1.default.group('Model | Has Many Through | pagination', (group) => {
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
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db.table('countries').multiInsert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db.table('users').multiInsert([
            {
                username: 'virk',
                country_id: 1,
            },
            {
                username: 'nikk',
                country_id: 1,
            },
            {
                username: 'romain',
                country_id: 2,
            },
        ]);
        await db.table('posts').multiInsert([
            {
                title: 'Adonis 101',
                user_id: 1,
            },
            {
                title: 'Lucid 101',
                user_id: 1,
            },
            {
                title: 'Design 101',
                user_id: 2,
            },
            {
                title: 'Dev 101',
                user_id: 3,
            },
        ]);
        const country = await Country.find(1);
        const posts = await country.related('posts').query().paginate(1, 2);
        posts.baseUrl('/posts');
        assert.lengthOf(posts.all(), 2);
        assert.instanceOf(posts.all()[0], Post);
        assert.notProperty(posts.all()[0].$extras, 'total');
        assert.equal(posts.perPage, 2);
        assert.equal(posts.currentPage, 1);
        assert.equal(posts.lastPage, 2);
        assert.isTrue(posts.hasPages);
        assert.isTrue(posts.hasMorePages);
        assert.isFalse(posts.isEmpty);
        assert.equal(posts.total, 3);
        assert.isTrue(posts.hasTotal);
        assert.deepEqual(posts.getMeta(), {
            total: 3,
            per_page: 2,
            current_page: 1,
            last_page: 2,
            first_page: 1,
            first_page_url: '/posts?page=1',
            last_page_url: '/posts?page=2',
            next_page_url: '/posts?page=2',
            previous_page_url: null,
        });
    });
    (0, japa_1.default)('disallow paginate during preload', async (assert) => {
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db.table('countries').insert({ name: 'India' });
        try {
            await Country.query().preload('posts', (query) => query.paginate(1));
        }
        catch ({ message }) {
            assert.equal(message, 'Cannot paginate relationship "posts" during preload');
        }
    });
});
japa_1.default.group('Model | Has Many Through | clone', (group) => {
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
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
        class Post extends BaseModel {
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
        ], Post.prototype, "userId", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db.table('countries').multiInsert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db.table('users').multiInsert([
            {
                username: 'virk',
                country_id: 1,
            },
            {
                username: 'nikk',
                country_id: 1,
            },
            {
                username: 'romain',
                country_id: 2,
            },
        ]);
        await db.table('posts').multiInsert([
            {
                title: 'Adonis 101',
                user_id: 1,
            },
            {
                title: 'Lucid 101',
                user_id: 1,
            },
            {
                title: 'Design 101',
                user_id: 2,
            },
            {
                title: 'Dev 101',
                user_id: 3,
            },
        ]);
        const country = await Country.find(1);
        const clonedQuery = country.related('posts').query().clone();
        assert.instanceOf(clonedQuery, QueryBuilder_1.HasManyThroughQueryBuilder);
    });
});
japa_1.default.group('Model | Has Many Through | scopes', (group) => {
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
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
        Object.defineProperty(Post, "adonisOnly", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, scope_1.scope)((query) => {
                query.where('title', 'Adonis 101');
            })
        });
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Post.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Post.prototype, "title", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db.table('countries').multiInsert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db.table('users').multiInsert([
            {
                username: 'virk',
                country_id: 1,
            },
            {
                username: 'nikk',
                country_id: 1,
            },
            {
                username: 'romain',
                country_id: 2,
            },
        ]);
        await db.table('posts').multiInsert([
            {
                title: 'Adonis 101',
                user_id: 1,
            },
            {
                title: 'Lucid 101',
                user_id: 1,
            },
            {
                title: 'Design 101',
                user_id: 2,
            },
            {
                title: 'Dev 101',
                user_id: 3,
            },
        ]);
        const country = await Country.query()
            .where('id', 1)
            .preload('posts', (query) => {
            query.apply((scopes) => scopes.adonisOnly());
        })
            .firstOrFail();
        const countryWithoutScope = await Country.query().where('id', 1).preload('posts').firstOrFail();
        assert.lengthOf(country.posts, 1);
        assert.lengthOf(countryWithoutScope.posts, 3);
        assert.equal(country.posts[0].title, 'Adonis 101');
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
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
        Object.defineProperty(Post, "adonisOnly", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, scope_1.scope)((query) => {
                query.where('title', 'Adonis 101');
            })
        });
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], Post.prototype, "userId", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", String)
        ], Post.prototype, "title", void 0);
        Post.boot();
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User]),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db.table('countries').multiInsert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db.table('users').multiInsert([
            {
                username: 'virk',
                country_id: 1,
            },
            {
                username: 'nikk',
                country_id: 1,
            },
            {
                username: 'romain',
                country_id: 2,
            },
        ]);
        await db.table('posts').multiInsert([
            {
                title: 'Adonis 101',
                user_id: 1,
            },
            {
                title: 'Lucid 101',
                user_id: 1,
            },
            {
                title: 'Design 101',
                user_id: 2,
            },
            {
                title: 'Dev 101',
                user_id: 3,
            },
        ]);
        const country = await Country.findOrFail(1);
        const posts = await country
            .related('posts')
            .query()
            .apply((scopes) => scopes.adonisOnly());
        const postsWithoutScope = await country.related('posts').query();
        assert.lengthOf(posts, 1);
        assert.lengthOf(postsWithoutScope, 3);
        assert.equal(posts[0].title, 'Adonis 101');
    });
});
japa_1.default.group('Model | Has Many Through | onQuery', (group) => {
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
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
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User], {
                onQuery: (query) => query.where('title', 'Adonis 101'),
            }),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db.table('countries').multiInsert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db.table('users').multiInsert([
            {
                username: 'virk',
                country_id: 1,
            },
            {
                username: 'nikk',
                country_id: 1,
            },
            {
                username: 'romain',
                country_id: 2,
            },
        ]);
        await db.table('posts').multiInsert([
            {
                title: 'Adonis 101',
                user_id: 1,
            },
            {
                title: 'Lucid 101',
                user_id: 1,
            },
            {
                title: 'Design 101',
                user_id: 2,
            },
            {
                title: 'Dev 101',
                user_id: 3,
            },
        ]);
        const country = await Country.query().where('id', 1).preload('posts').firstOrFail();
        assert.lengthOf(country.posts, 1);
        assert.equal(country.posts[0].title, 'Adonis 101');
    });
    (0, japa_1.default)('do not invoke onQuery method on preloading subqueries', async (assert) => {
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
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
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User], {
                onQuery: (query) => {
                    assert.isTrue(true);
                    query.where('title', 'Adonis 101');
                },
            }),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db.table('countries').multiInsert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db.table('users').multiInsert([
            {
                username: 'virk',
                country_id: 1,
            },
            {
                username: 'nikk',
                country_id: 1,
            },
            {
                username: 'romain',
                country_id: 2,
            },
        ]);
        await db.table('posts').multiInsert([
            {
                title: 'Adonis 101',
                user_id: 1,
            },
            {
                title: 'Lucid 101',
                user_id: 1,
            },
            {
                title: 'Design 101',
                user_id: 2,
            },
            {
                title: 'Dev 101',
                user_id: 3,
            },
        ]);
        const country = await Country.query()
            .where('id', 1)
            .preload('posts', (query) => query.where({}))
            .firstOrFail();
        assert.lengthOf(country.posts, 1);
        assert.equal(country.posts[0].title, 'Adonis 101');
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
                Object.defineProperty(this, "countryId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
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
        ], User.prototype, "countryId", void 0);
        User.boot();
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
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User], {
                onQuery: (query) => query.where('title', 'Adonis 101'),
            }),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db.table('countries').multiInsert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db.table('users').multiInsert([
            {
                username: 'virk',
                country_id: 1,
            },
            {
                username: 'nikk',
                country_id: 1,
            },
            {
                username: 'romain',
                country_id: 2,
            },
        ]);
        await db.table('posts').multiInsert([
            {
                title: 'Adonis 101',
                user_id: 1,
            },
            {
                title: 'Lucid 101',
                user_id: 1,
            },
            {
                title: 'Design 101',
                user_id: 2,
            },
            {
                title: 'Dev 101',
                user_id: 3,
            },
        ]);
        const country = await Country.findOrFail(1);
        const posts = await country.related('posts').query();
        assert.lengthOf(posts, 1);
        assert.equal(posts[0].title, 'Adonis 101');
    });
    (0, japa_1.default)('do not invoke onQuery method on related query builder subqueries', async (assert) => {
        class User extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
            }
        }
        __decorate([
            (0, Decorators_1.column)({ isPrimary: true }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.column)(),
            __metadata("design:type", Number)
        ], User.prototype, "countryId", void 0);
        User.boot();
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
        class Country extends BaseModel {
            constructor() {
                super(...arguments);
                Object.defineProperty(this, "id", {
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
        ], Country.prototype, "id", void 0);
        __decorate([
            (0, Decorators_1.hasManyThrough)([() => Post, () => User], {
                onQuery: (query) => query.where('title', 'Adonis 101'),
            }),
            __metadata("design:type", Object)
        ], Country.prototype, "posts", void 0);
        Country.boot();
        await db.table('countries').multiInsert([{ name: 'India' }, { name: 'Switzerland' }]);
        await db.table('users').multiInsert([
            {
                username: 'virk',
                country_id: 1,
            },
            {
                username: 'nikk',
                country_id: 1,
            },
            {
                username: 'romain',
                country_id: 2,
            },
        ]);
        await db.table('posts').multiInsert([
            {
                title: 'Adonis 101',
                user_id: 1,
            },
            {
                title: 'Lucid 101',
                user_id: 1,
            },
            {
                title: 'Design 101',
                user_id: 2,
            },
            {
                title: 'Dev 101',
                user_id: 3,
            },
        ]);
        const country = await Country.findOrFail(1);
        const { sql, bindings } = country
            .related('posts')
            .query()
            .where((query) => query.whereNotNull('created_at'))
            .toSQL();
        const { sql: knexSql, bindings: knexBindings } = db
            .connection()
            .from('posts')
            .select('posts.*', 'users.country_id as through_country_id')
            .innerJoin('users', 'users.id', 'posts.user_id')
            .where('title', 'Adonis 101')
            .where((query) => query.whereNotNull('created_at'))
            .where('users.country_id', 1)
            .toSQL();
        assert.equal(sql, knexSql);
        assert.deepEqual(bindings, knexBindings);
    });
});
