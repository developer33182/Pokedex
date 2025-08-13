import React, { useEffect, useState } from "react";

export default function PokemonCard({ name, url, onOpen }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Failed to load Pokémon data", e);
      }
    };
    run();
  }, [url]);

  if (!data) {
    return (
      <div className="h-44 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 animate-pulse" />
    );
  }

  return (
    <div
      onClick={() => onOpen(data)}
      className="
        cursor-pointer 
        rounded-xl 
        shadow-lg 
        border 
        border-gray-200 dark:border-gray-700 
        bg-gradient-to-b from-white to-gray-100 
        dark:from-gray-800 dark:to-gray-900
        hover:shadow-xl 
        hover:-translate-y-1 
        transition-all 
        duration-300
        relative
        overflow-hidden
      "
    >
      {/* Glossy highlight */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 dark:bg-white/10 pointer-events-none z-10" />

      {/* Pokéball background */}
      <div
        className="absolute inset-0 flex justify-center items-center opacity-10 dark:opacity-5 z-0"
        style={{
          backgroundImage:
            "url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "80px",
        }}
      />

      {/* Pokémon Image */}
      <div className="relative flex justify-center items-center bg-gray-50 dark:bg-gray-800 p-4 z-20">
        <img
          src={
            data.sprites.other["official-artwork"].front_default ||
            data.sprites.front_default
          }
          alt={name}
          className="h-28 w-28 object-contain drop-shadow-md"
        />
      </div>

      {/* Name & Type */}
      <div className="p-3 text-center relative z-20">
        <h2 className="text-lg font-bold capitalize">{name}</h2>
        <div className="flex justify-center gap-2 mt-1">
          {data.types.map((t) => (
            <span
              key={t.type.name}
              className="
                px-2 py-0.5 text-xs rounded-full 
                text-white 
                shadow-sm
              "
              style={{
                backgroundColor: typeColors[t.type.name] || "#888",
              }}
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Pokémon type colors
const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};
