import "./App.css";
import { useDarkMode } from "./hooks/useDarkMode.js";
import MainLayout from "./components/Layout/MainLayout.jsx";

function App() {
  // Dark mode já está em MainLayout via TopBar
  const { isDark } = useDarkMode();

  return (
    <div className="App-root" data-color-scheme={isDark ? "dark" : "light"}>
      <MainLayout />
    </div>
  );
}

export default App;
