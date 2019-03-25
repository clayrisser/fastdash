import FastMap from './fastMap';
import { Collection, Iteratee, Options } from './types';

export default async function fastMap(
  collection: Collection,
  iteratee: Iteratee,
  options?: Options
) {
  const fastMap = new FastMap(collection, iteratee, options);
  return fastMap.map();
}
