import { memo, useMemo } from 'react';
import type { AdditionalColumn, YearInfo } from '../../utils/types';
import { formatNumber } from '../../utils/utils';
import styles from './DataTable.module.css';

type Props = {
  rows: YearInfo[];
  extraColumns: AdditionalColumn[];
};

const REQUIRED: (keyof YearInfo)[] = [
  'year',
  'population',
  'co2',
  'co2_per_capita',
];

export const DataTable = memo(function DataTable({
  rows,
  extraColumns,
}: Props) {
  const columns = useMemo(() => {
    const extras = extraColumns.map((col) => col as keyof YearInfo);
    return [...REQUIRED, ...extras];
  }, [extraColumns]);

  return (
    <table className={styles.dataTable}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((yearData) => (
          <tr key={yearData.year}>
            {columns.map((col) => {
              const val = yearData[col];
              let display: string = 'N/A';
              if (val != null) {
                if (typeof val === 'number') {
                  if (col === 'year') display = String(val);
                  else if (col.toString().includes('per_capita'))
                    display = val.toFixed(6);
                  else display = formatNumber(val);
                } else {
                  display = String(val);
                }
              }
              return <td key={col}>{display}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
});
