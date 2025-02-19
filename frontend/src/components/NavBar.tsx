import { React } from "react";
import { SiteSection, NavBarProps } from "../types/index.ts";

const siteSections: SiteSection[] = [
  { id: 1, section: "Bio", ref: "bio" },
  { id: 2, section: "Projects", ref: "projects" },
  { id: 3, section: "Blog", ref: "blog" },
  { id: 4, section: "Wallet", ref: "wallet" },
  { id: 5, section: "Contact", ref: "contact-form" }, // Updated to match your Contact component's ID
];

const NavBar = ({ isMenuOpen }: NavBarProps) => {
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
      <ul
        className="flex bg-gradient-to-r from-gray-950 via-black to-gray-950 cursor-pointer justify-center 
                     dark:border-b-2 dark:border-gray-800 shadow-lg"
      >
        {siteSections.map((siteSection) => (
          <li
            key={siteSection.id}
            onClick={() => scrollToSection(siteSection.ref)}
            className="mx-4 my-4 text-xl text-gray-50 hover:bg-gradient-to-br hover:from-gray-800 hover:to-gray-700 
                       rounded px-3 py-1 transition-all duration-200"
          >
            {siteSection.section}
          </li>
        ))}
      </ul>
    </div>
  );

  const mobileMenu = (
    <div
      className={`md:hidden bg-gradient-to-b from-gray-950 to-black ${
        isMenuOpen ? "block" : "hidden"
      }`}
    >
      <ul className="flex flex-col items-center py-2">
        {siteSections.map((siteSection) => (
          <li
            key={siteSection.id}
            onClick={() => scrollToSection(siteSection.ref)}
            className="mx-4 my-4 text-xl text-gray-50 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 
                       rounded w-full text-center transition-all duration-200"
          >
            {siteSection.section}
          </li>
        ))}
      </ul>
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
