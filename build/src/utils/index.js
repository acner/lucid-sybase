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
exports.sourceFiles = exports.normalizeCherryPickObject = exports.getDDLMethod = exports.managedTransaction = exports.syncDiff = exports.unique = exports.isObject = exports.getValue = exports.ensureRelationIsBooted = exports.collectValues = exports.ensureValue = exports.ensureRelation = void 0;
/// <reference path="../../adonis-typings/index.ts" />
const path_1 = require("path");
const utils_1 = require("@poppinss/utils");
const utils_2 = require("@poppinss/utils");
/**
 * Ensure that relation is defined
 */
function ensureRelation(name, relation) {
    if (!relation) {
        throw new utils_1.Exception(`Cannot process unregistered relationship ${name}`, 500);
    }
    return true;
}
exports.ensureRelation = ensureRelation;
/**
 * Ensure a key value is not null or undefined inside an object.
 */
function ensureValue(collection, key, missingCallback) {
    const value = collection[key];
    if (value === undefined || value === null) {
        missingCallback();
        return;
    }
    return value;
}
exports.ensureValue = ensureValue;
/**
 * Collects values for a key inside an array. Similar to `Array.map`, but
 * reports missing values.
 */
function collectValues(payload, key, missingCallback) {
    return payload.map((row) => {
        return ensureValue(row, key, missingCallback);
    });
}
exports.collectValues = collectValues;
/**
 * Raises exception when a relationship `booted` property is false.
 */
function ensureRelationIsBooted(relation) {
    if (!relation.booted) {
        throw new utils_1.Exception('Relationship is not booted. Make sure to call boot first', 500, 'E_RUNTIME_EXCEPTION');
    }
}
exports.ensureRelationIsBooted = ensureRelationIsBooted;
/**
 * Returns the value for a key from the model instance and raises descriptive
 * exception when the value is missing
 */
function getValue(model, key, relation, action = 'preload') {
    return ensureValue(model, key, () => {
        throw new utils_1.Exception(`Cannot ${action} "${relation.relationName}", value of "${relation.model.name}.${key}" is undefined`, 500);
    });
}
exports.getValue = getValue;
/**
 * Helper to find if value is a valid Object or
 * not
 */
function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
exports.isObject = isObject;
/**
 * Drops duplicate values from an array
 */
function unique(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return [...new Set(value)];
}
exports.unique = unique;
/**
 * Returns a diff of rows to be updated or inserted when performing
 * a many to many `attach`
 */
function syncDiff(original, incoming) {
    const diff = Object.keys(incoming).reduce((result, incomingRowId) => {
        const originalRow = original[incomingRowId];
        const incomingRow = incoming[incomingRowId];
        /**
         * When there isn't any matching row, we need to insert
         * the upcoming row
         */
        if (!originalRow) {
            result.added[incomingRowId] = incoming[incomingRowId];
        }
        else if (Object.keys(incomingRow).find((key) => incomingRow[key] !== originalRow[key])) {
            /**
             * If any of the row attributes are different, then we must
             * update that row
             */
            result.updated[incomingRowId] = incoming[incomingRowId];
        }
        return result;
    }, { added: {}, updated: {} });
    return diff;
}
exports.syncDiff = syncDiff;
/**
 * Invokes a callback by wrapping it inside managed transaction
 * when passed client is not transaction itself.
 */
async function managedTransaction(client, callback) {
    const isManagedTransaction = !client.isTransaction;
    const trx = client.isTransaction
        ? client
        : await client.transaction();
    if (!isManagedTransaction) {
        return callback(trx);
    }
    try {
        const response = await callback(trx);
        await trx.commit();
        return response;
    }
    catch (error) {
        await trx.rollback();
        throw error;
    }
}
exports.managedTransaction = managedTransaction;
/**
 * Returns the sql method for a DDL statement
 */
function getDDLMethod(sql) {
    if (sql.startsWith('create')) {
        return 'create';
    }
    if (sql.startsWith('alter')) {
        return 'alter';
    }
    if (sql.startsWith('drop')) {
        return 'drop';
    }
    return 'unknown';
}
exports.getDDLMethod = getDDLMethod;
/**
 * Normalizes the cherry picking object to always be an object with
 * `pick` and `omit` properties
 */
function normalizeCherryPickObject(fields) {
    if (Array.isArray(fields)) {
        return {
            pick: fields,
            omit: [],
        };
    }
    return {
        pick: fields.pick,
        omit: fields.omit,
    };
}
exports.normalizeCherryPickObject = normalizeCherryPickObject;
/**
 * Sources files from a given directory
 */
function sourceFiles(fromLocation, directory) {
    return new Promise((resolve, reject) => {
        const path = utils_2.resolveDir(fromLocation, directory);
        const files = utils_2.fsReadAll(path);
        try {
            resolve({
                directory,
                files: files.sort().map((file) => {
                    return {
                        absPath: path_1.join(path, file),
                        name: path_1.join(directory, file.replace(RegExp(`${path_1.extname(file)}$`), '')),
                        getSource() {
                            return utils_2.esmRequire(this.absPath);
                        },
                    };
                }),
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.sourceFiles = sourceFiles;
