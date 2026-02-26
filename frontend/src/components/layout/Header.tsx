import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Sun, Moon, Menu, X, Home as HomeIcon } from "lucide-react";
import { useThemeContext } from "../../context/ThemeContext";
import { ProjectSwitcher } from "./ProjectSwitcher";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import { NavigationItem, Info } from "../../types";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button
      className="btn btn-primary p-2 rounded-lg"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};

// Removed the w-14 wrapper here so the button flexes cleanly in the new absolute container
const MobileMenuToggle = ({
  isMenuOpen,
  toggleMenu,
}: {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}) => (
  <button
    onClick={toggleMenu}
    className="p-2 text-header hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
  >
    {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
  </button>
);

const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 1, label: "Bio", path: "/", sectionRef: "bio" },
  { id: 2, label: "Projects", path: "/projects", sectionRef: "projects" },
  { id: 3, label: "Blog", path: "/blog", sectionRef: "blog" },
  { id: 4, label: "Wallet", path: "/wallet", sectionRef: "wallet" },
  { id: 5, label: "Contact", path: "/contact", sectionRef: "contact-form" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const isHomePage = currentPath === "/";

  const { data: info } = useApi<Info[]>(() => apiService.info.get());
  const infoData = info?.[0];

  const navItems: NavigationItem[] = isHomePage
    ? NAVIGATION_ITEMS
    : [
        { id: 0, label: "Home", path: "/", sectionRef: null },
        ...NAVIGATION_ITEMS.filter((item) => item.label !== "Bio").map(
          (item) => ({ ...item }),
        ),
      ];

  const handleNavigation = (item: NavigationItem, event: React.MouseEvent) => {
    if (isHomePage && item.sectionRef) {
      event.preventDefault();
      scrollToSection(item.sectionRef);
    }
    setIsMenuOpen(false);
  };

  const scrollToSection = (ref: string): void => {
    const section = document.getElementById(ref);
    if (section) {
      const header = document.querySelector(".sticky");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const sectionPosition = section.getBoundingClientRect().top;
      const offsetPosition =
        sectionPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const renderNavLinks = (items: NavigationItem[], isMobile = false) => (
    <ul
      className={
        isMobile
          ? "flex flex-col items-center py-2"
          : "flex justify-center w-full"
      }
    >
      {items.map((item) => {
        const isActive =
          item.path === "/"
            ? currentPath === "/"
            : currentPath.startsWith(item.path);

        return (
          <li key={item.id} className={isMobile ? "w-full my-2" : "mx-4 my-4"}>
            <Link
              to={item.path}
              onClick={(e) => handleNavigation(item, e)}
              className={`
                ${
                  isMobile
                    ? "flex items-center justify-center gap-1 mx-4 my-2 text-xl text-nav hover:text-neutral-500 dark:hover:text-neutral-400 rounded w-full py-2 text-center"
                    : "text-xl text-nav hover:text-neutral-500 dark:hover:text-neutral-400 rounded px-3 py-1 flex items-center gap-1"
                }
                transition-all duration-200 
                ${isActive ? "text-nav-active" : ""}
              `}
            >
              {item.label === "Home" && <HomeIcon size={18} />}
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="block sticky top-0 z-50">
      {/* 1. Solid Background: Removed /90 opacity and backdrop-blur-sm */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between min-h-[72px]">
          {/* LEFT ZONE: Project Switcher & Mobile Theme Toggle */}
          <div className="flex items-center justify-start w-24 gap-1">
            <ProjectSwitcher align="left" />
            {/* 2. Shows Theme Toggle here ONLY on mobile */}
            <div className="md:hidden flex items-center">
              <ThemeToggleButton />
            </div>
          </div>

          {/* CENTER ZONE: Symmetrical Title */}
          <div className="text-center flex-1 px-2">
            <h1 className="text-lg md:text-2xl font-bold leading-tight text-black dark:text-white">
              {infoData?.site_header}
            </h1>
            <h2 className="text-xs md:text-base leading-tight text-neutral-600 dark:text-neutral-400 mt-0.5">
              {infoData?.professional_title}
            </h2>
          </div>

          {/* RIGHT ZONE: Desktop Theme Toggle & Mobile Menu */}
          <div className="flex items-center justify-end w-24 gap-1">
            {/* 3. Shows Theme Toggle here ONLY on desktop */}
            <div className="hidden md:block">
              <ThemeToggleButton />
            </div>
            {/* Hamburger Menu (Mobile Only) */}
            <div className="md:hidden flex items-center">
              <MobileMenuToggle
                isMenuOpen={isMenuOpen}
                toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Bar */}
      <div className="hidden md:block">
        <nav className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm">
          {renderNavLinks(navItems)}
        </nav>
      </div>

      {/* Mobile Navigation Bar */}
      <div
        className={`md:hidden bg-gray-50 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 ${isMenuOpen ? "block" : "hidden"}`}
      >
        <nav>{renderNavLinks(navItems, true)}</nav>
      </div>
    </div>
  );
};

export default Header;
