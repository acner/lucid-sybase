/// <reference types="@adonisjs/application/build/adonis-typings" />
import { ApplicationContract } from '@ioc:Adonis/Core/Application';
/**
 * Database service provider
 */
export default class DatabaseServiceProvider {
    protected app: ApplicationContract;
    constructor(app: ApplicationContract);
    static needsApplication: boolean;
    /**
     * Register the database binding
     */
    private registerDatabase;
    /**
     * Registers ORM
     */
    private registerOrm;
    /**
     * Registers schema class
     */
    private registerSchema;
    /**
     * Registers schema class
     */
    private registerFactory;
    /**
     * Registers schema class
     */
    private registerBaseSeeder;
    /**
     * Registers the health checker
     */
    private registerHealthChecker;
    /**
     * Extends the validator by defining validation rules
     */
    private defineValidationRules;
    /**
     * Defines REPL bindings
     */
    private defineReplBindings;
    /**
     * Called when registering providers
     */
    register(): void;
    /**
     * Called when all bindings are in place
     */
    boot(): void;
    /**
     * Gracefully close connections during shutdown
     */
    shutdown(): Promise<void>;
}
