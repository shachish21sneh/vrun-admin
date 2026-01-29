"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DataTableSearchProps {
  searchKey: string;
  searchQuery: string;
}

export function DataTableSearch({
  searchKey,
  searchQuery,
}: DataTableSearchProps) {
  return (
    <Input
      placeholder={`Search ${searchKey}...`}
      value={searchQuery ?? ""}
      className={cn("w-full md:max-w-sm")}
    />
  );
}
