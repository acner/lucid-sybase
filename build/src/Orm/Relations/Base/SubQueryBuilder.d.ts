import knex from 'knex';
import { LucidModel } from '@ioc:Adonis/Lucid/Model';
import { QueryClientContract } from '@ioc:Adonis/Lucid/Database';
import { DBQueryCallback } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder';
import { RelationshipsContract, RelationSubQueryBuilderContract } from '@ioc:Adonis/Lucid/Relations';
import { ModelQueryBuilder } from '../../QueryBuilder';
/**
 * Base query builder for ORM Relationships
 */
export declare abstract class BaseSubQueryBuilder extends ModelQueryBuilder implements RelationSubQueryBuilderContract<LucidModel> {
    /**
     * The counter for the self join alias. Usually will be set by
     * the consumer
     */
    selfJoinCounter: number;
    /**
     * Alias for the self join table
     */
    get selfJoinAlias(): string;
    /**
     * Is query a relationship query obtained using `related('relation').query()`
     */
    get isRelatedQuery(): false;
    /**
     * Is query a relationship query obtained using `related('relation').subQuery()`
     */
    get isRelatedSubQuery(): true;
    /**
     * Is query a relationship query obtained using one of the preload methods.
     */
    get isRelatedPreloadQuery(): false;
    constructor(builder: knex.QueryBuilder, client: QueryClientContract, relation: RelationshipsContract, dbCallback: DBQueryCallback);
    /**
     * Returns the selected columns
     */
    protected getSelectedColumns(): undefined | {
        grouping: 'columns';
        value: any[];
    };
    /**
     * Returns the sql query keys for the join query
     */
    protected abstract getRelationKeys(): string[];
    /**
     * The relationship query builder must implement this method
     * to apply relationship related constraints
     */
    protected abstract applyConstraints(): void;
    /**
     * Selects the relation keys. Invoked by the preloader
     */
    selectRelationKeys(): this;
    /**
     * Get query sql
     */
    toSQL(): knex.Sql;
    /**
     * prepare
     */
    prepare(): this;
    /**
     * Executing subqueries is not allowed. It is disabled in static types, but
     * in case someone by-pass typescript checks to invoke it
     */
    exec(): any;
    paginate(): any;
    update(): any;
    del(): any;
    first(): any;
    firstOrFail(): any;
}
