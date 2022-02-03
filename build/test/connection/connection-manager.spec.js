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
const Manager_1 = require("../../src/Connection/Manager");
const test_helpers_1 = require("../../test-helpers");
let app;
japa_1.default.group('ConnectionManager', (group) => {
    group.before(async () => {
        await (0, test_helpers_1.setup)();
    });
    group.beforeEach(async () => {
        app = await (0, test_helpers_1.setupApplication)();
    });
    group.after(async () => {
        await (0, test_helpers_1.cleanup)();
        await test_helpers_1.fs.cleanup();
    });
    (0, japa_1.default)('do not connect until connect is called', async (assert) => {
        const manager = new Manager_1.ConnectionManager(app.logger, app.container.use('Adonis/Core/Event'));
        manager.add('primary', (0, test_helpers_1.getConfig)());
        assert.isTrue(manager.has('primary'));
        assert.isFalse(manager.isConnected('primary'));
        await manager.closeAll();
    });
    (0, japa_1.default)('connect and set its state to open', async (assert) => {
        const manager = new Manager_1.ConnectionManager(app.logger, app.container.use('Adonis/Core/Event'));
        manager.add('primary', (0, test_helpers_1.getConfig)());
        manager.connect('primary');
        assert.equal(manager.get('primary').state, 'open');
        assert.isTrue(manager.isConnected('primary'));
        await manager.closeAll();
    });
    (0, japa_1.default)('on disconnect set state to closed', async (assert) => {
        const manager = new Manager_1.ConnectionManager(app.logger, app.container.use('Adonis/Core/Event'));
        manager.add('primary', (0, test_helpers_1.getConfig)());
        manager.connect('primary');
        await manager.connections.get('primary').connection.disconnect();
        assert.equal(manager.get('primary').state, 'closed');
        assert.isFalse(manager.isConnected('primary'));
        await manager.closeAll();
    });
    (0, japa_1.default)('add duplicate connection must be a noop', async (assert) => {
        const manager = new Manager_1.ConnectionManager(app.logger, app.container.use('Adonis/Core/Event'));
        manager.add('primary', (0, test_helpers_1.getConfig)());
        manager.connect('primary');
        manager.add('primary', Object.assign({}, (0, test_helpers_1.getConfig)(), { client: 'foo' }));
        assert.notEqual(manager.get('primary').config.client, 'foo');
        await manager.closeAll();
    });
    (0, japa_1.default)('patch config when connection is not in open state', async (assert) => {
        const manager = new Manager_1.ConnectionManager(app.logger, app.container.use('Adonis/Core/Event'));
        manager.add('primary', (0, test_helpers_1.getConfig)());
        manager.connect('primary');
        await manager.close('primary');
        const fn = () => manager.add('primary', (0, test_helpers_1.getConfig)());
        assert.doesNotThrow(fn);
        await manager.closeAll();
    });
    (0, japa_1.default)('ignore multiple calls to `connect` on a single connection', async (_, done) => {
        const emitter = app.container.use('Adonis/Core/Event');
        let counter = 0;
        const manager = new Manager_1.ConnectionManager(app.logger, emitter);
        manager.add('primary', (0, test_helpers_1.getConfig)());
        emitter.on('db:connection:connect', () => {
            counter++;
            if (counter > 1) {
                throw new Error('Never expected to be called');
            }
            done();
        });
        manager.connect('primary');
        manager.connect('primary');
        await manager.closeAll();
    });
    (0, japa_1.default)('releasing a connection must close it first', async (assert) => {
        assert.plan(2);
        const emitter = app.container.use('Adonis/Core/Event');
        const manager = new Manager_1.ConnectionManager(app.logger, emitter);
        manager.add('primary', (0, test_helpers_1.getConfig)());
        manager.connect('primary');
        emitter.on('db:connection:disconnect', (connection) => {
            assert.equal(connection.name, 'primary');
        });
        await manager.release('primary');
        assert.isFalse(manager.has('primary'));
    });
    (0, japa_1.default)('proxy error event', async (assert, done) => {
        assert.plan(3);
        const emitter = app.container.use('Adonis/Core/Event');
        const manager = new Manager_1.ConnectionManager(app.logger, emitter);
        manager.add('primary', Object.assign({}, (0, test_helpers_1.getConfig)(), { client: null }));
        emitter.on('db:connection:error', async ([{ message }, connection]) => {
            try {
                assert.equal(message, "knex: Required configuration option 'client' is missing.");
                assert.instanceOf(connection, Connection_1.Connection);
                await manager.closeAll();
                done();
            }
            catch (error) {
                await manager.closeAll();
                done(error);
            }
        });
        const fn = () => manager.connect('primary');
        assert.throw(fn, /knex: Required configuration option/);
    });
    (0, japa_1.default)('patching the connection config must close old and create a new connection', async (assert, done) => {
        assert.plan(6);
        let connections = [];
        const emitter = app.container.use('Adonis/Core/Event');
        const manager = new Manager_1.ConnectionManager(app.logger, emitter);
        manager.add('primary', (0, test_helpers_1.getConfig)());
        emitter.on('db:connection:disconnect', async (connection) => {
            try {
                assert.deepEqual(connection, connections[0]);
                assert.equal(manager['orphanConnections'].size, 0);
                assert.deepEqual((0, test_helpers_1.mapToObj)(manager.connections), {
                    primary: {
                        config: connection.config,
                        name: 'primary',
                        state: 'open',
                        connection: connections[1],
                    },
                });
                done();
            }
            catch (error) {
                done(error);
            }
        });
        emitter.on('db:connection:connect', (connection) => {
            assert.instanceOf(connection, Connection_1.Connection);
            if (connections.length) {
                assert.notDeepEqual(connections[0], connection);
            }
            connections.push(connection);
        });
        manager.connect('primary');
        /**
         * Patching will trigger disconnect and a new connect
         */
        manager.patch('primary', (0, test_helpers_1.getConfig)());
        manager.connect('primary');
    });
    (0, japa_1.default)('get health check report for connections that has enabled health checks', async (assert) => {
        const manager = new Manager_1.ConnectionManager(app.logger, app.container.use('Adonis/Core/Event'));
        manager.add('primary', Object.assign({}, (0, test_helpers_1.getConfig)(), { healthCheck: true }));
        manager.add('secondary', Object.assign({}, (0, test_helpers_1.getConfig)(), { healthCheck: true }));
        manager.add('secondary-copy', Object.assign({}, (0, test_helpers_1.getConfig)(), { healthCheck: false }));
        const report = await manager.report();
        assert.equal(report.health.healthy, true);
        assert.equal(report.health.message, 'All connections are healthy');
        assert.lengthOf(report.meta, 2);
        assert.deepEqual(report.meta.map(({ connection }) => connection), ['primary', 'secondary']);
    });
    (0, japa_1.default)('get health check report when one of the connection is unhealthy', async (assert) => {
        const manager = new Manager_1.ConnectionManager(app.logger, app.container.use('Adonis/Core/Event'));
        manager.add('primary', Object.assign({}, (0, test_helpers_1.getConfig)(), { healthCheck: true }));
        manager.add('secondary', Object.assign({}, (0, test_helpers_1.getConfig)(), {
            healthCheck: true,
            connection: { host: 'bad-host' },
        }));
        manager.add('secondary-copy', Object.assign({}, (0, test_helpers_1.getConfig)(), { healthCheck: false }));
        const report = await manager.report();
        assert.equal(report.health.healthy, false);
        assert.equal(report.health.message, 'One or more connections are not healthy');
        assert.lengthOf(report.meta, 2);
        assert.deepEqual(report.meta.map(({ connection }) => connection), ['primary', 'secondary']);
    }).timeout(0);
});
