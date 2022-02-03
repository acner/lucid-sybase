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
const path_1 = require("path");
const SeedersSource_1 = require("../../src/SeedsRunner/SeedersSource");
const test_helpers_1 = require("../../test-helpers");
japa_1.default.group('Seeds Source', (group) => {
    group.beforeEach(async () => {
        await (0, test_helpers_1.setup)();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
    });
    (0, japa_1.default)('get list of seed files recursively', async (assert) => {
        const app = await (0, test_helpers_1.setupApplication)();
        const db = (0, test_helpers_1.getDb)(app);
        const seedsSource = new SeedersSource_1.SeedersSource(db.getRawConnection('primary').config, app);
        await test_helpers_1.fs.add('database/seeders/User.ts', '');
        await test_helpers_1.fs.add('database/seeders/Tenant/User.ts', '');
        await test_helpers_1.fs.add('database/seeders/Country/Post.ts', '');
        await db.manager.closeAll();
        const files = await seedsSource.getSeeders();
        assert.deepEqual(files.map((file) => {
            return { absPath: file.absPath, name: file.name };
        }), [
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/seeders/Country/Post.ts'),
                name: 'database/seeders/Country/Post',
            },
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/seeders/Tenant/User.ts'),
                name: 'database/seeders/Tenant/User',
            },
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/seeders/User.ts'),
                name: 'database/seeders/User',
            },
        ]);
    });
    (0, japa_1.default)('only pick .ts/.js files', async (assert) => {
        const app = await (0, test_helpers_1.setupApplication)();
        const db = (0, test_helpers_1.getDb)(app);
        const seedsSource = new SeedersSource_1.SeedersSource(db.getRawConnection('primary').config, app);
        await test_helpers_1.fs.add('database/seeders/User.ts', '');
        await test_helpers_1.fs.add('database/seeders/Tenant/User.ts', '');
        await test_helpers_1.fs.add('database/seeders/Country/Post.ts', '');
        await test_helpers_1.fs.add('database/seeders/foo.bar', '');
        await test_helpers_1.fs.add('database/seeders/foo.js', '');
        await db.manager.closeAll();
        const files = await seedsSource.getSeeders();
        assert.deepEqual(files.map((file) => {
            return { absPath: file.absPath, name: file.name };
        }), [
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/seeders/Country/Post.ts'),
                name: 'database/seeders/Country/Post',
            },
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/seeders/Tenant/User.ts'),
                name: 'database/seeders/Tenant/User',
            },
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/seeders/User.ts'),
                name: 'database/seeders/User',
            },
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/seeders/foo.js'),
                name: 'database/seeders/foo',
            },
        ]);
    });
    (0, japa_1.default)('sort multiple seeders directories seperately', async (assert) => {
        const app = await (0, test_helpers_1.setupApplication)();
        const db = (0, test_helpers_1.getDb)(app);
        const config = Object.assign({}, db.getRawConnection('primary').config, {
            seeders: {
                paths: ['./database/secondary', './database/primary'],
            },
        });
        const seedsSource = new SeedersSource_1.SeedersSource(config, app);
        await test_helpers_1.fs.add('database/secondary/User.ts', '');
        await test_helpers_1.fs.add('database/secondary/Tenant/User.ts', '');
        await test_helpers_1.fs.add('database/primary/Account.ts', '');
        await test_helpers_1.fs.add('database/primary/Team.ts', '');
        await db.manager.closeAll();
        const files = await seedsSource.getSeeders();
        assert.deepEqual(files.map((file) => {
            return { absPath: file.absPath, name: file.name };
        }), [
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/secondary/Tenant/User.ts'),
                name: 'database/secondary/Tenant/User',
            },
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/secondary/User.ts'),
                name: 'database/secondary/User',
            },
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/primary/Account.ts'),
                name: 'database/primary/Account',
            },
            {
                absPath: (0, path_1.join)(test_helpers_1.fs.basePath, 'database/primary/Team.ts'),
                name: 'database/primary/Team',
            },
        ]);
    });
});
