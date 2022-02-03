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
const dev_utils_1 = require("@poppinss/dev-utils");
const test_helpers_1 = require("../../test-helpers");
const MakeModel_1 = __importDefault(require("../../commands/MakeModel"));
const templatesFs = new dev_utils_1.Filesystem((0, path_1.join)(__dirname, '..', '..', 'templates'));
japa_1.default.group('MakeModel', (group) => {
    group.afterEach(async () => {
        delete process.env.ADONIS_ACE_CWD;
        await test_helpers_1.fs.cleanup();
    });
    (0, japa_1.default)('make a model inside the default directory', async (assert) => {
        const app = await (0, test_helpers_1.setupApplication)();
        const makeModel = new MakeModel_1.default(app, new standalone_1.Kernel(app));
        makeModel.name = 'user';
        await makeModel.run();
        const userModel = await test_helpers_1.fs.get('app/Models/User.ts');
        const schemaTemplate = await templatesFs.get('model.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(userModel), (0, test_helpers_1.toNewlineArray)(schemaTemplate.replace('{{ filename }}', 'User')));
    });
    (0, japa_1.default)('make a model inside a custom directory', async (assert) => {
        const app = await (0, test_helpers_1.setupApplication)();
        app.rcFile.namespaces.models = 'App';
        const makeModel = new MakeModel_1.default(app, new standalone_1.Kernel(app));
        makeModel.name = 'user';
        await makeModel.run();
        const userModel = await test_helpers_1.fs.get('app/User.ts');
        const schemaTemplate = await templatesFs.get('model.txt');
        assert.deepEqual((0, test_helpers_1.toNewlineArray)(userModel), (0, test_helpers_1.toNewlineArray)(schemaTemplate.replace('{{ filename }}', 'User')));
    });
});
