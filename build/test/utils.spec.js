"use strict";
/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../adonis-typings/index.ts" />
const japa_1 = __importDefault(require("japa"));
const utils_1 = require("../src/utils");
japa_1.default.group('Utils | syncDiff', () => {
    (0, japa_1.default)('return ids to be added', (assert) => {
        const dbRows = {
            1: {
                id: '1',
                user_id: '1',
                skill_id: '1',
                score: 1,
            },
        };
        const idsToSync = {
            1: {},
            2: {},
            3: {},
        };
        const diff = (0, utils_1.syncDiff)(dbRows, idsToSync);
        assert.deepEqual(diff, {
            added: { 2: {}, 3: {} },
            updated: {},
        });
    });
    (0, japa_1.default)('return ids to be updated when attributes are different', (assert) => {
        const dbRows = {
            1: {
                id: '1',
                user_id: '1',
                skill_id: '1',
                score: 1,
            },
        };
        const idsToSync = {
            1: {
                score: 4,
            },
            2: {},
            3: {},
        };
        const diff = (0, utils_1.syncDiff)(dbRows, idsToSync);
        assert.deepEqual(diff, {
            added: { 2: {}, 3: {} },
            updated: {
                1: { score: 4 },
            },
        });
    });
    (0, japa_1.default)('ignore rows whose attributes are same', (assert) => {
        const dbRows = {
            1: {
                id: '1',
                user_id: '1',
                skill_id: '1',
                score: 1,
            },
        };
        const idsToSync = {
            1: {
                score: 1,
            },
            2: {
                score: 4,
            },
            3: {
                score: 4,
            },
        };
        const diff = (0, utils_1.syncDiff)(dbRows, idsToSync);
        assert.deepEqual(diff, {
            added: {
                2: { score: 4 },
                3: { score: 4 },
            },
            updated: {},
        });
    });
});
