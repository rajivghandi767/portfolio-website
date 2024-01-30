import React from "react";

const sections = ["Home", "Projects", "Blog", "Wallet", "Contact"];

const NavBar = () => {
  const navBarItems = sections.map((item) => (
    <li className="mx-5 my-5 text-2xl text-gray-950 hover:text-grey-500 transition">
      {item}
    </li>
  ));

  return (
    <>
      <div id="home" className="md:block sticky top-0">
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
    </>
  );
};

export default NavBar;
