import "./App.css";
import NavBar from "./components/NavBar";
import Bio from "./components/Bio";
import Projects from "./components/Projects";
import Blog from "./components/Blog";
import Wallet from "./components/Wallet";

function App() {
  return (
    <>
      <NavBar />
      <div>
        <Bio />
        <Projects />
        <Blog />
        <Wallet />
      </div>
    </>
  );
}

export default App;
