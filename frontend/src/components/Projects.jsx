import React from "react";
import { useEffect, useState } from "react";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const projectsResponse = await fetch("http://localhost:8000/projects");
    const projectsData = await projectsResponse.json();
    setProjects(projectsData);

    console.log(projectsData);
  };

  const projectList = projects.map((project) => (
    <div className="mx-auto border-2 w-64 border-black inline-block dark:border-white">
      <img className="" src="" />
      <div className="p-2">
        <h3 className="mb-2 text-l text-center underline underline-offset-8 decoration-2 font-medium border-black dark:border-white">
          {project.title}
        </h3>
        <h5 className="text-center text-blue-500 hover:text-blue-700 transition cursor-pointer">
          <a href={project.repo} target="_blank" rel="noreferrer">
            View Code
          </a>
        </h5>
        <p className="pt-2 text-sm">{project.description}</p>
      </div>
    </div>
  ));

  return (
    <div id="projects" className="mx-auto">
      <h1 className="p-1 text-2xl text-center mx-auto">Coding Projects</h1>
      <div className="mx-auto lg:w-4/6 grid grid-rows md:grid-cols-3 gap-2">
        {projectList}
      </div>
    </div>
  );
};

export default Projects;
