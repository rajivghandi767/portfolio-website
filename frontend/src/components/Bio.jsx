import React from "react";

const Bio = () => {
  return (
    <div className="md:h-screen pt-4">
      <div className="flex md:flex-row flex-col space-between md:w-2/4 w-10/12 m-auto border rounded-lg p-4 shadow">
        <img
          className="rounded-full w-64 h-64"
          src="./bio_photo.jpg"
          alt="profile"
        />
        <div className="p-4">
          <h5 className="mb-2 text-2xl font-medium border-b-2">Hello!</h5>
          <p className="pt-3">
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Bio;
