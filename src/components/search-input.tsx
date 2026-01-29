import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search } from "lucide-react";

interface SearchInputProps {
  onSearchChange?: (value: string) => void; // Prop type for handling search value changes
}

export default function SearchInput({ onSearchChange }: SearchInputProps) {
  const [value, setValue] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onSearchChange) {
      onSearchChange(newValue); // Send value to parent component
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative w-full">
        <Input
          className="peer w-full pl-9 pr-9"
          placeholder="Search for anything..."
          type="search"
          value={value}
          onChange={handleInputChange}
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <Search
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            role="presentation"
          />
        </div>
        <button
          className="absolute inset-y-px right-px flex h-full w-9 items-center justify-center rounded-r-lg text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          type="submit"
        >
          <ArrowRight
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            role="presentation"
          />
        </button>
      </div>
    </div>
  );
}
