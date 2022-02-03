"use strict";
/*
 * @adonisjs/lucid
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const Base_1 = __importDefault(require("./Base"));
/**
 * The command is meant to migrate the database by execute migrations
 * in `up` direction.
 */
class Status extends Base_1.default {
    /**
     * Colorizes the status string
     */
    colorizeStatus(status) {
        switch (status) {
            case 'pending':
                return this.colors.yellow('pending');
            case 'migrated':
                return this.colors.green('completed');
            case 'corrupt':
                return this.colors.red('corrupt');
        }
    }
    /**
     * Handle command
     */
    async run() {
        const db = this.application.container.use('Adonis/Lucid/Database');
        this.connection = this.connection || db.primaryConnectionName;
        const connection = db.getRawConnection(this.connection);
        /**
         * Ensure the define connection name does exists in the
         * config file
         */
        if (!connection) {
            this.printNotAValidConnection(this.connection);
            this.exitCode = 1;
            return;
        }
        const { Migrator } = await Promise.resolve().then(() => __importStar(require('../../src/Migrator')));
        const migrator = new Migrator(db, this.application, {
            direction: 'up',
            connectionName: this.connection,
        });
        const list = await migrator.getList();
        await migrator.close();
        const table = this.ui.table();
        table.head(['Name', 'Status', 'Batch', 'Message']);
        /**
         * Push a new row to the table
         */
        list.forEach((node) => {
            table.row([
                node.name,
                this.colorizeStatus(node.status),
                node.batch || 'NA',
                node.status === 'corrupt' ? 'The migration file is missing on filesystem' : '',
            ]);
        });
        table.render();
    }
}
Status.commandName = 'migration:status';
Status.description = 'Check migrations current status.';
/**
 * This command loads the application, since we need the runtime
 * to find the migration directories for a given connection
 */
Status.settings = {
    loadApp: true,
};
__decorate([
    standalone_1.flags.string({ description: 'Define a custom database connection', alias: 'c' }),
    __metadata("design:type", String)
], Status.prototype, "connection", void 0);
exports.default = Status;
