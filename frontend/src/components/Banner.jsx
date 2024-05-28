import React from "react";

const Banner = () => {
  return (
    <>
      <div className="flex md:block bg-white text-center justify-center items-center mx-auto dark:bg-black">
        <button
          className="w-8 h-8 m-3 bg-black dark:bg-slate-300 rounded-full text-white dark:text-black"
          // onClick={toggleDarkMode}
        >
          {/* {darkMode === "dark" ? "☀️" : "🌙"} */}
        </button>
        <text>
          <h1 className="text-2xl">Rajiv Wallace</h1>
          <h2 classnam>Software Engineer & Web Developer</h2>
        </text>
        <div className="text-l hover:transition md:hidden">
          <svg
            className="w-9 h-8 m-3"
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
