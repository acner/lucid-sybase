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
exports.ModelQueryBuilder = void 0;
const utils_1 = require("@poppinss/utils");
const utils_2 = require("../../utils");
const Preloader_1 = require("../Preloader");
const Paginator_1 = require("../Paginator");
const QueryRunner_1 = require("../../QueryRunner");
const Chainable_1 = require("../../Database/QueryBuilder/Chainable");
const SimplePaginator_1 = require("../../Database/Paginator/SimplePaginator");
/**
 * A wrapper to invoke scope methods on the query builder
 * underlying model
 */
class ModelScopes {
    constructor(builder) {
        Object.defineProperty(this, "builder", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: builder
        });
        return new Proxy(this, {
            get(target, key) {
                if (typeof target.builder.model[key] === 'function') {
                    return (...args) => {
                        return target.builder.model[key](target.builder, ...args);
                    };
                }
                /**
                 * Unknown keys are not allowed
                 */
                throw new Error(`"${String(key)}" is not defined as a query scope on "${target.builder.model.name}" model`);
            },
        });
    }
}
/**
 * Database query builder exposes the API to construct and run queries for selecting,
 * updating and deleting records.
 */
class ModelQueryBuilder extends Chainable_1.Chainable {
    constructor(builder, model, client, customFn = (userFn) => {
        return ($builder) => {
            const subQuery = new ModelQueryBuilder($builder, this.model, this.client);
            subQuery.isChildQuery = true;
            userFn(subQuery);
            subQuery.applyWhere();
        };
    }) {
        super(builder, customFn, model.$keys.attributesToColumns.resolve.bind(model.$keys.attributesToColumns));
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: model
        });
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: client
        });
        /**
         * Sideloaded attributes that will be passed to the model instances
         */
        Object.defineProperty(this, "sideloaded", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        /**
         * A copy of defined preloads on the model instance
         */
        Object.defineProperty(this, "preloader", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Preloader_1.Preloader(this.model)
        });
        /**
         * A custom callback to transform each model row
         */
        Object.defineProperty(this, "rowTransformerCallback", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * A references to model scopes wrapper. It is lazily initialized
         * only when the `apply` method is invoked
         */
        Object.defineProperty(this, "scopesWrapper", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        /**
         * Control whether or not to wrap adapter result to model
         * instances or not
         */
        Object.defineProperty(this, "wrapResultsToModelInstances", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        /**
         * Custom data someone want to send to the profiler and the
         * query event
         */
        Object.defineProperty(this, "customReporterData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Control whether to debug the query or not. The initial
         * value is inherited from the query client
         */
        Object.defineProperty(this, "debugQueries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.client.debug
        });
        /**
         * Self join counter, increments with every "withCount"
         * "has" and "whereHas" queries.
         */
        Object.defineProperty(this, "joinCounter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        /**
         * Options that must be passed to all new model instances
         */
        Object.defineProperty(this, "clientOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                client: this.client,
                connection: this.client.connectionName,
                profiler: this.client.profiler,
            }
        });
        /**
         * Whether or not query is a subquery for `.where` callback
         */
        Object.defineProperty(this, "isChildQuery", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * Assign table when not already assigned
         */
        if (!builder['_single'] || !builder['_single'].table) {
            builder.table(model.table);
        }
    }
    /**
     * Executes the current query
     */
    async execQuery() {
        this.applyWhere();
        const isWriteQuery = ['update', 'del', 'insert'].includes(this.knexQuery['_method']);
        const queryData = Object.assign(this.getQueryData(), this.customReporterData);
        const rows = await new QueryRunner_1.QueryRunner(this.client, this.debugQueries, queryData).run(this.knexQuery);
        /**
         * Return the rows as it is when query is a write query
         */
        if (isWriteQuery || !this.wrapResultsToModelInstances) {
            return Array.isArray(rows) ? rows : [rows];
        }
        /**
         * Convert fetched results to an array of model instances
         */
        const modelInstances = rows.reduce((models, row) => {
            if ((0, utils_2.isObject)(row)) {
                const modelInstance = this.model.$createFromAdapterResult(row, this.sideloaded, this.clientOptions);
                /**
                 * Transform row when row transformer is defined
                 */
                if (this.rowTransformerCallback) {
                    this.rowTransformerCallback(modelInstance);
                }
                models.push(modelInstance);
            }
            return models;
        }, []);
        /**
         * Preload for model instances
         */
        await this.preloader
            .sideload(this.sideloaded)
            .debug(this.debugQueries)
            .processAllForMany(modelInstances, this.client);
        return modelInstances;
    }
    /**
     * Ensures that we are not executing `update` or `del` when using read only
     * client
     */
    ensureCanPerformWrites() {
        if (this.client && this.client.mode === 'read') {
            throw new utils_1.Exception('Updates and deletes cannot be performed in read mode');
        }
    }
    /**
     * Defines sub query for checking the existance of a relationship
     */
    addWhereHas(relationName, boolean, operator, value, callback) {
        let rawMethod = 'whereRaw';
        let existsMethod = 'whereExists';
        switch (boolean) {
            case 'or':
                rawMethod = 'orWhereRaw';
                existsMethod = 'orWhereExists';
                break;
            case 'not':
                existsMethod = 'whereNotExists';
                break;
            case 'orNot':
                rawMethod = 'orWhereRaw';
                existsMethod = 'orWhereNotExists';
                break;
        }
        const subQuery = this.getRelationship(relationName).subQuery(this.client);
        subQuery.selfJoinCounter = this.joinCounter;
        /**
         * Invoke callback when defined
         */
        if (typeof callback === 'function') {
            callback(subQuery);
        }
        /**
         * Count all when value and operator are defined.
         */
        if (value !== undefined && operator !== undefined) {
            /**
             * If user callback has not defined any aggregates, then we should
             * add a count
             */
            if (!subQuery.hasAggregates) {
                subQuery.count('*');
            }
            /**
             * Pull sql and bindings from the query
             */
            const { sql, bindings } = subQuery.prepare().toSQL();
            /**
             * Define where raw clause. Query builder doesn't have any "whereNotRaw" method
             * and hence we need to prepend the `NOT` keyword manually
             */
            boolean === 'orNot' || boolean === 'not'
                ? this[rawMethod](`not (${sql}) ${operator} (?)`, bindings.concat([value]))
                : this[rawMethod](`(${sql}) ${operator} (?)`, bindings.concat([value]));
            return this;
        }
        /**
         * Use where exists when no operator and value is defined
         */
        this[existsMethod](subQuery.prepare());
        return this;
    }
    /**
     * Returns the profiler action. Protected, since the class is extended
     * by relationships
     */
    getQueryData() {
        return {
            connection: this.client.connectionName,
            inTransaction: this.client.isTransaction,
            model: this.model.name,
        };
    }
    /**
     * Returns the relationship instance from the model. An exception is
     * raised when relationship is missing
     */
    getRelationship(name) {
        const relation = this.model.$getRelation(name);
        /**
         * Ensure relationship exists
         */
        if (!relation) {
            throw new utils_1.Exception(`"${name}" is not defined as a relationship on "${this.model.name}" model`, 500, 'E_UNDEFINED_RELATIONSHIP');
        }
        relation.boot();
        return relation;
    }
    /**
     * Define custom reporter data. It will be merged with
     * the existing data
     */
    reporterData(data) {
        this.customReporterData = data;
        return this;
    }
    /**
     * Define a custom callback to transform rows
     */
    rowTransformer(callback) {
        this.rowTransformerCallback = callback;
        return this;
    }
    /**
     * Clone the current query builder
     */
    clone() {
        const clonedQuery = new ModelQueryBuilder(this.knexQuery.clone(), this.model, this.client);
        this.applyQueryFlags(clonedQuery);
        clonedQuery.sideloaded = Object.assign({}, this.sideloaded);
        clonedQuery.debug(this.debugQueries);
        clonedQuery.reporterData(this.customReporterData);
        this.rowTransformerCallback && this.rowTransformer(this.rowTransformerCallback);
        return clonedQuery;
    }
    /**
     * Define returning columns
     */
    returning(columns) {
        /**
         * Do not chain `returning` in sqlite3 to avoid knex warnings
         */
        if (this.client && ['sqlite3', 'mysql'].includes(this.client.dialect.name)) {
            return this;
        }
        columns = Array.isArray(columns)
            ? columns.map((column) => this.resolveKey(column))
            : this.resolveKey(columns);
        this.knexQuery.returning(columns);
        return this;
    }
    /**
     * Define a query to constraint to be defined when condition is truthy
     */
    ifDialect(dialects, matchCallback, noMatchCallback) {
        dialects = Array.isArray(dialects) ? dialects : [dialects];
        if (dialects.includes(this.client.dialect.name)) {
            matchCallback(this);
        }
        else if (noMatchCallback) {
            noMatchCallback(this);
        }
        return this;
    }
    /**
     * Define a query to constraint to be defined when condition is falsy
     */
    unlessDialect(dialects, matchCallback, noMatchCallback) {
        dialects = Array.isArray(dialects) ? dialects : [dialects];
        if (!dialects.includes(this.client.dialect.name)) {
            matchCallback(this);
        }
        else if (noMatchCallback) {
            noMatchCallback(this);
        }
        return this;
    }
    /**
     * Applies the query scopes on the current query builder
     * instance
     */
    withScopes(callback) {
        this.scopesWrapper = this.scopesWrapper || new ModelScopes(this);
        callback(this.scopesWrapper);
        return this;
    }
    /**
     * Applies the query scopes on the current query builder
     * instance
     */
    apply(callback) {
        return this.withScopes(callback);
    }
    /**
     * Define a custom preloader instance for preloading relationships
     */
    usePreloader(preloader) {
        this.preloader = preloader;
        return this;
    }
    /**
     * Set sideloaded properties to be passed to the model instance
     */
    sideload(value) {
        this.sideloaded = value;
        return this;
    }
    /**
     * Fetch and return first results from the results set. This method
     * will implicitly set a `limit` on the query
     */
    async first() {
        const isFetchCall = this.wrapResultsToModelInstances && this.knexQuery['_method'] === 'select';
        if (isFetchCall) {
            await this.model.$hooks.exec('before', 'find', this);
        }
        const result = await this.limit(1).execQuery();
        if (result[0] && isFetchCall) {
            await this.model.$hooks.exec('after', 'find', result[0]);
        }
        return result[0] || null;
    }
    /**
     * Fetch and return first results from the results set. This method
     * will implicitly set a `limit` on the query
     */
    async firstOrFail() {
        const row = await this.first();
        if (!row) {
            throw new utils_1.Exception('Row not found', 404, 'E_ROW_NOT_FOUND');
        }
        return row;
    }
    /**
     * Load aggregate value as a subquery for a relationship
     */
    withAggregate(relationName, userCallback) {
        const subQuery = this.getRelationship(relationName).subQuery(this.client);
        subQuery.selfJoinCounter = this.joinCounter;
        /**
         * Invoke user callback
         */
        userCallback(subQuery);
        /**
         * Raise exception if the callback has not defined an aggregate
         */
        if (!subQuery.hasAggregates) {
            throw new utils_1.Exception('"withAggregate" callback must use an aggregate function');
        }
        /**
         * Select "*" when no custom selects are defined
         */
        if (!this.columns.length) {
            this.select(`${this.model.table}.*`);
        }
        /**
         * Throw exception when no alias
         */
        if (!subQuery.subQueryAlias) {
            throw new utils_1.Exception('"withAggregate" callback must define the alias for the aggregate query');
        }
        /**
         * Count subquery selection
         */
        this.select(subQuery.prepare());
        /**
         * Bump the counter
         */
        this.joinCounter++;
        return this;
    }
    /**
     * Get count of a relationship along side the main query results
     */
    withCount(relationName, userCallback) {
        this.withAggregate(relationName, (subQuery) => {
            if (typeof userCallback === 'function') {
                userCallback(subQuery);
            }
            /**
             * Count "*"
             */
            if (!subQuery.hasAggregates) {
                subQuery.count('*');
            }
            /**
             * Define alias for the subquery
             */
            if (!subQuery.subQueryAlias) {
                subQuery.as(`${relationName}_count`);
            }
        });
        return this;
    }
    /**
     * Add where constraint using the relationship
     */
    whereHas(relationName, callback, operator, value) {
        return this.addWhereHas(relationName, 'and', operator, value, callback);
    }
    /**
     * Add or where constraint using the relationship
     */
    orWhereHas(relationName, callback, operator, value) {
        return this.addWhereHas(relationName, 'or', operator, value, callback);
    }
    /**
     * Alias of [[whereHas]]
     */
    andWhereHas(relationName, callback, operator, value) {
        return this.addWhereHas(relationName, 'and', operator, value, callback);
    }
    /**
     * Add where not constraint using the relationship
     */
    whereDoesntHave(relationName, callback, operator, value) {
        return this.addWhereHas(relationName, 'not', operator, value, callback);
    }
    /**
     * Add or where not constraint using the relationship
     */
    orWhereDoesntHave(relationName, callback, operator, value) {
        return this.addWhereHas(relationName, 'orNot', operator, value, callback);
    }
    /**
     * Alias of [[whereDoesntHave]]
     */
    andWhereDoesntHave(relationName, callback, operator, value) {
        return this.addWhereHas(relationName, 'not', operator, value, callback);
    }
    /**
     * Add where constraint using the relationship
     */
    has(relationName, operator, value) {
        return this.addWhereHas(relationName, 'and', operator, value);
    }
    /**
     * Add or where constraint using the relationship
     */
    orHas(relationName, operator, value) {
        return this.addWhereHas(relationName, 'or', operator, value);
    }
    /**
     * Alias of [[has]]
     */
    andHas(relationName, operator, value) {
        return this.addWhereHas(relationName, 'and', operator, value);
    }
    /**
     * Add where not constraint using the relationship
     */
    doesntHave(relationName, operator, value) {
        return this.addWhereHas(relationName, 'not', operator, value);
    }
    /**
     * Add or where not constraint using the relationship
     */
    orDoesntHave(relationName, operator, value) {
        return this.addWhereHas(relationName, 'orNot', operator, value);
    }
    /**
     * Alias of [[doesntHave]]
     */
    andDoesntHave(relationName, operator, value) {
        return this.addWhereHas(relationName, 'not', operator, value);
    }
    /**
     * Define a relationship to be preloaded
     */
    preload(relationName, userCallback) {
        this.preloader.load(relationName, userCallback);
        return this;
    }
    /**
     * Perform update by incrementing value for a given column. Increments
     * can be clubbed with `update` as well
     */
    increment(column, counter) {
        this.ensureCanPerformWrites();
        this.knexQuery.increment(this.resolveKey(column, true), counter);
        return this;
    }
    /**
     * Perform update by decrementing value for a given column. Decrements
     * can be clubbed with `update` as well
     */
    decrement(column, counter) {
        this.ensureCanPerformWrites();
        this.knexQuery.decrement(this.resolveKey(column, true), counter);
        return this;
    }
    /**
     * Perform update
     */
    update(column, value, returning) {
        this.ensureCanPerformWrites();
        if (value === undefined && returning === undefined) {
            this.knexQuery.update(this.resolveKey(column, true));
        }
        else if (returning === undefined) {
            this.knexQuery.update(this.resolveKey(column), value);
        }
        else {
            this.knexQuery.update(this.resolveKey(column), value, returning);
        }
        return this;
    }
    /**
     * Delete rows under the current query
     */
    del() {
        this.ensureCanPerformWrites();
        this.knexQuery.del();
        return this;
    }
    /**
     * Alias for [[del]]
     */
    delete() {
        return this.del();
    }
    /**
     * Turn on/off debugging for this query
     */
    debug(debug) {
        this.debugQueries = debug;
        return this;
    }
    /**
     * Define query timeout
     */
    timeout(time, options) {
        this.knexQuery['timeout'](time, options);
        return this;
    }
    /**
     * Returns SQL query as a string
     */
    toQuery() {
        this.applyWhere();
        return this.knexQuery.toQuery();
    }
    /**
     * Run query inside the given transaction
     */
    useTransaction(transaction) {
        this.knexQuery.transacting(transaction.knexClient);
        return this;
    }
    /**
     * Executes the query
     */
    async exec() {
        const isFetchCall = this.wrapResultsToModelInstances && this.knexQuery['_method'] === 'select';
        if (isFetchCall) {
            await this.model.$hooks.exec('before', 'fetch', this);
        }
        const result = await this.execQuery();
        if (isFetchCall) {
            await this.model.$hooks.exec('after', 'fetch', result);
        }
        return result;
    }
    /**
     * Paginate through rows inside a given table
     */
    async paginate(page, perPage = 20) {
        const isFetchCall = this.wrapResultsToModelInstances && this.knexQuery['_method'] === 'select';
        /**
         * Cast to number
         */
        page = Number(page);
        perPage = Number(perPage);
        const countQuery = this.clone()
            .clearOrder()
            .clearLimit()
            .clearOffset()
            .clearSelect()
            .count('* as total')
            .pojo();
        /**
         * We pass both the counts query and the main query to the
         * paginate hook
         */
        if (isFetchCall) {
            await this.model.$hooks.exec('before', 'paginate', [countQuery, this]);
            await this.model.$hooks.exec('before', 'fetch', this);
        }
        const aggregateResult = await countQuery.exec();
        const total = this.hasGroupBy ? aggregateResult.length : aggregateResult[0].total;
        const results = total > 0 ? await this.forPage(page, perPage).execQuery() : [];
        /**
         * Choose paginator
         */
        const paginator = this.wrapResultsToModelInstances
            ? new Paginator_1.ModelPaginator(total, perPage, page, ...results)
            : new SimplePaginator_1.SimplePaginator(total, perPage, page, ...results);
        paginator.namingStrategy = this.model.namingStrategy;
        if (isFetchCall) {
            await this.model.$hooks.exec('after', 'paginate', paginator);
            await this.model.$hooks.exec('after', 'fetch', results);
        }
        return paginator;
    }
    /**
     * Get sql representation of the query
     */
    toSQL() {
        this.applyWhere();
        return this.knexQuery.toSQL();
    }
    /**
     * Get rows back as a plain javascript object and not an array
     * of model instances
     */
    pojo() {
        this.wrapResultsToModelInstances = false;
        return this;
    }
    /**
     * Implementation of `then` for the promise API
     */
    then(resolve, reject) {
        return this.exec().then(resolve, reject);
    }
    /**
     * Implementation of `catch` for the promise API
     */
    catch(reject) {
        return this.exec().catch(reject);
    }
    /**
     * Implementation of `finally` for the promise API
     */
    finally(fullfilled) {
        return this.exec().finally(fullfilled);
    }
    /**
     * Required when Promises are extended
     */
    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
}
exports.ModelQueryBuilder = ModelQueryBuilder;
/**
 * Required by macroable
 */
Object.defineProperty(ModelQueryBuilder, "macros", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {}
});
Object.defineProperty(ModelQueryBuilder, "getters", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {}
});
