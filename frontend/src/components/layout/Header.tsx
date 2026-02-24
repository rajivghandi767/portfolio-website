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
    className="p-2 text-header hover:text-primary transition-colors"
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
                    ? "flex items-center justify-center gap-1 mx-4 my-2 text-xl text-nav hover:text-primary rounded w-full py-2 text-center"
                    : "text-xl text-nav hover:text-primary rounded px-3 py-1 flex items-center gap-1"
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
      <div className="bg-header">
        {/* Relative positioning allows us to absolutely pin left/right items without disturbing the center */}
        <div className="container mx-auto px-4 py-3 relative flex items-center justify-center min-h-[72px]">
          {/* MOBILE ONLY: Switchers on the Left */}
          <div className="absolute left-4 flex md:hidden items-center gap-2">
            <ProjectSwitcher align="left" />
            <ThemeToggleButton />
          </div>

          {/* CENTER: Title & Subtitle */}
          <div className="text-center z-10 w-full max-w-[50%] md:max-w-[60%]">
            <h1 className="text-xl md:text-2xl text-header font-bold truncate">
              <span>{infoData?.site_header}</span>
            </h1>
            <h2 className="text-sm md:text-base text-header truncate">
              {infoData?.professional_title}
            </h2>
          </div>

          {/* RIGHT: Switchers (Desktop) OR Hamburger Menu (Mobile) */}
          <div className="absolute right-4 flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <ProjectSwitcher align="right" />
              <ThemeToggleButton />
            </div>
            <div className="md:hidden">
              <MobileMenuToggle
                isMenuOpen={isMenuOpen}
                toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <nav className="bg-nav shadow-lg">{renderNavLinks(navItems)}</nav>
      </div>

      <div className={`md:hidden bg-nav ${isMenuOpen ? "block" : "hidden"}`}>
        <nav>{renderNavLinks(navItems, true)}</nav>
      </div>
    </div>
  );
};

export default Header;
