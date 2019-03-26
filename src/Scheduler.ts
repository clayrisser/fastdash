import os from 'os';
import { isMainThread } from 'worker_threads';
import { Context, Options } from './types';

const defaultOptions: Options = {
  maxThreads: -1,
  context: {}
};

export default class Scheduler {
  cpuCount: number;

  threadCount: number;

  options: Options;

  context: Context;

  constructor(options?: Options) {
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
  }
}
