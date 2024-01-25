/* eslint-disable @typescript-eslint/no-namespace */
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsObject, IsOptional, IsPositive, IsString } from "class-validator";

import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET, DEFAULT_FILTER_INPUT_STRING, DEFAULT_ORDER_BY_COLUMN } from "./constants";
import { EntityType, JoinTypes, LevelState, OrderBy, RoleTypes } from "./enums";
import { Alert } from "../alert/entity/alert.entity";
import { Sensor } from "../sensor/entity/sensor.entity";

export namespace CommonDTOs {
  export class PaginationInput {
    @IsInt()
    @IsPositive()
    limit: number = DEFAULT_PAGE_LIMIT;

    @IsInt()
    offset: number = DEFAULT_PAGE_OFFSET;
  }

  export class FilterInputString {
    @IsString()
    filterInputString: string = DEFAULT_FILTER_INPUT_STRING;
  }
  export class Order {
    @IsString()
    orderByColumn: string = DEFAULT_ORDER_BY_COLUMN;

    @IsString()
    orderBy: string = OrderBy.DESC;
  }

  export class EntityNames {
    @IsOptional()
    @IsArray()
    entityNames?: string[];
  }

  export class CommonParams {
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    id: string;
  }

  export class FilterParam {
    [key: string]: string | number | string[];
  }

  export class Metadata {
    displayName: string;
  }
  export class Meta {
    friendlyName: string;

    dataType: string;

    isFilterable: boolean;

    isSortable: boolean;

    isRequired: boolean;
  }

  export class Fields {
    name: string;

    metadata: Meta;
  }

  export class JoinTable {
    tableName?: string;

    name: string;

    joinType: JoinTypes;

    joinTo: string;

    joinFrom: string;
  }

  export class FileReadJson {
    name: string;

    type: string;

    metadata: Metadata;

    fields: Fields[];
  }

  export class EdiFeedStatisticsMetadata {
    info: JSON;
  }
  export class MessageResponse {
    message: string;
  }
  export class DataModelOutput {
    fieldName: string;

    columnName: string;

    friendlyName: string;

    description: string;

    dataType: string;

    isEditable: boolean;

    isRequired: boolean;

    isSortable: boolean;

    isFilterable: boolean;

    isUnique: boolean;
  }

  export class DataModelInput {
    @IsString()
    entity: string;

    @IsString()
    siteId: string;

    @IsOptional()
    @IsObject()
    pagination: PaginationInput;

    @IsOptional()
    @IsString()
    filterInputString: string;

    @IsOptional()
    @IsString()
    filterInputString2: string;

    @IsOptional()
    @IsEnum(OrderBy)
    orderBy?: OrderBy;

    @IsOptional()
    @IsString()
    orderByColumn?: string;

    @IsOptional()
    @IsString()
    groupBy?: string;

    joinTables?: JoinTable[];

    id?: number | string;

    @IsOptional()
    columns?: string[];

    @IsOptional()
    uniqueKey?: string;

    input?: JSON;

    deleteSoft?: boolean;
  }

  export class CreateDataModelInput {
    @IsEnum(EntityType)
    entity: EntityType;

    @IsString()
    siteId: string;

    input?: JSON;
  }

  export class BulkDataModelInput {
    @IsEnum(EntityType)
    entity: EntityType;

    date?: string;

    id?: number;

    joinTables?: JoinTable[];

    columns?: string[];

    input: JSON[];
  }

  export class DataModelBulkDeleteInput {
    entity: string;

    date?: string;

    ids?: number[];

    joinTables?: JoinTable[];

    columns?: string[];

    input: JSON[];
  }

  export class DataModelUpdateInput {
    entity: string;

    date?: string;

    id?: number;

    joinTables?: JoinTable[];

    columns?: string[];

    data: UpdateDataModelDataType;
  }

  class UpdateDataModelDataType {
    id: string;

    input: JSON;
  }

  export interface PaginationOutput<T> {
    data: T[];
    totalRecords: number;
  }

  export class Response<T> {
    message?: string;
    data?: T;
  }
  export class VersionHistoryOutput {
    data: JSON;
    totalRecords?: number;
  }

  export class RelationShips {
    entityName: string;

    @IsEnum(LevelState)
    level: LevelState;
  }
  export class DataModelEntity {
    entity: string;
  }

  export class QueryBuilderOutput {
    query: string;
  }

  export class BulkUpdateDataModelInput {
    entity: string;

    date?: string;

    id?: number;

    joinTables?: JoinTable[];

    columns?: string[];

    data?: UpdateDataModelDataType[];
  }

  export class ValidationCorrectionInput {
    templateIds: number[];

    errorValidationRuleId?: number;
  }

  export class ValidationCorrectionOutput {
    data: JSON;
    totalRecords?: number;
  }

  export class CurrentUser {
    isSuperAdmin: boolean;
    email: string;
    id: string;
    password?: string;
    name: string;
  }

  export class CommonFileType {
    destination: string;
    encoding: string;
    fieldname: string;
    filename: string;
    mimetype: string;
    originalname: string;
    path: string;
    size: number;
  }
  export class SensorAlertType {
    sensor: Sensor[] | void;
    alert: Alert[];
  }
}
