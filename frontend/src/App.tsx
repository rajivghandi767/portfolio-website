import { React, useState } from "react";
import Banner from "./components/Banner";
import NavBar from "./components/NavBar";
import Bio from "./components/Bio";
import Projects from "./components/Projects";
import Blog from "./components/Blog";
import Wallet from "./components/Wallet";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white m-auto font-mono scroll-smooth text-black dark:bg-stone-950 dark:text-white pt-2 pb-2">
      <div className="block sticky top-0 z-50">
        <Banner isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <NavBar isMenuOpen={isMenuOpen} />
      </div>
      <Bio />
      <Projects />
      <Blog />
      <Wallet />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
