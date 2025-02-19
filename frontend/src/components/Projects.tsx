import { Project } from "../types/index.ts";
import { React, useEffect, useState } from "react";
import API_URL from "./ApiConfig";
import { Github } from "lucide-react";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const getData = async (): Promise<void> => {
    try {
      const projectsResponse = await fetch(`${API_URL}/projects`);
      // Check if response was successful
      if (!projectsResponse.ok) {
        throw new Error(
          `Server returned ${projectsResponse.status}: ${projectsResponse.statusText}`
        );
      }
      const projectsData: Project[] = await projectsResponse.json();
      setProjects(projectsData);
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
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Helper function to construct thumbnail URL - handles both absolute and relative paths
  const getThumbnailUrl = (thumbnailPath: string): string => {
    if (!thumbnailPath)
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'%3E%3Crect width='200' height='120' fill='%23eaeaea'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EImage Unavailable%3C/text%3E%3C/svg%3E";

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

  return (
    <div id="projects" className="mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-950 to-gray-800 dark:from-gray-50 dark:to-gray-300">
        Coding Projects
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden
                     border border-gray-200 dark:border-gray-700 transition-all duration-300
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
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='160' viewBox='0 0 200 160'%3E%3Crect width='200' height='160' fill='%23eaeaea'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EImage Unavailable%3C/text%3E%3C/svg%3E";
                  target.onerror = null; // Prevent infinite loop if fallback also fails
                }}
              />
            </div>

            <div className="flex flex-col flex-grow p-4">
              <h2
                className="text-base font-semibold mb-1 text-center text-transparent bg-clip-text bg-gradient-to-r 
                            from-gray-950 to-gray-800 dark:from-gray-50 dark:to-gray-300"
              >
                {project.title}
              </h2>

              <div className="flex items-center justify-center gap-4 mb-2">
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 
                           hover:text-blue-800 dark:hover:text-blue-300 transition-colors text-xs"
                >
                  <Github size={12} />
                  <span>Code</span>
                </a>

                {project.deployed_url && (
                  <a
                    href={project.deployed_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-green-600 dark:text-green-400 
                             hover:text-green-800 dark:hover:text-green-300 transition-colors text-xs"
                  >
                    <span>Demo</span>
                  </a>
                )}
              </div>

              <p className="text-xs text-gray-700 dark:text-gray-300 mb-2 h-10 overflow-hidden line-clamp-2">
                {project.description}
              </p>

              <div className="mt-auto">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Stack:</span> {project.stack}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
