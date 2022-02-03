declare module '@ioc:Adonis/Lucid/Schema' {
    import { Knex } from 'knex';
    import { QueryClientContract, RawQueryBindings } from '@ioc:Adonis/Lucid/Database';
    /**
     * Shape of callback to defer database calls
     */
    export type DeferCallback = (client: QueryClientContract) => void | Promise<void>;
    /**
     * Shape of schema class constructor
     */
    export interface SchemaConstructorContract {
        disableTransactions: boolean;
        new (db: QueryClientContract, file: string, dryRun: boolean): SchemaContract;
    }
    /**
     * Shape of schema class
     */
    export interface SchemaContract {
        readonly file: string;
        dryRun: boolean;
        debug: boolean;
        db: QueryClientContract;
        schema: Knex.SchemaBuilder;
        now(precision?: number): Knex.Raw;
        raw(sql: string, bindings?: RawQueryBindings): Knex.Raw;
        defer: (cb: DeferCallback) => void;
        up(): Promise<void> | void;
        down(): Promise<void> | void;
        execUp(): Promise<string[] | boolean>;
        execDown(): Promise<string[] | boolean>;
    }
    const Schema: SchemaConstructorContract;
    export default Schema;
}
