import React, { useEffect, useState } from "react";

const typeColors = {
  normal: "bg-gray-400 dark:bg-gray-500",
  fire: "bg-orange-500 dark:bg-orange-700",
  water: "bg-blue-500 dark:bg-blue-700",
  electric: "bg-yellow-400 dark:bg-yellow-600",
  grass: "bg-green-500 dark:bg-green-700",
  ice: "bg-cyan-400 dark:bg-cyan-600",
  fighting: "bg-red-700 dark:bg-red-900",
  poison: "bg-purple-500 dark:bg-purple-700",
  ground: "bg-yellow-700 dark:bg-yellow-900",
  flying: "bg-indigo-400 dark:bg-indigo-600",
  psychic: "bg-pink-500 dark:bg-pink-700",
  bug: "bg-lime-500 dark:bg-lime-700",
  rock: "bg-yellow-800 dark:bg-yellow-900",
  ghost: "bg-indigo-700 dark:bg-indigo-900",
  dragon: "bg-purple-700 dark:bg-purple-900",
  dark: "bg-gray-700 dark:bg-gray-900",
  steel: "bg-gray-500 dark:bg-gray-700",
  fairy: "bg-pink-300 dark:bg-pink-500",
};

function Stat({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold capitalize text-slate-800 dark:text-slate-200">{label}</span>
      <div className="w-40 h-2 rounded-full overflow-hidden bg-slate-300 dark:bg-slate-700 border border-slate-400 dark:border-slate-500">
        <div
          className="h-2 bg-gradient-to-r from-yellow-400 to-red-500"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

export default function PokemonModal({ pokemon, onClose }) {
  const [species, setSpecies] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(pokemon.species.url);
        const data = await res.json();
        if (active) setSpecies(data);
      } catch {}
    })();
    return () => { active = false; };
  }, [pokemon]);

  const art =
    pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon?.sprites?.front_default;

  const flavor =
    species?.flavor_text_entries?.find(e => e.language.name === "en")
      ?.flavor_text?.replace(/\f/g, " ");

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="absolute left-1/2 top-1/2 w-[min(850px,95vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl border-[6px] border-red-600 bg-gradient-to-b from-red-500 to-red-700 dark:from-gray-800 dark:to-gray-900 text-white animate-scaleIn overflow-hidden">

        {/* Header */}
        <div className="relative bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 dark:from-yellow-600 dark:via-yellow-700 dark:to-yellow-800 px-6 py-4 font-extrabold text-3xl flex items-center justify-between shadow-md">
          <span className="capitalize drop-shadow-lg">{pokemon.name}</span>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 rounded-full px-4 py-1 shadow-md border border-white/30"
          >
            ✕
          </button>
        </div>

        {/* Top Accent Light */}
        <div className="absolute -top-4 left-6 w-10 h-10 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>

        {/* Content */}
        <div className="p-6 grid gap-6 sm:grid-cols-2 bg-white dark:bg-gray-800 text-black dark:text-gray-100">

          {/* Left Column: Art + Flavor */}
          <div className="flex flex-col items-center gap-4">
            {art ? (
              <img src={art} alt={pokemon.name} className="h-48 object-contain drop-shadow-lg" />
            ) : (
              <div className="h-48 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            )}
            <p className="text-center italic text-sm">{flavor || "No description available."}</p>
          </div>

          {/* Right Column: Info */}
          <div className="space-y-4">
            {/* Types */}
            <div>
              <h4 className="font-bold text-lg border-b border-gray-300 dark:border-gray-600 mb-2">Types</h4>
              <div className="flex flex-wrap gap-2">
                {pokemon.types.map(t => (
                  <span
                    key={t.type.name}
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize shadow ${typeColors[t.type.name]}`}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div>
              <h4 className="font-bold text-lg border-b border-gray-300 dark:border-gray-600 mb-2">Stats</h4>
              <div className="space-y-2">
                {pokemon.stats.map(s => (
                  <Stat key={s.stat.name} label={s.stat.name} value={s.base_stat} />
                ))}
              </div>
            </div>

            {/* Height & Weight */}
            <div>
              <h4 className="font-bold text-lg border-b border-gray-300 dark:border-gray-600 mb-2">Height & Weight</h4>
              <p className="text-sm">Height: {pokemon.height / 10} m<br />Weight: {pokemon.weight / 10} kg</p>
            </div>

            {/* Abilities */}
            <div>
              <h4 className="font-bold text-lg border-b border-gray-300 dark:border-gray-600 mb-2">Abilities</h4>
              <ul className="list-disc list-inside text-sm">
                {pokemon.abilities.map(a => (
                  <li key={a.ability.name} className="capitalize">
                    {a.ability.name}{a.is_hidden ? " (hidden)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer: Pokéball Accent */}
        <div className="w-full h-12 bg-gradient-to-r from-red-600 to-red-800 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-full border-2 border-black"></div>
        </div>
      </div>
    </div>
  );
}
