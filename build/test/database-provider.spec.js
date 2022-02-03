"use strict";
/*
 * @adonisjs/session
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const japa_1 = __importDefault(require("japa"));
const Database_1 = require("../src/Database");
const scope_1 = require("../src/Helpers/scope");
const BaseSeeder_1 = require("../src/BaseSeeder");
const Factory_1 = require("../src/Factory");
const BaseModel_1 = require("../src/Orm/BaseModel");
const Paginator_1 = require("../src/Orm/Paginator");
const decorators = __importStar(require("../src/Orm/Decorators"));
const SnakeCase_1 = require("../src/Orm/NamingStrategies/SnakeCase");
const test_helpers_1 = require("../test-helpers");
japa_1.default.group('Database Provider', (group) => {
    group.afterEach(async () => {
        await test_helpers_1.fs.cleanup();
    });
    (0, japa_1.default)('register database provider', async (assert) => {
        const app = await (0, test_helpers_1.setupApplication)({
            connection: 'sqlite',
            connections: {
                sqlite: {},
            },
        }, ['../../providers/DatabaseProvider']);
        assert.instanceOf(app.container.use('Adonis/Lucid/Database'), Database_1.Database);
        assert.deepEqual(app.container.use('Adonis/Lucid/Orm'), {
            BaseModel: BaseModel_1.BaseModel,
            ModelPaginator: Paginator_1.ModelPaginator,
            SnakeCaseNamingStrategy: SnakeCase_1.SnakeCaseNamingStrategy,
            scope: scope_1.scope,
            ...decorators,
        });
        assert.isTrue(app.container.hasBinding('Adonis/Lucid/Schema'));
        assert.instanceOf(app.container.use('Adonis/Lucid/Factory'), Factory_1.FactoryManager);
        assert.deepEqual(app.container.use('Adonis/Lucid/Seeder'), BaseSeeder_1.BaseSeeder);
    });
    (0, japa_1.default)('register health checker', async (assert) => {
        const app = await (0, test_helpers_1.setupApplication)({
            connection: 'sqlite',
            connections: {
                sqlite: {
                    healthCheck: true,
                },
            },
        }, ['../../providers/DatabaseProvider']);
        const HealthCheck = app.container.use('Adonis/Core/HealthCheck');
        assert.equal(HealthCheck['healthCheckers']['lucid'], 'Adonis/Lucid/Database');
    });
    (0, japa_1.default)('register validator rules', async (assert) => {
        const app = await (0, test_helpers_1.setupApplication)({
            connection: 'sqlite',
            connections: {
                sqlite: {},
            },
        }, ['../../providers/DatabaseProvider']);
        const Validator = app.container.use('Adonis/Core/Validator');
        assert.property(Validator['rules'], 'unique');
        assert.property(Validator['rules'], 'exists');
    });
    (0, japa_1.default)('register repl bindings in repl environment', async (assert) => {
        const app = await (0, test_helpers_1.setupApplication)({
            connection: 'sqlite',
            connections: {
                sqlite: {},
            },
        }, ['../../providers/DatabaseProvider'], 'repl');
        const Repl = app.container.use('Adonis/Addons/Repl');
        assert.property(Repl['customMethods'], 'loadModels');
        assert.property(Repl['customMethods'], 'loadDb');
    });
});
