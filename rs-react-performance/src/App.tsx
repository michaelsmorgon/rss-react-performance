import { useCallback, useMemo, useState, useTransition } from 'react';
import styles from './App.module.css';
import type {
  AdditionalColumn,
  CountryKey,
  SortKey,
  YearInfo,
} from './utils/types';
import { useDataResource } from './hooks/useResourceData';
import { getAllYears } from './utils/utils';
import { CountryCard } from './components/country-card/CountryCard';
import { ColumnSelectorModal } from './components/column-selector/ColumnSelectorModal';
import YearSelector from './components/search/YearSelector';
import RegionSelector from './components/search/RegionSelector';
import CountrySearch from './components/search/CountrySearch';
import Button from './components/button/Button';
import SortBy from './components/search/SortBy';
import OrderBy from './components/search/OrderBy';

const REQUIRED_COLS: (keyof YearInfo)[] = [
  'year',
  'population',
  'co2',
  'co2_per_capita',
];

export default function App() {
  const resource = useDataResource();
  const data = resource.read();

  const years = useMemo(() => getAllYears(data), [data]);
  const [selectedYear, setSelectedYear] = useState<number>(
    years[years.length - 1] ?? 2023
  );
  const [query, setQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortKey>('population');
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('desc');
  const [selectedCols, setSelectedCols] = useState<AdditionalColumn[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleYearChange = useCallback((y: number) => {
    startTransition(() => setSelectedYear(y));
  }, []);

  const handleQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    },
    []
  );

  const handleRegion = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setRegionFilter(event.target.value);
    },
    []
  );

  const handleSortKey = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSortBy(event.target.value as SortKey);
    },
    []
  );

  const handleOrderBy = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setOrderBy(event.target.value as 'asc' | 'desc');
    },
    []
  );

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);
  const onColumnsChange = useCallback((cols: AdditionalColumn[]) => {
    setSelectedCols(cols);
  }, []);

  const countryEntries = useMemo(() => {
    const entries = Object.entries(data) as [
      CountryKey,
      { iso_code?: string; data: YearInfo[] },
    ][];
    let list = entries;

    if (regionFilter !== 'All') {
      list = list.filter(([countryName]) => {
        return countryName === regionFilter;
      });
    }

    if (query.trim()) {
      const queryLower = query.trim().toLowerCase();
      list = list.filter(([name]) => name.toLowerCase().includes(queryLower));
    }

    const compare = (a: (typeof list)[number], b: (typeof list)[number]) => {
      if (sortBy === 'name') {
        return orderBy === 'asc'
          ? a[0].localeCompare(b[0])
          : b[0].localeCompare(a[0]);
      }
      const getPop = (entry: (typeof list)[number]) => {
        const data = entry[1].data.find((obj) => obj.year === selectedYear);
        return data?.population ?? Number.NaN;
      };
      const popA = getPop(a);
      const popB = getPop(b);
      const popValueA = Number.isFinite(popA)
        ? popA
        : orderBy === 'desc'
          ? -Infinity
          : Infinity;
      const popValueB = Number.isFinite(popB)
        ? popB
        : orderBy === 'desc'
          ? -Infinity
          : Infinity;
      return orderBy === 'asc' ? popValueA - popValueB : popValueB - popValueA;
    };

    return [...list].sort(compare);
  }, [data, regionFilter, query, sortBy, orderBy, selectedYear]);

  const availableColumns = useMemo(() => {
    const visibleCols = new Set<string>();
    for (const [, meta] of Object.entries(data)) {
      for (const row of meta.data) {
        Object.keys(row).forEach((col) => visibleCols.add(col));
      }
    }
    REQUIRED_COLS.forEach((col) => visibleCols.delete(col));
    visibleCols.delete('country');
    return Array.from(visibleCols).sort();
  }, [data]);

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <div className={styles.toolbarRow}>
          <YearSelector
            handleYearChange={handleYearChange}
            selectedYear={selectedYear}
            isPending={isPending}
            years={years}
            className={styles.control}
          />

          <RegionSelector
            handleRegion={handleRegion}
            data={data}
            regionFilter={regionFilter}
            className={styles.control}
          />

          <CountrySearch
            handleQuery={handleQuery}
            query={query}
            className={`${styles.control} ${styles.grow}`}
          />

          <SortBy
            handleSortKey={handleSortKey}
            sortBy={sortBy}
            className={styles.control}
          />

          <OrderBy
            handleOrderBy={handleOrderBy}
            orderBy={orderBy}
            className={styles.control}
          />

          <Button onClick={openModal} small>
            + Columns
          </Button>
        </div>
      </header>

      <main className={styles.grid}>
        {countryEntries.map(([name, meta]) => (
          <CountryCard
            key={name}
            name={name}
            isoCode={meta.iso_code}
            rows={meta.data}
            selectedYear={selectedYear}
            extraColumns={selectedCols}
          />
        ))}
      </main>

      <ColumnSelectorModal
        open={modalOpen}
        onClose={closeModal}
        available={availableColumns}
        selected={selectedCols}
        onChange={onColumnsChange}
      />
    </div>
  );
}
