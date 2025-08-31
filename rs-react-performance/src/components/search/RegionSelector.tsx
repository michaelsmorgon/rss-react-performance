import { useMemo } from 'react';
import { inferRegionsFromKeys } from '../../utils/utils';
import type { Dataset } from '../../utils/types';

type Props = {
  handleRegion: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  data: Dataset;
  regionFilter: string;
  className?: string;
};

export default function RegionSelector({
  handleRegion,
  data,
  regionFilter,
  className,
}: Props) {
  const regions = useMemo(() => inferRegionsFromKeys(data), [data]);
  return (
    <div className={className}>
      <label>Region</label>
      <select value={regionFilter} onChange={handleRegion}>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
}
