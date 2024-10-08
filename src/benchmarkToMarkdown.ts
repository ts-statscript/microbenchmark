import { BenchmarkResult } from './microbenchmark';

/**
 * Formats results as a markdown table
 *
 * @param results - Array of BenchmarkResult objects
 * @param mdTitle - A markdown title for the table e.g. '# Variance benchmarks'
 */
export function benchmarkToMarkdown(results: BenchmarkResult[]): string {
    let markdown = '| Function | Median | Mean | Min | Max | SD | Unit|\n';
    markdown +=
        '|----------|--------|------|-----|-----|--------------------|------|\n';

    results.forEach((result) => {
        markdown += `| ${result.name} | ${result.median} | ${result.mean} | ${result.min} | ${result.max} | ${result.sd} | ${result.unit} |\n`;
    });

    return markdown;
}
