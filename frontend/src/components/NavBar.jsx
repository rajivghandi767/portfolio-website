import React from "react";
import { useState } from "react";

const sections = ["Home", "Projects", "Blog", "Wallet", "Contact"];

const NavBar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const navIconHandler = (e) => {
    e.preventDefault();
    setToggleMenu(!toggleMenu);
  };

  const navBarItems = sections.map((item) => (
    <li className="mx-5 my-5 text-2xl text-gray-950 hover:text-grey-500 transition">
      {item}
    </li>
  ));

  return (
    <>
      <div className="hidden md:block sticky top-0">
        <div className="flex justify-center text-center bg-gray-50">
          <text>
            <h1 className="text-5xl">Rajiv Wallace</h1>
            <h2 className="text-3xl">Software Engineer</h2>
          </text>
        </div>
        <div>
          <ul className="flex bg-gray-200 cursor-pointer justify-center">
            {navBarItems}
          </ul>
        </div>
      </div>
      <div className="md:hidden block">
        <div className="flex justify-center text-center bg-gray-50">
          <text>
            <h1 className="text-5xl">Rajiv Wallace</h1>
            <h2 className="text-3xl">Software Engineer</h2>
          </text>
        </div>
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
