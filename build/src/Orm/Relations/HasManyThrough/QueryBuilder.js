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
exports.HasManyThroughQueryBuilder = void 0;
const utils_1 = require("../../../utils");
const QueryBuilder_1 = require("../Base/QueryBuilder");
/**
 * Extends the model query builder for executing queries in scope
 * to the current relationship
 */
class HasManyThroughQueryBuilder extends QueryBuilder_1.BaseQueryBuilder {
    constructor(builder, client, parent, relation) {
        super(builder, client, relation, (userFn) => {
            return ($builder) => {
                const subQuery = new HasManyThroughQueryBuilder($builder, this.client, this.parent, this.relation);
                subQuery.isChildQuery = true;
                subQuery.isRelatedPreloadQuery = this.isRelatedPreloadQuery;
                userFn(subQuery);
            };
        });
        this.parent = parent;
        this.relation = relation;
        this.cherryPickingKeys = false;
        this.appliedConstraints = false;
        this.throughTable = this.relation.throughModel().table;
        this.relatedTable = this.relation.relatedModel().table;
    }
    /**
     * Prefixes the through table name to a column
     */
    prefixThroughTable(column) {
        return `${this.throughTable}.${column}`;
    }
    /**
     * Prefixes the related table name to a column
     */
    prefixRelatedTable(column) {
        return `${this.relatedTable}.${column}`;
    }
    /**
     * Adds where constraint to the pivot table
     */
    addWhereConstraints(builder) {
        const queryAction = this.queryAction();
        /**
         * Eager query contraints
         */
        if (Array.isArray(this.parent)) {
            builder.whereIn(this.prefixThroughTable(this.relation.foreignKeyColumnName), utils_1.unique(this.parent.map((model) => {
                return utils_1.getValue(model, this.relation.localKey, this.relation, queryAction);
            })));
            return;
        }
        /**
         * Query constraints
         */
        const value = utils_1.getValue(this.parent, this.relation.localKey, this.relation, queryAction);
        builder.where(this.prefixThroughTable(this.relation.foreignKeyColumnName), value);
    }
    /**
     * Transforms the selected column names by prefixing the
     * table name
     */
    transformRelatedTableColumns(columns) {
        return columns.map((column) => {
            if (typeof column === 'string') {
                return this.prefixRelatedTable(this.resolveKey(column));
            }
            return this.transformValue(column);
        });
    }
    /**
     * Profiler data for HasManyThrough relationship
     */
    profilerData() {
        return {
            type: this.relation.type,
            model: this.relation.model.name,
            throughModel: this.relation.throughModel().name,
            relatedModel: this.relation.relatedModel().name,
        };
    }
    /**
     * The keys for constructing the join query
     */
    getRelationKeys() {
        return [this.relation.throughForeignKeyColumnName];
    }
    /**
     * Applies constraint to limit rows to the current relationship
     * only.
     */
    applyConstraints() {
        if (this.appliedConstraints) {
            return;
        }
        this.appliedConstraints = true;
        if (['delete', 'update'].includes(this.queryAction())) {
            this.whereIn(this.prefixRelatedTable(this.relation.throughForeignKeyColumnName), (subQuery) => {
                subQuery.from(this.throughTable);
                this.addWhereConstraints(subQuery);
            });
            return;
        }
        /**
         * Add select statements only when not running aggregate
         * queries. The end user can still select columns
         */
        if (!this.hasAggregates) {
            /**
             * Select * from related model when user is not cherry picking
             * keys
             */
            if (!this.cherryPickingKeys) {
                this.select('*');
            }
            /**
             * Selecting all from the related table, along with the foreign key of the
             * through table.
             */
            this.knexQuery.select(`${this.prefixThroughTable(this.relation.foreignKeyColumnName)} as ${this.relation.throughAlias(this.relation.foreignKeyColumnName)}`);
        }
        /**
         * Inner join
         */
        this.innerJoin(this.throughTable, this.prefixThroughTable(this.relation.throughLocalKeyColumnName), this.prefixRelatedTable(this.relation.throughForeignKeyColumnName));
        /**
         * Adding where constraints
         */
        this.addWhereConstraints(this);
    }
    /**
     * Select keys from the related table
     */
    select(...args) {
        let columns = args;
        if (Array.isArray(args[0])) {
            columns = args[0];
        }
        this.cherryPickingKeys = true;
        this.knexQuery.select(this.transformRelatedTableColumns(columns));
        return this;
    }
    /**
     * Clones the current query
     */
    clone() {
        const clonedQuery = new HasManyThroughQueryBuilder(this.knexQuery.clone(), this.client, this.parent, this.relation);
        this.applyQueryFlags(clonedQuery);
        clonedQuery.appliedConstraints = this.appliedConstraints;
        clonedQuery.cherryPickingKeys = this.cherryPickingKeys;
        clonedQuery.isRelatedPreloadQuery = this.isRelatedPreloadQuery;
        return clonedQuery;
    }
    /**
     * Paginate through rows inside a given table
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
            column: this.prefixRelatedTable(this.resolveKey(this.relation.relatedModel().primaryKey)),
            direction: 'desc',
        };
        const rowName = 'adonis_group_limit_counter';
        const partitionBy = `PARTITION BY ${this.prefixThroughTable(this.relation.foreignKeyColumnName)}`;
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
exports.HasManyThroughQueryBuilder = HasManyThroughQueryBuilder;
