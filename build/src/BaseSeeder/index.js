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
exports.BaseSeeder = void 0;
class BaseSeeder {
    constructor(client) {
        this.client = client;
    }
    async run() { }
}
exports.BaseSeeder = BaseSeeder;
