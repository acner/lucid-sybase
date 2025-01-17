import { PgDialect } from './Pg';
import { MysqlDialect } from './Mysql';
import { MssqlDialect } from './Mssql';
import { Sybase } from './Sybase';
import { SqliteDialect } from './Sqlite';
import { OracleDialect } from './Oracle';
import { RedshiftDialect } from './Redshift';
export declare const dialects: {
    mssql: typeof MssqlDialect;
    mysql: typeof MysqlDialect;
    mysql2: typeof MysqlDialect;
    oracledb: typeof OracleDialect;
    postgres: typeof PgDialect;
    redshift: typeof RedshiftDialect;
    sqlite3: typeof SqliteDialect;
    sybase: typeof Sybase;
};
