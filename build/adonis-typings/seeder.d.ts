declare module '@ioc:Adonis/Lucid/Seeder' {
    import { QueryClientContract, FileNode } from '@ioc:Adonis/Lucid/Database';
    /**
     * Shape of seeder class
     */
    export type SeederConstructorContract = {
        developmentOnly: boolean;
        new (client: QueryClientContract): {
            client: QueryClientContract;
            run(): Promise<void>;
        };
    };
    /**
     * Shape of file node returned by the run method
     */
    export type SeederFileNode = {
        status: 'pending' | 'completed' | 'failed' | 'ignored';
        error?: any;
        file: FileNode<unknown>;
    };
    const BaseSeeder: SeederConstructorContract;
    export default BaseSeeder;
}
