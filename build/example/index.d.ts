/// <reference path="../adonis-typings/model.d.ts" />
/// <reference path="../adonis-typings/orm.d.ts" />
/// <reference path="../adonis-typings/relations.d.ts" />
import { DateTime } from 'luxon';
import { BaseModel, HasOne, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm';
declare enum ProfileTypes {
    TWITTER = "TWITTER"
}
declare type Builder = ModelQueryBuilderContract<typeof User>;
declare class Profile extends BaseModel {
    id: string;
    userId: string;
    user: HasOne<typeof User>;
    type: ProfileTypes;
    createdAt?: DateTime;
}
export declare class User extends BaseModel {
    id: string;
    username: string;
    profile: HasOne<typeof Profile>;
    static active: import("@ioc:Adonis/Lucid/Orm").QueryScope<(builder: Builder) => void>;
    static country: import("@ioc:Adonis/Lucid/Orm").QueryScope<(builder: ModelQueryBuilderContract<import("@ioc:Adonis/Lucid/Orm").LucidModel, import("@ioc:Adonis/Lucid/Orm").LucidRow>, _country: string) => void>;
}
export {};
