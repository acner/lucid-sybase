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
exports.HasManyQueryClient = void 0;
const utils_1 = require("../../../utils");
const QueryBuilder_1 = require("./QueryBuilder");
const SubQueryBuilder_1 = require("./SubQueryBuilder");
/**
 * Query client for executing queries in scope to the defined
 * relationship
 */
class HasManyQueryClient {
    constructor(relation, parent, client) {
        this.relation = relation;
        this.parent = parent;
        this.client = client;
    }
    /**
     * Generate a related query builder
     */
    static query(client, relation, row) {
        const query = new QueryBuilder_1.HasManyQueryBuilder(client.knexQuery(), client, row, relation);
        typeof relation.onQueryHook === 'function' && relation.onQueryHook(query);
        return query;
    }
    /**
     * Generate a related eager query builder
     */
    static eagerQuery(client, relation, rows) {
        const query = new QueryBuilder_1.HasManyQueryBuilder(client.knexQuery(), client, rows, relation);
        query.isRelatedPreloadQuery = true;
        typeof relation.onQueryHook === 'function' && relation.onQueryHook(query);
        return query;
    }
    /**
     * Returns an instance of the sub query
     */
    static subQuery(client, relation) {
        const query = new SubQueryBuilder_1.HasManySubQueryBuilder(client.knexQuery(), client, relation);
        typeof relation.onQueryHook === 'function' && relation.onQueryHook(query);
        return query;
    }
    /**
     * Returns instance of query builder
     */
    query() {
        return HasManyQueryClient.query(this.client, this.relation, this.parent);
    }
    /**
     * Save related model instance
     */
    async save(related) {
        await utils_1.managedTransaction(this.parent.$trx || this.client, async (trx) => {
            this.parent.$trx = trx;
            await this.parent.save();
            this.relation.hydrateForPersistance(this.parent, related);
            related.$trx = trx;
            await related.save();
        });
    }
    /**
     * Save related model instance
     */
    async saveMany(related) {
        const parent = this.parent;
        await utils_1.managedTransaction(this.parent.$trx || this.client, async (trx) => {
            this.parent.$trx = trx;
            await parent.save();
            for (let row of related) {
                this.relation.hydrateForPersistance(this.parent, row);
                row.$trx = trx;
                await row.save();
            }
        });
    }
    /**
     * Create instance of the related model
     */
    async create(values) {
        return utils_1.managedTransaction(this.parent.$trx || this.client, async (trx) => {
            this.parent.$trx = trx;
            await this.parent.save();
            const valuesToPersist = Object.assign({}, values);
            this.relation.hydrateForPersistance(this.parent, valuesToPersist);
            return this.relation.relatedModel().create(valuesToPersist, { client: trx });
        });
    }
    /**
     * Create instance of the related model
     */
    async createMany(values) {
        const parent = this.parent;
        return utils_1.managedTransaction(this.parent.$trx || this.client, async (trx) => {
            this.parent.$trx = trx;
            await parent.save();
            const valuesToPersist = values.map((value) => {
                const valueToPersist = Object.assign({}, value);
                this.relation.hydrateForPersistance(this.parent, valueToPersist);
                return valueToPersist;
            });
            return this.relation.relatedModel().createMany(valuesToPersist, { client: trx });
        });
    }
    /**
     * Get the first matching related instance or create a new one
     */
    async firstOrCreate(search, savePayload) {
        return utils_1.managedTransaction(this.parent.$trx || this.client, async (trx) => {
            this.parent.$trx = trx;
            await this.parent.save();
            const valuesToPersist = Object.assign({}, search);
            this.relation.hydrateForPersistance(this.parent, valuesToPersist);
            return this.relation
                .relatedModel()
                .firstOrCreate(valuesToPersist, savePayload, { client: trx });
        });
    }
    /**
     * Update the existing row or create a new one
     */
    async updateOrCreate(search, updatePayload) {
        return utils_1.managedTransaction(this.parent.$trx || this.client, async (trx) => {
            this.parent.$trx = trx;
            await this.parent.save();
            const valuesToPersist = Object.assign({}, search);
            this.relation.hydrateForPersistance(this.parent, valuesToPersist);
            return this.relation
                .relatedModel()
                .updateOrCreate(valuesToPersist, updatePayload, { client: trx });
        });
    }
    /**
     * Fetch the existing related rows or create new one's
     */
    async fetchOrCreateMany(payload, predicate) {
        return utils_1.managedTransaction(this.parent.$trx || this.client, async (trx) => {
            this.parent.$trx = trx;
            await this.parent.save();
            payload.forEach((row) => {
                this.relation.hydrateForPersistance(this.parent, row);
            });
            predicate = Array.isArray(predicate) ? predicate : predicate ? [predicate] : [];
            return this.relation
                .relatedModel()
                .fetchOrCreateMany(predicate.concat(this.relation.foreignKey), payload, {
                client: trx,
            });
        });
    }
    /**
     * Update the existing related rows or create new one's
     */
    async updateOrCreateMany(payload, predicate) {
        return utils_1.managedTransaction(this.parent.$trx || this.client, async (trx) => {
            this.parent.$trx = trx;
            await this.parent.save();
            payload.forEach((row) => {
                this.relation.hydrateForPersistance(this.parent, row);
            });
            predicate = Array.isArray(predicate) ? predicate : predicate ? [predicate] : [];
            return this.relation
                .relatedModel()
                .updateOrCreateMany(predicate.concat(this.relation.foreignKey), payload, {
                client: trx,
            });
        });
    }
}
exports.HasManyQueryClient = HasManyQueryClient;
