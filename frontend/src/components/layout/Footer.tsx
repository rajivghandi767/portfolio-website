import { Github, Linkedin } from "../common/Icons";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import { Info } from "../../types";

const currentYear = new Date().getFullYear();

const Footer = () => {
  const { data: info } = useApi<Info[]>(() => apiService.info.get());
  const infoData = info?.[0];

  return (
    <footer className="py-6 mt-6 border-t border-gray-200 dark:border-neutral-800">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Social Icons */}
          <div className="flex gap-4 mb-4">
            {infoData?.linkedin && (
              <a
                href={infoData.linkedin}
                aria-label="LinkedIn Profile"
                className="inline-flex items-center justify-center bg-brand-light dark:bg-brand-dark text-bg-light dark:text-bg-dark hover:bg-neutral-800 dark:hover:bg-gray-200 transition-colors duration-200 p-2 rounded-full"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}

            {infoData?.github && (
              <a
                href={infoData.github}
                aria-label="GitHub Profile"
                className="inline-flex items-center justify-center bg-brand-light dark:bg-brand-dark text-bg-light dark:text-bg-dark hover:bg-neutral-800 dark:hover:bg-gray-200 transition-colors duration-200 p-2 rounded-full"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="w-5 h-5" />
              </a>
            )}

            {infoData?.substack && (
              <a
                href={infoData.substack}
                aria-label="Substack Profile"
                className="inline-flex items-center justify-center bg-brand-light dark:bg-brand-dark text-bg-light dark:text-bg-dark hover:bg-neutral-800 dark:hover:bg-gray-200 transition-colors duration-200 p-2 rounded-full"
                target="_blank"
                rel="noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                </svg>
              </a>
            )}
          </div>
          {infoData?.email && (
            <div className="mb-2">
              <a
                href={`mailto:${infoData.email}`}
                className="text-brand-light dark:text-brand-dark hover:underline text-sm font-medium transition-colors"
              >
                {infoData.email}
              </a>
            </div>
          )}

          {/* Copyright text */}
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="text-sm">
              &copy; {currentYear} {infoData?.site_header}. All rights reserved.
            </p>
            <p className="text-xs mt-1">{infoData?.professional_title}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
