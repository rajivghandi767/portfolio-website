import { Project } from "../types/index.ts";
import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "./ApiConfig";
import { Github, ChevronRight } from "lucide-react";

const Projects = ({ limit = 3 }: { limit?: number }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const getData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const projectsResponse = await fetch(`${API_URL}/projects`);
      // Check if response was successful
      if (!projectsResponse.ok) {
        throw new Error(
          `Server returned ${projectsResponse.status}: ${projectsResponse.statusText}`
        );
      }
      const projectsData: Project[] = await projectsResponse.json();
      setProjects(projectsData);
      setError(null);
    } catch (error) {
      console.error("Error fetching projects:", error);
      // Set fallback projects if API fails - prevents empty state
      setProjects([
        {
          id: 1,
          title: "Sample Project",
          description: "Unable to load projects. This is a placeholder.",
          thumbnail: "",
          repo: "#",
          deployed_url: "",
          stack: "N/A",
        },
      ]);
      setError(
        error instanceof Error ? error.message : "Failed to load projects"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Helper function to construct thumbnail URL - handles both absolute and relative paths
  const getThumbnailUrl = (thumbnailPath: string): string => {
    if (!thumbnailPath)
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'%3E%3Crect width='200' height='120' fill='%23eaeaea'/%3E%3Ctext x='50%25' y='50%25' font-family='monospace' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EImage Unavailable%3C/text%3E%3C/svg%3E";

    // Check if the path is already an absolute URL
    if (
      thumbnailPath.startsWith("http://") ||
      thumbnailPath.startsWith("https://")
    ) {
      return thumbnailPath;
    }

    // Remove leading slash from thumbnail path if it exists
    const cleanPath = thumbnailPath.startsWith("/")
      ? thumbnailPath.slice(1)
      : thumbnailPath;

    // Remove trailing slash from API_URL if it exists
    const baseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;

    return `${baseUrl}/${cleanPath}`;
  };

  // Determine which projects to display based on limit and showAll flag
  const displayedProjects = showAll ? projects : projects.slice(0, limit);

  // Determine if we should show the "See More" button
  const shouldShowSeeMore = !showAll && projects.length > limit;

  return (
    <div id="projects" className="mx-auto px-4 py-8">
      <div className="flex justify-center items-center mb-8">
        <Link
          to="/projects"
          className="text-2xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-300 hover:from-gray-900 hover:to-gray-800 dark:hover:from-gray-200 dark:hover:to-gray-100 transition-all duration-200"
        >
          Coding Projects
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-gray-100"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 bg-red-50 dark:bg-black border border-red-200 dark:border-red-900 rounded-lg max-w-2xl mx-auto">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {displayedProjects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col h-full bg-white dark:bg-black rounded-lg shadow-lg overflow-hidden
                         border-2 border-black dark:border-gray-800 transition-all duration-300
                         hover:shadow-xl hover:scale-102"
              >
                <div className="w-full h-40 overflow-hidden">
                  <img
                    src={getThumbnailUrl(project.thumbnail)}
                    alt={project.title}
                    className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Use inline SVG as data URL to avoid additional HTTP requests
                      target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='160' viewBox='0 0 200 160'%3E%3Crect width='200' height='160' fill='%23eaeaea'/%3E%3Ctext x='50%25' y='50%25' font-family='monospace' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EImage Unavailable%3C/text%3E%3C/svg%3E";
                      target.onerror = null; // Prevent infinite loop if fallback also fails
                    }}
                  />
                </div>

                <div className="flex flex-col flex-grow p-4">
                  <h2
                    className="text-base font-semibold mb-1 text-center text-transparent bg-clip-text bg-gradient-to-r 
                                from-black to-black dark:from-white dark:to-gray-300"
                  >
                    {project.title}
                  </h2>

                  <div className="flex items-center justify-center gap-4 mb-2">
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-black dark:text-gray-300 
                               hover:text-gray-800 dark:hover:text-white transition-colors text-xs"
                    >
                      <Github size={12} />
                      <span>Code</span>
                    </a>

                    {project.deployed_url && (
                      <a
                        href={project.deployed_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-black dark:text-gray-300 
                                 hover:text-gray-800 dark:hover:text-white transition-colors text-xs"
                      >
                        <span>Demo</span>
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-black dark:text-gray-300 mb-2 h-10 overflow-hidden line-clamp-2">
                    {project.description}
                  </p>

                  <div className="mt-auto">
                    <p className="text-xs text-black dark:text-gray-400">
                      <span className="font-semibold">Stack:</span>{" "}
                      {project.technology}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {shouldShowSeeMore && (
            <div className="flex justify-center mt-8">
              <Link
                to="/projects"
                className="flex items-center gap-2 text-black dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors px-4 py-2 border-2 border-black dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-black"
              >
                <span>See More Projects</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Projects;
