import type { Dataset, YearInfo } from './types';

export function formatNumber(num: number): string {
  try {
    if (Math.abs(num) >= 1000)
      return new Intl.NumberFormat().format(Math.round(num));
    return String(num);
  } catch {
    return String(num);
  }
}

export function getAllYears(dataset: Dataset): number[] {
  const set = new Set<number>();
  for (const key of Object.keys(dataset)) {
    for (const row of dataset[key].data) {
      set.add(row.year);
    }
  }
  return Array.from(set).sort((a, b) => a - b);
}

export function latestWithField(
  rows: YearInfo[],
  field: keyof YearInfo
): YearInfo | null {
  const sorted = [...rows].sort((a, b) => b.year - a.year);
  return sorted.find((yearInfo) => yearInfo[field] != null) ?? null;
}

export function inferRegionsFromKeys(dataset: Dataset): string[] {
  const regions = new Set<string>();
  regions.add('All');

  Object.entries(dataset).forEach(([countryName, entry]) => {
    if (!entry.iso_code) {
      regions.add(countryName);
    }
  });

  return Array.from(regions);
}
