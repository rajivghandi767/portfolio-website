import "./App.css";
import NavBar from "./components/NavBar";
import Bio from "./components/Bio";
import Projects from "./components/Projects";
import Blog from "./components/Blog";
import Wallet from "./components/Wallet";
import Contact from "./components/Contact";

function App() {
  return (
    <>
      <div className="my-4">
        <NavBar />
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
