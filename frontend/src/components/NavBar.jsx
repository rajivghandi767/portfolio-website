import React from "react";

const sections = ["Home", "Projects", "Blog", "Wallet", "Contact"];

const NavBar = () => {
  const navBarItems = sections.map((item) => (
    <li className="mx-6 my-5 text-slate-900 hover:text-slate-700 transition">
      {item}
    </li>
  ));

  return (
    <div>
      <div className="flex justify-center text-center">
        <text>
          <h1 className="text-5xl">Rajiv Wallace</h1>
          <h2 className="text-3xl">Software Engineer</h2>
        </text>
      </div>
      <div className="mt-4">
        <ul className="flex bg-stone-100 cursor-pointer justify-center text-2xl">
          {navBarItems}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
