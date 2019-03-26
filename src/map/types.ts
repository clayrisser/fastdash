import { Collection, Context, Key, Options, WorkerData } from '../types';

export type MapResult = any[];

export type MapIteratee = (value: any, key?: Key, context?: Context) => {};

export interface MapOptions extends Options {}

export interface MapWorkerData extends WorkerData {
  iterateeString: string;
  partialCollection: Collection;
}
