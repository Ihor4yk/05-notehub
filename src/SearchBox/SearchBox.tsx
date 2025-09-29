import type { DebouncedState } from "use-debounce";
import css from "./SearchBox.module.css"

interface SearchBoxProps {
  onSearch: DebouncedState<(val: string) => void>;
  value: string;
}

export default function SearchBox({ onSearch, value }: SearchBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      defaultValue={value}
      onChange={handleChange}
    />
  )
}