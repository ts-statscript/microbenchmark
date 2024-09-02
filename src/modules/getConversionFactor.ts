/**
 * Calculates the conversion factor for the given time unit.
 *
 * @param unit - The time unit to convert to
 * @returns The conversion factor
 */
export function getConversionFactor(unit: 'ns' | 'us' | 'ms' | 's'): number {
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
