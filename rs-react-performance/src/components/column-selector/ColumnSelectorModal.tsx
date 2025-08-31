import { memo, useCallback, useMemo } from 'react';
import type { AdditionalColumn } from '../../utils/types';
import styles from './ColumnSelectorModal.module.css';
import Button from '../button/Button';

type Props = {
  open: boolean;
  onClose: () => void;
  available: string[];
  selected: AdditionalColumn[];
  onChange: (cols: AdditionalColumn[]) => void;
};

export const ColumnSelectorModal = memo(function ColumnSelectorModal({
  open,
  onClose,
  available,
  selected,
  onChange,
}: Props) {
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const toggle = useCallback(
    (col: string) => {
      const next = new Set(selectedSet);
      if (next.has(col)) {
        next.delete(col);
      } else {
        next.add(col);
      }
      onChange(Array.from(next) as AdditionalColumn[]);
    },
    [selectedSet, onChange]
  );

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <h4>Select additional columns</h4>
        </header>
        <div className={styles.modalBody}>
          <div className={styles.columnsGrid}>
            {available.map((col) => (
              <label key={col} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={selectedSet.has(col)}
                  onChange={() => toggle(col)}
                />
                <span>{col}</span>
              </label>
            ))}
          </div>
        </div>
        <footer className={styles.modalFooter}>
          <Button onClick={onClose}>Done</Button>
        </footer>
      </div>
    </div>
  );
});
