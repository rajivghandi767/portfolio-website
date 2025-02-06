import { SiteSection } from "../types/index.ts";

const siteSections: SiteSection[] = [
  {
    id: 1,
    section: "Bio",
    ref: "bioRef",
  },
  {
    id: 2,
    section: "Projects",
    ref: "projectsRef",
  },
  {
    id: 3,
    section: "Blog",
    ref: "blogRef",
  },
  {
    id: 4,
    section: "Wallet",
    ref: "walletRef",
  },
  {
    id: 5,
    section: "Contact",
    ref: "contactRef",
  },
];

const NavBar = () => {
  // Jump to Section Logic

  const scrollToSection = (ref: string) => {
    const section = document.getElementById(ref);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navBarItems = siteSections.map((siteSection) => (
    <li
      key={siteSection.id}
      onClick={() => scrollToSection(siteSection.ref)}
      className="mx-4 my-4 text-xl text-white hover:bg-gray-700 rounded"
    >
      {siteSection.section}
    </li>
  ));

  return (
    <>
      {/* View settings for md+ screens contained here*/}
      {/* View settings for mobile screens contained in Banner Component*/}

      <div className="hidden md:block mb-2 w-screen mx-auto">
        <ul className="flex bg-stone-950 cursor-pointer justify-center dark:border-b-2 dark:border-t-2">
          {navBarItems}
        </ul>
      </div>
    </>
  );
};

export default NavBar;
