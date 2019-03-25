import os from 'os';
import path from 'path';
import {
  Key,
  Context,
  Collection,
  Iteratee,
  Options,
  WorkerData
} from './types';
import { Worker, isMainThread } from 'worker_threads';

const defaultOptions: Options = {
  maxThreads: -1,
  context: {}
};

export default class FastMap {
  // workers: Worker[];

  cpuCount: number;

  threadCount: number;

  options: Options;

  partialLength: number;

  length: number;

  context: Context;

  constructor(
    public collection: Collection,
    public iteratee: Iteratee,
    options?: Options
  ) {
    if (!isMainThread) throw new Error('not main thread');
    this.options = {
      ...defaultOptions,
      ...options
    };
    this.context = this.options.context;
    this.cpuCount = os.cpus().length;
    this.threadCount =
      this.cpuCount > this.options.maxThreads
        ? this.options.maxThreads
        : this.cpuCount;
    this.length =
      Array.isArray(this.collection) || typeof this.collection === 'string'
        ? this.collection.length
        : Object.keys(this.collection).length;
    this.partialLength = Math.ceil(this.length / this.threadCount);
  }

  async map() {
    for (let i = 0; i < this.threadCount; i++) {
      let partialCollection: Collection;
      if (
        typeof this.collection === 'string' ||
        Array.isArray(this.collection)
      ) {
        partialCollection = this.collection;
      } else if (typeof this.collection === 'object') {
        partialCollection = {};
        const keys: Key[] = Object.keys(this.collection);
        for (let i = 0; i < keys.length; i++) {
          const key: Key = keys[i];
          partialCollection[key as keyof Collection];
        }
      } else {
        throw new Error('not a valid collection');
      }
      const workerData: WorkerData = {
        context: this.context,
        iteratee: this.iteratee,
        partialCollection
      };
      const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
        workerData
      });
      return new Promise((resolve, reject) => {
        worker.on('message', message => {
          return resolve(message);
        });
        worker.on('error', reject);
        worker.on('exit', (code: number) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });
    }
  }
}
