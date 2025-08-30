import { useCallback, useMemo, useState, useTransition } from 'react';
import styles from './App.module.css';
import type { SortKey } from './utils/types';
import { useDataResource } from './hooks/useResourceData';
import { getAllYears } from './utils/utils';
import YearSelector from './components/search/YearSelector';
import RegionSelector from './components/search/RegionSelector';
import CountrySearch from './components/search/CountrySearch';
import SortBy from './components/search/SortBy';
import OrderBy from './components/search/OrderBy';

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
        </div>
      </header>
    </div>
  );
}
