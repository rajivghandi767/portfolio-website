import React from "react";

const projects = ["Project 1"];

const Projects = () => {
  const projectList = projects.map((item) => (
    <div className="flex flex-col rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 md:max-w-xl md:flex-row">
      <img
        className="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
        src="https://tecdn.b-cdn.net/wp-content/uploads/2020/06/vertical.jpg"
        alt=""
      />
      <div className="flex flex-col justify-start p-6">
        <h5 className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">
          Card title
        </h5>
        <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
          This is a wider card with supporting text below as a natural lead-in
          to additional content. This content is a little bit longer.
        </p>
      </div>
    </div>
  ));

  return (
    <div className="w-2/4 mx-auto mt-5 mb-2">
      <div>
        <h1 className="text-4xl mb-3">Projects</h1>
      </div>
      <div>{projectList}</div>
    </div>
  );

  // return (
  //   <div>
  //     <div className="w-2/4 mx-auto mt-5 mb-2">
  //       <h2 className="text-4xl mb-3">Projects</h2>
  //     </div>

  //     <div className="flex items-center justify-center px-5">
  //       <a
  //         href="#"
  //         className="flex flex-col items-center rounded-lg overflow-hidden border border-gray-200 bg-white shadow hover:bg-gray-100 md:max-w-xl md:flex-row"
  //       >
  //         <img
  //           className="w-full object-cover md:h-auto md:w-48 md:rounded-none"
  //           src="https://via.placeholder.com/640x360"
  //           alt=""
  //         />

  //         <div className="flex flex-col justify-between p-4 leading-normal">
  //           <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
  //             Introduction to React
  //           </h5>
  //           <p className="mb-3 font-normal text-gray-700">
  //             React is a popular frontend library used for creating UI
  //             components.
  //           </p>
  //         </div>
  //       </a>
  //     </div>
  //   </div>
  // );
  // return (
  //   <div className="w-2/4 mx-auto mt-5 mb-2">
  //     <div>
  //       <h1 className="text-4xl mb-3">Projects</h1>
  //     </div>
  //     <div className="flex flex-col rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 md:max-w-xl md:flex-row">
  //       <img
  //         className="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
  //         src="https://tecdn.b-cdn.net/wp-content/uploads/2020/06/vertical.jpg"
  //         alt=""
  //       />
  //       <div className="flex flex-col justify-start p-6">
  //         <h5 className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">
  //           Card title
  //         </h5>
  //         <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
  //           This is a wider card with supporting text below as a natural lead-in
  //           to additional content. This content is a little bit longer.
  //         </p>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Projects;
