"use strict";
/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adapter = void 0;
/// <reference path="../../../adonis-typings/index.ts" />
const utils_1 = require("@poppinss/utils");
/**
 * Adapter exposes the API to make database queries and constructor
 * model instances from it.
 */
class Adapter {
    constructor(db) {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: db
        });
    }
    getPrimaryKeyColumnName(Model) {
        return Model.$keys.attributesToColumns.get(Model.primaryKey, Model.primaryKey);
    }
    /**
     * Returns the query client based upon the model instance
     */
    modelConstructorClient(modelConstructor, options) {
        if (options && options.client) {
            return options.client;
        }
        const connection = (options && options.connection) || modelConstructor.connection;
        const profiler = options && options.profiler;
        return this.db.connection(connection, { profiler });
    }
    /**
     * Returns the model query builder instance for a given model
     */
    query(modelConstructor, options) {
        const client = this.modelConstructorClient(modelConstructor, options);
        return client.modelQuery(modelConstructor);
    }
    /**
     * Returns query client for a model instance by inspecting it's options
     */
    modelClient(instance) {
        const modelConstructor = instance.constructor;
        return instance.$trx
            ? instance.$trx
            : this.modelConstructorClient(modelConstructor, instance.$options);
    }
    /**
     * Perform insert query on a given model instance
     */
    async insert(instance, attributes) {
        const query = instance.$getQueryFor('insert', this.modelClient(instance));
        const Model = instance.constructor;
        const primaryKeyColumnName = this.getPrimaryKeyColumnName(Model);
        const result = await query.insert(attributes).reporterData({ model: Model.name });
        if (!Model.selfAssignPrimaryKey) {
            instance.$consumeAdapterResult({ [primaryKeyColumnName]: result[0] });
        }
    }
    /**
     * Perform update query on a given model instance
     */
    async update(instance, dirty) {
        await instance.$getQueryFor('update', this.modelClient(instance)).update(dirty);
    }
    /**
     * Perform delete query on a given model instance
     */
    async delete(instance) {
        await instance.$getQueryFor('delete', this.modelClient(instance)).del();
    }
    /**
     * Refresh the model instance attributes
     */
    async refresh(instance) {
        const Model = instance.constructor;
        const primaryKeyColumnName = this.getPrimaryKeyColumnName(Model);
        const freshModelInstance = await instance
            .$getQueryFor('refresh', this.modelClient(instance))
            .first();
        if (!freshModelInstance) {
            throw new utils_1.Exception([
                '"Model.refresh" failed. ',
                `Unable to lookup "${Model.table}" table where "${primaryKeyColumnName}" = ${instance.$primaryKeyValue}`,
            ].join(''));
        }
        instance.fill(freshModelInstance.$attributes);
        instance.$hydrateOriginals();
    }
}
exports.Adapter = Adapter;
