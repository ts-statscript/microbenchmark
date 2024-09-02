import fs from 'fs';
import path from 'path';

import { BenchmarkResult } from './microbenchmark';

/**
 * Writes benchmark results to a Markdown file.
 *
 * @param results - Array of BenchmarkResult objects
 * @param outputPath - Path to write the Markdown file (default: './docs/benchmark-results.md')
 */
export function benchmarkToMarkdown(
    results: BenchmarkResult[],
    outputPath: string = path.join(process.cwd(), 'benchmark-results.md')
): void {
    let markdown = '# Benchmark Results\n\n';
    markdown += '| Function | Median | Mean | Min | Max | SD | Unit|\n';
    markdown +=
        '|----------|--------|------|-----|-----|--------------------|------|\n';

    results.forEach((result) => {
        markdown += `| ${result.name} | ${result.median} | ${result.mean} | ${result.min} | ${result.max} | ${result.sd} | ${result.unit} |\n`;
    });

    fs.writeFileSync(outputPath, markdown);
    console.log(`Benchmark results written to ${outputPath}`);
}
