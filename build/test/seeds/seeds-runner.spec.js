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
const japa_1 = __importDefault(require("japa"));
const SeedsRunner_1 = require("../../src/SeedsRunner");
const test_helpers_1 = require("../../test-helpers");
japa_1.default.group('Seeds Runner', (group) => {
    group.beforeEach(async () => {
        await (0, test_helpers_1.setup)();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
    });
    (0, japa_1.default)('run a seeder file', async (assert) => {
        const app = await (0, test_helpers_1.setupApplication)();
        const db = (0, test_helpers_1.getDb)(app);
        const runner = new SeedsRunner_1.SeedsRunner(db, app);
        await test_helpers_1.fs.add('database/seeders/User.ts', `export default class FooSeeder {
      public static invoked = false

      run () {
        (this.constructor as any).invoked = true
      }
    }`);
        const files = await runner.getList();
        const report = await runner.run(files[0]);
        assert.equal(report.file.getSource()['invoked'], true);
        assert.equal(report.status, 'completed');
        await db.manager.closeAll();
    });
    (0, japa_1.default)('catch and return seeder errors', async (assert) => {
        const app = await (0, test_helpers_1.setupApplication)();
        const db = (0, test_helpers_1.getDb)(app);
        const runner = new SeedsRunner_1.SeedsRunner(db, app);
        await test_helpers_1.fs.add('database/seeders/User.ts', `export default class FooSeeder {
      run () {
        throw new Error('Failed')
      }
    }`);
        const files = await runner.getList();
        const report = await runner.run(files[0]);
        assert.equal(report.status, 'failed');
        assert.exists(report.error);
        await db.manager.closeAll();
    });
    (0, japa_1.default)('mark file as ignored when "developmentOnly = true" and not running in development mode', async (assert) => {
        process.env.NODE_ENV = 'production';
        const app = await (0, test_helpers_1.setupApplication)();
        const db = (0, test_helpers_1.getDb)(app);
        const runner = new SeedsRunner_1.SeedsRunner(db, app);
        await test_helpers_1.fs.add('database/seeders/User.ts', `export default class FooSeeder {
      public static invoked = false
      public static developmentOnly = true

      run () {
        (this.constructor as any).invoked = true
      }
    }`);
        const files = await runner.getList();
        const report = await runner.run(files[0]);
        assert.equal(report.status, 'ignored');
        delete process.env.NODE_ENV;
        await db.manager.closeAll();
    });
});
