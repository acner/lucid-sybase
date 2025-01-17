/// <reference path="../../../../adonis-typings/model.d.ts" />
import knex from 'knex';
import { LucidModel, LucidRow } from '@ioc:Adonis/Lucid/Model';
import { QueryClientContract } from '@ioc:Adonis/Lucid/Database';
import { ManyToManyQueryBuilderContract } from '@ioc:Adonis/Lucid/Relations';
import { ManyToMany } from './index';
import { BaseQueryBuilder } from '../Base/QueryBuilder';
/**
 * Extends the model query builder for executing queries in scope
 * to the current relationship
 */
export declare class ManyToManyQueryBuilder extends BaseQueryBuilder implements ManyToManyQueryBuilderContract<LucidModel, LucidModel> {
    private parent;
    relation: ManyToMany;
    private pivotQuery;
    private relatedTable;
    private pivotHelpers;
    protected cherryPickingKeys: boolean;
    protected appliedConstraints: boolean;
    /**
     * A boolean to know if query build targets only the pivot
     * table or not
     */
    get isPivotOnlyQuery(): boolean;
    set isPivotOnlyQuery(pivotOnly: boolean);
    constructor(builder: knex.QueryBuilder, client: QueryClientContract, parent: LucidRow | LucidRow[], relation: ManyToMany);
    /**
     * Profiler data for ManyToMany relationship
     */
    protected profilerData(): {
        type: "manyToMany";
        model: string;
        pivotTable: string;
        relatedModel: string;
    };
    /**
     * The keys for constructing the join query
     */
    protected getRelationKeys(): string[];
    /**
     * Prefixes the related table name to a column
     */
    private prefixRelatedTable;
    /**
     * Adds where constraint to the pivot table
     */
    private addWhereConstraints;
    /**
     * Transforms the selected column names by prefixing the
     * table name
     */
    private transformRelatedTableColumns;
    /**
     * Applying query constraints to scope them to relationship
     * only.
     */
    protected applyConstraints(): void;
    /**
     * Select keys from the related table
     */
    select(...args: any[]): this;
    /**
     * Add where clause with pivot table prefix
     */
    wherePivot(key: any, operator?: any, value?: any): this;
    /**
     * Add or where clause with pivot table prefix
     */
    orWherePivot(key: any, operator?: any, value?: any): this;
    /**
     * Alias for wherePivot
     */
    andWherePivot(key: any, operator?: any, value?: any): this;
    /**
     * Add where not pivot
     */
    whereNotPivot(key: any, operator?: any, value?: any): this;
    /**
     * Add or where not pivot
     */
    orWhereNotPivot(key: any, operator?: any, value?: any): this;
    /**
     * Alias for `whereNotPivot`
     */
    andWhereNotPivot(key: any, operator?: any, value?: any): this;
    /**
     * Adds where in clause
     */
    whereInPivot(key: any, value: any): this;
    /**
     * Adds or where in clause
     */
    orWhereInPivot(key: any, value: any): this;
    /**
     * Alias from `whereInPivot`
     */
    andWhereInPivot(key: any, value: any): this;
    /**
     * Adds where not in clause
     */
    whereNotInPivot(key: any, value: any): this;
    /**
     * Adds or where not in clause
     */
    orWhereNotInPivot(key: any, value: any): this;
    /**
     * Alias from `whereNotInPivot`
     */
    andWhereNotInPivot(key: any, value: any): this;
    /**
     * Select pivot columns
     */
    pivotColumns(columns: string[]): this;
    /**
     * Clones query
     */
    clone(): ManyToManyQueryBuilder;
    /**
     * Paginate through rows inside a given table
     */
    paginate(page: number, perPage?: number): Promise<import("../../../Database/Paginator/SimplePaginator").SimplePaginator>;
    /**
     * Returns the group limit query
     */
    getGroupLimitQuery(): import("@ioc:Adonis/Lucid/Model").ModelQueryBuilderContract<LucidModel, LucidRow>;
}
