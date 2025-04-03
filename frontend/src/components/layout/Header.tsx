import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Sun, Moon, Menu, X, Home as HomeIcon } from "lucide-react";
import { useThemeContext } from "../../context/ThemeContext";

// Type definition for navigation items
type NavigationItem = {
  id: number;
  label: string;
  path: string;
  sectionRef?: string | null;
};

// Separate component for theme toggle button
const ThemeToggleButton = () => {
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <button
      className="btn btn-primary p-2 rounded-lg"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

// Separate component for mobile menu toggle
const MobileMenuToggle = ({
  isMenuOpen,
  toggleMenu,
}: {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}) => (
  <div className="w-14 flex justify-end md:hidden">
    <button
      onClick={toggleMenu}
      className="p-2 text-header hover:text-primary transition-colors"
      aria-label={isMenuOpen ? "Close menu" : "Open menu"}
    >
      {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
    </button>
  </div>
);

// Navigation items configuration
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

  // Compute navigation items based on current page
  const navItems: NavigationItem[] = isHomePage
    ? NAVIGATION_ITEMS
    : [
        { id: 0, label: "Home", path: "/", sectionRef: null },
        ...NAVIGATION_ITEMS.filter((item) => item.label !== "Bio").map(
          (item) => ({ ...item })
        ),
      ];

  // Handle navigation and scrolling
  const handleNavigation = (item: NavigationItem, event: React.MouseEvent) => {
    // Scroll to section on home page
    if (isHomePage && item.sectionRef) {
      event.preventDefault();
      scrollToSection(item.sectionRef);
    }

    // Close mobile menu
    setIsMenuOpen(false);
  };

  // Scroll to a specific section
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

  // Render navigation links
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
      {/* Banner */}
      <div className="bg-header">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="w-14">
              <ThemeToggleButton />
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

            <MobileMenuToggle
              isMenuOpen={isMenuOpen}
              toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <nav className="bg-nav shadow-lg">{renderNavLinks(navItems)}</nav>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden bg-nav ${isMenuOpen ? "block" : "hidden"}`}>
        <nav>{renderNavLinks(navItems, true)}</nav>
      </div>
    </div>
  );
};

export default Header;
