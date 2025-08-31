import { memo, useMemo, useState } from 'react';
import type { AdditionalColumn, YearInfo } from '../../utils/types';
import { DataTable } from '../data-table/DataTable';
import { formatNumber, latestWithField } from '../../utils/utils';
import styles from './CountryCard.module.css';

type Props = {
  name: string;
  isoCode?: string;
  rows: YearInfo[];
  selectedYear: number;
  extraColumns: AdditionalColumn[];
};

export const CountryCard = memo(function CountryCard({
  name,
  isoCode,
  rows,
  selectedYear,
  extraColumns,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const selectedRow = useMemo(
    () => rows.find((yearData) => yearData.year === selectedYear),
    [rows, selectedYear]
  );

  const latestPop = useMemo(
    () => latestWithField(rows, 'population')?.population ?? null,
    [rows]
  );

  return (
    <section
      className={styles.card}
      data-updated
      onClick={() => setExpanded((val) => !val)}
    >
      <header className={styles.cardHeader}>
        <div className={styles.title}>
          <h3 className={styles.name}>{name}</h3>
          {isoCode && <span className={styles.badge}>{isoCode}</span>}
        </div>
        <div className={styles.meta}>
          <div>
            <strong>Year:</strong>{' '}
            <span className={styles.highlight}>{selectedYear}</span>
          </div>
          <div>
            <strong>Population:</strong>{' '}
            {selectedRow?.population != null
              ? formatNumber(selectedRow.population)
              : latestPop != null
                ? `${formatNumber(latestPop)} (latest)`
                : 'N/A'}
          </div>
        </div>
      </header>

      {expanded && (
        <div className={styles.tableWrap}>
          <DataTable rows={rows} extraColumns={extraColumns} />
        </div>
      )}
    </section>
  );
});
