import { useState, useEffect } from "react";
import Banner from "./components/Banner";
import NavBar from "./components/NavBar";
import Bio from "./components/Bio";
import Projects from "./components/Projects";
import Blog from "./components/Blog";
import Wallet from "./components/Wallet";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

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
      <div className="bg-white m-auto font-mono dark:bg-black text-black dark:text-white pt-2 pb-2">
        <div className="block sticky top-0">
          <button
            className="absolute w-10 h-10 right-2 top-2 bg-black dark:bg-slate-300 rounded-full text-white dark:text-black"
            onClick={toggleDarkMode}
          >
            {darkMode === "dark" ? "☀️" : "🌙"}
          </button>
          <Banner />
          <NavBar />
        </div>
        <Bio />
        <Projects />
        <Blog />
        <Wallet />
        <Contact />
        <Footer />
      </div>
    </>
  );
}

export default App;
