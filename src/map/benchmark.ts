import '@babel/polyfill';
import _ from 'lodash';
import map from './';

type HRTime = [number, number];

const arr = getArray(512);

async function main() {
  const fastMapBenchmarkNonintensive = await benchmark(() => {
    return map(arr, f => f);
  });
  const lodashMapBenchmarkNonintensive = await benchmark(() => {
    return _.map(arr, f => f);
  });
  const fastMapBenchmarkIntensive = await benchmark(async () => {
    return map(arr, () => {
      function isPrime(num: number) {
        for (let i = 2; i < num; i++) {
          if (num % i === 0) return false;
        }
        return true;
      }
      function work(num: number) {
        const arr = [2];
        for (let i = 3; i < num; i += 2) {
          if (isPrime(i)) arr.push(i);
        }
        return arr;
      }
      return work(10000);
    });
  });
  const lodashMapBenchmarkIntensive = await benchmark(() => {
    return _.map(arr, () => {
      function isPrime(num: number) {
        for (let i = 2; i < num; i++) {
          if (num % i === 0) return false;
        }
        return true;
      }
      function work(num: number) {
        const arr = [2];
        for (let i = 3; i < num; i += 2) {
          if (isPrime(i)) arr.push(i);
        }
        return arr;
      }
      return work(10000);
    });
  });
  console.log('\n=== CPU NONINTENSIVE ===');
  console.log(`fast.map() => ${fastMapBenchmarkNonintensive} milliseconds`);
  console.log(`_.map() => ${lodashMapBenchmarkNonintensive} milliseconds`);
  console.log('\n=== CPU INTENSIVE ===');
  console.log(`fast.map() => ${fastMapBenchmarkIntensive} milliseconds`);
  console.log(`_.map() => ${lodashMapBenchmarkIntensive} milliseconds\n`);
}

function getArray(size: number) {
  const arr: number[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(i);
  }
  return arr;
}

async function benchmark(job: () => {}): Promise<number> {
  const hrStart: HRTime = process.hrtime();
  await job();
  const hrEnd: HRTime = process.hrtime(hrStart);
  const time: number = hrEnd[0] * 1000 + hrEnd[1] / 1000000;
  return time;
}

main();
