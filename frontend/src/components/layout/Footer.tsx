// src/components/layout/Footer.tsx
import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 mt-6 border-t border-default">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Social Icons */}
          <div className="flex gap-4 mb-4">
            <a
              href="https://linkedin.com/in/rajiv-wallace"
              aria-label="LinkedIn Profile"
              className="btn btn-primary p-2 rounded-full"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            <a
              href="https://github.com/rajivghandi767"
              aria-label="GitHub Profile"
              className="btn btn-primary p-2 rounded-full"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright text */}
          <div className="text-center">
            <p className="text-sm">
              &copy; {currentYear} Rajiv Wallace. All rights reserved.
            </p>
            <p className="text-xs mt-1">Software Engineer & Web Developer</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
