import React from "react";
import Pokedex from "./Pokemon/Pokedex";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  return (
    <main className="min-h-screen bg-white dark:bg-grey-600">
    
    <header className="bg-red-600 dark:bg-red-700 text-white dark:text-red-700">
  {/* <div className="flex items-center justify-between">
    <h1 className="font-bold">Pokédex</h1>
    <ThemeToggle />
  </div> */}
</header>

      <section className="max-w-6xl dark:bg-gray-600 mx-auto border border-color: red-700 px-4 py-6">
        <Pokedex />
      </section>
    </main>
  );
}


