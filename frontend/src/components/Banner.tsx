import { React } from "react";
import { BannerProps } from "../types/index.ts";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const Banner = ({ isMenuOpen, toggleMenu }: BannerProps) => {
  // Use the theme context instead of local state
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-black dark:via-black dark:to-black font-mono backdrop-blur-sm bg-opacity-80">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="w-14">
            <button
              className="p-2 rounded-lg bg-gradient-to-br from-black to-gray-900 dark:from-gray-100 dark:to-gray-200 
                         text-gray-50 dark:text-black 
                         hover:from-gray-900 hover:to-gray-800 dark:hover:from-gray-200 dark:hover:to-gray-300 
                         transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex-1 text-center">
            <h1 className="text-2xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-black to-gray-900 dark:from-gray-50 dark:via-gray-200 dark:to-gray-50">
                Rajiv Wallace
              </span>
              <span className="text-black dark:text-gray-50"> 🇩🇲</span>
            </h1>
            <h2 className="text-l text-black dark:text-gray-300">
              Software Engineer & Web Developer
            </h2>
          </div>

          <div className="w-14 flex justify-end md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-black dark:text-gray-50 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
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
