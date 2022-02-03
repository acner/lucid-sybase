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
exports.dateTimeColumn = void 0;
const luxon_1 = require("luxon");
const utils_1 = require("@poppinss/utils");
/**
 * The method to prepare the datetime column before persisting it's
 * value to the database
 */
function prepareDateTimeColumn(value, attributeName, modelInstance) {
    /**
     * Return string or missing values as it is. If `auto` is set to true on
     * the column, then the hook will always initialize the date
     */
    if (typeof value === 'string' || !value) {
        return value;
    }
    const model = modelInstance.constructor;
    const modelName = model.name;
    /**
     * Format luxon instances to SQL formatted date
     */
    if (value instanceof luxon_1.DateTime) {
        if (!value.isValid) {
            throw new utils_1.Exception(`Invalid value for "${modelName}.${attributeName}". ${value.invalidReason}`, 500, 'E_INVALID_DATETIME_COLUMN_VALUE');
        }
        const dateTimeFormat = model.query(modelInstance.$options).client.dialect.dateTimeFormat;
        return value.toFormat(dateTimeFormat);
    }
    /**
     * Anything else if not an acceptable value for date column
     */
    throw new utils_1.Exception(`The value for "${modelName}.${attributeName}" must be an instance of "luxon.DateTime"`, 500, 'E_INVALID_DATETIME_COLUMN_VALUE');
}
/**
 * Consume database return value and convert it to an instance of luxon.DateTime
 */
function consumeDateTimeColumn(value, attributeName, modelInstance) {
    /**
     * Bypass null columns
     */
    if (!value) {
        return value;
    }
    /**
     * Convert from string
     */
    if (typeof value === 'string') {
        return luxon_1.DateTime.fromSQL(value);
    }
    /**
     * Convert from date
     */
    if (value instanceof Date) {
        return luxon_1.DateTime.fromJSDate(value);
    }
    /**
     * Any another value cannot be formatted
     */
    const modelName = modelInstance.constructor.name;
    throw new utils_1.Exception(`Cannot format "${modelName}.${attributeName}" ${typeof value} value to an instance of "luxon.DateTime"`, 500, 'E_INVALID_DATETIME_COLUMN_VALUE');
}
/**
 * Decorator to define a new date time column
 */
const dateTimeColumn = (options) => {
    return function decorateAsColumn(target, property) {
        const Model = target.constructor;
        Model.boot();
        const normalizedOptions = Object.assign({
            prepare: prepareDateTimeColumn,
            consume: consumeDateTimeColumn,
            serialize: (value) => {
                if (value instanceof luxon_1.DateTime) {
                    return value.toISO();
                }
                return value;
            },
            meta: {},
        }, options);
        /**
         * Type always has to be a datetime
         */
        normalizedOptions.meta.type = 'datetime';
        normalizedOptions.meta.autoCreate = normalizedOptions.autoCreate === true;
        normalizedOptions.meta.autoUpdate = normalizedOptions.autoUpdate === true;
        Model.$addColumn(property, normalizedOptions);
    };
};
exports.dateTimeColumn = dateTimeColumn;
