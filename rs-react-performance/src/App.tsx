import { useCallback, useMemo, useState, useTransition } from 'react';
import styles from './App.module.css';
import type { AdditionalColumn, SortKey, YearInfo } from './utils/types';
import { useDataResource } from './hooks/useResourceData';
import { getAllYears } from './utils/utils';
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
