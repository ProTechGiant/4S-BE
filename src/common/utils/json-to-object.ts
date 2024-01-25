import { Brackets, SelectQueryBuilder } from "typeorm";

export const JsonToObject = (filter: string) => {
  const res = JSON.parse(filter);

  const outerOperator = (Object.keys(res)[0] as "$and" | "$or") ?? null;
  if (outerOperator === null) return outerOperator;

  const innerOperator: Object = Object.values(res)[0];

  const processOperations = (fieldName: string, element: any, opCode: string) => {
    const value = element[fieldName][opCode];
    const uniqueIndex = Math.random();

    switch (opCode) {
      case "$gt":
        return {
          [fieldName]: [`> :val${uniqueIndex}`, { [`val${uniqueIndex}`]: value }],
        };
      case "$gte":
        return {
          [fieldName]: [`>= :val${uniqueIndex}`, { [`val${uniqueIndex}`]: value }],
        };
      case "$eq":
        return {
          [fieldName]: [`= :val${uniqueIndex}`, { [`val${uniqueIndex}`]: value }],
        };
      case "$ne":
        return {
          [fieldName]: [`<> :val${uniqueIndex}`, { [`val${uniqueIndex}`]: value }],
        };
      case "$lt":
        return {
          [fieldName]: [`< :val${uniqueIndex}`, { [`val${uniqueIndex}`]: value }],
        };
      case "$lte":
        return {
          [fieldName]: [`<= :val${uniqueIndex}`, { [`val${uniqueIndex}`]: value }],
        };
      case "$in":
        return {
          [fieldName]: [`in :val${uniqueIndex}`, { [`val${uniqueIndex}`]: value }],
        };
      case "$like":
        return {
          [fieldName]: [`like :val${uniqueIndex}`, { [`val${uniqueIndex}`]: `%${value}%` }],
        };
      case "$isNull":
        return {
          [fieldName]: [`is :val${uniqueIndex}`, { [`val${uniqueIndex}`]: null }],
        };
      case "$notNull":
        return {
          [fieldName]: [`is not :val${uniqueIndex}`, { [`val${uniqueIndex}`]: null }],
        };
      case "$between":
        const [minValue, maxValue] = value;
        return {
          [fieldName]: [`between :val0 AND :val1`, { val0: minValue, val1: maxValue }],
        };
      default:
        return null;
    }
  };

  const processFilter = (operation: string) => {
    const val = innerOperator[operation];

    if (val === undefined) {
      return null;
    } else if (val.length > 0) {
      return val.map((element: any) => {
        const fieldName = Object.keys(element)[0];
        const opCode = Object.keys(element[fieldName])[0];
        return processOperations(fieldName, element, opCode);
      });
    }
    return null;
  };

  Object.keys(innerOperator).forEach((operation) => {
    const conditions = processFilter(operation);
    innerOperator[operation] = conditions.length ? conditions : null;
  });

  return { [outerOperator]: innerOperator };
};
export const TransformQueryByFilter = <T>(filter: any, query: SelectQueryBuilder<T>): SelectQueryBuilder<T> => {
  if (filter != null) {
    const outerOperator = Object.keys(filter)[0];
    const innerOperators = Object.values(filter)[0];
    const checkOuterOperationType = outerOperator === "$and" ? "andWhere" : "orWhere";
    Object.entries(innerOperators).forEach(([operation, conditions]) => {
      if (conditions === null) return;
      const checkOperationType = operation === "$and" ? "andWhere" : "orWhere";
      if (Array.isArray(conditions)) {
        query[checkOuterOperationType](
          new Brackets((qb) => {
            conditions.forEach((condition: any) => {
              if (condition === null) return;
              const fieldName = Object.keys(condition)[0];
              const [comparison, parameters] = condition[fieldName];
              qb = qb[checkOperationType](`${fieldName} ${comparison}`, {
                ...parameters,
              });
            });
          })
        );
      }
    });
  }
  return query;
};
