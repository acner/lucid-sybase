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
const path_1 = require("path");
const standalone_1 = require("@adonisjs/core/build/standalone");
const Migrator_1 = require("../../src/Migrator");
const Run_1 = __importDefault(require("../../commands/Migration/Run"));
const Rollback_1 = __importDefault(require("../../commands/Migration/Rollback"));
const test_helpers_1 = require("../../test-helpers");
let db;
let app;
japa_1.default.group('Migrate', (group) => {
    group.beforeEach(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        db = (0, test_helpers_1.getDb)(app);
        app.container.bind('Adonis/Lucid/Database', () => db);
        app.container.bind('Adonis/Lucid/Migrator', () => Migrator_1.Migrator);
        await (0, test_helpers_1.setup)();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.cleanup)();
        await (0, test_helpers_1.cleanup)(['adonis_schema', 'schema_users', 'schema_accounts']);
        await test_helpers_1.fs.cleanup();
    });
    (0, japa_1.default)('run migrations from default directory', async (assert) => {
        await test_helpers_1.fs.add('database/migrations/users.ts', `
      import { Schema } from '../../../../src/Schema'
      module.exports = class User extends Schema {
        public async up () {
          this.schema.createTable('schema_users', (table) => {
            table.increments()
          })
        }
      }
    `);
        const migrate = new Run_1.default(app, new standalone_1.Kernel(app));
        await migrate.run();
        /**
         * Migrate command closes the db connection. So we need to re-instantiate
         * it
         */
        db = (0, test_helpers_1.getDb)(app);
        const migrated = await db.connection().from('adonis_schema').select('*');
        const hasUsersTable = await db.connection().schema.hasTable('schema_users');
        assert.lengthOf(migrated, 1);
        assert.isTrue(hasUsersTable);
        assert.equal(migrated[0].name, 'database/migrations/users');
        assert.equal(migrated[0].batch, 1);
    });
    (0, japa_1.default)('skip migrations when already up to date', async (assert) => {
        await test_helpers_1.fs.fsExtra.ensureDir((0, path_1.join)(test_helpers_1.fs.basePath, 'database/migrations'));
        const migrate = new Run_1.default(app, new standalone_1.Kernel(app));
        await migrate.run();
        /**
         * Migrate command closes the db connection. So we need to re-instantiate
         * it
         */
        db = (0, test_helpers_1.getDb)(app);
        const migrated = await db.connection().from('adonis_schema').select('*');
        assert.lengthOf(migrated, 0);
    });
    (0, japa_1.default)('print sql queries in dryRun', async (assert) => {
        await test_helpers_1.fs.add('database/migrations/users.ts', `
      import { Schema } from '../../../../src/Schema'
      module.exports = class User extends Schema {
        public async up () {
          this.schema.createTable('schema_users', (table) => {
            table.increments()
          })
        }
      }
    `);
        const migrate = new Run_1.default(app, new standalone_1.Kernel(app));
        migrate.dryRun = true;
        await migrate.run();
        /**
         * Migrate command closes the db connection. So we need to re-instantiate
         * it
         */
        db = (0, test_helpers_1.getDb)(app);
        const migrated = await db.connection().from('adonis_schema').select('*');
        assert.lengthOf(migrated, 0);
    });
    (0, japa_1.default)('prompt during migrations in production without force flag', async (assert) => {
        assert.plan(1);
        app.nodeEnvironment = 'production';
        await test_helpers_1.fs.add('database/migrations/users.ts', `
      import { Schema } from '../../../../src/Schema'
      module.exports = class User extends Schema {
        public async up () {
          this.schema.createTable('schema_users', (table) => {
            table.increments()
          })
        }
      }
    `);
        const migrate = new Run_1.default(app, new standalone_1.Kernel(app));
        migrate.prompt.on('prompt', (prompt) => {
            assert.equal(prompt.message, 'You are in production environment. Want to continue running migrations?');
            prompt.accept();
        });
        await migrate.run();
        delete process.env.NODE_ENV;
    });
    (0, japa_1.default)('do not prompt during migration when force flag is defined', async () => {
        app.nodeEnvironment = 'production';
        await test_helpers_1.fs.add('database/migrations/users.ts', `
      import { Schema } from '../../../../src/Schema'
      module.exports = class User extends Schema {
        public async up () {
          this.schema.createTable('schema_users', (table) => {
            table.increments()
          })
        }
      }
    `);
        const migrate = new Run_1.default(app, new standalone_1.Kernel(app));
        migrate.force = true;
        migrate.prompt.on('prompt', () => {
            throw new Error('Never expected to be here');
        });
        await migrate.run();
        delete process.env.NODE_ENV;
    });
    (0, japa_1.default)('prompt during rollback in production without force flag', async (assert) => {
        assert.plan(1);
        app.nodeEnvironment = 'production';
        await test_helpers_1.fs.add('database/migrations/users.ts', `
      import { Schema } from '../../../../src/Schema'
      module.exports = class User extends Schema {
        public async down () {
        }
      }
    `);
        const rollback = new Rollback_1.default(app, new standalone_1.Kernel(app));
        rollback.prompt.on('prompt', (prompt) => {
            assert.equal(prompt.message, 'You are in production environment. Want to continue running migrations?');
            prompt.accept();
        });
        await rollback.run();
        delete process.env.NODE_ENV;
    });
    (0, japa_1.default)('do not prompt during rollback in production when force flag is defined', async () => {
        app.nodeEnvironment = 'production';
        await test_helpers_1.fs.add('database/migrations/users.ts', `
      import { Schema } from '../../../../src/Schema'
      module.exports = class User extends Schema {
        public async down () {
        }
      }
    `);
        const rollback = new Rollback_1.default(app, new standalone_1.Kernel(app));
        rollback.force = true;
        rollback.prompt.on('prompt', () => {
            throw new Error('Never expected to be here');
        });
        await rollback.run();
        delete process.env.NODE_ENV;
    });
});
