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
      <span className="text-xs sm:text-sm font-bold capitalize text-slate-800 dark:text-slate-200">{label}</span>
      <div className="w-32 sm:w-40 h-2 rounded-full overflow-hidden bg-slate-300 dark:bg-slate-700 border border-slate-400 dark:border-slate-500">
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
      <div
        className={`
          fixed inset-x-0 bottom-0 sm:left-1/2 sm:top-1/2 sm:bottom-auto
          sm:-translate-x-1/2 sm:-translate-y-1/2
          w-full sm:w-[min(850px,95vw)]
          max-h-[90vh] overflow-y-auto
          rounded-t-2xl sm:rounded-2xl
          shadow-2xl border-t-[6px] sm:border-[6px] border-black
          bg-gradient-to-b from-red-600 to-red-800
          text-white animate-slideUp sm:animate-scaleIn
        `}
      >
        {/* Top Control Bar */}
        <div className="relative px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full border border-white"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full border border-white"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border border-white"></div>
          </div>
          <button
            onClick={onClose}
            className="bg-red-700 hover:bg-red-800 text-white rounded-full px-3 sm:px-4 py-1 shadow-md border border-white/30"
          >
            ✕
          </button>
        </div>

        {/* Pokéball hinge */}
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full border-4 border-black z-10"></div>
          <div className="flex-1 h-2 bg-black"></div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full border-4 border-black z-10"></div>
        </div>

        {/* Screen (white section) */}
        <div className="bg-white dark:bg-gray-800 text-black dark:text-gray-100 p-4 sm:p-6 rounded-t-2xl mt-2">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            {/* Left: Art & Flavor */}
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              {art ? (
                <img src={art} alt={pokemon.name} className="h-36 sm:h-48 object-contain drop-shadow-lg" />
              ) : (
                <div className="h-36 w-36 sm:h-48 sm:w-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              )}
              <p className="text-center italic text-xs sm:text-sm">{flavor || "No description available."}</p>
            </div>

            {/* Right: Info */}
            <div className="space-y-3 sm:space-y-4">
              {/* Name */}
              <h2 className="text-lg sm:text-2xl font-bold capitalize">{pokemon.name}</h2>

              {/* Types */}
              <div>
                <h4 className="font-bold text-base sm:text-lg border-b border-gray-300 dark:border-gray-600 mb-2">Types</h4>
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
                <h4 className="font-bold text-base sm:text-lg border-b border-gray-300 dark:border-gray-600 mb-2">Stats</h4>
                <div className="space-y-2">
                  {pokemon.stats.map(s => (
                    <Stat key={s.stat.name} label={s.stat.name} value={s.base_stat} />
                  ))}
                </div>
              </div>

              {/* Height & Weight */}
              <div>
                <h4 className="font-bold text-base sm:text-lg border-b border-gray-300 dark:border-gray-600 mb-2">Height & Weight</h4>
                <p className="text-xs sm:text-sm">
                  Height: {pokemon.height / 10} m<br />Weight: {pokemon.weight / 10} kg
                </p>
              </div>

              {/* Abilities */}
              <div>
                <h4 className="font-bold text-base sm:text-lg border-b border-gray-300 dark:border-gray-600 mb-2">Abilities</h4>
                <ul className="list-disc list-inside text-xs sm:text-sm">
                  {pokemon.abilities.map(a => (
                    <li key={a.ability.name} className="capitalize">
                      {a.ability.name}{a.is_hidden ? " (hidden)" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
