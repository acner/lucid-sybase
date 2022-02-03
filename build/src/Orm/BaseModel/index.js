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
var BaseModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
/// <reference path="../../../adonis-typings/index.ts" />
const luxon_1 = require("luxon");
const fast_deep_equal_1 = __importDefault(require("fast-deep-equal"));
const hooks_1 = require("@poppinss/hooks");
const utils_1 = require("@poppinss/utils");
const ModelKeys_1 = require("../ModelKeys");
const Preloader_1 = require("../Preloader");
const HasOne_1 = require("../Relations/HasOne");
const proxyHandler_1 = require("./proxyHandler");
const HasMany_1 = require("../Relations/HasMany");
const BelongsTo_1 = require("../Relations/BelongsTo");
const ManyToMany_1 = require("../Relations/ManyToMany");
const HasManyThrough_1 = require("../Relations/HasManyThrough");
const utils_2 = require("../../utils");
const SnakeCase_1 = require("../NamingStrategies/SnakeCase");
const LazyLoad_1 = require("../Relations/AggregatesLoader/LazyLoad");
const MANY_RELATIONS = ['hasMany', 'manyToMany', 'hasManyThrough'];
const DATE_TIME_TYPES = {
    date: 'date',
    datetime: 'datetime',
};
function StaticImplements() {
    return (_t) => { };
}
/**
 * Abstract class to define fully fledged data models
 */
