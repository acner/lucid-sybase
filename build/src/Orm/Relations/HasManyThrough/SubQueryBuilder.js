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
exports.HasManyThroughSubQueryBuilder = void 0;
const SubQueryBuilder_1 = require("../Base/SubQueryBuilder");
/**
 * Extends the model query builder for executing queries in scope
 * to the current relationship
 */
class HasManyThroughSubQueryBuilder extends SubQueryBuilder_1.BaseSubQueryBuilder {
    constructor(builder, client, relation) {
        super(builder, client, relation, (userFn) => {
            return ($builder) => {
                const subQuery = new HasManyThroughSubQueryBuilder($builder, this.client, this.relation);
                subQuery.isChildQuery = true;
                userFn(subQuery);
            };
        });
        this.relation = relation;
        /**
         * A boolean to track if query constraints for the relationship
         * has been applied or not
         */
        this.appliedConstraints = false;
        /**
         * Reference to the related table
         */
        this.relatedTable = this.relation.relatedModel().table;
        /**
         * Reference to the through table
         */
        this.throughTable = this.relation.throughModel().table;
        this.hasSelfRelation = this.relatedTable === this.relation.model.table;
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
        if (this.hasSelfRelation) {
            return `${this.selfJoinAlias}.${column}`;
        }
        return `${this.relatedTable}.${column}`;
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
     * The keys for constructing the join query
     */
    getRelationKeys() {
        return [this.relation.throughForeignKeyColumnName];
    }
    /**
     * Select keys from the related table
     */
    select(...args) {
        let columns = args;
        if (Array.isArray(args[0])) {
            columns = args[0];
        }
        this.knexQuery.select(this.transformRelatedTableColumns(columns));
        return this;
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
        /**
         * In case of self joins, we must alias the table selection
         */
        if (this.relation.relatedModel() === this.relation.model) {
            this.knexQuery.from(`${this.relatedTable} as ${this.selfJoinAlias}`);
        }
        this.innerJoin(this.throughTable, this.prefixThroughTable(this.relation.throughLocalKeyColumnName), this.prefixRelatedTable(this.relation.throughForeignKeyColumnName));
        this.where(`${this.relation.model.table}.${this.relation.localKeyColumnName}`, this.client.ref(this.prefixThroughTable(this.relation.foreignKeyColumnName)));
    }
    /**
     * Clones the current query
     */
    clone() {
        const clonedQuery = new HasManyThroughSubQueryBuilder(this.knexQuery.clone(), this.client, this.relation);
        this.applyQueryFlags(clonedQuery);
        clonedQuery.appliedConstraints = this.appliedConstraints;
        return clonedQuery;
    }
}
exports.HasManyThroughSubQueryBuilder = HasManyThroughSubQueryBuilder;
