export type Collection = object | string | any[];

export type Context = object;

export type Key = string | number;

export interface Message {
  result: any;
}

export interface Options {
  maxThreads: number;
  context: Context;
}

export interface WorkerData {
  context: Context;
}
