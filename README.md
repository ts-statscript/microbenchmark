# @ts-statscript/microbenchmark

A TypeScript microbenchmarking library inspired by R's microbenchmark package. This library allows you to easily benchmark and compare the performance of multiple functions, supporting both synchronous and asynchronous operations.

## Features

- Benchmark multiple functions in a single call
- Support for both synchronous and asynchronous functions
- Customisable number of iterations and warmup rounds
- Flexible time unit reporting (nanoseconds, microseconds, milliseconds, seconds)
- Comprehensive statistics including median, mean, min, max, and standard deviation

## Installation

Install the package using npm:

```bash
npm install @ts-statscript/microbenchmark
```

Or using yarn:

```bash
yarn add @ts-statscript/microbenchmark
```

## Usage

Here's a basic example of how to use `@ts-statscript/microbenchmark`:

```typescript
import {
    microbenchmark,
    BenchmarkEntry,
    benchmarkToMarkdown
} from '@ts-statscript/microbenchmark';

const benchmarks: BenchmarkEntry[] = [
    {
        name: 'for loop',
        fn: () => {
            let sum = 0;
            for (let i = 0; i < 1000; i++) {
                sum += i;
            }
            return sum;
        }
    },
    {
        name: 'reduce',
        fn: () => {
            return Array.from({ length: 1000 }, (_, i) => i).reduce((sum, i) => sum + i, 0);
        }
    }
];

async function main(): Promise<void> {
    const results = await microbenchmark(benchmarks, { times: 5, warmup: 100, unit: 'us' });
    console.log(results);

    benchmarkToMarkdown(results);
}

main();
```

Outputs to markdown file:

```markdown
# Benchmark Results

| Function | Median | Mean | Min | Max | SD | Unit|
|----------|--------|------|-----|-----|--------------------|------|
| for loop | 6.750000000000256 | 6.549800000000516 | 4.8330000000014195 | 7.999999999999119 | 1.0367272351002275 | us |
| reduce | 11.416000000000537 | 23.38280000000026 | 9.665999999999286 | 71.79100000000105 | 24.22385929120337 | us |

```

## Usage

### `microbenchmark(entries, options)`

Runs the benchmark suite and returns the results.

#### Parameters:

- `entries`: An array of `BenchmarkEntry` objects, each containing:
    - `name`: A string identifying the benchmark
    - `fn`: The function to benchmark (can be synchronous or asynchronous)
- `options`: (Optional) A `BenchmarkOptions` object with the following properties:
    - `times`: Number of times to run each benchmark (default: 100)
    - `warmup`: Number of warmup runs before timing (default: 10)
    - `unit`: Time unit for results ('ns', 'us', 'ms', or 's', default: 'ms')

#### Returns:

A Promise that resolves to an array of `BenchmarkResult` objects, each containing:

- `name`: The name of the benchmarked function
- `times`: Array of execution times for each run
- `median`: Median execution time
- `mean`: Mean execution time
- `min`: Minimum execution time
- `max`: Maximum execution time
- `sd`: Standard deviation of execution times

## Demo

Let's run a more comprehensive demo that includes async functions and different time units:

```typescript
import { microbenchmark, BenchmarkEntry } from '@ts-statscript/microbenchmark';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const benchmarks: BenchmarkEntry[] = [
    {
        name: 'Synchronous: for loop',
        fn: () => {
            let sum = 0;
            for (let i = 0; i < 1000; i++) {
                sum += i;
            }
            return sum;
        }
    },
    {
        name: 'Synchronous: reduce',
        fn: () => {
            return Array.from({ length: 1000 }, (_, i) => i).reduce((sum, i) => sum + i, 0);
        }
    },
    {
        name: 'Asynchronous: 1ms delay',
        fn: async () => {
            await delay(1);
        }
    },
    {
        name: 'Asynchronous: 2ms delay',
        fn: async () => {
            await delay(2);
        }
    }
];

async function benchmark() {
    console.log('Running benchmarks...');
    const results = await microbenchmark(benchmarks, { times: 1000, warmup: 100, unit: 'us' });
    
    results.forEach(result => {
        console.log(`\n${result.name}:`);
        console.log(`  Median: ${result.median.toFixed(2)} μs`);
        console.log(`  Mean: ${result.mean.toFixed(2)} μs`);
        console.log(`  Min: ${result.min.toFixed(2)} μs`);
        console.log(`  Max: ${result.max.toFixed(2)} μs`);
        console.log(`  Standard Deviation: ${result.sd.toFixed(2)} μs`);
    });
}

benchmark();
```

This demo will output the benchmark results for four different functions: two synchronous and two asynchronous. The results will show you how `@ts-statscript/microbenchmark` can be used to compare the performance of different implementations and types of functions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Licence

This project is licensed under the MIT Licence.