"use strict";
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
exports.User = void 0;
const luxon_1 = require("luxon");
const Orm_1 = require("@ioc:Adonis/Lucid/Orm");
const Factory_1 = __importDefault(require("@ioc:Adonis/Lucid/Factory"));
var ProfileTypes;
(function (ProfileTypes) {
    ProfileTypes["TWITTER"] = "TWITTER";
})(ProfileTypes || (ProfileTypes = {}));
class Profile extends Orm_1.BaseModel {
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
        Object.defineProperty(this, "type", {
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
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Profile.prototype, "createdAt", void 0);
class User extends Orm_1.BaseModel {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
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
Object.defineProperty(User, "active", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, Orm_1.scope)((builder) => {
        builder.apply((scopes) => scopes.country('India'));
    })
});
Object.defineProperty(User, "country", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, Orm_1.scope)((builder, _country) => {
        builder.whereIn('', []);
    })
});
__decorate([
    (0, Orm_1.hasOne)(() => Profile, {
        onQuery: (builder) => {
            if (builder.isRelatedQuery) {
                builder.preload('user');
            }
        },
    }),
    __metadata("design:type", Object)
], User.prototype, "profile", void 0);
exports.User = User;
User.query().apply((scopes) => scopes.active().country('India'));
User.create({ id: '1', username: 'a' });
User.fetchOrCreateMany('id', [{ id: '1', username: 'virk' }]);
User.create({ id: '1', username: 'virk' });
User.create({ id: '1', username: 'virk' });
User.create({ id: '1' });
const F = Factory_1.default.define(User, ({ faker }) => {
    return {
        username: faker.internet.userName(),
    };
});
const P = Factory_1.default.define(Profile, () => {
    return {};
});
const ProfileF = P.state('social', () => { }).build();
const UserF = F.state('active', (user) => {
    user.username = 'virk';
})
    .relation('profile', () => ProfileF)
    .build();
UserF.with('profile', 1).merge({});
User.query().withCount('profile', (query) => {
    query.where('isActive', true).has('user', '>', 1);
});
User.query().withCount('profile');
User.query()
    .paginate(1, 1)
    .then((users) => {
    users.forEach((user) => user.username);
});
const user = new User();
user.loadCount('profile');
