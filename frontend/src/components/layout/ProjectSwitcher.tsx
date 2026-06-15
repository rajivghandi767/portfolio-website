import { useState, useRef, useEffect } from "react";

import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import { Project } from "../../types";

interface ProjectSwitcherProps {
  align?: "left" | "right";
}

export function ProjectSwitcher({ align = "right" }: ProjectSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: projectsData } = useApi<Project[]>(() => apiService.projects.getAll());
  const projects = (projectsData || [])
    .filter((p) => p.is_visible_switcher)
    .sort((a, b) => (a.switcher_order || 0) - (b.switcher_order || 0));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignmentClasses =
    align === "left" ? "left-0 origin-top-left" : "right-0 origin-top-right";

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-brand-light dark:text-brand-dark hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors"
        title="More Projects"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute mt-3 w-72 bg-bg-light dark:bg-bg-dark rounded-xl shadow-xl border border-gray-200 dark:border-neutral-800 overflow-hidden transform transition-all ${alignmentClasses}`}
        >
          <div className="p-3 border-b border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Projects by Rajiv
            </h3>
          </div>

          <div className="p-2 grid gap-1">
            {projects.map((project, idx) => (
              <a
                key={idx}
                href={project.deployed_url || project.repo}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors group"
              >
                <div
                  className="w-8 flex-shrink-0 flex items-start justify-start text-xl pt-0.5 text-gray-700 dark:text-gray-300"
                >
                  {project.emoji || "✨"}
                </div>
                <div>
                  <div className="font-bold text-brand-light dark:text-brand-dark group-hover:text-brand-light/80 dark:group-hover:text-brand-dark/80 transition-colors">
                    {project.title}
                  </div>
                  {project.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5 line-clamp-2">
                      {project.description}
                    </div>
                  )}
                </div>
              </a>
            ))}
            {projects.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">
                No projects available
              </div>
            )}
          </div>

          <div className="p-2 border-t border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 text-center">
            <a
              href="https://github.com/rajivghandi767"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-brand-light dark:text-brand-dark hover:underline"
            >
              View GitHub Repo →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectSwitcher;
