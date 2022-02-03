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
const Connection_1 = require("../../src/Connection");
const test_helpers_1 = require("../../test-helpers");
let app;
if (process.env.DB !== 'sqlite') {
    japa_1.default.group('Connection | config', (group) => {
        group.before(async () => {
            app = await (0, test_helpers_1.setupApplication)();
            await (0, test_helpers_1.setup)();
        });
        group.after(async () => {
            await (0, test_helpers_1.cleanup)();
            await test_helpers_1.fs.cleanup();
        });
        (0, japa_1.default)('get write config by merging values from connection', (assert) => {
            const config = (0, test_helpers_1.getConfig)();
            config.replicas = {
                write: {
                    connection: {
                        host: '10.0.0.1',
                    },
                },
                read: {
                    connection: [
                        {
                            host: '10.0.0.1',
                        },
                    ],
                },
            };
            const connection = new Connection_1.Connection('primary', config, app.logger);
            const writeConfig = connection['getWriteConfig']();
            assert.equal(writeConfig.client, config.client);
            assert.equal(writeConfig.connection['host'], '10.0.0.1');
        });
        (0, japa_1.default)('get read config by merging values from connection', (assert) => {
            const config = (0, test_helpers_1.getConfig)();
            config.replicas = {
                write: {
                    connection: {
                        host: '10.0.0.1',
                    },
                },
                read: {
                    connection: [
                        {
                            host: '10.0.0.1',
                        },
                    ],
                },
            };
            const connection = new Connection_1.Connection('primary', config, app.logger);
            const readConfig = connection['getReadConfig']();
            assert.equal(readConfig.client, config.client);
        });
    });
}
japa_1.default.group('Connection | setup', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        await (0, test_helpers_1.setup)();
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
    });
    group.afterEach(async () => {
        await (0, test_helpers_1.resetTables)();
    });
    (0, japa_1.default)('do not instantiate knex unless connect is called', (assert) => {
        const connection = new Connection_1.Connection('primary', (0, test_helpers_1.getConfig)(), app.logger);
        assert.isUndefined(connection.client);
    });
    (0, japa_1.default)('instantiate knex when connect is invoked', async (assert, done) => {
        const connection = new Connection_1.Connection('primary', (0, test_helpers_1.getConfig)(), app.logger);
        connection.on('connect', async () => {
            assert.isDefined(connection.client);
            assert.equal(connection.pool.numUsed(), 0);
            await connection.disconnect();
            done();
        });
        connection.connect();
    });
    (0, japa_1.default)('on disconnect destroy knex', async (assert) => {
        const connection = new Connection_1.Connection('primary', (0, test_helpers_1.getConfig)(), app.logger);
        connection.connect();
        await connection.disconnect();
        assert.isUndefined(connection.client);
        assert.isUndefined(connection['_readClient']);
    });
    (0, japa_1.default)('on disconnect emit disconnect event', async (assert, done) => {
        const connection = new Connection_1.Connection('primary', (0, test_helpers_1.getConfig)(), app.logger);
        connection.connect();
        connection.on('disconnect', () => {
            assert.isUndefined(connection.client);
            done();
        });
        await connection.disconnect();
    });
    (0, japa_1.default)('raise error when unable to make connection', (assert, done) => {
        assert.plan(2);
        const connection = new Connection_1.Connection('primary', Object.assign({}, (0, test_helpers_1.getConfig)(), { client: null }), app.logger);
        connection.on('error', ({ message }) => {
            try {
                assert.equal(message, "knex: Required configuration option 'client' is missing.");
                done();
            }
            catch (error) {
                done(error);
            }
        });
        const fn = () => connection.connect();
        assert.throw(fn, /knex: Required configuration option/);
    });
});
if (process.env.DB === 'mysql') {
    japa_1.default.group('Connection | setup mysql', () => {
        (0, japa_1.default)('pass user config to mysql driver', async (assert) => {
            const config = (0, test_helpers_1.getConfig)();
            config.connection.charset = 'utf-8';
            config.connection.typeCast = false;
            const connection = new Connection_1.Connection('primary', config, app.logger);
            connection.connect();
            assert.equal(connection.client['context'].client.constructor.name, 'Client_MySQL');
            assert.equal(connection.client['context'].client.config.connection.charset, 'utf-8');
            assert.equal(connection.client['context'].client.config.connection.typeCast, false);
            await connection.disconnect();
        });
    });
}
japa_1.default.group('Health Checks', (group) => {
    group.before(async () => {
        app = await (0, test_helpers_1.setupApplication)();
        await (0, test_helpers_1.setup)();
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
    });
    (0, japa_1.default)('get healthcheck report for healthy connection', async (assert) => {
        const connection = new Connection_1.Connection('primary', (0, test_helpers_1.getConfig)(), app.logger);
        connection.connect();
        const report = await connection.getReport();
        assert.deepEqual(report, {
            connection: 'primary',
            message: 'Connection is healthy',
            error: null,
        });
        await connection.disconnect();
    });
    if (process.env.DB !== 'sqlite') {
        (0, japa_1.default)('get healthcheck report for un-healthy connection', async (assert) => {
            const connection = new Connection_1.Connection('primary', Object.assign({}, (0, test_helpers_1.getConfig)(), {
                connection: {
                    host: 'bad-host',
                },
            }), app.logger);
            connection.connect();
            const report = await connection.getReport();
            assert.equal(report.message, 'Unable to reach the database server');
            assert.exists(report.error);
            await connection.disconnect();
        }).timeout(0);
        (0, japa_1.default)('get healthcheck report for un-healthy read host', async (assert) => {
            const connection = new Connection_1.Connection('primary', Object.assign({}, (0, test_helpers_1.getConfig)(), {
                replicas: {
                    write: {
                        connection: (0, test_helpers_1.getConfig)().connection,
                    },
                    read: {
                        connection: [
                            (0, test_helpers_1.getConfig)().connection,
                            Object.assign({}, (0, test_helpers_1.getConfig)().connection, { host: 'bad-host', port: 8000 }),
                        ],
                    },
                },
            }), app.logger);
            connection.connect();
            const report = await connection.getReport();
            assert.equal(report.message, 'Unable to reach one of the read hosts');
            assert.exists(report.error);
            await connection.disconnect();
        }).timeout(0);
    }
});
