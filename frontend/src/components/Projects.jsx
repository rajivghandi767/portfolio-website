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

  const eachProject = ["Project 1", "Project 2", "Project 3", "P4"];

  const projectList = eachProject.map((item) => (
    <div className="flex justify-center space-between border rounded-lg p-2 m-auto shadow">
      <img
        className="object-contain square-full w-64 h-64"
        src="https://tecdn.b-cdn.net/wp-content/uploads/2020/06/vertical.jpg"
      />
      <div className="p-4">
        <h3 className="mb-2 text-2xl font-medium border-b-2">Card title</h3>
        <h5 className="text-blue-500 hover:text-blue-700 transition cursor-pointer">
          View Code
        </h5>
        <p className="pt-2">
          This is a wider card with supporting text below as a natural lead-in
          to additional content. This content is a little bit longer.
        </p>
      </div>
    </div>
  ));

  return (
    <div id="projects" className="m-3">
      <h1 className="p-2 text-4xl text-center">Projects</h1>
      <div className="flex grid gap-4 mx-5">{projectList}</div>
    </div>
  );
};

export default Projects;
