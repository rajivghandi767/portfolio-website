import { React } from "react";
import { useLocation, Link } from "react-router-dom";
import { Home as HomeIcon } from "lucide-react";
import { NavBarProps } from "../types/index.ts";

// Define site sections with both paths and section refs
const navigationItems = [
  { id: 1, label: "Bio", path: "/", sectionRef: "bio" },
  { id: 2, label: "Projects", path: "/projects", sectionRef: "projects" },
  { id: 3, label: "Blog", path: "/blog", sectionRef: "blog" },
  { id: 4, label: "Wallet", path: "/wallet", sectionRef: "wallet" },
  { id: 5, label: "Contact", path: "/contact", sectionRef: "contact-form" },
];

const NavBar = ({ isMenuOpen }: NavBarProps) => {
  // Get current location to determine behavior and active state
  const location = useLocation();
  const currentPath = location.pathname;
  const isHomePage = currentPath === "/";

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
    // Otherwise, normal link behavior will navigate to the path
  };

  // Scroll to section function (only used on home page)
  const scrollToSection = (ref: string): void => {
    const section = document.getElementById(ref);
    if (section) {
      // Get the header height (Banner + NavBar)
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

  const desktopMenu = (
    <div className="hidden md:block">
      <nav
        className="flex bg-gradient-to-r from-gray-950 via-black to-gray-950 
                     dark:border-b-2 dark:border-gray-800 shadow-lg"
      >
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
                  className={`text-xl text-gray-50 hover:bg-gradient-to-br hover:from-gray-800 hover:to-gray-700
                             rounded px-3 py-1 transition-all duration-200 flex items-center gap-1
                             ${isActive ? "bg-gray-800" : ""}`}
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
  );

  const mobileMenu = (
    <div
      className={`md:hidden bg-gradient-to-b from-gray-950 to-black ${
        isMenuOpen ? "block" : "hidden"
      }`}
    >
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
                  className={`flex items-center justify-center gap-1 mx-4 my-2 text-xl text-gray-50
                             hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700
                             rounded w-full py-2 text-center transition-all duration-200
                             ${isActive ? "bg-gray-800" : ""}`}
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
  );

  return (
    <>
      {desktopMenu}
      {mobileMenu}
    </>
  );
};

export default NavBar;
