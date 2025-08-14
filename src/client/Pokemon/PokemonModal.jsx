import React, { useEffect, useState } from "react";

const typeColors = {
  normal: "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-500 dark:to-gray-600",
  fire: "bg-gradient-to-r from-orange-400 to-red-500 dark:from-orange-600 dark:to-red-700",
  water: "bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800",
  electric: "bg-gradient-to-r from-yellow-300 to-yellow-500 dark:from-yellow-500 dark:to-yellow-700",
  grass: "bg-gradient-to-r from-green-400 to-green-600 dark:from-green-600 dark:to-green-800",
  ice: "bg-gradient-to-r from-cyan-300 to-cyan-500 dark:from-cyan-500 dark:to-cyan-700",
  fighting: "bg-gradient-to-r from-red-600 to-red-800 dark:from-red-800 dark:to-red-900",
  poison: "bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-600 dark:to-purple-800",
  ground: "bg-gradient-to-r from-yellow-600 to-yellow-800 dark:from-yellow-800 dark:to-yellow-900",
  flying: "bg-gradient-to-r from-indigo-300 to-indigo-500 dark:from-indigo-500 dark:to-indigo-700",
  psychic: "bg-gradient-to-r from-pink-400 to-pink-600 dark:from-pink-600 dark:to-pink-800",
  bug: "bg-gradient-to-r from-lime-400 to-lime-600 dark:from-lime-600 dark:to-lime-800",
  rock: "bg-gradient-to-r from-yellow-700 to-yellow-900 dark:from-yellow-900 dark:to-yellow-950",
  ghost: "bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-700 dark:to-indigo-900",
  dragon: "bg-gradient-to-r from-purple-600 to-indigo-800 dark:from-purple-800 dark:to-indigo-950",
  dark: "bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-900 dark:to-black",
  steel: "bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-700",
  fairy: "bg-gradient-to-r from-pink-300 to-pink-500 dark:from-pink-500 dark:to-pink-700",
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
  const [evolution, setEvolution] = useState([]);

  // Fetch species
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

useEffect(() => {
  if (!species?.evolution_chain?.url) return;

  (async () => {
    const res = await fetch(species.evolution_chain.url);
    const data = await res.json();

    // Parse evolution names
    function parseChain(chain) {
      let evoList = [];
      let current = chain;
      while (current) {
        evoList.push(current.species.name);
        current = current.evolves_to[0];
      }
      return evoList;
    }

    const evoNames = parseChain(data.chain);
      // Fetch official-artwork for each Pokémon
      const evoData = await Promise.all(
        evoNames.map(async (name) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          const poke = await res.json();
          return {
            name: poke.name,
            img: poke.sprites.other['official-artwork'].front_default
          };
        })
      );

      setEvolution(evoData);
    })();
  }, [species]);

  const art =
    pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon?.sprites?.front_default;

  const flavor =
    species?.flavor_text_entries?.find(e => e.language.name === "en")
      ?.flavor_text?.replace(/\f/g, " ");

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className={`
          fixed inset-x-0 bottom-0 sm:left-1/2 sm:top-1/2 sm:bottom-auto
          sm:-translate-x-1/2 sm:-translate-y-1/2
          w-full sm:w-[min(900px,95vw)]
          max-h-[90vh] overflow-y-auto
          rounded-t-2xl sm:rounded-2xl
          shadow-2xl border-t-[6px] sm:border-[6px] border-black
          bg-gradient-to-b from-red-600 to-red-800
          text-white animate-slideUp sm:animate-scaleIn
        `}
      >
        {/* Top Bar */}
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

        {/* Pokéball Hinge */}
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full border-4 border-black z-10"></div>
          <div className="flex-1 h-2 bg-black"></div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full border-4 border-black z-10"></div>
        </div>

        {/* Screen */}
        <div className="bg-white dark:bg-gray-800 text-black dark:text-gray-100 p-4 sm:p-6 rounded-t-2xl mt-2">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            {/* Left: Artwork, Flavor, Evolution, Sprites */}
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              {art ? (
                <img src={art} alt={pokemon.name} className="h-36 sm:h-48 object-contain drop-shadow-lg" />
              ) : (
                <div className="h-36 w-36 sm:h-48 sm:w-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              )}
              <p className="text-center italic text-xs sm:text-sm">{flavor || "No description available."}</p>

              {/* Evolution Chain */}
              {evolution.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold text-base sm:text-lg border-b border-gray-300 dark:border-gray-600 mb-2 text-center">
                    Evolution Chain
                  </h4>
                  <div className="flex gap-4 flex-wrap justify-center items-center">
                    {evolution.map((evo, i) => (
                      <React.Fragment key={evo.name}>
                        <div className="flex flex-col items-center">
                          <img
                            src={evo.img}
                            alt={evo.name}
                            className="w-20 h-20 object-contain"
                          />
                          <span className="capitalize text-xs sm:text-sm mt-1">{evo.name}</span>
                        </div>
                        {i < evolution.length - 1 && (
                          <span className="text-lg">➡</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* Sprite Gallery */}
              <div className="mt-3">
                <h4 className="font-bold text-sm border-b border-gray-300 dark:border-gray-600 mb-1">Sprites</h4>
                <div className="flex gap-2 flex-wrap justify-center">
                  {Object.entries(pokemon.sprites)
                    .filter(([_, value]) => typeof value === "string" && value)
                    .map(([key, value]) => (
                      <img key={key} src={value} alt={key} className="w-10 h-10" />
                    ))}
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div className="space-y-3 sm:space-y-4">
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

              {/* Pokédex Info */}
              <div>
                <h4 className="font-bold text-base sm:text-lg border-b border-gray-300 dark:border-gray-600 mb-2">Pokédex Info</h4>
                <p className="text-xs sm:text-sm">
                  Base XP: {pokemon.base_experience}<br />
                  Capture Rate: {species?.capture_rate}<br />
                  Habitat: {species?.habitat?.name || "Unknown"}<br />
                  Generation: {species?.generation?.name}<br />
                  Shape: {species?.shape?.name}<br />
                  Color: {species?.color?.name}
                </p>
              </div>

              {/* Moves */}
              <div>
                <h4 className="font-bold text-base sm:text-lg border-b border-gray-300 dark:border-gray-600 mb-2">Moves</h4>
                <ul className="list-disc list-inside text-xs sm:text-sm max-h-32 overflow-y-auto">
                  {pokemon.moves.slice(0, 10).map(m => (
                    <li key={m.move.name} className="capitalize">{m.move.name}</li>
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
