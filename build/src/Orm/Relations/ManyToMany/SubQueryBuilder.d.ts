import knex from 'knex';
import { LucidModel } from '@ioc:Adonis/Lucid/Model';
import { QueryClientContract } from '@ioc:Adonis/Lucid/Database';
import { ManyToManySubQueryBuilderContract } from '@ioc:Adonis/Lucid/Relations';
import { ManyToMany } from './index';
import { BaseSubQueryBuilder } from '../Base/SubQueryBuilder';
/**
 * Exposes the API to construct sub queries for a many to many relationships
 */
export declare class ManyToManySubQueryBuilder extends BaseSubQueryBuilder implements ManyToManySubQueryBuilderContract<LucidModel> {
    relation: ManyToMany;
    /**
     * Pivot helpers provides the implementation for pivot table constraints
     * and clauses
     */
    private pivotHelpers;
    /**
     * Reference to the related table
     */
    private relatedTable;
    /**
     * Whether or not the constraints has been applied
     */
    protected appliedConstraints: boolean;
    private hasSelfRelation;
    constructor(builder: knex.QueryBuilder, client: QueryClientContract, relation: ManyToMany);
    /**
     * Prefixes the related table name to a column
     */
    private prefixRelatedTable;
    /**
     * Transforms the selected column names by prefixing the
     * table name
     */
    private transformRelatedTableColumns;
    /**
     * The keys for constructing the join query
     */
    protected getRelationKeys(): string[];
    /**
     * Applies constraint to limit rows to the current relationship
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
     * Clones the current query
     */
    clone(): ManyToManySubQueryBuilder;
}
