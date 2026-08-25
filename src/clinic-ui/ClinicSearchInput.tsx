"use client";

import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ClinicSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ClinicSearchInput({
  value,
  onChange,
  placeholder = "Pesquisar...",
}: ClinicSearchInputProps) {
  return (
    <div className="relative">

      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        value={value}
        placeholder={placeholder}
        className="pl-10 pr-10"
        onChange={(e) =>
          onChange(e.target.value)
        }
      />

      {value && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

    </div>
  );
}