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
exports.HasManyQueryBuilder = void 0;
const utils_1 = require("../../../utils");
const QueryBuilder_1 = require("../Base/QueryBuilder");
/**
 * Extends the model query builder for executing queries in scope
 * to the current relationship
 */
class HasManyQueryBuilder extends QueryBuilder_1.BaseQueryBuilder {
    constructor(builder, client, parent, relation) {
        super(builder, client, relation, (userFn) => {
            return ($builder) => {
                const subQuery = new HasManyQueryBuilder($builder, this.client, this.parent, this.relation);
                subQuery.isChildQuery = true;
                subQuery.isRelatedPreloadQuery = this.isRelatedPreloadQuery;
                userFn(subQuery);
            };
        });
        this.parent = parent;
        this.relation = relation;
        this.appliedConstraints = false;
    }
    /**
     * Profiler data for HasMany relationship
     */
    profilerData() {
        return {
            type: this.relation.type,
            model: this.relation.model.name,
            relatedModel: this.relation.relatedModel().name,
        };
    }
    /**
     * The keys for constructing the join query
     */
    getRelationKeys() {
        return [this.relation.foreignKey];
    }
    /**
     * Clones the current query
     */
    clone() {
        const clonedQuery = new HasManyQueryBuilder(this.knexQuery.clone(), this.client, this.parent, this.relation);
        this.applyQueryFlags(clonedQuery);
        clonedQuery.appliedConstraints = this.appliedConstraints;
        clonedQuery.isRelatedPreloadQuery = this.isRelatedPreloadQuery;
        return clonedQuery;
    }
    /**
     * Applies constraint to limit rows to the current relationship
     * only.
     */
    applyConstraints() {
        if (this.appliedConstraints) {
            return;
        }
        const queryAction = this.queryAction();
        this.appliedConstraints = true;
        /**
         * Eager query contraints
         */
        if (Array.isArray(this.parent)) {
            this.whereIn(this.relation.foreignKey, utils_1.unique(this.parent.map((model) => {
                return utils_1.getValue(model, this.relation.localKey, this.relation, queryAction);
            })));
            return;
        }
        /**
         * Query constraints
         */
        const value = utils_1.getValue(this.parent, this.relation.localKey, this.relation, queryAction);
        this.where(this.relation.foreignKey, value);
    }
    /**
     * Same as standard model query builder paginate method. But ensures that
     * it is not invoked during eagerloading
     */
    paginate(page, perPage = 20) {
        if (this.isRelatedPreloadQuery) {
            throw new Error(`Cannot paginate relationship "${this.relation.relationName}" during preload`);
        }
        return super.paginate(page, perPage);
    }
    /**
     * Returns the group limit query
     */
    getGroupLimitQuery() {
        const { direction, column } = this.groupConstraints.orderBy || {
            column: this.resolveKey(this.relation.relatedModel().primaryKey),
            direction: 'desc',
        };
        const rowName = 'adonis_group_limit_counter';
        const partitionBy = `PARTITION BY ${this.relation.foreignKeyColumName}`;
        const orderBy = `ORDER BY ${column} ${direction}`;
        /**
         * Select * when no columns are selected
         */
        if (!this.getSelectedColumns()) {
            this.select('*');
        }
        this.select(this.client.raw(`row_number() over (${partitionBy} ${orderBy}) as ${rowName}`)).as('adonis_temp');
        return this.relation
            .relatedModel()
            .query()
            .from(this)
            .where(rowName, '<=', this.groupConstraints.limit);
    }
}
exports.HasManyQueryBuilder = HasManyQueryBuilder;
