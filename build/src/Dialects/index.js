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
exports.dialects = void 0;
const Pg_1 = require("./Pg");
const Mysql_1 = require("./Mysql");
const Mssql_1 = require("./Mssql");
const Sybase_1 = require("./Sybase");
const Sqlite_1 = require("./Sqlite");
const Oracle_1 = require("./Oracle");
const Redshift_1 = require("./Redshift");
exports.dialects = {
    mssql: Mssql_1.MssqlDialect,
    sybase: Sybase_1.SybaseDialect,
    mysql: Mysql_1.MysqlDialect,
    mysql2: Mysql_1.MysqlDialect,
    oracledb: Oracle_1.OracleDialect,
    postgres: Pg_1.PgDialect,
    redshift: Redshift_1.RedshiftDialect,
    sqlite3: Sqlite_1.SqliteDialect,
};
