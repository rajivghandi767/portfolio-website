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

  return info.map((info) => (
    <div
      id="bio"
      className="flex items-center space-between w-2/4 m-auto border-2 border-black dark:border-white p-3 shadow"
    >
      <img className="w-64 h-64" src="bio_photo.jpg" alt="profile_photo" />
      <div className="p-4">
        <h5 className="text-xl font-medium border-b-2 border-black dark:border-white">
          {info.greeting}
        </h5>
        <p className="pt-3">{info.bio} </p>
      </div>
    </div>
  ));
};

export default Bio;
