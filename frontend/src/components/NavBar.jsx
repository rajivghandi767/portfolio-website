import React from "react";
import { useRef } from "react";

const siteSections = [
  {
    section: "Bio",
    ref: "bioRef",
  },
  {
    section: "Projects",
    ref: "projectsRef",
  },
  {
    section: "Blog",
    ref: "blogRef",
  },
  {
    section: "Wallet",
    ref: "walletRef",
  },
  {
    section: "Contact",
    ref: "contactRef",
  },
];

const NavBar = () => {
  // Jump to Section Logic

  const navBarItems = siteSections.map((siteSection) => (
    <li
      onClick={() => scrollToSection(siteSection.ref)}
      className="mx-4 my-4 text-xl text-white hover:bg-gray-700 rounded"
    >
      {siteSection.section}
    </li>
  ));

  return (
    <>
      {/* View settings for md+ screens contained here*/}
      {/* View settings for mobile screens contained in Banner Component*/}

      <div className="hidden md:block mb-2 w-screen mx-auto">
        <ul className="flex bg-stone-950 cursor-pointer justify-center dark:border-b-2 dark:border-t-2">
          {navBarItems}
        </ul>
      </div>
    </>
  );
};

export default NavBar;
