import React, { useEffect, useMemo, useState } from "react";
import PokemonCard from "./PokemonCard";
import PokemonModal from "./PokemonModal";

const PAGE_SIZE = 24;
const TYPE_OPTIONS = [
  "all","normal","fire","water","electric","grass","ice","fighting","poison",
  "ground","flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy"
];

export default function Pokedex() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [allPokemon, setAllPokemon] = useState([]);
  const [typeFilteredNames, setTypeFilteredNames] = useState(null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typeLoading, setTypeLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Apply theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Load Pokémon list
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
        const data = await res.json();
        setAllPokemon(data.results || []);
      } catch (e) {
        setError("Failed to load Pokémon list.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // Filter by type
  useEffect(() => {
    const run = async () => {
      if (type === "all") {
        setTypeFilteredNames(null);
        setPage(1);
        return;
      }
      try {
        setTypeLoading(true);
        const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        const data = await res.json();
        const names = new Set((data.pokemon || []).map(p => p.pokemon.name));
        setTypeFilteredNames(names);
        setPage(1);
      } catch (e) {
        setError("Failed to filter by type.");
      } finally {
        setTypeLoading(false);
      }
    };
    run();
  }, [type]);

  // Apply search & type filter
  const filtered = useMemo(() => {
    const base = typeFilteredNames
      ? allPokemon.filter(p => typeFilteredNames.has(p.name))
      : allPokemon;
    const q = search.trim().toLowerCase();
    return q ? base.filter(p => p.name.includes(q)) : base;
  }, [allPokemon, typeFilteredNames, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-display">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between p-4 bg-red-500 dark:bg-red-700 shadow-md gap-3">
        <h1 className="text-2xl font-bold">Pokédex</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-full bg-yellow-400 text-black dark:bg-yellow-300 hover:scale-105 transition"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      {/* Controls */}
      <div className="space-y-6 p-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <input
            type="text"
            placeholder="Search Pokémon…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full md:max-w-md rounded-full border border-gray-300 bg-white dark:bg-gray-800 px-4 py-2.5 outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
          />

          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-red-500"
            >
              {TYPE_OPTIONS.map(t => (
                <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="ml-auto flex items-center gap-2 text-sm">
            <span>{filtered.length.toLocaleString()} found</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {(loading || typeLoading) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 animate-pulse">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="h-44 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700" />
            ))}
          </div>
        )}

        {/* Pokémon Grid */}
        {!loading && !typeLoading && (
          <>
            {pageItems.length === 0 ? (
              <div className="text-center py-10 opacity-70">No Pokémon match your filters.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {pageItems.map(p => (
                  <PokemonCard
                    key={p.name}
                    name={p.name}
                    url={p.url}
                    onOpen={setSelected}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm">
                  Page <b>{page}</b> / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {selected && (
          <PokemonModal pokemon={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}
