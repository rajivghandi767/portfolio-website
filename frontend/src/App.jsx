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
  const homeRef = useRef(null);
  const projectsRef = useRef(null);
  const blogRef = useRef(null);
  const walletRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <>
      <div className="h-screen my-4">
        <div className="block sticky top-0">
          <Banner />
          <NavBar
            homeRef={homeRef}
            projectsRef={projectsRef}
            blogRef={blogRef}
            walletRef={walletRef}
            contactRef={contactRef}
          />
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
