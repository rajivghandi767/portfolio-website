// src/components/layout/Footer.tsx
import { Github, Linkedin } from "lucide-react";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import { Info } from "../../types";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const { data: info } = useApi<Info[]>(() => apiService.info.get());
  const infoData = info?.[0];

  return (
    <footer className="py-6 mt-6 border-t border-default">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Social Icons */}
          <div className="flex gap-4 mb-4">
            <a
              href={infoData?.linkedin}
              aria-label="LinkedIn Profile"
              className="btn btn-primary p-2 rounded-full"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            <a
              href={infoData?.github}
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
