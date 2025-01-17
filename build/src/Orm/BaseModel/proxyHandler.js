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
exports.proxyHandler = void 0;
/**
 * A proxy trap to add support for custom getters and setters
 */
exports.proxyHandler = {
    get(target, key, receiver) {
        const Model = target.constructor;
        const column = Model.$getColumn(key);
        /**
         * Fetch the attribute value, when attribute exists and
         * doesn't have a getter
         */
        if (column && !column.hasGetter) {
            return target.$getAttribute(key);
        }
        /**
         * Fetch the relation when property is defined as a relationship
         */
        const relation = Model.$getRelation(key);
        if (relation) {
            return target.$getRelated(key);
        }
        return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
        const Model = target.constructor;
        const column = Model.$getColumn(key);
        /**
         * Set value as an attribute when column is defined and
         * their isn't any setter for it.
         */
        if (column && !column.hasSetter) {
            target.$setAttribute(key, value);
            return true;
        }
        /**
         * Fetch the relation when property is defined as a relationship
         */
        const relation = Model.$getRelation(key);
        if (relation) {
            target.$setRelated(key, value);
            return true;
        }
        return Reflect.set(target, key, value, receiver);
    },
};
