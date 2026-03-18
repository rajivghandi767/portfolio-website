import { Link } from "react-router-dom";
import { Github, ChevronRight } from "lucide-react";
import { Project, PageProps } from "../../types";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import imageUtils from "../../utils/imageUtils";
import DataLoader from "../common/DataLoader";

const Projects = ({ limit = 3 }: PageProps) => {
  const {
    data: projects,
    isLoading,
    error,
  } = useApi<Project[]>(() => apiService.projects.getAll());
  const isProjectsPage = window.location.pathname === "/projects";

  return (
    <div id="projects" className="mx-auto px-4 py-8">
      <div className="flex justify-center items-center mb-8">
        <Link
          to="/projects"
          className="text-2xl font-semibold text-center text-brand-light dark:text-brand-dark hover:underline"
        >
          Coding Projects
        </Link>
      </div>

      <DataLoader<Project>
        isLoading={isLoading}
        error={error}
        data={projects}
        emptyMessage="Stay Tuned! But if you cant wait, check out my GitHub (github.com/rajivghandi767) for my latest work."
      >
        {(allProjects) => {
          const displayedProjects = isProjectsPage
            ? allProjects
            : allProjects.slice(0, limit);
          const shouldShowSeeMore =
            !isProjectsPage && allProjects.length > limit;

          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
                {displayedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>

              {shouldShowSeeMore && (
                <div className="flex justify-center mt-8">
                  <Link to="/projects">
                    <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 px-4 py-2 bg-transparent border-2 border-gray-200 dark:border-neutral-800 text-brand-light dark:text-brand-dark hover:border-brand-light dark:hover:border-brand-dark gap-2">
                      <span>See More Projects</span>
                      <ChevronRight size={16} />
                    </button>
                  </Link>
                </div>
              )}
            </>
          );
        }}
      </DataLoader>
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const imageUrl = imageUtils.getImageUrl(project.thumbnail_url, "project");

  return (
    <div className="bg-bg-light dark:bg-bg-dark text-brand-light dark:text-brand-dark border-2 border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
      <div className="bg-white dark:bg-neutral-900 flex items-center justify-center w-full h-40 overflow-hidden">
        <img
          src={imageUrl}
          alt={project.title || "Project thumbnail"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col grow">
        <h2 className="text-base font-semibold mb-1 text-center">
          {project.title}
        </h2>

        <div className="flex items-center justify-center gap-4 mb-2">
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors text-xs font-medium"
            >
              <Github size={12} />
              <span>Code</span>
            </a>
          )}
          {project.deployed_url && (
            <a
              href={project.deployed_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors text-xs font-medium"
            >
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Demo</span>
            </a>
          )}
        </div>

        <p className="text-xs mb-2 h-10 overflow-hidden line-clamp-2">
          {project.description || "No description available"}
        </p>

        <div className="mt-auto">
          <p className="text-xs">
            <span className="font-semibold">Stack:</span>{" "}
            <span className="text-gray-600 dark:text-gray-400">
              {project.technology || "Not specified"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Projects;
