import { LucidModel, LucidRow } from '@ioc:Adonis/Lucid/Model';
import { QueryClientContract } from '@ioc:Adonis/Lucid/Database';
import { OneOrMany } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder';
import { BelongsToClientContract } from '@ioc:Adonis/Lucid/Relations';
import { BelongsTo } from './index';
import { BelongsToQueryBuilder } from './QueryBuilder';
import { BelongsToSubQueryBuilder } from './SubQueryBuilder';
/**
 * Query client for executing queries in scope to the belongsTo relationship.
 */
export declare class BelongsToQueryClient implements BelongsToClientContract<BelongsTo, LucidModel> {
    relation: BelongsTo;
    private parent;
    private client;
    constructor(relation: BelongsTo, parent: LucidRow, client: QueryClientContract);
    /**
     * Generate a query builder instance
     */
    static query(client: QueryClientContract, relation: BelongsTo, rows: OneOrMany<LucidRow>): BelongsToQueryBuilder;
    /**
     * Generate a eager query
     */
    static eagerQuery(client: QueryClientContract, relation: BelongsTo, rows: OneOrMany<LucidRow>): BelongsToQueryBuilder;
    /**
     * Returns an instance of the subquery
     */
    static subQuery(client: QueryClientContract, relation: BelongsTo): BelongsToSubQueryBuilder;
    /**
     * Returns instance of query builder
     */
    query(): any;
    /**
     * Associate the related model with the parent model
     */
    associate(related: LucidRow): Promise<void>;
    /**
     * Drop association
     */
    dissociate(): Promise<void>;
}
