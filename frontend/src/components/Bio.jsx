import React from "react";

const Bio = () => {
  return (
    <div className="w-1/2 mx-auto mt-5 mb-2">
      <div>
        <h1 className="text-4xl mb-3 border-slate-300">Bio</h1>
      </div>

      <div className="flex flex-col rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 md:max-w-xl md:flex-row py-5">
        <img
          className="rounded-full w-59 h-64 mx-4"
          src="./bio_photo.jpg"
          alt="profile"
        />
        <div className="flex flex-col justify-start p-6">
          <h5 className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">
            Hello!
          </h5>
          <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Bio;
