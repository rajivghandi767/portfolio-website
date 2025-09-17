// src/components/sections/Projects.tsx
import { Link } from "react-router-dom";
import { Github, ChevronRight } from "lucide-react";
import { Project } from "../../types";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import imageUtils from "../../utils/imageUtils";

interface ProjectsProps {
  limit?: number;
}

const Projects = ({ limit = 3 }: ProjectsProps) => {
  // Use our custom hook to fetch projects
  const {
    data: projects,
    isLoading,
    error,
  } = useApi<Project[]>(() => apiService.projects.getAll());

  // Check if we're on the dedicated projects page
  const isProjectsPage = window.location.pathname === "/projects";

  // Determine which projects to display based on limit
  const displayedProjects = isProjectsPage
    ? projects || []
    : (projects || []).slice(0, limit);

  // Determine if we should show the "See More" button
  const shouldShowSeeMore = !isProjectsPage && (projects?.length || 0) > limit;

  return (
    <div id="projects" className="mx-auto px-4 py-8">
      <div className="flex justify-center items-center mb-8">
        <Link to="/projects" className="text-2xl font-semibold text-center">
          Coding Projects
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg border border-red-200 dark:border-red-900">
            {error}
          </div>
        </div>
      ) : !displayedProjects.length ? (
        <div className="text-center p-8">
          No projects available at this time.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {displayedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {shouldShowSeeMore && (
            <div className="flex justify-center mt-8">
              <Link to="/projects">
                <button className="btn btn-outline flex items-center gap-2 px-4 py-2">
                  <span>See More Projects</span>
                  <ChevronRight size={16} />
                </button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Separate component for each project card
interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  // Get image URL using our image utility
  const imageUrl = imageUtils.getImageUrl(project.thumbnail, "project");

  return (
    <div className="card hover-scale">
      <div className="card-image-container w-full h-40 overflow-hidden">
        <img
          src={imageUrl}
          alt={project.title || "Project thumbnail"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-base font-semibold mb-1 text-center">
          {project.title}
        </h2>

        <div className="flex items-center justify-center gap-4 mb-2">
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors text-xs"
              aria-label={`View source code for ${project.title}`}
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
              className="flex items-center gap-1 hover:text-primary transition-colors text-xs"
              aria-label={`View demo for ${project.title}`}
            >
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
            {project.technology || "Not specified"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Projects;
