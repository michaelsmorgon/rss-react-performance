type Props = {
  handleYearChange: (year: number) => void;
  selectedYear: number;
  isPending: boolean;
  years: number[];
  className?: string;
};

export default function YearSelector({
  handleYearChange,
  selectedYear,
  isPending,
  years,
  className,
}: Props) {
  return (
    <div className={className}>
      <label>Year</label>
      <select
        value={selectedYear}
        onChange={(e) => handleYearChange(Number(e.target.value))}
        className={isPending ? 'pending' : ''}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
