import { isMainThread, parentPort, workerData } from 'worker_threads';
import { Collection, Key, Iteratee, Result, Context } from './types';

if (!isMainThread && parentPort) {
  const partialCollection: Collection = workerData.partialCollection;
  const iteratee: Iteratee = workerData.iteratee;
  const context: Context = workerData.context;
  let result: Result;
  if (typeof partialCollection === 'string') {
    result = mapString(partialCollection, iteratee, context);
  } else if (Array.isArray(partialCollection)) {
    result = mapArray(partialCollection, iteratee, context);
  } else if (typeof partialCollection === 'object') {
    result = mapObject(partialCollection, iteratee, context);
  } else {
    throw new Error('not a valid collection');
  }
  parentPort.postMessage({ result });
}

function mapArray(arr: any[], iteratee: Iteratee, context: Context): Result {
  const result: Result = [];
  arr.forEach((item: any[], i: Key) => {
    result.push(iteratee(item, i, context));
  });
  return result;
}

function mapObject(obj: object, iteratee: Iteratee, context: Context): Result {
  const result: Result = [];
  Object.keys(obj).forEach((key: Key) => {
    const item: any = obj[key as keyof object];
    result.push(iteratee(item, key, context));
  });
  return result;
}

function mapString(str: string, iteratee: Iteratee, context: Context): Result {
  let strResult: string = '';
  let arrResult: any[] = [];
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const iterateeResult: any = iteratee(char, i, context);
    if (typeof char === 'string') strResult += iterateeResult;
    arrResult.push(iterateeResult);
  }
  if (strResult.length === arrResult.length) return strResult;
  return arrResult;
}