let BaseModel = BaseModel_1 = class BaseModel {
    constructor() {
        /**
         * Custom options defined on the model instance that are
         * passed to the adapter
         */
        Object.defineProperty(this, "modelOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Reference to transaction that will be used for performing queries on a given
         * model instance.
         */
        Object.defineProperty(this, "modelTrx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The transaction listener listens for the `commit` and `rollback` events and
         * cleansup the `$trx` reference
         */
        Object.defineProperty(this, "transactionListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function listener() {
                this.modelTrx = undefined;
            }.bind(this)
        });
        /**
         * When `fill` method is called, then we may have a situation where it
         * removed the values which exists in `original` and hence the dirty
         * diff has to do a negative diff as well
         */
        Object.defineProperty(this, "fillInvoked", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * A copy of cached getters
         */
        Object.defineProperty(this, "cachedGetters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        /**
         * A type only reference to the columns
         */
        Object.defineProperty(this, "$columns", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        /**
         * A copy of attributes that will be sent over to adapter
         */
        Object.defineProperty(this, "$attributes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        /**
         * Original represents the properties that already has been
         * persisted or loaded by the adapter.
         */
        Object.defineProperty(this, "$original", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        /**
         * Preloaded relationships on the model instance
         */
        Object.defineProperty(this, "$preloaded", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        /**
         * Extras are dynamic properties set on the model instance, which
         * are not serialized and neither casted for adapter calls.
         *
         * This is helpful when adapter wants to load some extra data conditionally
         * and that data must not be persisted back the adapter.
         */
        Object.defineProperty(this, "$extras", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        /**
         * Sideloaded are dynamic properties set on the model instance, which
         * are not serialized and neither casted for adapter calls.
         *
         * This is helpful when you want to add dynamic meta data to the model
         * and it's children as well.
         *
         * The difference between [[extras]] and [[sideloaded]] is:
         *
         * - Extras can be different for each model instance
         * - Extras are not shared down the hierarchy (example relationships)
         * - Sideloaded are shared across multiple model instances created via `$createMultipleFromAdapterResult`.
         * - Sideloaded are passed to the relationships as well.
         */
        Object.defineProperty(this, "$sideloaded", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        /**
         * Persisted means the model has been persisted with the adapter. This will
         * also be true, when model instance is created as a result of fetch
         * call from the adapter.
         */
        Object.defineProperty(this, "$isPersisted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * Once deleted the model instance cannot make calls to the adapter
         */
        Object.defineProperty(this, "$isDeleted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * `$isLocal` tells if the model instance was created locally vs
         * one generated as a result of fetch call from the adapter.
         */
        Object.defineProperty(this, "$isLocal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        return new Proxy(this, proxyHandler_1.proxyHandler);
    }
    /**
     * Creates a new model instance with payload and adapter options
     */
    static newUpWithOptions(payload, options, allowExtraProperties) {
        const row = new this();
        row.fill(payload, allowExtraProperties);
        /**
         * Pass client options to the newly created row. If row was found
         * the query builder will set the same options.
         */
        row.$setOptionsAndTrx(options);
        return row;
    }
    /**
     * Helper method for `fetchOrNewUpMany`, `fetchOrCreateMany` and `createOrUpdate`
     * many.
     */
    static newUpIfMissing(rowObjects, existingRows, keys, mergeAttribute, options, allowExtraProperties) {
        /**
         * Return existing or create missing rows in the same order as the original
         * array
         */
        return rowObjects.map((rowObject) => {
            const existingRow = existingRows.find((one) => {
                /* eslint-disable-next-line eqeqeq */
                return keys.every((key) => one[key] == rowObject[key]);
            });
            /**
             * Return the row found from the select call
             */
            if (existingRow) {
                if (mergeAttribute) {
                    existingRow.merge(rowObject, allowExtraProperties);
                }
                return existingRow;
            }
            /**
             * Otherwise create a new one
             */
            return this.newUpWithOptions(rowObject, options, allowExtraProperties);
        });
    }
    /**
     * Returns the model query instance for the given model
     */
    static query(options) {
        return this.$adapter.query(this, options);
    }
    /**
     * Create a model instance from the adapter result. The result value must
     * be a valid object, otherwise `null` is returned.
     */
    static $createFromAdapterResult(adapterResult, sideloadAttributes, options) {
        if (typeof adapterResult !== 'object' || Array.isArray(adapterResult)) {
            return null;
        }
        const instance = new this();
        instance.$consumeAdapterResult(adapterResult, sideloadAttributes);
        instance.$hydrateOriginals();
        instance.$setOptionsAndTrx(options);
        instance.$isPersisted = true;
        instance.$isLocal = false;
        return instance;
    }
    /**
     * Creates an array of models from the adapter results. The `adapterResults`
     * must be an array with valid Javascript objects.
     *
     * 1. If top level value is not an array, then an empty array is returned.
     * 2. If row is not an object, then it will be ignored.
     */
    static $createMultipleFromAdapterResult(adapterResults, sideloadAttributes, options) {
        if (!Array.isArray(adapterResults)) {
            return [];
        }
        return adapterResults.reduce((models, row) => {
            if ((0, utils_2.isObject)(row)) {
                models.push(this.$createFromAdapterResult(row, sideloadAttributes, options));
            }
            return models;
        }, []);
    }
    /**
     * Define a new column on the model. This is required, so that
     * we differentiate between plain properties vs model attributes.
     */
    static $addColumn(name, options) {
        const descriptor = Object.getOwnPropertyDescriptor(this.prototype, name);
        const column = {
            isPrimary: options.isPrimary || false,
            columnName: options.columnName || this.namingStrategy.columnName(this, name),
            hasGetter: !!(descriptor && descriptor.get),
            hasSetter: !!(descriptor && descriptor.set),
            serializeAs: options.serializeAs !== undefined
                ? options.serializeAs
                : this.namingStrategy.serializedName(this, name),
            serialize: options.serialize,
            prepare: options.prepare,
            consume: options.consume,
            meta: options.meta,
        };
        /**
         * Set column as the primary column, when `primary` is to true
         */
        if (column.isPrimary) {
            this.primaryKey = name;
        }
        this.$columnsDefinitions.set(name, column);
        this.$keys.attributesToColumns.add(name, column.columnName);
        column.serializeAs && this.$keys.attributesToSerialized.add(name, column.serializeAs);
        this.$keys.columnsToAttributes.add(column.columnName, name);
        column.serializeAs && this.$keys.columnsToSerialized.add(column.columnName, column.serializeAs);
        column.serializeAs && this.$keys.serializedToAttributes.add(column.serializeAs, name);
        column.serializeAs && this.$keys.serializedToColumns.add(column.serializeAs, column.columnName);
        return column;
    }
    /**
     * Returns a boolean telling if column exists on the model
     */
    static $hasColumn(name) {
        return this.$columnsDefinitions.has(name);
    }
    /**
     * Returns the column for a given name
     */
    static $getColumn(name) {
        return this.$columnsDefinitions.get(name);
    }
    /**
     * Adds a computed node
     */
    static $addComputed(name, options) {
        const computed = {
            serializeAs: options.serializeAs || name,
            meta: options.meta,
        };
        this.$computedDefinitions.set(name, computed);
        return computed;
    }
    /**
     * Find if some property is marked as computed
     */
    static $hasComputed(name) {
        return this.$computedDefinitions.has(name);
    }
    /**
     * Get computed node
     */
    static $getComputed(name) {
        return this.$computedDefinitions.get(name);
    }
    /**
     * Register has one relationship
     */
    static $addHasOne(name, relatedModel, options) {
        this.$relationsDefinitions.set(name, new HasOne_1.HasOne(name, relatedModel, options, this));
    }
    /**
     * Register has many relationship
     */
    static $addHasMany(name, relatedModel, options) {
        this.$relationsDefinitions.set(name, new HasMany_1.HasMany(name, relatedModel, options, this));
    }
    /**
     * Register belongs to relationship
     */
    static $addBelongsTo(name, relatedModel, options) {
        this.$relationsDefinitions.set(name, new BelongsTo_1.BelongsTo(name, relatedModel, options, this));
    }
    /**
     * Register many to many relationship
     */
    static $addManyToMany(name, relatedModel, options) {
        this.$relationsDefinitions.set(name, new ManyToMany_1.ManyToMany(name, relatedModel, options, this));
    }
    /**
     * Register many to many relationship
     */
    static $addHasManyThrough(name, relatedModel, options) {
        this.$relationsDefinitions.set(name, new HasManyThrough_1.HasManyThrough(name, relatedModel, options, this));
    }
    /**
     * Adds a relationship
     */
    static $addRelation(name, type, relatedModel, options) {
        switch (type) {
            case 'hasOne':
                this.$addHasOne(name, relatedModel, options);
                break;
            case 'hasMany':
                this.$addHasMany(name, relatedModel, options);
                break;
            case 'belongsTo':
                this.$addBelongsTo(name, relatedModel, options);
                break;
            case 'manyToMany':
                this.$addManyToMany(name, relatedModel, options);
                break;
            case 'hasManyThrough':
                this.$addHasManyThrough(name, relatedModel, options);
                break;
            default:
                throw new Error(`${type} is not a supported relation type`);
        }
    }
    /**
     * Find if some property is marked as a relation or not
     */
    static $hasRelation(name) {
        return this.$relationsDefinitions.has(name);
    }
    /**
     * Returns relationship node for a given relation
     */
    static $getRelation(name) {
        return this.$relationsDefinitions.get(name);
    }
    /**
     * Define a static property on the model using the inherit or
     * define strategy.
     *
     * Inherit strategy will clone the property from the parent model
     * and will set it on the current model
     */
    static $defineProperty(propertyName, defaultValue, strategy) {
        (0, utils_1.defineStaticProperty)(this, BaseModel_1, {
            propertyName: propertyName,
            defaultValue: defaultValue,
            strategy: strategy,
        });
    }
    /**
     * Boot the model
     */
    static boot() {
        /**
         * Define the property when not defined on self
         */
        if (!this.hasOwnProperty('booted')) {
            this.booted = false;
        }
        /**
         * Return when already booted
         */
        if (this.booted === true) {
            return;
        }
        this.booted = true;
        /**
         * Table name is never inherited from the base model
         */
        this.$defineProperty('table', this.namingStrategy.tableName(this), 'define');
        /**
         * Inherit primary key or default to "id"
         */
        this.$defineProperty('primaryKey', 'id', 'inherit');
        /**
         * Inherit selfAssignPrimaryKey or default to "false"
         */
        this.$defineProperty('selfAssignPrimaryKey', false, 'inherit');
        /**
         * Define the keys property. This allows looking up variations
         * for model keys
         */
        this.$defineProperty('$keys', {
            attributesToColumns: new ModelKeys_1.ModelKeys(),
            attributesToSerialized: new ModelKeys_1.ModelKeys(),
            columnsToAttributes: new ModelKeys_1.ModelKeys(),
            columnsToSerialized: new ModelKeys_1.ModelKeys(),
            serializedToColumns: new ModelKeys_1.ModelKeys(),
            serializedToAttributes: new ModelKeys_1.ModelKeys(),
        }, (value) => {
            return {
                attributesToColumns: new ModelKeys_1.ModelKeys(Object.assign({}, value.attributesToColumns.all())),
                attributesToSerialized: new ModelKeys_1.ModelKeys(Object.assign({}, value.attributesToSerialized.all())),
                columnsToAttributes: new ModelKeys_1.ModelKeys(Object.assign({}, value.columnsToAttributes.all())),
                columnsToSerialized: new ModelKeys_1.ModelKeys(Object.assign({}, value.columnsToSerialized.all())),
                serializedToColumns: new ModelKeys_1.ModelKeys(Object.assign({}, value.serializedToColumns.all())),
                serializedToAttributes: new ModelKeys_1.ModelKeys(Object.assign({}, value.serializedToAttributes.all())),
            };
        });
        /**
         * Define columns
         */
        this.$defineProperty('$columnsDefinitions', new Map(), 'inherit');
        /**
         * Define computed properties
         */
        this.$defineProperty('$computedDefinitions', new Map(), 'inherit');
        /**
         * Define relationships
         */
        this.$defineProperty('$relationsDefinitions', new Map(), (value) => {
            const relations = new Map();
            value.forEach((relation, key) => {
                const relationClone = relation.clone(this);
                relationClone.boot();
                relations.set(key, relationClone);
            });
            return relations;
        });
        /**
         * Define hooks.
         */
        this.$defineProperty('$hooks', new hooks_1.Hooks(this.$container.getResolver(undefined, 'modelHooks', 'App/Models/Hooks')), (value) => {
            const hooks = new hooks_1.Hooks();
            hooks.merge(value);
            return hooks;
        });
    }
    /**
     * Register before hooks
     */
    static before(event, handler) {
        this.$hooks.add('before', event, handler);
        return this;
    }
    /**
     * Register after hooks
     */
    static after(event, handler) {
        this.$hooks.add('after', event, handler);
        return this;
    }
    /**
     * Returns a fresh persisted instance of model by applying
     * attributes to the model instance
     */
    static async create(values, options) {
        const instance = this.newUpWithOptions(values, options, options?.allowExtraProperties);
        await instance.save();
        return instance;
    }
    /**
     * Same as [[BaseModel.create]], but persists multiple instances. The create
     * many call will be wrapped inside a managed transaction for consistency.
     * If required, you can also pass a transaction client and the method
     * will use that instead of create a new one.
     */
    static async createMany(values, options) {
        const client = this.$adapter.modelConstructorClient(this, options);
        return (0, utils_2.managedTransaction)(client, async (trx) => {
            const modelInstances = [];
            const createOptions = {
                client: trx,
                allowExtraProperties: options?.allowExtraProperties,
            };
            for (let row of values) {
                const modelInstance = await this.create(row, createOptions);
                modelInstances.push(modelInstance);
            }
            return modelInstances;
        });
    }
    /**
     * Find model instance using the primary key
     */
    static async find(value, options) {
        if (value === undefined) {
            throw new utils_1.Exception('"find" expects a value. Received undefined');
        }
        return this.findBy(this.primaryKey, value, options);
    }
    /**
     * Find model instance using the primary key
     */
    static async findOrFail(value, options) {
        if (value === undefined) {
            throw new utils_1.Exception('"findOrFail" expects a value. Received undefined');
        }
        return this.findByOrFail(this.primaryKey, value, options);
    }
    /**
     * Find model instance using a key/value pair
     */
    static async findBy(key, value, options) {
        if (value === undefined) {
            throw new utils_1.Exception('"findBy" expects a value. Received undefined');
        }
        return this.query(options).where(key, value).first();
    }
    /**
     * Find model instance using a key/value pair
     */
    static async findByOrFail(key, value, options) {
        if (value === undefined) {
            throw new utils_1.Exception('"findByOrFail" expects a value. Received undefined');
        }
        return this.query(options).where(key, value).firstOrFail();
    }
    /**
     * Same as `query().first()`
     */
    static async first(options) {
        return this.query(options).first();
    }
    /**
     * Same as `query().firstOrFail()`
     */
    static async firstOrFail(options) {
        return this.query(options).firstOrFail();
    }
    /**
     * Find model instance using a key/value pair
     */
    static async findMany(value, options) {
        if (value === undefined) {
            throw new utils_1.Exception('"findMany" expects a value. Received undefined');
        }
        return this.query(options)
            .whereIn(this.primaryKey, value)
            .orderBy(this.primaryKey, 'desc')
            .exec();
    }
    /**
     * Find model instance using a key/value pair or create a
     * new one without persisting it.
     */
    static async firstOrNew(searchPayload, savePayload, options) {
        /**
         * Search using the search payload and fetch the first row
         */
        const query = this.query(options).where(searchPayload);
        const row = await query.first();
        /**
         * Create a new one, if row is not found
         */
        if (!row) {
            return this.newUpWithOptions(Object.assign({}, searchPayload, savePayload), query.clientOptions, options?.allowExtraProperties);
        }
        return row;
    }
    /**
     * Same as `firstOrNew`, but also persists the newly created model instance.
     */
    static async firstOrCreate(searchPayload, savePayload, options) {
        /**
         * Search using the search payload and fetch the first row
         */
        const query = this.query(options).where(searchPayload);
        let row = await query.first();
        /**
         * Create a new instance and persist it to the database
         */
        if (!row) {
            row = this.newUpWithOptions(Object.assign({}, searchPayload, savePayload), query.clientOptions, options?.allowExtraProperties);
            await row.save();
        }
        return row;
    }
    /**
     * Updates or creates a new row inside the database
     */
    static async updateOrCreate(searchPayload, updatedPayload, options) {
        const client = this.$adapter.modelConstructorClient(this, options);
        /**
         * We wrap updateOrCreate call inside a transaction and obtain an update
         * lock on the selected row. This ensures that concurrent reads waits
         * for the existing writes to finish
         */
        return (0, utils_2.managedTransaction)(client, async (trx) => {
            const query = this.query({ client: trx }).forUpdate().where(searchPayload);
            let row = await query.first();
            /**
             * Create a new instance or update the existing one (if found)
             */
            if (!row) {
                row = this.newUpWithOptions(Object.assign({}, searchPayload, updatedPayload), query.clientOptions, options?.allowExtraProperties);
            }
            else {
                row.merge(updatedPayload, options?.allowExtraProperties);
            }
            await row.save();
            return row;
        });
    }
    /**
     * Find existing rows or create an in-memory instances of the missing ones.
     */
    static async fetchOrNewUpMany(uniqueKeys, payload, options) {
        uniqueKeys = Array.isArray(uniqueKeys) ? uniqueKeys : [uniqueKeys];
        const uniquenessPair = uniqueKeys.map((uniqueKey) => {
            return {
                key: uniqueKey,
                value: (0, utils_2.collectValues)(payload, uniqueKey, () => {
                    throw new utils_1.Exception(`Value for the "${uniqueKey}" is null or undefined inside "fetchOrNewUpMany" payload`);
                }),
            };
        });
        /**
         * Find existing rows
         */
        const query = this.query(options);
        uniquenessPair.forEach(({ key, value }) => query.whereIn(key, value));
        const existingRows = await query;
        /**
         * Return existing rows as it is and create a model instance for missing one's
         */
        return this.newUpIfMissing(payload, existingRows, uniqueKeys, false, query.clientOptions, options?.allowExtraProperties);
    }
    /**
     * Find existing rows or create missing one's. One database call per insert
     * is invoked, so that each insert goes through the lifecycle of model
     * hooks.
     */
    static async fetchOrCreateMany(uniqueKeys, payload, options) {
        uniqueKeys = Array.isArray(uniqueKeys) ? uniqueKeys : [uniqueKeys];
        const uniquenessPair = uniqueKeys.map((uniqueKey) => {
            return {
                key: uniqueKey,
                value: (0, utils_2.collectValues)(payload, uniqueKey, () => {
                    throw new utils_1.Exception(`Value for the "${uniqueKey}" is null or undefined inside "fetchOrCreateMany" payload`);
                }),
            };
        });
        /**
         * Find existing rows
         */
        const query = this.query(options);
        uniquenessPair.forEach(({ key, value }) => query.whereIn(key, value));
        const existingRows = await query;
        /**
         * Create model instance for the missing rows
         */
        const rows = this.newUpIfMissing(payload, existingRows, uniqueKeys, false, query.clientOptions, options?.allowExtraProperties);
        /**
         * Perist inside db inside a transaction
         */
        await (0, utils_2.managedTransaction)(query.client, async (trx) => {
            for (let row of rows) {
                /**
                 * If transaction `client` was passed, then the row will have
                 * the `trx` already set. But since, the trx of row will be
                 * same as the `trx` passed to this callback, we can safely
                 * re-set it.
                 */
                row.$trx = trx;
                if (!row.$isPersisted) {
                    await row.save();
                }
            }
        });
        return rows;
    }
    /**
     * Update existing rows or create missing one's. One database call per insert
     * is invoked, so that each insert and update goes through the lifecycle
     * of model hooks.
     */
    static async updateOrCreateMany(uniqueKeys, payload, options) {
        uniqueKeys = Array.isArray(uniqueKeys) ? uniqueKeys : [uniqueKeys];
        const uniquenessPair = uniqueKeys.map((uniqueKey) => {
            return {
                key: uniqueKey,
                value: (0, utils_2.collectValues)(payload, uniqueKey, () => {
                    throw new utils_1.Exception(`Value for the "${uniqueKey}" is null or undefined inside "updateOrCreateMany" payload`);
                }),
            };
        });
        const client = this.$adapter.modelConstructorClient(this, options);
        return (0, utils_2.managedTransaction)(client, async (trx) => {
            /**
             * Find existing rows
             */
            const query = this.query({ client: trx }).forUpdate();
            uniquenessPair.forEach(({ key, value }) => query.whereIn(key, value));
            const existingRows = await query;
            /**
             * Create model instance for the missing rows
             */
            const rows = this.newUpIfMissing(payload, existingRows, uniqueKeys, true, query.clientOptions, options?.allowExtraProperties);
            for (let row of rows) {
                await row.save();
            }
            return rows;
        });
    }
    /**
     * Returns all rows from the model table
     */
    static async all(options) {
        return this.query(options).orderBy(this.primaryKey, 'desc');
    }
    /**
     * Truncate model table
     */
    static truncate(cascade = false) {
        return this.query().client.truncate(this.table, cascade);
    }
    /**
     * Raises exception when mutations are performed on a delete model
     */
    ensureIsntDeleted() {
        if (this.$isDeleted) {
            throw new utils_1.Exception('Cannot mutate delete model instance', 500, 'E_MODEL_DELETED');
        }
    }
    /**
     * Invoked when performing the insert call. The method initiates
     * all `datetime` columns, if there are not initiated already
     * and `autoCreate` or `autoUpdate` flags are turned on.
     */
    initiateAutoCreateColumns() {
        const model = this.constructor;
        model.$columnsDefinitions.forEach((column, attributeName) => {
            const columnType = column.meta?.type;
            /**
             * Return early when not dealing with date time columns
             */
            if (!columnType || !DATE_TIME_TYPES[columnType]) {
                return;
            }
            /**
             * Set the value when its missing and `autoCreate` or `autoUpdate`
             * flags are defined.
             */
            const attributeValue = this[attributeName];
            if (!attributeValue && (column.meta.autoCreate || column.meta.autoUpdate)) {
                this[attributeName] = luxon_1.DateTime.local();
                return;
            }
        });
    }
    /**
     * Invoked when performing the update call. The method initiates
     * all `datetime` columns, if there have `autoUpdate` flag
     * turned on.
     */
    initiateAutoUpdateColumns() {
        const model = this.constructor;
        model.$columnsDefinitions.forEach((column, attributeName) => {
            const columnType = column.meta?.type;
            /**
             * Return early when not dealing with date time columns or auto update
             * is not set to true
             */
            if (!columnType || !DATE_TIME_TYPES[columnType] || !column.meta.autoUpdate) {
                return;
            }
            this[attributeName] = luxon_1.DateTime.local();
        });
    }
    /**
     * Preparing the object to be sent to the adapter. We need
     * to create the object with the property names to be
     * used by the adapter.
     */
    prepareForAdapter(attributes) {
        const Model = this.constructor;
        return Object.keys(attributes).reduce((result, key) => {
            const column = Model.$getColumn(key);
            const value = typeof column.prepare === 'function'
                ? column.prepare(attributes[key], key, this)
                : attributes[key];
            result[column.columnName] = value;
            return result;
        }, {});
    }
    /**
     * Returns true when the field must be included
     * inside the serialized object.
     */
    shouldSerializeField(serializeAs, fields) {
        /**
         * If explicit serializing is turned off, then never
         * return the field
         */
        if (!serializeAs) {
            return false;
        }
        /**
         * If not explicit fields are defined, then always include the field
         */
        if (!fields) {
            return true;
        }
        const { pick, omit } = (0, utils_2.normalizeCherryPickObject)(fields);
        /**
         * Return false, when under omit array
         */
        if (omit && omit.includes(serializeAs)) {
            return false;
        }
        /**
         * Otherwise ensure is inside pick array
         */
        return !pick || pick.includes(serializeAs);
    }
    /**
     * Returns the value of primary key. The value must be
     * set inside attributes object
     */
    get $primaryKeyValue() {
        const model = this.constructor;
        const column = model.$getColumn(model.primaryKey);
        if (column && column.hasGetter) {
            return this[model.primaryKey];
        }
        return this.$getAttribute(model.primaryKey);
    }
    /**
     * Opposite of [[this.isPersisted]]
     */
    get $isNew() {
        return !this.$isPersisted;
    }
    /**
     * Returns dirty properties of a model by doing a diff
     * between original values and current attributes
     */
    get $dirty() {
        const processedKeys = [];
        /**
         * Do not compute diff, when model has never been persisted
         */
        if (!this.$isPersisted) {
            return this.$attributes;
        }
        const dirty = Object.keys(this.$attributes).reduce((result, key) => {
            const value = this.$attributes[key];
            const originalValue = this.$original[key];
            let isEqual = true;
            if (luxon_1.DateTime.isDateTime(value) || luxon_1.DateTime.isDateTime(originalValue)) {
                isEqual = value === originalValue;
            }
            else {
                isEqual = (0, fast_deep_equal_1.default)(originalValue, value);
            }
            if (!isEqual) {
                result[key] = value;
            }
            if (this.fillInvoked) {
                processedKeys.push(key);
            }
            return result;
        }, {});
        /**
         * Find negative diff if fill was invoked, since we may have removed values
         * that exists in originals
         */
        if (this.fillInvoked) {
            Object.keys(this.$original)
                .filter((key) => !processedKeys.includes(key))
                .forEach((key) => {
                dirty[key] = null;
            });
        }
        return dirty;
    }
    /**
     * Finding if model is dirty with changes or not
     */
    get $isDirty() {
        return Object.keys(this.$dirty).length > 0;
    }
    /**
     * Returns the transaction
     */
    get $trx() {
        return this.modelTrx;
    }
    /**
     * Set the trx to be used by the model to executing queries
     */
    set $trx(trx) {
        if (!trx) {
            this.modelTrx = undefined;
            return;
        }
        /**
         * Remove old listeners
         */
        if (this.modelTrx) {
            this.modelTrx.removeListener('commit', this.transactionListener);
            this.modelTrx.removeListener('rollback', this.transactionListener);
        }
        /**
         * Store reference to the transaction
         */
        this.modelTrx = trx;
        this.modelTrx.once('commit', this.transactionListener);
        this.modelTrx.once('rollback', this.transactionListener);
    }
    /**
     * Get options
     */
    get $options() {
        return this.modelOptions;
    }
    /**
     * Set options
     */
    set $options(options) {
        if (!options) {
            this.modelOptions = undefined;
            return;
        }
        this.modelOptions = this.modelOptions || {};
        if (options.connection) {
            this.modelOptions.connection = options.connection;
        }
        if (options.profiler) {
            this.modelOptions.profiler = options.profiler;
        }
    }
    /**
     * Set options on the model instance along with transaction
     */
    $setOptionsAndTrx(options) {
        if (!options) {
            return;
        }
        if (options.client && options.client.isTransaction) {
            this.$trx = options.client;
        }
        this.$options = options;
    }
    /**
     * A chainable method to set transaction on the model
     */
    useTransaction(trx) {
        this.$trx = trx;
        return this;
    }
    /**
     * A chainable method to set transaction on the model
     */
    useConnection(connection) {
        this.$options = { connection };
        return this;
    }
    /**
     * Set attribute
     */
    $setAttribute(key, value) {
        this.ensureIsntDeleted();
        this.$attributes[key] = value;
    }
    /**
     * Get value of attribute
     */
    $getAttribute(key) {
        return this.$attributes[key];
    }
    /**
     * Returns the attribute value from the cache which was resolved by
     * the mutated by a getter. This is done to avoid re-mutating
     * the same attribute value over and over again.
     */
    $getAttributeFromCache(key, callback) {
        const original = this.$getAttribute(key);
        const cached = this.cachedGetters[key];
        /**
         * Return the resolved value from cache when cache original is same
         * as the attribute value
         */
        if (cached && cached.original === original) {
            return cached.resolved;
        }
        /**
         * Re-resolve the value from the callback
         */
        const resolved = callback(original);
        if (!cached) {
            /**
             * Create cache entry
             */
            this.cachedGetters[key] = { getter: callback, original, resolved };
        }
        else {
            /**
             * Update original and resolved keys
             */
            this.cachedGetters[key].original = original;
            this.cachedGetters[key].resolved = resolved;
        }
        return resolved;
    }
    /**
     * Returns the related model or default value when model is missing
     */
    $getRelated(key) {
        return this.$preloaded[key];
    }
    /**
     * A boolean to know if relationship has been preloaded or not
     */
    $hasRelated(key) {
        return this.$preloaded[key] !== undefined;
    }
    /**
     * Sets the related data on the model instance. The method internally handles
     * `one to one` or `many` relations
     */
    $setRelated(key, models) {
        const Model = this.constructor;
        const relation = Model.$relationsDefinitions.get(key);
        /**
         * Ignore when relation is not defined
         */
        if (!relation) {
            return;
        }
        /**
         * Reset array before invoking $pushRelated
         */
        if (MANY_RELATIONS.includes(relation.type)) {
            if (!Array.isArray(models)) {
                throw new utils_1.Exception(`"${Model.name}.${key}" must be an array when setting "${relation.type}" relationship`);
            }
            this.$preloaded[key] = [];
        }
        return this.$pushRelated(key, models);
    }
    /**
     * Push related adds to the existing related collection
     */
    $pushRelated(key, models) {
        const Model = this.constructor;
        const relation = Model.$relationsDefinitions.get(key);
        /**
         * Ignore when relation is not defined
         */
        if (!relation) {
            return;
        }
        /**
         * Create multiple for `hasMany` `manyToMany` and `hasManyThrough`
         */
        if (MANY_RELATIONS.includes(relation.type)) {
            this.$preloaded[key] = (this.$preloaded[key] || []).concat(models);
            return;
        }
        /**
         * Dis-allow setting multiple model instances for a one to one relationship
         */
        if (Array.isArray(models)) {
            throw new Error(`"${Model.name}.${key}" cannot reference more than one instance of "${relation.relatedModel().name}" model`);
        }
        this.$preloaded[key] = models;
    }
    /**
     * Merges the object with the model attributes, assuming object keys
     * are coming the database.
     *
     * 1. If key is unknown, it will be added to the `extras` object.
     * 2. If key is defined as a relationship, it will be ignored and one must call `$setRelated`.
     */
    $consumeAdapterResult(adapterResult, sideloadedAttributes) {
        const Model = this.constructor;
        /**
         * Merging sideloaded attributes with the existing sideloaded values
         * on the model instance
         */
        if (sideloadedAttributes) {
            this.$sideloaded = Object.assign({}, this.$sideloaded, sideloadedAttributes);
        }
        /**
         * Merge result of adapter with the attributes. This enables
         * the adapter to hydrate models with properties generated
         * as a result of insert or update
         */
        if ((0, utils_2.isObject)(adapterResult)) {
            Object.keys(adapterResult).forEach((key) => {
                /**
                 * Pull the attribute name from the column name, since adapter
                 * results always holds the column names.
                 */
                const attributeName = Model.$keys.columnsToAttributes.get(key);
                if (attributeName) {
                    const attribute = Model.$getColumn(attributeName);
                    /**
                     * Invoke `consume` method for the column, before setting the
                     * attribute
                     */
                    const value = typeof attribute.consume === 'function'
                        ? attribute.consume(adapterResult[key], attributeName, this)
                        : adapterResult[key];
                    /**
                     * When consuming the adapter result, we must always set the attributes
                     * directly, as we do not want to invoke setters.
                     */
                    this.$setAttribute(attributeName, value);
                    return;
                }
                /**
                 * If key is defined as a relation, then ignore it, since one
                 * must pass a qualified model to `this.$setRelated()`
                 */
                if (Model.$relationsDefinitions.has(key)) {
                    return;
                }
                /**
                 * Set directly on the model
                 */
                if (this.hasOwnProperty(key)) {
                    this[key] = adapterResult[key];
                    return;
                }
                this.$extras[key] = adapterResult[key];
            });
        }
    }
    /**
     * Sync originals with the attributes. After this `isDirty` will
     * return false
     */
    $hydrateOriginals() {
        this.$original = {};
        utils_1.lodash.merge(this.$original, this.$attributes);
    }
    /**
     * Set bulk attributes on the model instance. Setting relationships via
     * fill isn't allowed, since we disallow setting relationships
     * locally
     */
    fill(values, allowExtraProperties = false) {
        this.$attributes = {};
        this.merge(values, allowExtraProperties);
        this.fillInvoked = true;
        return this;
    }
    /**
     * Merge bulk attributes with existing attributes.
     *
     * 1. If key is unknown, it will be added to the `extras` object.
     * 2. If key is defined as a relationship, it will be ignored and one must call `$setRelated`.
     */
    merge(values, allowExtraProperties = false) {
        const Model = this.constructor;
        /**
         * Merge values with the attributes
         */
        if ((0, utils_2.isObject)(values)) {
            Object.keys(values).forEach((key) => {
                const value = values[key];
                /**
                 * Set as column
                 */
                if (Model.$hasColumn(key)) {
                    this[key] = value;
                    return;
                }
                /**
                 * Resolve the attribute name from the column names. Since people
                 * usaully define the column names directly as well by
                 * accepting them directly from the API.
                 */
                const attributeName = Model.$keys.columnsToAttributes.get(key);
                if (attributeName) {
                    this[attributeName] = value;
                    return;
                }
                /**
                 * If key is defined as a relation, then ignore it, since one
                 * must pass a qualified model to `this.$setRelated()`
                 */
                if (Model.$relationsDefinitions.has(key)) {
                    return;
                }
                /**
                 * If the property already exists on the model, then set it
                 * as it is vs defining it as an extra property
                 */
                if (this.hasOwnProperty(key)) {
                    this[key] = value;
                    return;
                }
                /**
                 * Raise error when not instructed to ignore non-existing properties.
                 */
                if (!allowExtraProperties) {
                    throw new Error(`Cannot define "${key}" on "${Model.name}" model, since it is not defined as a model property`);
                }
                this.$extras[key] = value;
            });
        }
        return this;
    }
    /**
     * Preloads one or more relationships for the current model
     */
    async load(relationName, callback) {
        this.ensureIsntDeleted();
        if (!this.$isPersisted) {
            throw new utils_1.Exception('Cannot lazy load relationship for an unpersisted model instance');
        }
        const Model = this.constructor;
        const preloader = new Preloader_1.Preloader(Model);
        if (typeof relationName === 'function') {
            relationName(preloader);
        }
        else {
            preloader.load(relationName, callback);
        }
        await preloader
            .sideload(this.$sideloaded)
            .processAllForOne(this, Model.$adapter.modelClient(this));
    }
    /**
     * @deprecated
     */
    async preload(relationName, callback) {
        process.emitWarning('DeprecationWarning', '"Model.preload()" is deprecated. Use "Model.load()" instead');
        return this.load(relationName, callback);
    }
    /**
     * Lazy load the relationship aggregate value
     */
    loadAggregate(relationName, callback) {
        this.ensureIsntDeleted();
        if (!this.$isPersisted) {
            throw new utils_1.Exception('Cannot lazy load relationship aggregates for an unpersisted model instance');
        }
        return new LazyLoad_1.LazyLoadAggregates(this).loadAggregate(relationName, callback);
    }
    /**
     * Lazy load the relationship count value
     */
    loadCount(relationName, callback) {
        this.ensureIsntDeleted();
        if (!this.$isPersisted) {
            throw new utils_1.Exception('Cannot lazy load relationship aggregates for an unpersisted model instance');
        }
        return new LazyLoad_1.LazyLoadAggregates(this).loadCount(relationName, callback);
    }
    /**
     * Perform save on the model instance to commit mutations.
     */
    async save() {
        this.ensureIsntDeleted();
        const Model = this.constructor;
        /**
         * Persit the model when it's not persisted already
         */
        if (!this.$isPersisted) {
            await Model.$hooks.exec('before', 'create', this);
            await Model.$hooks.exec('before', 'save', this);
            this.initiateAutoCreateColumns();
            await Model.$adapter.insert(this, this.prepareForAdapter(this.$attributes));
            this.$hydrateOriginals();
            this.$isPersisted = true;
            await Model.$hooks.exec('after', 'create', this);
            await Model.$hooks.exec('after', 'save', this);
            return this;
        }
        /**
         * Call hooks before hand, so that they have the chance
         * to make mutations that produces one or more `$dirty`
         * fields.
         */
        await Model.$hooks.exec('before', 'update', this);
        await Model.$hooks.exec('before', 'save', this);
        /**
         * Do not issue updates when model doesn't have any mutations
         */
        if (!this.$isDirty) {
            return this;
        }
        /**
         * Perform update
         */
        this.initiateAutoUpdateColumns();
        await Model.$adapter.update(this, this.prepareForAdapter(this.$dirty));
        this.$hydrateOriginals();
        await Model.$hooks.exec('after', 'update', this);
        await Model.$hooks.exec('after', 'save', this);
        return this;
    }
    /**
     * Perform delete by issuing a delete request on the adapter
     */
    async delete() {
        this.ensureIsntDeleted();
        const Model = this.constructor;
        await Model.$hooks.exec('before', 'delete', this);
        await Model.$adapter.delete(this);
        this.$isDeleted = true;
        await Model.$hooks.exec('after', 'delete', this);
    }
    /**
     * Serializes model attributes to a plain object
     */
    serializeAttributes(fields, raw = false) {
        const Model = this.constructor;
        return Object.keys(this.$attributes).reduce((result, key) => {
            const column = Model.$getColumn(key);
            if (!this.shouldSerializeField(column.serializeAs, fields)) {
                return result;
            }
            const value = this[key];
            result[column.serializeAs] =
                typeof column.serialize === 'function' && !raw ? column.serialize(value, key, this) : value;
            return result;
        }, {});
    }
    /**
     * Serializes model compute properties to an object.
     */
    serializeComputed(fields) {
        const Model = this.constructor;
        const result = {};
        Model.$computedDefinitions.forEach((value, key) => {
            const computedValue = this[key];
            if (computedValue !== undefined && this.shouldSerializeField(value.serializeAs, fields)) {
                result[value.serializeAs] = computedValue;
            }
        });
        return result;
    }
    /**
     * Serializes relationships to a plain object. When `raw=true`, it will
     * recurisvely serialize the relationships as well.
     */
    serializeRelations(cherryPick, raw = false) {
        const Model = this.constructor;
        return Object.keys(this.$preloaded).reduce((result, key) => {
            const relation = Model.$getRelation(key);
            /**
             * Do not serialize relationship, when serializeAs is null
             */
            if (!relation.serializeAs) {
                return result;
            }
            const value = this.$preloaded[key];
            /**
             * Return relationship model as it is, when `raw` is true.
             */
            if (raw) {
                result[relation.serializeAs] = value;
                return result;
            }
            /**
             * Always make sure we passing a valid object or undefined
             * to the relationships
             */
            const relationOptions = cherryPick ? cherryPick[relation.serializeAs] : undefined;
            result[relation.serializeAs] = Array.isArray(value)
                ? value.map((one) => one.serialize(relationOptions))
                : value === null
                    ? null
                    : value.serialize(relationOptions);
            return result;
        }, {});
    }
    /**
     * Converting model to it's JSON representation
     */
    serialize(cherryPick) {
        let extras = null;
        if (this['serializeExtras'] === true) {
            extras = { meta: this.$extras };
        }
        else if (typeof this['serializeExtras'] === 'function') {
            extras = this['serializeExtras']();
        }
        return {
            ...this.serializeAttributes(cherryPick?.fields, false),
            ...this.serializeRelations(cherryPick?.relations, false),
            ...this.serializeComputed(cherryPick?.fields),
            ...extras,
        };
    }
    /**
     * Convert model to a plain Javascript object
     */
    toObject() {
        const Model = this.constructor;
        const computed = {};
        /**
         * Relationships toObject
         */
        const preloaded = Object.keys(this.$preloaded).reduce((result, key) => {
            const value = this.$preloaded[key];
            result[key] = Array.isArray(value) ? value.map((one) => one.toObject()) : value.toObject();
            return result;
        }, {});
        /**
         * Update computed object with computed definitions
         */
        Model.$computedDefinitions.forEach((_, key) => {
            const computedValue = this[key];
            if (computedValue !== undefined) {
                computed[key] = computedValue;
            }
        });
        return {
            ...this.$attributes,
            ...preloaded,
            ...computed,
            $extras: this.$extras,
        };
    }
    /**
     * Returns the serialize method output. However, any model can overwrite
     * it to define it's custom serialize output
     */
    toJSON() {
        return this.serialize();
    }
    /**
     * Returns the query for `insert`, `update` or `delete` actions.
     * Since the query builder for these actions are not exposed to
     * the end user, this method gives a way to compose queries.
     */
    $getQueryFor(action, client) {
        const modelConstructor = this.constructor;
        const primaryKeyColumn = modelConstructor.$keys.attributesToColumns.get(modelConstructor.primaryKey, modelConstructor.primaryKey);
        /**
         * Returning insert query for the inserts
         */
        if (action === 'insert') {
            const insertQuery = client.insertQuery().table(modelConstructor.table);
            insertQuery.returning(primaryKeyColumn);
            return insertQuery;
        }
        /**
         * When self assigning the primary key, then we read the primary
         * value from the originals and the attributes, since we allow
         * updating primary key itself
         */
        const primaryKeyValue = modelConstructor.selfAssignPrimaryKey
            ? this.$original[primaryKeyColumn]
            : this.$primaryKeyValue;
        /**
         * Returning generic query builder for rest of the queries
         */
        return client.modelQuery(modelConstructor).where(primaryKeyColumn, primaryKeyValue);
    }
    /**
     * Returns an instance of relationship on the given model
     */
    related(relationName) {
        const Model = this.constructor;
        const relation = Model.$getRelation(relationName);
        (0, utils_2.ensureRelation)(relationName, relation);
        relation.boot();
        return relation.client(this, Model.$adapter.modelClient(this));
    }
    /**
     * Reload/Refresh the model instance
     */
    async refresh() {
        this.ensureIsntDeleted();
        /**
         * Noop when model instance is not persisted
         */
        if (!this.$isPersisted) {
            return this;
        }
        const Model = this.constructor;
        await Model.$adapter.refresh(this);
        return this;
    }
};
/**
 * Naming strategy for model properties
 */
Object.defineProperty(BaseModel, "namingStrategy", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new SnakeCase_1.SnakeCaseNamingStrategy()
});
/**
 * Query scopes defined on the model
 */
Object.defineProperty(BaseModel, "$queryScopes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {}
});
BaseModel = BaseModel_1 = __decorate([
    StaticImplements(),
    __metadata("design:paramtypes", [])
], BaseModel);
exports.BaseModel = BaseModel;
