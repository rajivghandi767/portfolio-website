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
      {/* View settings for large screens */}

      <div className="mb-2 w-screen mx-auto">
        <div>
          <ul className="flex bg-black cursor-pointer justify-center dark:border-b-2 dark:border-t-2">
            {navBarItems}
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavBar;
