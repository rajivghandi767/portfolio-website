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
    <div className="flex justify-center space-between border-2 border-black dark:border-white p-2 m-auto shadow">
      <img className="object-contain square-full w-64 h-64" src="" />
      <div className="p-4">
        <h3 className="mb-2 text-xl font-medium border-b-2 border-black dark:border-white">
          {project.title}
        </h3>
        <h5 className="text-blue-500 hover:text-blue-700 transition cursor-pointer">
          <a href={project.repo}>View Code</a>
        </h5>
        <p className="pt-2">{project.description}</p>
      </div>
    </div>
  ));

  return (
    <div id="projects" className="m-3">
      <h1 className="p-2 text-3xl text-center">Projects</h1>
      <div className="container mx-auto grid grid-cols-3 gap-4">
        {projectList}
      </div>
    </div>
  );
};

export default Projects;
