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
exports.HasOne = void 0;
const Base_1 = require("./Base");
/**
 * Has one to factory relation
 */
class HasOne extends Base_1.BaseRelation {
    constructor(relation, factory) {
        super(factory);
        this.relation = relation;
        this.relation.boot();
    }
    /**
     * Make relationship and set it on the parent model instance
     */
    async make(parent, callback) {
        const factory = this.compile(callback);
        const customAttributes = {};
        this.relation.hydrateForPersistance(parent, customAttributes);
        const instance = await factory.makeStubbed((related) => related.merge(customAttributes));
        parent.$setRelated(this.relation.relationName, instance);
    }
    /**
     * Persist relationship and set it on the parent model instance
     */
    async create(parent, callback) {
        const factory = this.compile(callback);
        const customAttributes = {};
        this.relation.hydrateForPersistance(parent, customAttributes);
        const instance = await factory.create((related) => related.merge(customAttributes));
        parent.$setRelated(this.relation.relationName, instance);
    }
}
exports.HasOne = HasOne;
