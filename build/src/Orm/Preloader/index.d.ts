import { ModelObject, LucidRow, LucidModel } from '@ioc:Adonis/Lucid/Model';
import { PreloaderContract } from '@ioc:Adonis/Lucid/Relations';
import { QueryClientContract } from '@ioc:Adonis/Lucid/Database';
/**
 * Exposes the API to define and preload relationships in reference to
 * a model
 */
export declare class Preloader implements PreloaderContract<LucidRow> {
    private model;
    private preloads;
    /**
     * When invoked via query builder. The preloader will get the sideloaded
     * object, that should be transferred to relationship model instances.
     */
    private sideloaded;
    private debugQueries;
    constructor(model: LucidModel);
    /**
     * Processes a relationship for a single parent
     */
    private processRelation;
    /**
     * Process a given relationship for many parent instances. This happens
     * during eagerloading
     */
    private processRelationForMany;
    /**
     * Define a relationship to preload
     */
    preload(name: any, callback?: any): this;
    /**
     * Toggle query debugging
     */
    debug(debug: boolean): this;
    /**
     * Define attributes to be passed to all the model instance as
     * sideloaded attributes
     */
    sideload(values: ModelObject): this;
    /**
     * Process of all the preloaded relationships for a single parent
     */
    processAllForOne(parent: LucidRow, client: QueryClientContract): Promise<void>;
    /**
     * Process of all the preloaded relationships for many parents
     */
    processAllForMany(parent: LucidRow[], client: QueryClientContract): Promise<void>;
}
