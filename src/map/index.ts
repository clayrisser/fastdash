import Map from './Map';
import { Collection } from '../types';
import { MapIteratee, MapOptions, MapResult } from './types';

export default async function map(
  collection: Collection,
  iteratee: MapIteratee,
  options?: MapOptions
): Promise<MapResult> {
  const map = new Map(collection, iteratee, options);
  return map.run();
}
