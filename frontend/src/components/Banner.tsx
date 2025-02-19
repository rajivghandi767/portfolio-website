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
    <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 font-mono backdrop-blur-sm bg-opacity-80">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="w-14">
            <button
              className="p-2 rounded-lg bg-gradient-to-br from-gray-950 to-gray-900 dark:from-gray-100 dark:to-gray-200 
                         text-gray-50 dark:text-gray-900 
                         hover:from-gray-900 hover:to-gray-800 dark:hover:from-gray-200 dark:hover:to-gray-300 
                         transition-all duration-200
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

          <div className="flex-1 text-center">
            <h1 className="text-2xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 dark:from-gray-50 dark:via-gray-200 dark:to-gray-50">
                Rajiv Wallace
              </span>
              <span className="text-gray-950 dark:text-gray-50"> 🇩🇲</span>
            </h1>
            <h2 className="text-l text-gray-800 dark:text-gray-300">
              Software Engineer & Web Developer
            </h2>
          </div>

          <div className="w-14 flex justify-end md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-950 dark:text-gray-50 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
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
