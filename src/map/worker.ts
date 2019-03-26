import { isMainThread, parentPort, workerData } from 'worker_threads';
import partialMap from './partialMap';
import { Collection, Context } from '../types';
import { MapIteratee, MapResult } from './types';

export default function worker(): MapResult {
  const partialCollection: Collection = workerData.partialCollection;
  const iteratee: MapIteratee = workerData.iteratee;
  const context: Context = workerData.context;
  const result: MapResult = partialMap(partialCollection, iteratee, context);
  if (parentPort) parentPort.postMessage({ result });
  return result;
}

if (!isMainThread) worker();
