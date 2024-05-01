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
  const navBarItems = siteSections.map((siteSection) => (
    <li
      onClick={() => scrollToSection(siteSection.ref)}
      className="mx-5 my-5 text-2xl text-gray-950 hover:text-grey-500 transition"
    >
      {siteSection.section}
    </li>
  ));

  return (
    <>
      {/* View settings for large screens */}

      <div className="mb-4">
        <div>
          <ul className="flex bg-gray-200 cursor-pointer justify-center">
            {navBarItems}
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavBar;
