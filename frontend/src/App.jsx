import "./App.css";
import { useRef } from "react";
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
      <div className="my-4">
        <NavBar
          homeRef={homeRef}
          projectsRef={projectsRef}
          blogRef={blogRef}
          walletRef={walletRef}
          contactRef={contactRef}
        />
        <div>
          <Bio />
          <Projects />
          <Blog />
          <Wallet />
          <Contact />
        </div>
      </div>
    </>
  );
}

export default App;
