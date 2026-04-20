"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { searchAyahs, SearchResult } from "@/app/actions/searchAyahs";
import { useDebounce } from "@/hooks/use-debounce";

export function SearchDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  React.useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.trim().length < 3) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await searchAyahs(debouncedQuery);
        setResults(res);
      } catch (error) {
        console.error("Error searching ayahs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const onSelect = (result: SearchResult) => {
    setOpen(false);
    // Add scrollTo and q params to the URL for virtual list scrolling and text highlighting
    router.push(`/${result.surahNumber}?scrollTo=${result.globalIndex}&q=${encodeURIComponent(query)}`);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search Ayahs" description="Search translations in English and Bangla">
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Type to search ayahs..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            {loading ? "Searching..." : "No results found."}
          </CommandEmpty>

          {results.length > 0 && (
            <CommandGroup heading="Results">
              {results.map((result) => (
                <CommandItem
                  key={`${result.source}-${result.globalIndex}`}
                  onSelect={() => onSelect(result)}
                  className="flex flex-col items-start gap-1 py-3 px-4"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-semibold text-primary">
                      Surah {result.surahNumber}, Ayah {result.ayahNumber}
                    </span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {result.source}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2 text-muted-foreground w-full text-left">
                    {result.text}
                  </p>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
