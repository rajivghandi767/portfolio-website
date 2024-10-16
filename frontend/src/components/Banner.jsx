import { React, useState, useEffect } from "react";

const Banner = () => {
  // Dark Mode Toggle

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode("dark");
    } else {
      setDarkMode("");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(darkMode === "dark" ? "" : "dark");
  };

  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Toggle Icons

  const sun = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    </svg>
  );

  const moon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    </svg>
  );

  // Mobile Menu Icon

  const mobileMenu = (
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
  );

  return (
    <>
      <div className="flex bg-white text-center items-center mx-auto dark:bg-stone-950">
        <button
          className="md:absolute p-1 m-3 bg-black dark:bg-slate-300 rounded-lg text-white dark:text-black"
          onClick={toggleDarkMode}
        >
          {darkMode === "dark" ? sun : moon}
        </button>
        <div className="mx-auto">
          <h1 className="text-2xl">Rajiv Wallace 🇩🇲</h1>
          <h2 className="text-l">Software Engineer & Web Developer</h2>
        </div>
        <div className="text-l hover:transition md:hidden">{mobileMenu}</div>
      </div>
    </>
  );
};

export default Banner;
