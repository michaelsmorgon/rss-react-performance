type Props = {
  handleQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
  query: string;
  className?: string;
};

export default function CountrySearch({
  handleQuery,
  query,
  className,
}: Props) {
  return (
    <div className={className}>
      <label>Search</label>
      <input
        type="search"
        placeholder="Type country/region name…"
        value={query}
        onChange={handleQuery}
      />
    </div>
  );
}
