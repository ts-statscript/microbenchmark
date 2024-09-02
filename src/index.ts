import { performance } from 'perf_hooks';

interface BenchmarkResult {
    name: string;
    times: number[];
    median: number;
    mean: number;
    min: number;
    max: number;
    sd: number;
}

interface BenchmarkOptions {
    times?: number;
    warmup?: number;
    unit?: 'ns' | 'us' | 'ms' | 's';
}

interface BenchmarkEntry {
    name: string;
    fn: () => any | Promise<any>;
}

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
            sd: sd * conversionFactor
        });
    }

    return results;
}

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
