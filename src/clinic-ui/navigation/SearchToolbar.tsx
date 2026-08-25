import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface SearchToolbarProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function SearchToolbar({
  value,
  placeholder = "Pesquisar...",
  onChange,
}: SearchToolbarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search
        className="absolute left-3 top-1/2 h-4 w-4
                   -translate-y-1/2 text-muted-foreground"
      />

      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}