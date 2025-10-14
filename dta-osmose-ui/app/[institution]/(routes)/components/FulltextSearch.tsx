// "use client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { SearchIcon } from "lucide-react";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";

// const FulltextSearch = () => {
//   const [search, setSearch] = useState("");
//   const router = useRouter();

//   const handleSearch = async () => {
//     router.push(`/fulltext-search?q=${search}`);
//     setSearch("");
//   };

//   return (
//     <div className="flex w-full max-w-sm items-center space-x-2">
//       <Input
//         type="text"
//         placeholder={"Rechercher ..."}
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />
//       <Button type="submit" className="gap-2" onClick={handleSearch}>
        
//         <SearchIcon />
//       </Button>
//     </div>
//   );
// };

// export default FulltextSearch;

/* 
// //Pour mettre en place le systeme de recherche globale on a:
// 1. Créer un système de recherche unifié: en creant un service de recherche dans le fihier @/lib/searchServices.ts
// 2. Indexer les modules et pages disponibles
// 3. Implémenter la navigation intelligente
// */
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@uidotdev/usehooks"
import { Plus } from "lucide-react";
import { Search, Command } from "lucide-react";
import { searchModules } from "@/lib/searchServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useParams } from 'next/navigation';
import { useEffect } from "react";
import { SearchIcon } from "lucide-react";

const FulltextSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const router = useRouter();
  const { institution } = useParams() as { institution: string };
  const userType =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const results = searchModules(debouncedQuery, institution, userType );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        
        Rechercher un module...
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <Search className="h-4 w-4 mr-2" />
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Rechercher un module, une page..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          
          {results.length > 0 && (
            <CommandGroup heading="Résultats de recherche">
              {results.map((module) => (
                <CommandItem
                  key={module.id}
                  value={module.title}
                  onSelect={() => runCommand(() => {
                    router.push(module.path);
                  })}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{module.icon}</span>
                    <div>
                      <p className="font-medium">{module.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandGroup heading="Actions rapides">
            <CommandItem
              onSelect={() => runCommand(() => router.push(`/${institution}/sales`))}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Vente
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push(`/${institution}/salepromise`))}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Promesse
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default FulltextSearch;
