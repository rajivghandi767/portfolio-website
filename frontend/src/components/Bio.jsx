import React from "react";

const Bio = () => {
  return (
    <div className="h-screen">
      <div className="flex space-between w-2/4 mt-4 m-auto border rounded-lg p-4 shadow">
        <img
          className="object-contain rounded-full w-64 h-64"
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
