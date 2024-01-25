export interface MapperJsonObject {
  tables: Object;
  columns: Object;
  joinClauses: Object[];
  whereClauses: any[][];
  groupBy: string[];
  orderBy: Object;
  limit: string;
  offset: string;
}

export interface QueryObj {
  query: string;
  queryObj: queryObject;
}

export interface queryObject {
  select: string;
  from: string;
  joins: string;
  where: string;
  groupBy: string;
  orderBy: string;
  limit: string;
  offset: string;
}
