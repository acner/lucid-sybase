"use strict";
/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../adonis-typings/index.ts" />
const japa_1 = __importDefault(require("japa"));
require("reflect-metadata");
const standalone_1 = require("@adonisjs/core/build/standalone");
const DbSeed_1 = __importDefault(require("../../commands/DbSeed"));
const test_helpers_1 = require("../../test-helpers");
let app;
let db;
japa_1.default.group('DbSeed', (group) => {
    group.beforeEach(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        app.container.bind('Adonis/Lucid/Database', () => db);
        await (0, test_helpers_1.setup)();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.cleanup)();
        await (0, test_helpers_1.cleanup)(['adonis_schema', 'schema_users', 'schema_accounts']);
        await test_helpers_1.fs.cleanup();
    });
    (0, japa_1.default)('run seeds', async (assert) => {
        await test_helpers_1.fs.add('database/seeders/user.ts', `export default class UserSeeder {
				public async run () {
					process.env.EXEC_USER_SEEDER = 'true'
				}
			}`);
        const seed = new DbSeed_1.default(app, new standalone_1.Kernel(app));
        await seed.run();
        assert.equal(process.env.EXEC_USER_SEEDER, 'true');
        delete process.env.EXEC_USER_SEEDER;
    });
    (0, japa_1.default)('run custom files', async (assert) => {
        await test_helpers_1.fs.add('database/seeders/user.ts', `export default class UserSeeder {
				public async run () {
					process.env.EXEC_USER_SEEDER = 'true'
				}
			}`);
        await test_helpers_1.fs.add('database/seeders/post.ts', `export default class PostSeeder {
				public async run () {
					process.env.EXEC_POST_SEEDER = 'true'
				}
			}`);
        const seed = new DbSeed_1.default(app, new standalone_1.Kernel(app));
        seed.files = ['./database/seeders/post.ts'];
        await seed.run();
        assert.isUndefined(process.env.EXEC_USER_SEEDER);
        assert.equal(process.env.EXEC_POST_SEEDER, 'true');
        delete process.env.EXEC_POST_SEEDER;
    });
});
