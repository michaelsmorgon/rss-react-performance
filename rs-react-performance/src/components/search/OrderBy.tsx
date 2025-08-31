type Props = {
  handleOrderBy: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  orderBy: string;
  className?: string;
};

export default function OrderBy({ handleOrderBy, orderBy, className }: Props) {
  return (
    <div className={className}>
      <label>Order By</label>
      <select value={orderBy} onChange={handleOrderBy}>
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
    </div>
  );
}
