import React from "react";
import { useEffect, useState } from "react";

const Bio = () => {
  const [info, setInfo] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const infoResponse = await fetch("http://localhost:8000/info");
    const infoData = await infoResponse.json();
    setInfo(infoData);

    console.log(infoData);
  };

  return (
    <div
      id="bio"
      className="flex items-center space-between w-2/4 m-auto border rounded-lg p-3 shadow"
    >
      <img
        className="rounded-full w-64 h-64"
        src="./bio_photo.jpg"
        alt="profile"
      />
      <div className="p-4">
        <h5 className="text-2xl font-medium border-b-2">Hello!</h5>
        <p className="pt-3">
          This is a wider card with supporting text below as a natural lead-in
          to additional content. This content is a little bit longer.
        </p>
      </div>
    </div>
  );
};

export default Bio;
