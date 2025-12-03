import "./App.css";
import { useDarkMode } from "./hooks/ui/useDarkMode.js";
import MainLayout from "./components/Layout/MainLayout.jsx";

function App() {
  const { isDark, toggleTheme } = useDarkMode?.() || { isDark: false, toggleTheme: () => {} };

  return (
    <div className={isDark ? "theme-dark" : "theme-light"}>
      <MainLayout />
    </div>
  );
}

export default App;
