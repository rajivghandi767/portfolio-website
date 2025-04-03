// src/components/layout/Header.tsx
import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Sun, Moon, Menu, X, Home as HomeIcon } from "lucide-react";
import { useThemeContext } from "../../context/ThemeContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useThemeContext();
  const location = useLocation();
  const currentPath = location.pathname;
  const isHomePage = currentPath === "/";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Define site sections with both paths and section refs
  const navigationItems = [
    { id: 1, label: "Bio", path: "/", sectionRef: "bio" },
    { id: 2, label: "Projects", path: "/projects", sectionRef: "projects" },
    { id: 3, label: "Blog", path: "/blog", sectionRef: "blog" },
    { id: 4, label: "Wallet", path: "/wallet", sectionRef: "wallet" },
    { id: 5, label: "Contact", path: "/contact", sectionRef: "contact-form" },
  ];

  // When on home page, show all navigation items
  // When not on home page, show Home link and hide Bio link
  const navItems = isHomePage
    ? navigationItems
    : [
        { id: 0, label: "Home", path: "/", sectionRef: null },
        ...navigationItems.filter((item) => item.label !== "Bio"),
      ];

  // Handle navigation based on current page
  const handleNavigation = (
    item: (typeof navigationItems)[0],
    event: React.MouseEvent
  ) => {
    // If on home page and the item has a section reference, use scroll behavior
    if (isHomePage && item.sectionRef) {
      event.preventDefault();
      scrollToSection(item.sectionRef);
    }

    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Scroll to section function (only used on home page)
  const scrollToSection = (ref: string): void => {
    const section = document.getElementById(ref);
    if (section) {
      // Get the header height
      const header = document.querySelector(".sticky");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;

      // Calculate the exact scroll position
      const sectionPosition = section.getBoundingClientRect().top;
      const offsetPosition =
        sectionPosition + window.pageYOffset - headerHeight;

      // Smooth scroll to the section
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="block sticky top-0 z-50">
      {/* Banner - now with solid background */}
      <div className="bg-header">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="w-14">
              <button
                className="btn btn-primary p-2 rounded-lg"
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
              <h1 className="text-2xl text-header">
                <span>Rajiv Wallace</span>
                <span> 🇩🇲</span>
              </h1>
              <h2 className="text-l text-header">
                Software Engineer & Web Developer
              </h2>
            </div>

            <div className="w-14 flex justify-end md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 text-header hover:text-primary transition-colors"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <nav className="bg-nav shadow-lg">
          <ul className="flex justify-center w-full">
            {navItems.map((item) => {
              const isActive =
                item.path === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(item.path);

              return (
                <li key={item.id} className="mx-4 my-4">
                  <Link
                    to={item.path}
                    onClick={(e) => handleNavigation(item, e)}
                    className={`text-xl text-nav hover:text-primary rounded px-3 py-1 transition-all duration-200 flex items-center gap-1 ${
                      isActive ? "text-nav-active" : ""
                    }`}
                  >
                    {item.label === "Home" && <HomeIcon size={18} />}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden bg-nav ${isMenuOpen ? "block" : "hidden"}`}>
        <nav>
          <ul className="flex flex-col items-center py-2">
            {navItems.map((item) => {
              const isActive =
                item.path === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(item.path);

              return (
                <li key={item.id} className="w-full my-2">
                  <Link
                    to={item.path}
                    onClick={(e) => handleNavigation(item, e)}
                    className={`flex items-center justify-center gap-1 mx-4 my-2 text-xl text-nav hover:text-primary rounded w-full py-2 text-center transition-all duration-200 ${
                      isActive ? "text-nav-active" : ""
                    }`}
                  >
                    {item.label === "Home" && <HomeIcon size={18} />}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
