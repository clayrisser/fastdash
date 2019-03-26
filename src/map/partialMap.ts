import { Key, Collection, Context } from '../types';
import { MapIteratee, MapResult } from './types';

export default function partialMap(
  partialCollection: Collection,
  iteratee: MapIteratee,
  context: Context
): MapResult {
  if (
    typeof partialCollection === 'string' ||
    Array.isArray(partialCollection)
  ) {
    return mapArray(partialCollection, iteratee, context);
  } else if (typeof partialCollection === 'object') {
    return mapObject(partialCollection, iteratee, context);
  }
  return [];
}

function mapArray(
  arr: string | any[],
  iteratee: MapIteratee,
  context: Context
): MapResult {
  const result: MapResult = [];
  for (let i = 0; i < arr.length; i++) {
    const item: any = arr[i];
    result.push(iteratee(item, i, context));
  }
  return result;
}

function mapObject(
  obj: object,
  iteratee: MapIteratee,
  context: Context
): MapResult {
  const result: MapResult = [];
  Object.keys(obj).forEach((key: Key) => {
    const item: any = obj[key as keyof object];
    result.push(iteratee(item, key, context));
  });
  return result;
}
