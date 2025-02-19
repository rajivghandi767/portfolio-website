import { React } from "react";
import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-2">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Social Icons */}
          <div className="flex gap-4 mb-4">
            <a
              href="https://linkedin.com/in/rajiv-wallace"
              aria-label="LinkedIn Profile"
              className="p-2 rounded-full bg-gradient-to-br from-gray-950 to-gray-800 dark:from-gray-50 dark:to-gray-300
                        text-white dark:text-gray-950
                        hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-200 dark:hover:to-gray-100
                        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            <a
              href="https://github.com/rajivghandi767"
              aria-label="GitHub Profile"
              className="p-2 rounded-full bg-gradient-to-br from-gray-950 to-gray-800 dark:from-gray-50 dark:to-gray-300
                        text-white dark:text-gray-950
                        hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-200 dark:hover:to-gray-100
                        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright text */}
          <div className="text-center">
            <p className="text-sm text-gray-800 dark:text-gray-300">
              &copy; {currentYear} Rajiv Wallace. All rights reserved.
            </p>
            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              Software Engineer & Web Developer
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
