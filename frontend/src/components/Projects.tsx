import { Project } from "../types/index.ts";
import { React, useEffect, useState } from "react";
import API_URL from "./ApiConfig.tsx";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const getData = async (): Promise<void> => {
    try {
      const projectsResponse = await fetch(`${API_URL}/projects`);
      const projectsData: Project[] = await projectsResponse.json();
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div id="projects" className="mx-auto">
      <h1 className="p-3 font-semibold text-2xl text-center mx-auto">
        Coding Projects
      </h1>
      <div className="mx-auto lg:w-4/6 grid grid-rows md:grid-cols-3 gap-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="mx-auto border-2 w-64 border-black inline-block dark:border-white rounded-md"
          >
            <div className="p-2">
              <h1 className="mb-1 text-l text-center underline underline-offset-8 decoration-2 font-semibold border-black dark:border-white">
                {project.title}
              </h1>
              <h2 className="text-center text-blue-500 hover:text-blue-700 transition cursor-pointer">
                <a href={project.repo} target="_blank" rel="noreferrer">
                  View Code
                </a>
              </h2>
              <p className="py-1 text-sm">{project.description}</p>
              <h2 className="text-xs font-bold text-left">
                Tech Stack: {project.stack}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
