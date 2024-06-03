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
  return (
    <>
      <div className="bg-white m-auto font-mono scroll-smooth text-black dark:bg-stone-950 dark:text-white pt-2 pb-2">
        <div className="block sticky top-0">
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
