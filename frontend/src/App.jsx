import "./App.css";
import { useState, useEffect } from "react";
import Banner from "./components/Banner";
import NavBar from "./components/NavBar";
import Bio from "./components/Bio";
import Projects from "./components/Projects";
import Blog from "./components/Blog";
import Wallet from "./components/Wallet";
import Contact from "./components/Contact";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(darkMode === "dark" ? "" : "dark");
  };

  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
      <div className="bg-slate-50 m-auto dark:bg-black text-black dark:text-white">
        <div className="block sticky top-0">
          <button
            className="absolute w-10 h-10 right-2 top-2 bg-slate-950 dark:bg-slate-50 rounded-full text-white dark:text-black"
            onClick={toggleDarkMode}
          >
            {darkMode === "dark" ? "*" : "🌙"}
          </button>
          <Banner />
          <NavBar />
        </div>
        <Bio />
        <Projects />
        <Blog />
        <Wallet />
        <Contact />
      </div>
    </>
  );
}

export default App;
