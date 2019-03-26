import path from 'path';
import Scheduler from '../Scheduler';
import partialMap from './partialMap';
import scheduleWorker from '../scheduleWorker';
import { Collection, Key } from '../types';
import { MapIteratee, MapOptions, MapWorkerData, MapResult } from './types';

export default class Map extends Scheduler {
  partialLength: number;

  lastPartialLength: number;

  collectionKeys?: Key[];

  length: number;

  constructor(
    public collection: Collection,
    public iteratee: MapIteratee,
    options?: Partial<MapOptions>
  ) {
    super(options);
    this.length =
      Array.isArray(this.collection) || typeof this.collection === 'string'
        ? this.collection.length
        : Object.keys(this.collection).length;
    this.partialLength = Math.ceil(this.length / this.threadCount);
    this.lastPartialLength = this.length % this.partialLength;
    if (
      typeof this.collection === 'object' &&
      !Array.isArray(this.collection)
    ) {
      this.collectionKeys = Object.keys(this.collection);
    }
  }

  getPartialCollection(threadId: number): Collection {
    let partialCollection: Collection = [];
    const start: number = threadId * this.partialLength;
    const end: number =
      start +
      (threadId === this.threadCount - 1
        ? this.lastPartialLength
        : this.partialLength);
    if (typeof this.collection === 'string' || Array.isArray(this.collection)) {
      partialCollection = this.collection.slice(start, end);
    } else if (typeof this.collection === 'object' && this.collectionKeys) {
      partialCollection = {};
      const keys: Key[] = this.collectionKeys.slice(start, end);
      keys.forEach((key: Key) => {
        partialCollection[key as keyof Collection] = this.collection[
          key as keyof Collection
        ];
      });
    }
    return partialCollection;
  }

  async run(): Promise<MapResult> {
    let result: MapResult = [];
    const workers: Promise<MapResult>[] = [];
    for (let threadId = 0; threadId < this.threadCount; threadId++) {
      const partialCollection = this.getPartialCollection(threadId);
      if (threadId === 0) {
        workers.push(
          Promise.resolve(
            partialMap(partialCollection, this.iteratee, this.context)
          )
        );
      } else {
        const workerData: MapWorkerData = {
          context: this.context,
          iterateeString: this.iteratee.toString(),
          partialCollection
        };
        workers.push(
          scheduleWorker<MapResult>(
            path.resolve(__dirname, '../../lib/map', 'worker.js'),
            workerData
          )
        );
      }
    }
    const partialResults: MapResult[] = await Promise.all(workers);
    partialResults.forEach(partialResult => {
      result = result.concat(partialResult);
    });
    return result;
  }
}
