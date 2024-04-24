import "./App.css";
import { useRef } from "react";
import Banner from "./components/Banner";
import NavBar from "./components/NavBar";
import Bio from "./components/Bio";
import Projects from "./components/Projects";
import Blog from "./components/Blog";
import Wallet from "./components/Wallet";
import Contact from "./components/Contact";

function App() {
  return (
    <>
      <div className="block sticky top-0">
        <Banner />
        <NavBar />
      </div>
      <Bio />
      <Projects />
      <Blog />
      <Wallet />
      <Contact />
    </>
  );
}

export default App;
