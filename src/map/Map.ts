import path from 'path';
import Scheduler from '../Scheduler';
import scheduleWorker from '../scheduleWorker';
import { Collection, Key } from '../types';
import { MapIteratee, MapOptions, MapWorkerData, MapResult } from './types';

export default class Map extends Scheduler {
  partialLength: number;

  length: number;

  constructor(
    public collection: Collection,
    public iteratee: MapIteratee,
    options?: MapOptions
  ) {
    super(options);
    this.length =
      Array.isArray(this.collection) || typeof this.collection === 'string'
        ? this.collection.length
        : Object.keys(this.collection).length;
    this.partialLength = Math.ceil(this.length / this.threadCount);
  }

  getPartialCollection(): Collection {
    let partialCollection: Collection = [];
    if (typeof this.collection === 'string' || Array.isArray(this.collection)) {
      partialCollection = this.collection;
    } else if (typeof this.collection === 'object') {
      partialCollection = {};
      const keys: Key[] = Object.keys(this.collection);
      keys.forEach((key: Key) => {
        partialCollection[key as keyof Collection];
      });
    }
    return partialCollection;
  }

  async run(): Promise<MapResult> {
    const result: MapResult = [];
    const workers: Promise<MapResult>[] = [];
    for (let i = 0; i < this.threadCount; i++) {
      const workerData: MapWorkerData = {
        context: this.context,
        iteratee: this.iteratee,
        partialCollection: this.getPartialCollection()
      };
      workers.push(
        scheduleWorker<MapResult>(
          path.resolve(__dirname, 'worker.js'),
          workerData
        )
      );
    }
    const results: MapResult[] = await Promise.all(workers);
    for (let i = 0; i < this.threadCount; i++) {
      result.concat(results.pop());
    }
    return result;
  }
}
