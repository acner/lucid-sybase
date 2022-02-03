"use strict";
/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
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
const standalone_1 = require("@adonisjs/core/build/standalone");
const Base_1 = __importDefault(require("./Base"));
/**
 * The command is meant to migrate the database by executing migrations
 * in `down` direction.
 */
class Migrate extends Base_1.default {
    constructor() {
        super(...arguments);
        /**
         * Custom connection for running migrations.
         */
        Object.defineProperty(this, "connection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Force run migrations in production
         */
        Object.defineProperty(this, "force", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Perform dry run
         */
        Object.defineProperty(this, "dryRun", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Define custom batch, instead of rolling back to the latest batch
         */
        Object.defineProperty(this, "batch", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    /**
     * Handle command
     */
    async run() {
        const db = this.application.container.use('Adonis/Lucid/Database');
        this.connection = this.connection || db.primaryConnectionName;
        const continueMigrations = !this.application.inProduction || this.force || (await this.takeProductionConstent());
        /**
         * Prompt cancelled or rejected and hence do not continue
         */
        if (!continueMigrations) {
            return;
        }
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
        /**
         * New up migrator
         */
        const Migrator = this.application.container.resolveBinding('Adonis/Lucid/Migrator');
        const migrator = new Migrator(db, this.application, {
            direction: 'down',
            batch: this.batch,
            connectionName: this.connection,
            dryRun: this.dryRun,
        });
        await this.runMigrations(migrator, this.connection);
    }
}
Object.defineProperty(Migrate, "commandName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'migration:rollback'
});
Object.defineProperty(Migrate, "description", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'Rollback migrations to a given batch number'
});
/**
 * This command loads the application, since we need the runtime
 * to find the migration directories for a given connection
 */
Object.defineProperty(Migrate, "settings", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        loadApp: true,
    }
});
__decorate([
    standalone_1.flags.string({ description: 'Define a custom database connection', alias: 'c' }),
    __metadata("design:type", String)
], Migrate.prototype, "connection", void 0);
__decorate([
    standalone_1.flags.boolean({ description: 'Explictly force to run migrations in production' }),
    __metadata("design:type", Boolean)
], Migrate.prototype, "force", void 0);
__decorate([
    standalone_1.flags.boolean({ description: 'Print SQL queries, instead of running the migrations' }),
    __metadata("design:type", Boolean)
], Migrate.prototype, "dryRun", void 0);
__decorate([
    standalone_1.flags.number({
        description: 'Define custom batch number for rollback. Use 0 to rollback to initial state',
    }),
    __metadata("design:type", Number)
], Migrate.prototype, "batch", void 0);
exports.default = Migrate;
