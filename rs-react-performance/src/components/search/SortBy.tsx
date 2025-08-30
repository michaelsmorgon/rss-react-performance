type Props = {
  handleSortKey: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  sortBy: string;
  className?: string;
};

export default function SortBy({ handleSortKey, sortBy, className }: Props) {
  return (
    <div className={className}>
      <label>Sort by</label>
      <select value={sortBy} onChange={handleSortKey}>
        <option value="population">Population (selected year)</option>
        <option value="name">Name</option>
      </select>
    </div>
  );
}
