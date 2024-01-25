/* eslint-disable @typescript-eslint/no-namespace */

import { IsArray, IsNotEmpty, IsString } from "class-validator";

export namespace DataModelsDtos {
  export class BulkUpdateInput {
    entity: string;

    data: UpdateData[];
  }

  export class BulkInsertInput {
    entity: string;

    data: JSON[];
  }

  export class Table {
    name: string;
    alias: string;
    columns: string[];
  }

  export class UpdateDataInput {
    entity: string;

    data: UpdateData;
  }

  export class UpdateData {
    id: string;

    input: JSON;
  }

  export class MetaDataInfo {
    column_name: string;
    data_type: string;
    is_nullable: string;
    Key: string;
    column_default: string;
    Extra: string;
  }

  export class MetaDataResponse {
    columnName: string;
    dataType: string;
    nullable: boolean;
    key: string;
    defaultValue: string;
  }

  export class DbRelationshipData {
    dbRelationalData: RelationshipModelFields[];
  }

  export class TablesInput {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsArray()
    columns: string[];
  }

  export class GetJoinsClauseInput {
    @IsArray()
    tables: TablesInput[];
  }

  export class RelationshipModelFields {
    tableName: string;
    columnName: string;
    referencedTableName: string;
    referencedColumnName: string;
    constraintName: string;
  }
}
