import { microbenchmark, BenchmarkEntry } from '../src/index';

describe('microbenchmark', () => {
    const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    test('benchmarks synchronous functions', async () => {
        const entries: BenchmarkEntry[] = [
            {
                name: 'loopSum',
                fn: () => {
                    let sum = 0;
                    for (let i = 0; i < 1000; i++) sum += i;
                    return sum;
                }
            },
            {
                name: 'arrayReduce',
                fn: () =>
                    Array.from({ length: 1000 }, (_, i) => i).reduce(
                        (sum, i) => sum + i,
                        0
                    )
            }
        ];

        const results = await microbenchmark(entries, { times: 10, warmup: 2 });

        expect(results).toHaveLength(2);
        results.forEach((result) => {
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('times');
            expect(result.times).toHaveLength(10);
            expect(result).toHaveProperty('median');
            expect(result).toHaveProperty('mean');
            expect(result).toHaveProperty('min');
            expect(result).toHaveProperty('max');
            expect(result).toHaveProperty('sd');
        });
    });

    test('benchmarks asynchronous functions', async () => {
        const entries: BenchmarkEntry[] = [
            {
                name: 'shortDelay',
                fn: async () => await delay(1)
            },
            {
                name: 'longDelay',
                fn: async () => await delay(2)
            }
        ];

        const results = await microbenchmark(entries, { times: 5, warmup: 1 });

        expect(results).toHaveLength(2);
        expect(results[0].mean).toBeLessThan(results[1].mean);
    });

    test('benchmarks mixed sync and async functions', async () => {
        const entries: BenchmarkEntry[] = [
            {
                name: 'loopSum',
                fn: () => {
                    let sum = 0;
                    for (let i = 0; i < 1000; i++) sum += i;
                    return sum;
                }
            },
            {
                name: 'delay',
                fn: async () => await delay(1)
            }
        ];

        const results = await microbenchmark(entries, { times: 5, warmup: 1 });

        expect(results).toHaveLength(2);
    });

    test('supports different time units', async () => {
        const entries: BenchmarkEntry[] = [
            {
                name: 'loopSum',
                fn: () => {
                    let sum = 0;
                    for (let i = 0; i < 1000; i++) sum += i;
                    return sum;
                }
            }
        ];

        const results = await microbenchmark(entries, {
            times: 5,
            warmup: 1,
            unit: 'us'
        });

        expect(results[0].mean).toBeGreaterThan(1); // Assuming the loop takes at least 1 microsecond
    });

    test('handles errors in benchmarked functions', async () => {
        const entries: BenchmarkEntry[] = [
            {
                name: 'throwError',
                fn: () => {
                    throw new Error('Test error');
                }
            }
        ];

        await expect(
            microbenchmark(entries, { times: 5, warmup: 1 })
        ).rejects.toThrow('Test error');
    });
});
