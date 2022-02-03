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
exports.ManyToManyQueryClient = void 0;
const luxon_1 = require("luxon");
const QueryBuilder_1 = require("./QueryBuilder");
const SubQueryBuilder_1 = require("./SubQueryBuilder");
const utils_1 = require("../../../utils");
/**
 * ------------------------------------------------------------
 *                    NO_PIVOT_ATTRS
 * ------------------------------------------------------------
 *
 * We do not define pivot attributes during a save/create calls. Coz, one can
 * attach the related instance with multiple parent instance.
 *
 * For example:
 *
 * user.related('skills').save(skill)
 * user1.related('skills').save(skill)
 *
 * As per the above example, the `skill.$extras.pivot_user_id` will have
 * which user id?
 *
 * Same is true with a create call
 *
 * const skill = user.related('skills').create({ name: 'Programming' })
 * user1.related('skills').save(skill)
 */
/**
 * Query client for executing queries in scope to the defined
 * relationship
 */
class ManyToManyQueryClient {
    constructor(relation, parent, client) {
        Object.defineProperty(this, "relation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: relation
        });
        Object.defineProperty(this, "parent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: parent
        });
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: client
        });
    }
    /**
     * Returns the timestamps for the pivot row
     */
    getPivotTimestamps(updatedAtOnly) {
        const timestamps = {};
        if (this.relation.pivotCreatedAtTimestamp && !updatedAtOnly) {
            timestamps[this.relation.pivotCreatedAtTimestamp] = luxon_1.DateTime.local().toFormat(this.client.dialect.dateTimeFormat);
        }
        if (this.relation.pivotUpdatedAtTimestamp) {
            timestamps[this.relation.pivotUpdatedAtTimestamp] = luxon_1.DateTime.local().toFormat(this.client.dialect.dateTimeFormat);
        }
        return timestamps;
    }
    /**
     * Generate a related query builder
     */
    static query(client, relation, rows) {
        const query = new QueryBuilder_1.ManyToManyQueryBuilder(client.knexQuery(), client, rows, relation);
        typeof relation.onQueryHook === 'function' && relation.onQueryHook(query);
        return query;
    }
    /**
     * Generate a related eager query builder
     */
    static eagerQuery(client, relation, rows) {
        const query = new QueryBuilder_1.ManyToManyQueryBuilder(client.knexQuery(), client, rows, relation);
        query.isRelatedPreloadQuery = true;
        typeof relation.onQueryHook === 'function' && relation.onQueryHook(query);
        return query;
    }
    /**
     * Returns an instance of the related sub query builder
     */
    static subQuery(client, relation) {
        const query = new SubQueryBuilder_1.ManyToManySubQueryBuilder(client.knexQuery(), client, relation);
        typeof relation.onQueryHook === 'function' && relation.onQueryHook(query);
        return query;
    }
    /**
     * Generate a related pivot query builder
     */
    static pivotQuery(client, relation, rows) {
        const query = new QueryBuilder_1.ManyToManyQueryBuilder(client.knexQuery(), client, rows, relation);
        query.isRelatedPreloadQuery = false;
        query.isPivotOnlyQuery = true;
        typeof relation.onQueryHook === 'function' && relation.onQueryHook(query);
        return query;
    }
    /**
     * Returns query builder instance
     */
    query() {
        return ManyToManyQueryClient.query(this.client, this.relation, this.parent);
    }
    /**
     * Returns a query builder instance for the pivot table only
     */
    pivotQuery() {
        return ManyToManyQueryClient.pivotQuery(this.client, this.relation, this.parent);
    }
    /**
     * Save related model instance.
     * @note: Read the "NO_PIVOT_ATTRS" section at the top
     */
    async save(related, performSync = true, pivotAttributes) {
        await (0, utils_1.managedTransaction)(this.parent.$trx || this.client, async (trx) => {
            /**
             * Persist parent
             */
            this.parent.$trx = trx;
            await this.parent.save();
            /**
             * Persist related
             */
            related.$trx = trx;
            await related.save();
            const [, relatedForeignKeyValue] = this.relation.getPivotRelatedPair(related);
            const pivotPayload = {
                [relatedForeignKeyValue]: pivotAttributes || {},
            };
            /**
             * Sync when checkExisting = true, to avoid duplicate rows. Otherwise
             * perform insert
             */
            if (performSync) {
                await this.sync(pivotPayload, false, trx);
            }
            else {
                await this.attach(pivotPayload, trx);
            }
        });
    }
    /**
     * Save many of related model instances
     * @note: Read the "NO_PIVOT_ATTRS" section at the top
     */
    async saveMany(related, performSync = true, pivotAttributes) {
        await (0, utils_1.managedTransaction)(this.parent.$trx || this.client, async (trx) => {
            /**
             * Persist parent
             */
            this.parent.$trx = trx;
            await this.parent.save();
            /**
             * Persist all related models
             */
            for (let one of related) {
                one.$trx = trx;
                await one.save();
            }
            const relatedForeignKeyValues = related.reduce((result, one, index) => {
                const [, relatedForeignKeyValue] = this.relation.getPivotRelatedPair(one);
                result[relatedForeignKeyValue] = pivotAttributes?.[index] || {};
                return result;
            }, {});
            /**
             * Sync when checkExisting = true, to avoid duplicate rows. Otherwise
             * perform insert
             */
            if (performSync) {
                await this.sync(relatedForeignKeyValues, false, trx);
            }
            else {
                await this.attach(relatedForeignKeyValues, trx);
            }
        });
    }
    /**
     * Create and persist an instance of related model. Also makes the pivot table
     * entry to create the relationship
     * @note: Read the "NO_PIVOT_ATTRS" section at the top
     */
    async create(values, pivotAttributes) {
        return (0, utils_1.managedTransaction)(this.parent.$trx || this.client, async (trx) => {
            this.parent.$trx = trx;
            await this.parent.save();
            /**
             * Create and persist related model instance
             */
            const related = await this.relation.relatedModel().create(values, { client: trx });
            const [, relatedForeignKeyValue] = this.relation.getPivotRelatedPair(related);
            const pivotPayload = {
                [relatedForeignKeyValue]: pivotAttributes || {},
            };
            /**
             * Attach new rows
             */
            await this.attach(pivotPayload, trx);
            return related;
        });
    }
    /**
     * Create and persist multiple of instances of related model. Also makes
     * the pivot table entries to create the relationship.
     * @note: Read the "NO_PIVOT_ATTRS" section at the top
     */
    async createMany(values, pivotAttributes) {
        return (0, utils_1.managedTransaction)(this.parent.$trx || this.client, async (trx) => {
            this.parent.$trx = trx;
            await this.parent.save();
            /**
             * Create and persist related model instance
             */
            const related = await this.relation.relatedModel().createMany(values, { client: trx });
            const relatedForeignKeyValues = related.reduce((result, one, index) => {
                const [, relatedForeignKeyValue] = this.relation.getPivotRelatedPair(one);
                result[relatedForeignKeyValue] = pivotAttributes?.[index] || {};
                return result;
            }, {});
            /**
             * Attach new rows
             */
            await this.attach(relatedForeignKeyValues, trx);
            return related;
        });
    }
    /**
     * Attach one or more related models using it's foreign key value
     * by performing insert inside the pivot table.
     */
    async attach(ids, trx) {
        /**
         * Pivot foreign key value (On the parent model)
         */
        const [, foreignKeyValue] = this.relation.getPivotPair(this.parent);
        /**
         * Finding if `ids` parameter is an object or not
         */
        const hasAttributes = !Array.isArray(ids);
        /**
         * Extracting pivot related foreign keys (On the related model)
         */
        const pivotRows = (!hasAttributes ? ids : Object.keys(ids)).map((id) => {
            return Object.assign(this.getPivotTimestamps(false), hasAttributes ? ids[id] : {}, {
                [this.relation.pivotForeignKey]: foreignKeyValue,
                [this.relation.pivotRelatedForeignKey]: id,
            });
        });
        if (!pivotRows.length) {
            return;
        }
        /**
         * Perform bulk insert
         */
        const query = trx ? trx.insertQuery() : this.client.insertQuery();
        await query.table(this.relation.pivotTable).multiInsert(pivotRows);
    }
    /**
     * Detach related ids from the pivot table
     */
    async detach(ids, trx) {
        const query = this.pivotQuery();
        /**
         * Scope deletion to specific rows when `id` is defined. Otherwise
         * delete all the rows
         */
        if (ids && ids.length) {
            query.whereInPivot(this.relation.pivotRelatedForeignKey, ids);
        }
        /**
         * Use transaction when defined
         */
        if (trx) {
            query.useTransaction(trx);
        }
        await query.del();
    }
    /**
     * Sync pivot rows by
     *
     * - Dropping the non-existing one's.
     * - Creating the new one's.
     * - Updating the existing one's with different attributes.
     */
    async sync(ids, 
    /**
     * Detach means, do not remove existing rows, that are
     * missing in this new object/array.
     */
    detach = true, trx) {
        await (0, utils_1.managedTransaction)(trx || this.client, async (transaction) => {
            const hasAttributes = !Array.isArray(ids);
            /**
             * An object of pivot rows from from the incoming ids or
             * an object of key-value pair.
             */
            const pivotRows = !hasAttributes
                ? ids.reduce((result, id) => {
                    result[id] = {};
                    return result;
                }, {})
                : ids;
            const query = this.pivotQuery().useTransaction(transaction);
            /**
             * We must scope the select query to related foreign key when ids
             * is an array and not an object. This will help in performance
             * when there are indexes defined on this key
             */
            if (!hasAttributes) {
                query.select(this.relation.pivotRelatedForeignKey);
            }
            const pivotRelatedForeignKeys = Object.keys(pivotRows);
            /**
             * Fetch existing pivot rows for the relationship
             */
            const existingPivotRows = await query
                .whereIn(this.relation.pivotRelatedForeignKey, pivotRelatedForeignKeys)
                .exec();
            /**
             * Find a diff of rows being removed, added or updated in comparison
             * to the existing pivot rows.
             */
            const { added, updated } = (0, utils_1.syncDiff)(existingPivotRows.reduce((result, row) => {
                result[row[this.relation.pivotRelatedForeignKey]] = row;
                return result;
            }, {}), pivotRows);
            /**
             * Add new rows
             */
            await this.attach(added, transaction);
            /**
             * Update
             */
            for (let id of Object.keys(updated)) {
                const attributes = updated[id];
                await this.pivotQuery()
                    .useTransaction(transaction)
                    .wherePivot(this.relation.pivotRelatedForeignKey, id)
                    .update(Object.assign({}, this.getPivotTimestamps(true), attributes));
            }
            /**
             * Return early when detach is disabled.
             */
            if (!detach) {
                return;
            }
            /**
             * Detach everything except the synced ids
             */
            await this.pivotQuery()
                .useTransaction(transaction)
                .whereNotInPivot(this.relation.pivotRelatedForeignKey, pivotRelatedForeignKeys)
                .del();
        });
    }
}
exports.ManyToManyQueryClient = ManyToManyQueryClient;
