import React from "react";
import { useState } from "react";

const siteSections = [
  {
    section: "Home",
    ref: "homeRef",
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

const NavBar = ({ homeRef, projectsRef, blogRef, walletRef, contactRef }) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const navIconHandler = (e) => {
    e.preventDefault();
    setToggleMenu(!toggleMenu);
  };

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

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

      <div className="">
        <div>
          <ul className="flex bg-gray-200 cursor-pointer justify-center">
            {navBarItems}
          </ul>
        </div>
      </div>

      {/* View settings for small screens */}

      <div className="md:hidden block sticky top-0">
        <div className="flex justify-between w-100 bg-gray-200 cursor-pointer">
          <div>
            <div className="grid grid-cols-1 bg-gray-200 cursor-pointer">
              <div className="mx-2 my-4 text-gray-900 hover:text-gray-700 transition">
                <div>
                  <ul className="flex bg-gray-200 cursor-pointer justify-center text-center">
                    {navBarItems}
                    <svg
                      onClick={navIconHandler}
                      className="w-8 h-8 text-gray-900 my-4 mr-5"
                      x-show="!showMenu"
                      fill="none"
                      strokeLinecap="round"
                      strokelinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-5 my-5 text-2xl text-gray-950 hover:text-grey-500 transition"></div>
      </div>
    </>
  );
};

export default NavBar;
