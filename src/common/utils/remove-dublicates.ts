import * as _ from 'lodash';

interface MyObject {
  [key: string]: any;
}

export function removeDuplicatesByKey<T extends MyObject>(array: T[], key: string): T[] {
  return _.uniqBy(array, key);
}