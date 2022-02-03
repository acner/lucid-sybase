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
exports.ManyToManyQueryBuilder = void 0;
const luxon_1 = require("luxon");
const PivotHelpers_1 = require("./PivotHelpers");
const utils_1 = require("../../../utils");
const QueryBuilder_1 = require("../Base/QueryBuilder");
/**
 * Extends the model query builder for executing queries in scope
 * to the current relationship
 */
class ManyToManyQueryBuilder extends QueryBuilder_1.BaseQueryBuilder {
    constructor(builder, client, parent, relation) {
        super(builder, client, relation, (userFn) => {
            return ($builder) => {
                const subQuery = new ManyToManyQueryBuilder($builder, this.client, this.parent, this.relation);
                subQuery.isChildQuery = true;
                subQuery.isPivotOnlyQuery = this.isPivotOnlyQuery;
                subQuery.isRelatedPreloadQuery = this.isRelatedPreloadQuery;
                userFn(subQuery);
                subQuery.applyWhere();
            };
        });
        Object.defineProperty(this, "parent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: parent
        });
        Object.defineProperty(this, "relation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: relation
        });
        Object.defineProperty(this, "pivotQuery", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "relatedTable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.relation.relatedModel().table
        });
        Object.defineProperty(this, "pivotHelpers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new PivotHelpers_1.PivotHelpers(this, true)
        });
        Object.defineProperty(this, "cherryPickingKeys", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "appliedConstraints", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    /**
     * A boolean to know if query build targets only the pivot
     * table or not
     */
    get isPivotOnlyQuery() {
        return this.pivotQuery;
    }
    set isPivotOnlyQuery(pivotOnly) {
        this.pivotQuery = pivotOnly;
        /**
         * Get plain object for a pivot only query
         */
        if (this.pivotQuery) {
            this.pojo();
        }
    }
    /**
     * Profiler data for ManyToMany relationship
     */
    profilerData() {
        return {
            type: this.relation.type,
            model: this.relation.model.name,
            pivotTable: this.relation.pivotTable,
            relatedModel: this.relation.relatedModel().name,
        };
    }
    /**
     * The keys for constructing the join query
     */
    getRelationKeys() {
        return [`${this.relation.relatedModel().table}.${this.relation.relatedKeyColumnName}`];
    }
    /**
     * Prefixes the related table name to a column
     */
    prefixRelatedTable(column) {
        return column.includes('.') ? column : `${this.relatedTable}.${column}`;
    }
    /**
     * Adds where constraint to the pivot table
     */
    addWhereConstraints() {
        const queryAction = this.queryAction();
        /**
         * Eager query contraints
         */
        if (Array.isArray(this.parent)) {
            this.wrapExisting().whereInPivot(this.relation.pivotForeignKey, (0, utils_1.unique)(this.parent.map((model) => {
                return (0, utils_1.getValue)(model, this.relation.localKey, this.relation, queryAction);
            })));
            return;
        }
        /**
         * Query constraints
         */
        const value = (0, utils_1.getValue)(this.parent, this.relation.localKey, this.relation, queryAction);
        this.wrapExisting().wherePivot(this.relation.pivotForeignKey, value);
    }
    /**
     * Transforms the selected column names by prefixing the
     * table name
     */
    transformRelatedTableColumns(columns) {
        if (this.isPivotOnlyQuery) {
            return columns;
        }
        return columns.map((column) => {
            if (typeof column === 'string') {
                return this.prefixRelatedTable(this.resolveKey(column));
            }
            return this.transformValue(column);
        });
    }
    /**
     * Applying query constraints to scope them to relationship
     * only.
     */
    applyConstraints() {
        if (this.appliedConstraints) {
            return;
        }
        this.appliedConstraints = true;
        if (this.isPivotOnlyQuery || ['delete', 'update'].includes(this.queryAction())) {
            this.from(this.relation.pivotTable);
            this.addWhereConstraints();
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
             * Select columns from the pivot table
             */
            this.pivotColumns([this.relation.pivotForeignKey, this.relation.pivotRelatedForeignKey]
                .concat(this.relation.pivotColumns)
                .concat(this.relation.pivotTimestamps));
        }
        /**
         * Add inner join between related model and pivot table
         */
        this.innerJoin(this.relation.pivotTable, `${this.relatedTable}.${this.relation.relatedKeyColumnName}`, `${this.relation.pivotTable}.${this.relation.pivotRelatedForeignKey}`);
        this.addWhereConstraints();
        return;
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
     * Add where clause with pivot table prefix
     */
    wherePivot(key, operator, value) {
        this.pivotHelpers.wherePivot('and', key, operator, value);
        return this;
    }
    /**
     * Add or where clause with pivot table prefix
     */
    orWherePivot(key, operator, value) {
        this.pivotHelpers.wherePivot('or', key, operator, value);
        return this;
    }
    /**
     * Alias for wherePivot
     */
    andWherePivot(key, operator, value) {
        return this.wherePivot(key, operator, value);
    }
    /**
     * Add where not pivot
     */
    whereNotPivot(key, operator, value) {
        this.pivotHelpers.wherePivot('not', key, operator, value);
        return this;
    }
    /**
     * Add or where not pivot
     */
    orWhereNotPivot(key, operator, value) {
        this.pivotHelpers.wherePivot('orNot', key, operator, value);
        return this;
    }
    /**
     * Alias for `whereNotPivot`
     */
    andWhereNotPivot(key, operator, value) {
        return this.whereNotPivot(key, operator, value);
    }
    /**
     * Adds where in clause
     */
    whereInPivot(key, value) {
        this.pivotHelpers.whereInPivot('and', key, value);
        return this;
    }
    /**
     * Adds or where in clause
     */
    orWhereInPivot(key, value) {
        this.pivotHelpers.whereInPivot('or', key, value);
        return this;
    }
    /**
     * Alias from `whereInPivot`
     */
    andWhereInPivot(key, value) {
        return this.whereInPivot(key, value);
    }
    /**
     * Adds where not in clause
     */
    whereNotInPivot(key, value) {
        this.pivotHelpers.whereInPivot('not', key, value);
        return this;
    }
    /**
     * Adds or where not in clause
     */
    orWhereNotInPivot(key, value) {
        this.pivotHelpers.whereInPivot('orNot', key, value);
        return this;
    }
    /**
     * Alias from `whereNotInPivot`
     */
    andWhereNotInPivot(key, value) {
        return this.whereNotInPivot(key, value);
    }
    /**
     * Same as "whereNull", but for the pivot table only
     */
    whereNullPivot(key) {
        this.pivotHelpers.whereNullPivot('and', key);
        return this;
    }
    /**
     * Same as "orWhereNull", but for the pivot table only
     */
    orWhereNullPivot(key) {
        this.pivotHelpers.whereNullPivot('or', key);
        return this;
    }
    /**
     * Same as "andWhereNull", but for the pivot table only
     */
    andWhereNullPivot(key) {
        return this.whereNullPivot(key);
    }
    /**
     * Same as "whereNotNull", but for the pivot table only
     */
    whereNotNullPivot(key) {
        this.pivotHelpers.whereNullPivot('not', key);
        return this;
    }
    /**
     * Same as "orWhereNotNull", but for the pivot table only
     */
    orWhereNotNullPivot(key) {
        this.pivotHelpers.whereNullPivot('orNot', key);
        return this;
    }
    /**
     * Same as "andWhereNotNull", but for the pivot table only
     */
    andWhereNotNullPivot(key) {
        return this.whereNotNullPivot(key);
    }
    /**
     * Select pivot columns
     */
    pivotColumns(columns) {
        this.pivotHelpers.pivotColumns(columns);
        return this;
    }
    /**
     * Clones query
     */
    clone() {
        this.applyConstraints();
        const clonedQuery = new ManyToManyQueryBuilder(this.knexQuery.clone(), this.client, this.parent, this.relation);
        this.applyQueryFlags(clonedQuery);
        clonedQuery.isPivotOnlyQuery = this.isPivotOnlyQuery;
        clonedQuery.cherryPickingKeys = this.cherryPickingKeys;
        clonedQuery.appliedConstraints = this.appliedConstraints;
        clonedQuery.isRelatedPreloadQuery = this.isRelatedPreloadQuery;
        clonedQuery.debug(this.debugQueries);
        clonedQuery.reporterData(this.customReporterData);
        return clonedQuery;
    }
    /**
     * Paginate through rows inside a given table
     */
    paginate(page, perPage = 20) {
        if (this.isRelatedPreloadQuery) {
            throw new Error(`Cannot paginate relationship "${this.relation.relationName}" during preload`);
        }
        this.applyConstraints();
        return super.paginate(page, perPage);
    }
    async exec() {
        const pivotTimestamps = this.relation.pivotTimestamps.map((timestamp) => this.relation.pivotAlias(timestamp));
        /**
         * Transform pivot timestamps
         */
        if (pivotTimestamps.length) {
            this.rowTransformer((row) => {
                pivotTimestamps.forEach((timestamp) => {
                    const timestampValue = row.$extras[timestamp];
                    if (!timestampValue) {
                        return;
                    }
                    /**
                     * Convert from string
                     */
                    if (typeof timestampValue === 'string') {
                        row.$extras[timestamp] = luxon_1.DateTime.fromSQL(timestampValue);
                    }
                    /**
                     * Convert from date
                     */
                    if (timestampValue instanceof Date) {
                        row.$extras[timestamp] = luxon_1.DateTime.fromJSDate(timestampValue);
                    }
                });
            });
        }
        return super.exec();
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
        const partitionBy = `PARTITION BY ${this.pivotHelpers.prefixPivotTable(this.relation.pivotForeignKey)}`;
        const orderBy = `ORDER BY ${column} ${direction}`;
        /**
         * Select * when no columns are selected
         */
        if (!this.getSelectedColumns()) {
            this.select('*');
        }
        this.select(this.client.raw(`row_number() over (${partitionBy} ${orderBy}) as ${rowName}`)).as('adonis_temp');
        const groupQuery = this.relation.relatedModel().query();
        groupQuery.usePreloader(this.preloader);
        groupQuery.sideload(this.sideloaded);
        groupQuery.debug(this.debugQueries);
        this.customReporterData && groupQuery.reporterData(this.customReporterData);
        return groupQuery.from(this).where(rowName, '<=', this.groupConstraints.limit);
    }
}
exports.ManyToManyQueryBuilder = ManyToManyQueryBuilder;
