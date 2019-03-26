import { Worker } from 'worker_threads';
import { Message, WorkerData } from './types';

export default async function scheduleWorker<Result>(
  workerPath: string,
  workerData: WorkerData
): Promise<Result> {
  const worker = new Worker(workerPath, { workerData });
  return new Promise((resolve, reject) => {
    worker.on('message', (message: Message) => {
      const result: Result = message.result;
      return resolve(result);
    });
    worker.on('error', reject);
    worker.on('exit', (code: number) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}
