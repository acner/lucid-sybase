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
exports.FactoryModel = void 0;
const hooks_1 = require("@poppinss/hooks");
const HasOne_1 = require("./Relations/HasOne");
const HasMany_1 = require("./Relations/HasMany");
const FactoryBuilder_1 = require("./FactoryBuilder");
const BelongsTo_1 = require("./Relations/BelongsTo");
const ManyToMany_1 = require("./Relations/ManyToMany");
/**
 * Factory model exposes the API to define a model factory with custom
 * states and relationships
 */
class FactoryModel {
    constructor(model, define, manager) {
        this.model = model;
        this.define = define;
        this.manager = manager;
        /**
         * Method to instantiate a new model instance. This method can be
         * overridden using the `newUp` public method.
         */
        this.newUpModelInstance = function (attributes) {
            const Model = this.model;
            /**
             * Handling case, where someone returns model instance directly
             */
            if (attributes instanceof Model) {
                return attributes;
            }
            const modelInstance = new Model();
            modelInstance.merge(attributes);
            return modelInstance;
        }.bind(this);
        /**
         * Method to merge runtime attributes with the model instance. This method
         * can be overridden using the `merge` method.
         */
        this.mergeAttributes = function (model, attributes) {
            model.merge(attributes);
        }.bind(this);
        /**
         * A collection of factory states
         */
        this.states = {};
        /**
         * A collection of factory relations
         */
        this.relations = {};
        /**
         * A set of registered hooks
         */
        this.hooks = new hooks_1.Hooks();
    }
    /**
     * Register a before event hook
     */
    before(event, handler) {
        this.hooks.add('before', event, handler);
        return this;
    }
    /**
     * Register an after event hook
     */
    after(event, handler) {
        this.hooks.add('after', event, handler);
        return this;
    }
    /**
     * Returns state callback defined on the model factory. Raises an
     * exception, when state is not registered
     */
    getState(state) {
        const stateCallback = this.states[state];
        if (!stateCallback) {
            throw new Error(`Cannot apply undefined state "${state}". Double check the model factory`);
        }
        return stateCallback;
    }
    /**
     * Returns the pre-registered relationship factory function, along with
     * the original model relation.
     */
    getRelation(relation) {
        const relationship = this.relations[relation];
        if (!relationship) {
            throw new Error(`Cannot setup undefined relationship "${relation}". Double check the model factory`);
        }
        return relationship;
    }
    /**
     * Define custom state for the factory. When executing the factory,
     * you can apply the pre-defined states
     */
    state(state, callback) {
        this.states[state] = callback;
        return this;
    }
    /**
     * Define a relationship on another factory
     */
    relation(relation, callback) {
        const modelRelation = this.model.$getRelation(relation);
        /**
         * Only whitelisted relationships are allowed on the factory
         */
        if (!modelRelation) {
            throw new Error([
                `Cannot define "${relation}" relationship.`,
                `The relationship must exist on the "${this.model.name}" model first`,
            ].join(' '));
        }
        switch (modelRelation.type) {
            case 'belongsTo':
                this.relations[relation] = new BelongsTo_1.BelongsTo(modelRelation, callback);
                break;
            case 'hasOne':
                this.relations[relation] = new HasOne_1.HasOne(modelRelation, callback);
                break;
            case 'hasMany':
                this.relations[relation] = new HasMany_1.HasMany(modelRelation, callback);
                break;
            case 'manyToMany':
                this.relations[relation] = new ManyToMany_1.ManyToMany(modelRelation, callback);
                break;
            case 'hasManyThrough':
                throw new Error([
                    `Cannot define "${relation}" relationship.`,
                    '"hasManyThrough" relationship does not have any persistance API',
                ].join(' '));
        }
        return this;
    }
    /**
     * Define a custom `newUp` method
     */
    newUp(callback) {
        this.newUpModelInstance = callback;
        return this;
    }
    /**
     * Define a custom `merge` method
     */
    merge(callback) {
        this.mergeAttributes = callback;
        return this;
    }
    /**
     * Build factory model and return factory builder. The builder is then
     * used to make/create model instances
     */
    build() {
        /**
         * Return a build object, which proxies all of the factory builder
         * method and invokes them with a fresh instance.
         */
        const builder = {
            model: this,
            query(options) {
                return new FactoryBuilder_1.FactoryBuilder(this.model, options);
            },
            client(...args) {
                return this.query().client(...args);
            },
            connection(...args) {
                return this.query().connection(...args);
            },
            apply(...args) {
                return this.query().apply(...args);
            },
            with(relation, ...args) {
                return this.query().with(relation, ...args);
            },
            merge(attributes) {
                return this.query().merge(attributes);
            },
            useCtx(ctx) {
                return this.query().useCtx(ctx);
            },
            make(callback) {
                return this.query().make(callback);
            },
            makeStubbed(callback) {
                return this.query().makeStubbed(callback);
            },
            create(callback) {
                return this.query().create(callback);
            },
            makeMany(count, callback) {
                return this.query().makeMany(count, callback);
            },
            makeStubbedMany(count, callback) {
                return this.query().makeStubbedMany(count, callback);
            },
            createMany(count, callback) {
                return this.query().createMany(count, callback);
            },
        };
        return builder;
    }
}
exports.FactoryModel = FactoryModel;
