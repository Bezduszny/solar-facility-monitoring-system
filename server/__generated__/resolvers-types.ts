import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
import { ApolloContext } from "../apollo.ts";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: any; output: any };
  DateTimeISO: { input: any; output: any };
  Upload: { input: any; output: any };
};

export type EnergyReport = {
  __typename?: "EnergyReport";
  active_power_kW?: Maybe<Scalars["Float"]["output"]>;
  energy_kWh?: Maybe<Scalars["Float"]["output"]>;
  facility_id: Scalars["ID"]["output"];
  id: Scalars["ID"]["output"];
  timestamp?: Maybe<Scalars["DateTimeISO"]["output"]>;
};

export type Facility = {
  __typename?: "Facility";
  availableReportsDates?: Maybe<Array<Scalars["Date"]["output"]>>;
  energyReports?: Maybe<Array<EnergyReport>>;
  id: Scalars["ID"]["output"];
  name?: Maybe<Scalars["String"]["output"]>;
  nominalPower?: Maybe<Scalars["Int"]["output"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  createFacility?: Maybe<Facility>;
  deleteFacility?: Maybe<Scalars["Boolean"]["output"]>;
  updateFacility?: Maybe<Facility>;
  uploadCSV?: Maybe<UploadResult>;
};

export type MutationCreateFacilityArgs = {
  name: Scalars["String"]["input"];
  nominalPower?: InputMaybe<Scalars["Int"]["input"]>;
};

export type MutationDeleteFacilityArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationUpdateFacilityArgs = {
  id: Scalars["ID"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  nominalPower?: InputMaybe<Scalars["Int"]["input"]>;
};

export type MutationUploadCsvArgs = {
  facility_id: Scalars["ID"]["input"];
  file: Scalars["Upload"]["input"];
};

export type Query = {
  __typename?: "Query";
  facilities?: Maybe<Array<Maybe<Facility>>>;
  facility?: Maybe<Facility>;
};

export type QueryFacilityArgs = {
  id: Scalars["ID"]["input"];
};

export type UploadResult = {
  __typename?: "UploadResult";
  duplicatesIgnored?: Maybe<Scalars["Int"]["output"]>;
  insertedCount?: Maybe<Scalars["Int"]["output"]>;
  modifiedCount?: Maybe<Scalars["Int"]["output"]>;
  success?: Maybe<Scalars["String"]["output"]>;
};

export type AdditionalEntityFields = {
  path?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
};

import { ObjectId } from "mongodb";
export type EnergyReportDbObject = {
  active_power_kW?: Maybe<number>;
  energy_kWh?: Maybe<number>;
  facility_id: IdDbObject["_id"];
  _id: ObjectId;
  timestamp?: Maybe<any>;
};

export type FacilityDbObject = {
  _id: ObjectId;
  name?: Maybe<string>;
  nominalPower?: Maybe<number>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Date: ResolverTypeWrapper<Scalars["Date"]["output"]>;
  DateTimeISO: ResolverTypeWrapper<Scalars["DateTimeISO"]["output"]>;
  EnergyReport: ResolverTypeWrapper<EnergyReportDbObject>;
  Float: ResolverTypeWrapper<Scalars["Float"]["output"]>;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  Facility: ResolverTypeWrapper<FacilityDbObject>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  Query: ResolverTypeWrapper<{}>;
  Upload: ResolverTypeWrapper<Scalars["Upload"]["output"]>;
  UploadResult: ResolverTypeWrapper<UploadResult>;
  AdditionalEntityFields: AdditionalEntityFields;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Date: Scalars["Date"]["output"];
  DateTimeISO: Scalars["DateTimeISO"]["output"];
  EnergyReport: EnergyReportDbObject;
  Float: Scalars["Float"]["output"];
  ID: Scalars["ID"]["output"];
  Facility: FacilityDbObject;
  String: Scalars["String"]["output"];
  Int: Scalars["Int"]["output"];
  Mutation: {};
  Boolean: Scalars["Boolean"]["output"];
  Query: {};
  Upload: Scalars["Upload"]["output"];
  UploadResult: UploadResult;
  AdditionalEntityFields: AdditionalEntityFields;
}>;

export type UnionDirectiveArgs = {
  discriminatorField?: Maybe<Scalars["String"]["input"]>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type UnionDirectiveResolver<
  Result,
  Parent,
  ContextType = ApolloContext,
  Args = UnionDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {
  discriminatorField: Scalars["String"]["input"];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type AbstractEntityDirectiveResolver<
  Result,
  Parent,
  ContextType = ApolloContext,
  Args = AbstractEntityDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {
  embedded?: Maybe<Scalars["Boolean"]["input"]>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type EntityDirectiveResolver<
  Result,
  Parent,
  ContextType = ApolloContext,
  Args = EntityDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {
  overrideType?: Maybe<Scalars["String"]["input"]>;
};

export type ColumnDirectiveResolver<
  Result,
  Parent,
  ContextType = ApolloContext,
  Args = ColumnDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = {};

export type IdDirectiveResolver<
  Result,
  Parent,
  ContextType = ApolloContext,
  Args = IdDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {
  overrideType?: Maybe<Scalars["String"]["input"]>;
};

export type LinkDirectiveResolver<
  Result,
  Parent,
  ContextType = ApolloContext,
  Args = LinkDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = {};

export type EmbeddedDirectiveResolver<
  Result,
  Parent,
  ContextType = ApolloContext,
  Args = EmbeddedDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {
  path: Scalars["String"]["input"];
};

export type MapDirectiveResolver<
  Result,
  Parent,
  ContextType = ApolloContext,
  Args = MapDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
  name: "Date";
}

export interface DateTimeIsoScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["DateTimeISO"], any> {
  name: "DateTimeISO";
}

export type EnergyReportResolvers<
  ContextType = ApolloContext,
  ParentType extends ResolversParentTypes["EnergyReport"] = ResolversParentTypes["EnergyReport"]
> = ResolversObject<{
  active_power_kW?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  energy_kWh?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  facility_id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  timestamp?: Resolver<
    Maybe<ResolversTypes["DateTimeISO"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FacilityResolvers<
  ContextType = ApolloContext,
  ParentType extends ResolversParentTypes["Facility"] = ResolversParentTypes["Facility"]
> = ResolversObject<{
  availableReportsDates?: Resolver<
    Maybe<Array<ResolversTypes["Date"]>>,
    ParentType,
    ContextType
  >;
  energyReports?: Resolver<
    Maybe<Array<ResolversTypes["EnergyReport"]>>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  nominalPower?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = ApolloContext,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = ResolversObject<{
  createFacility?: Resolver<
    Maybe<ResolversTypes["Facility"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateFacilityArgs, "name">
  >;
  deleteFacility?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteFacilityArgs, "id">
  >;
  updateFacility?: Resolver<
    Maybe<ResolversTypes["Facility"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateFacilityArgs, "id">
  >;
  uploadCSV?: Resolver<
    Maybe<ResolversTypes["UploadResult"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUploadCsvArgs, "facility_id" | "file">
  >;
}>;

export type QueryResolvers<
  ContextType = ApolloContext,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = ResolversObject<{
  facilities?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Facility"]>>>,
    ParentType,
    ContextType
  >;
  facility?: Resolver<
    Maybe<ResolversTypes["Facility"]>,
    ParentType,
    ContextType,
    RequireFields<QueryFacilityArgs, "id">
  >;
}>;

export interface UploadScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Upload"], any> {
  name: "Upload";
}

export type UploadResultResolvers<
  ContextType = ApolloContext,
  ParentType extends ResolversParentTypes["UploadResult"] = ResolversParentTypes["UploadResult"]
> = ResolversObject<{
  duplicatesIgnored?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  insertedCount?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  modifiedCount?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  success?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = ApolloContext> = ResolversObject<{
  Date?: GraphQLScalarType;
  DateTimeISO?: GraphQLScalarType;
  EnergyReport?: EnergyReportResolvers<ContextType>;
  Facility?: FacilityResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  UploadResult?: UploadResultResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = ApolloContext> = ResolversObject<{
  union?: UnionDirectiveResolver<any, any, ContextType>;
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  column?: ColumnDirectiveResolver<any, any, ContextType>;
  id?: IdDirectiveResolver<any, any, ContextType>;
  link?: LinkDirectiveResolver<any, any, ContextType>;
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>;
  map?: MapDirectiveResolver<any, any, ContextType>;
}>;
