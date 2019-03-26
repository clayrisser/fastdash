import '@babel/polyfill';
import { isMainThread, parentPort, workerData } from 'worker_threads';
import partialMap from './partialMap';
import { Collection, Context } from '../types';
import { MapIteratee, MapResult } from './types';

export default async function worker(): Promise<MapResult> {
  const partialCollection: Collection = workerData.partialCollection;
  const iteratee: MapIteratee = eval(workerData.iterateeString);
  const context: Context = workerData.context;
  const result: MapResult = await partialMap(
    partialCollection,
    iteratee,
    context
  );
  if (parentPort) parentPort.postMessage({ result });
  return result;
}

if (!isMainThread) worker();
