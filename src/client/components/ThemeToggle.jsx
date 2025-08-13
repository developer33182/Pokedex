  import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="rounded-lg border border-slate-300 bg-white dark:bg-slate-800 px-3 py-2 text-sm shadow hover:bg-slate-50 dark:hover:bg-slate-700 transition"
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
