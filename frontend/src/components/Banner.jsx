import React from "react";

const Banner = () => {
  return (
    <>
      <div className="bg-white text-center mx-auto dark:bg-black">
        <text>
          <h1 className="text-2xl">Rajiv Wallace</h1>
          <h2 classnam>Software Engineer & Web Developer</h2>
        </text>
        <div className="mx-3 my-4 text-l hover:transition md:hidden">
          <svg
            className="w-9 h-8"
            x-show="!showMenu"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16M4"></path>
          </svg>
        </div>
      </div>
    </>
  );
};

export default Banner;
