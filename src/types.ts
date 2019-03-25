export type Collection = object | string | any[];

export type Context = object;

export type Key = string | number;

export type Result = any[] | string;

export type Iteratee = (value: any, key?: Key, context?: Context) => {};

export interface Options {
  maxThreads: number;
  context: Context;
}

export interface WorkerData {
  context: Context;
  iteratee: Iteratee;
  partialCollection: Collection;
}
