import { performance } from 'perf_hooks';

/**
 * Represents the result of a single benchmark run.
 */
interface BenchmarkResult {
    /** The name of the benchmarked function */
    name: string;
    /** Array of execution times for each run */
    times: number[];
    /** Median execution time */
    median: number;
    /** Mean execution time */
    mean: number;
    /** Minimum execution time */
    min: number;
    /** Maximum execution time */
    max: number;
    /** Standard deviation of execution times */
    sd: number;
    /** Time unit */
    unit: string;
}

/**
 * Options for configuring the benchmark run.
 */
interface BenchmarkOptions {
    /** Number of times to run each benchmark (default: 100) */
    times?: number;
    /** Number of warmup runs before timing (default: 10) */
    warmup?: number;
    /** Time unit for results (default: 'ms') */
    unit?: 'ns' | 'us' | 'ms' | 's';
}

/**
 * Represents a single entry in the benchmark suite.
 */
interface BenchmarkEntry {
    /** Name of the benchmark */
    name: string;
    /** Function to be benchmarked */
    fn: () => any | Promise<any>;
}

/**
 * Runs microbenchmarks on the provided functions and returns performance statistics.
 *
 * @param entries - An array of benchmark entries to run
 * @param options - Configuration options for the benchmark
 * @returns A promise that resolves to an array of benchmark results
 */
async function microbenchmark(
    entries: BenchmarkEntry[],
    options: BenchmarkOptions = {}
): Promise<BenchmarkResult[]> {
    const { times = 100, warmup = 10, unit = 'ms' } = options;

    const results: BenchmarkResult[] = [];

    for (const { name, fn } of entries) {
        // Warmup
        for (let i = 0; i < warmup; i++) {
            await Promise.resolve(fn());
        }

        const timings: number[] = [];

        // Actual benchmark
        for (let i = 0; i < times; i++) {
            const start = performance.now();
            await Promise.resolve(fn());
            const end = performance.now();
            timings.push(end - start);
        }

        // Calculate statistics
        timings.sort((a, b) => a - b);
        const median = timings[Math.floor(timings.length / 2)];
        const mean =
            timings.reduce((sum, time) => sum + time, 0) / timings.length;
        const min = timings[0];
        const max = timings[timings.length - 1];
        const sd = Math.sqrt(
            timings.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) /
                timings.length
        );

        // Convert to specified unit
        const conversionFactor = getConversionFactor(unit);
        const convertedTimings = timings.map((t) => t * conversionFactor);

        results.push({
            name,
            times: convertedTimings,
            median: median * conversionFactor,
            mean: mean * conversionFactor,
            min: min * conversionFactor,
            max: max * conversionFactor,
            sd: sd * conversionFactor,
            unit: unit
        });
    }

    return results;
}

/**
 * Calculates the conversion factor for the given time unit.
 *
 * @param unit - The time unit to convert to
 * @returns The conversion factor
 */
function getConversionFactor(unit: 'ns' | 'us' | 'ms' | 's'): number {
    switch (unit) {
        case 'ns':
            return 1e6;
        case 'us':
            return 1e3;
        case 'ms':
            return 1;
        case 's':
            return 1e-3;
        default:
            return 1;
    }
}

export { microbenchmark, BenchmarkResult, BenchmarkOptions, BenchmarkEntry };
