/// <reference path="../../../adonis-typings/index.d.ts" />
import { Hooks } from '@poppinss/hooks';
import { QueryClientContract, TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
import { LucidRow, OrmConfig, CacheNode, LucidModel, CherryPick, EventsList, ModelObject, HooksHandler, ModelOptions, ColumnOptions, ComputedOptions, AdapterContract, CherryPickFields, ModelColumnOptions, ModelKeysContract, ModelAdapterOptions, ModelRelationOptions } from '@ioc:Adonis/Lucid/Model';
import { ModelRelations, RelationOptions, RelationshipsContract, ThroughRelationOptions, ManyToManyRelationOptions } from '@ioc:Adonis/Lucid/Relations';
import { IocContract } from '@ioc:Adonis/Core/Application';
/**
 * Abstract class to define fully fledged data models
 */
export declare class BaseModel implements LucidRow {
    /**
     * The adapter to be used for persisting and fetching data.
     *
     * NOTE: Adapter is a singleton and share among all the models, unless
     * a user wants to swap the adapter for a given model
     */
    static $adapter: AdapterContract;
    /**
     * Used to construct defaults for the model
     */
    static $configurator: OrmConfig;
    /**
     * The container required to resolve hooks
     *
     * NOTE: Container is a singleton and share among all the models, unless
     * a user wants to swap the container for a given model
     */
    static $container: IocContract;
    /**
     * Primary key is required to build relationships across models
     */
    static primaryKey: string;
    /**
     * Whether or not the model has been booted. Booting the model initializes it's
     * static properties. Base models must not be initialized.
     */
    static booted: boolean;
    /**
     * Query scopes defined on the model
     */
    static $queryScopes: any;
    /**
     * A set of properties marked as computed. Computed properties are included in
     * the `toJSON` result, else they behave the same way as any other instance
     * property.
     */
    static $computedDefinitions: Map<string, ComputedOptions>;
    /**
     * Columns makes it easier to define extra props on the model
     * and distinguish them with the attributes to be sent
     * over to the adapter
     */
    static $columnsDefinitions: Map<string, ModelColumnOptions>;
    /**
     * Registered relationships for the given model
     */
    static $relationsDefinitions: Map<string, RelationshipsContract>;
    /**
     * The name of database table. It is auto generated from the model name, unless
     * specified
     */
    static table: string;
    /**
     * Self assign the primary instead of relying on the database to
     * return it back
     */
    static selfAssignPrimaryKey: boolean;
    /**
     * A custom connection to use for queries. The connection defined on
     * query builder is preferred over the model connection
     */
    static connection?: string;
    /**
     * Storing model hooks
     */
    static $hooks: Hooks;
    /**
     * Keys mappings to make the lookups easy
     */
    static $keys: {
        attributesToColumns: ModelKeysContract;
        attributesToSerialized: ModelKeysContract;
        columnsToAttributes: ModelKeysContract;
        columnsToSerialized: ModelKeysContract;
        serializedToColumns: ModelKeysContract;
        serializedToAttributes: ModelKeysContract;
    };
    /**
     * Helper method for `fetchOrNewUpMany`, `fetchOrCreateMany` and `createOrUpdate`
     * many.
     */
    private static newUpIfMissing;
    /**
     * Returns the model query instance for the given model
     */
    static query(options?: ModelAdapterOptions): any;
    /**
     * Create a model instance from the adapter result. The result value must
     * be a valid object, otherwise `null` is returned.
     */
    static $createFromAdapterResult(adapterResult: ModelObject, sideloadAttributes?: ModelObject, options?: ModelAdapterOptions): any | null;
    /**
     * Creates an array of models from the adapter results. The `adapterResults`
     * must be an array with valid Javascript objects.
     *
     * 1. If top level value is not an array, then an empty array is returned.
     * 2. If row is not an object, then it will be ignored.
     */
    static $createMultipleFromAdapterResult<T extends LucidModel>(this: T, adapterResults: ModelObject[], sideloadAttributes?: ModelObject, options?: ModelAdapterOptions): InstanceType<T>[];
    /**
     * Define a new column on the model. This is required, so that
     * we differentiate between plain properties vs model attributes.
     */
    static $addColumn(name: string, options: Partial<ColumnOptions>): ModelColumnOptions;
    /**
     * Returns a boolean telling if column exists on the model
     */
    static $hasColumn(name: string): boolean;
    /**
     * Returns the column for a given name
     */
    static $getColumn(name: string): ModelColumnOptions | undefined;
    /**
     * Adds a computed node
     */
    static $addComputed(name: string, options: Partial<ComputedOptions>): ComputedOptions;
    /**
     * Find if some property is marked as computed
     */
    static $hasComputed(name: string): boolean;
    /**
     * Get computed node
     */
    static $getComputed(name: string): ComputedOptions | undefined;
    /**
     * Register has one relationship
     */
    protected static $addHasOne(name: string, relatedModel: () => LucidModel, options: RelationOptions<ModelRelations>): void;
    /**
     * Register has many relationship
     */
    protected static $addHasMany(name: string, relatedModel: () => LucidModel, options: RelationOptions<ModelRelations>): void;
    /**
     * Register belongs to relationship
     */
    protected static $addBelongsTo(name: string, relatedModel: () => LucidModel, options: RelationOptions<ModelRelations>): void;
    /**
     * Register many to many relationship
     */
    protected static $addManyToMany(name: string, relatedModel: () => LucidModel, options: ManyToManyRelationOptions<ModelRelations>): void;
    /**
     * Register many to many relationship
     */
    protected static $addHasManyThrough(name: string, relatedModel: () => LucidModel, options: ThroughRelationOptions<ModelRelations>): void;
    /**
     * Adds a relationship
     */
    static $addRelation(name: string, type: ModelRelations['__opaque_type'], relatedModel: () => LucidModel, options: ModelRelationOptions): void;
    /**
     * Find if some property is marked as a relation or not
     */
    static $hasRelation(name: any): boolean;
    /**
     * Returns relationship node for a given relation
     */
    static $getRelation(name: any): any;
    /**
     * Boot the model
     */
    static boot(): void;
    /**
     * Register before hooks
     */
    static before(event: EventsList, handler: HooksHandler<any, EventsList>): typeof BaseModel;
    /**
     * Register after hooks
     */
    static after(event: EventsList, handler: HooksHandler<any, EventsList>): typeof BaseModel;
    /**
     * Returns a fresh persisted instance of model by applying
     * attributes to the model instance
     */
    static create(values: any, options?: ModelAdapterOptions): Promise<any>;
    /**
     * Same as [[BaseModel.create]], but persists multiple instances. The create
     * many call will be wrapped inside a managed transaction for consistency.
     * If required, you can also pass a transaction client and the method
     * will use that instead of create a new one.
     */
    static createMany(values: any, options?: ModelAdapterOptions): Promise<any[]>;
    /**
     * Find model instance using the primary key
     */
    static find(value: any, options?: ModelAdapterOptions): Promise<any>;
    /**
     * Find model instance using the primary key
     */
    static findOrFail(value: any, options?: ModelAdapterOptions): Promise<any>;
    /**
     * Find model instance using a key/value pair
     */
    static findBy(key: string, value: any, options?: ModelAdapterOptions): Promise<any>;
    /**
     * Find model instance using a key/value pair
     */
    static findByOrFail(key: string, value: any, options?: ModelAdapterOptions): Promise<any>;
    /**
     * Same as `query().first()`
     */
    static first(options?: ModelAdapterOptions): Promise<any>;
    /**
     * Same as `query().firstOrFail()`
     */
    static firstOrFail(options?: ModelAdapterOptions): Promise<any>;
    /**
     * Find model instance using a key/value pair
     */
    static findMany(value: any[], options?: ModelAdapterOptions): Promise<any>;
    /**
     * Creates a new model instance with payload and adapter options
     */
    private static newUpWithOptions;
    /**
     * Find model instance using a key/value pair or create a
     * new one without persisting it.
     */
    static firstOrNew(searchPayload: any, savePayload?: any, options?: ModelAdapterOptions): Promise<any>;
    /**
     * Same as `firstOrNew`, but also persists the newly created model instance.
     */
    static firstOrCreate(searchPayload: any, savePayload?: any, options?: ModelAdapterOptions): Promise<any>;
    /**
     * Updates or creates a new row inside the database
     */
    static updateOrCreate(searchPayload: any, updatedPayload: any, options?: ModelAdapterOptions): Promise<any>;
    /**
     * Find existing rows or create an in-memory instances of the missing ones.
     */
    static fetchOrNewUpMany(uniqueKeys: any, payload: any, options?: ModelAdapterOptions): Promise<any[]>;
    /**
     * Find existing rows or create missing one's. One database call per insert
     * is invoked, so that each insert goes through the lifecycle of model
     * hooks.
     */
    static fetchOrCreateMany(uniqueKeys: any, payload: any, options?: ModelAdapterOptions): Promise<any[]>;
    /**
     * Update existing rows or create missing one's. One database call per insert
     * is invoked, so that each insert and update goes through the lifecycle
     * of model hooks.
     */
    static updateOrCreateMany(uniqueKeys: any, payload: any, options?: ModelAdapterOptions): Promise<any>;
    /**
     * Returns all rows from the model table
     */
    static all(options?: ModelAdapterOptions): Promise<any>;
    /**
     * Truncate model table
     */
    static truncate(cascade?: boolean): any;
    constructor();
    /**
     * Custom options defined on the model instance that are
     * passed to the adapter
     */
    private modelOptions?;
    /**
     * Reference to transaction that will be used for performing queries on a given
     * model instance.
     */
    private modelTrx?;
    /**
     * The transaction listener listens for the `commit` and `rollback` events and
     * cleansup the `$trx` reference
     */
    private transactionListener;
    /**
     * When `fill` method is called, then we may have a situation where it
     * removed the values which exists in `original` and hence the dirty
     * diff has to do a negative diff as well
     */
    private fillInvoked;
    /**
     * A copy of cached getters
     */
    private cachedGetters;
    /**
     * Raises exception when mutations are performed on a delete model
     */
    private ensureIsntDeleted;
    /**
     * Invoked when performing the insert call. The method initiates
     * all `datetime` columns, if there are not initiated already
     * and `autoCreate` or `autoUpdate` flags are turned on.
     */
    protected initiateAutoCreateColumns(): void;
    /**
     * Invoked when performing the update call. The method initiates
     * all `datetime` columns, if there have `autoUpdate` flag
     * turned on.
     */
    protected initiateAutoUpdateColumns(): void;
    /**
     * Preparing the object to be sent to the adapter. We need
     * to create the object with the property names to be
     * used by the adapter.
     */
    protected prepareForAdapter(attributes: ModelObject): {};
    /**
     * Returns true when the field must be included
     * inside the serialized object.
     */
    private shouldSerializeField;
    /**
     * A type only reference to the columns
     */
    $columns: any;
    /**
     * A copy of attributes that will be sent over to adapter
     */
    $attributes: ModelObject;
    /**
     * Original represents the properties that already has been
     * persisted or loaded by the adapter.
     */
    $original: ModelObject;
    /**
     * Preloaded relationships on the model instance
     */
    $preloaded: {
        [relation: string]: LucidRow | LucidRow[];
    };
    /**
     * Extras are dynamic properties set on the model instance, which
     * are not serialized and neither casted for adapter calls.
     *
     * This is helpful when adapter wants to load some extra data conditionally
     * and that data must not be persisted back the adapter.
     */
    $extras: ModelObject;
    /**
     * Sideloaded are dynamic properties set on the model instance, which
     * are not serialized and neither casted for adapter calls.
     *
     * This is helpful when you want to add dynamic meta data to the model
     * and it's children as well.
     *
     * The difference between [[extras]] and [[sideloaded]] is:
     *
     * - Extras can be different for each model instance
     * - Extras are not shared down the hierarchy (example relationships)
     * - Sideloaded are shared across multiple model instances created via `$createMultipleFromAdapterResult`.
     * - Sideloaded are passed to the relationships as well.
     */
    $sideloaded: ModelObject;
    /**
     * Persisted means the model has been persisted with the adapter. This will
     * also be true, when model instance is created as a result of fetch
     * call from the adapter.
     */
    $isPersisted: boolean;
    /**
     * Once deleted the model instance cannot make calls to the adapter
     */
    $isDeleted: boolean;
    /**
     * `$isLocal` tells if the model instance was created locally vs
     * one generated as a result of fetch call from the adapter.
     */
    $isLocal: boolean;
    /**
     * Returns the value of primary key. The value must be
     * set inside attributes object
     */
    get $primaryKeyValue(): any | undefined;
    /**
     * Opposite of [[this.isPersisted]]
     */
    get $isNew(): boolean;
    /**
     * Returns dirty properties of a model by doing a diff
     * between original values and current attributes
     */
    get $dirty(): any;
    /**
     * Finding if model is dirty with changes or not
     */
    get $isDirty(): boolean;
    /**
     * Returns the transaction
     */
    get $trx(): TransactionClientContract | undefined;
    /**
     * Set the trx to be used by the model to executing queries
     */
    set $trx(trx: TransactionClientContract | undefined);
    /**
     * Get options
     */
    get $options(): ModelOptions | undefined;
    /**
     * Set options
     */
    set $options(options: ModelOptions | undefined);
    /**
     * Set options on the model instance along with transaction
     */
    $setOptionsAndTrx(options?: ModelAdapterOptions): void;
    /**
     * A chainable method to set transaction on the model
     */
    useTransaction(trx: TransactionClientContract): this;
    /**
     * A chainable method to set transaction on the model
     */
    useConnection(connection: string): this;
    /**
     * Set attribute
     */
    $setAttribute(key: string, value: any): void;
    /**
     * Get value of attribute
     */
    $getAttribute(key: string): any;
    /**
     * Returns the attribute value from the cache which was resolved by
     * the mutated by a getter. This is done to avoid re-mutating
     * the same attribute value over and over again.
     */
    $getAttributeFromCache(key: string, callback: CacheNode['getter']): any;
    /**
     * Returns the related model or default value when model is missing
     */
    $getRelated(key: any): any;
    /**
     * A boolean to know if relationship has been preloaded or not
     */
    $hasRelated(key: any): boolean;
    /**
     * Sets the related data on the model instance. The method internally handles
     * `one to one` or `many` relations
     */
    $setRelated(key: any, models: LucidRow | LucidRow[]): void;
    /**
     * Push related adds to the existing related collection
     */
    $pushRelated(key: any, models: LucidRow | LucidRow[]): void;
    /**
     * Merges the object with the model attributes, assuming object keys
     * are coming the database.
     *
     * 1. If key is unknown, it will be added to the `extras` object.
     * 2. If key is defined as a relationship, it will be ignored and one must call `$setRelated`.
     */
    $consumeAdapterResult(adapterResult: ModelObject, sideloadedAttributes?: ModelObject): void;
    /**
     * Sync originals with the attributes. After this `isDirty` will
     * return false
     */
    $hydrateOriginals(): void;
    /**
     * Set bulk attributes on the model instance. Setting relationships via
     * fill isn't allowed, since we disallow setting relationships
     * locally
     */
    fill(values: any, allowNonExtraProperties?: boolean): this;
    /**
     * Merge bulk attributes with existing attributes.
     *
     * 1. If key is unknown, it will be added to the `extras` object.
     * 2. If key is defined as a relationship, it will be ignored and one must call `$setRelated`.
     */
    merge(values: any, allowNonExtraProperties?: boolean): this;
    /**
     * A more expressive alias for "this.preload"
     */
    load(relationName: any, callback?: any): Promise<void>;
    /**
     * Preloads one or more relationships for the current model
     */
    preload(relationName: any, callback?: any): Promise<void>;
    /**
     * Perform save on the model instance to commit mutations.
     */
    save(): Promise<this>;
    /**
     * Perform delete by issuing a delete request on the adapter
     */
    delete(): Promise<void>;
    /**
     * Serializes model attributes to a plain object
     */
    serializeAttributes(fields?: CherryPickFields, raw?: boolean): ModelObject;
    /**
     * Serializes model compute properties to an object.
     */
    serializeComputed(fields?: CherryPickFields): ModelObject;
    /**
     * Serializes relationships to a plain object. When `raw=true`, it will
     * recurisvely serialize the relationships as well.
     */
    serializeRelations(cherryPick?: CherryPick['relations'], raw?: boolean): ModelObject | {
        [key: string]: LucidRow | LucidRow[];
    };
    /**
     * Converting model to it's JSON representation
     */
    serialize(cherryPick?: CherryPick): any;
    /**
     * Convert model to a plain Javascript object
     */
    toObject(): {
        $extras: ModelObject;
    };
    /**
     * Returns the serialize method output. However, any model can overwrite
     * it to define it's custom serialize output
     */
    toJSON(): any;
    /**
     * Returns the query for `insert`, `update` or `delete` actions.
     * Since the query builder for these actions are not exposed to
     * the end user, this method gives a way to compose queries.
     */
    $getQueryFor(action: 'insert' | 'update' | 'delete', client: QueryClientContract): any;
    /**
     * Returns an instance of relationship on the given model
     */
    related(relationName: any): any;
    /**
     * Reload/Refresh the model instance
     */
    refresh(): Promise<this>;
}
