import { Key, Collection, Context } from '../types';
import { MapIteratee, MapResult } from './types';

export default async function partialMap(
  partialCollection: Collection,
  iteratee: MapIteratee,
  context: Context
): Promise<MapResult> {
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

async function mapArray(
  arr: string | any[],
  iteratee: MapIteratee,
  context: Context
): Promise<MapResult> {
  const result: MapResult = [];
  for (let i = 0; i < arr.length; i++) {
    const item: any = arr[i];
    result.push(await iteratee(item, i, context));
  }
  return result;
}

async function mapObject(
  obj: object,
  iteratee: MapIteratee,
  context: Context
): Promise<MapResult> {
  const result: MapResult = [];
  const keys: Key[] = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key: Key = keys[i];
    const item: any = obj[key as keyof object];
    result.push(await iteratee(item, key, context));
  }
  return result;
}
