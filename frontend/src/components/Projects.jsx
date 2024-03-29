import React from "react";

const projects = ["Project 1", "Project 2", "Project 3", "P4"];

const Projects = () => {
  const projectList = projects.map((item) => (
    <div className="flex space-between border rounded-lg p-2 m-auto shadow">
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
    <div id="projects" className="md:h-screen">
      <div className="m-8">
        <h1 className="text-4xl text-center">Projects</h1>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mx-5">
        {projectList}
      </div>
    </div>
  );
};

export default Projects;
