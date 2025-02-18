import { React, useState, useEffect } from "react";
import { BannerProps } from "../types/index.ts";
import { Sun, Moon, Menu, X } from "lucide-react";

const Banner = ({ isMenuOpen, toggleMenu }: BannerProps) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="bg-white dark:bg-stone-950 font-mono">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="w-14">
            <button
              className="p-2 rounded-lg bg-black dark:bg-slate-300 text-white dark:text-black 
                         hover:bg-gray-800 dark:hover:bg-slate-400 transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Center - Title and subtitle */}
          <div className="flex-1 text-center">
            <h1 className="text-2xl text-black dark:text-white">
              Rajiv Wallace 🇩🇲
            </h1>
            <h2 className="text-l text-black dark:text-white">
              Software Engineer & Web Developer
            </h2>
          </div>

          {/* Right side - Mobile menu button */}
          <div className="w-14 flex justify-end md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-black dark:text-white hover:text-gray-600 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
