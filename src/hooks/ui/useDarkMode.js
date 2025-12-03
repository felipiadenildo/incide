import { useState, useEffect } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    // Verifica localStorage ou preferência do sistema
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Aplica classe no root
    document.documentElement.setAttribute("data-color-scheme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    console.log("🌙 Dark mode:", isDark);
  }, [isDark]);

  const toggle = () => setIsDark(!isDark);

  return { isDark, toggle };
}
