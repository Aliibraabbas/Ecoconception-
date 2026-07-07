import { useState, useRef } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/hooks/useSearch.js";
import { SearchResults } from "./SearchResults.jsx";

export function GlobalSearch() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { data, isFetching } = useSearch(term);

  const handleSelect = (type, id, projectId) => {
    setOpen(false);
    setTerm("");
    if (type === "project") navigate(`/app/projects/${id}`);
    if (type === "task") navigate(`/app/projects/${projectId}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <label htmlFor="global-search" className="sr-only">
        Rechercher des projets et des tâches
      </label>
      <div className="flex items-center gap-2 rounded-lg border border-text-secondary/20 bg-background px-3 py-2">
        <Search className="h-4 w-4 text-text-secondary" aria-hidden="true" />
        <input
          id="global-search"
          type="search"
          placeholder="Rechercher…"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-secondary"
        />
      </div>
      {open && term.trim().length > 1 && (
        <SearchResults data={data} isLoading={isFetching} onSelect={handleSelect} onDismiss={() => setOpen(false)} />
      )}
    </div>
  );
}
