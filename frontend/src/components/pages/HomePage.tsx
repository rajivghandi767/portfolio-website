// src/components/pages/HomePage.tsx
import React from "react";
import Bio from "../sections/Bio";
import Projects from "../sections/Projects";
import Blog from "../sections/Blog";
import Wallet from "../sections/Wallet";
import Contact from "../sections/Contact";

const HomePage = () => {
  return (
    <>
      <Bio />
      <Projects limit={3} />
      <Blog limit={3} />
      <Wallet limit={4} />
      <Contact />
    </>
  );
};

export default HomePage;
