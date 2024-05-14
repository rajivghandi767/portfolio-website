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
      className="mx-5 justify-items-center border-2 border-black dark:border-white p-3"
    >
      <img
        className="mx-auto object-cover object-top w-44 h-44 rounded-full"
        src="bio_photo.jpg"
        alt="profile_photo"
      />
      <h5 className="text-xl font-medium underline underline-offset-8 decoration-2 dark:border-white">
        {info.greeting}
      </h5>
      <p className="pt-3">{info.bio}</p>
      <h5 className="mt-2 text-center text-blue-500 hover:text-blue-700 transition cursor-pointer">
        <a href="">View Resume</a>
      </h5>
    </div>
  ));
};

export default Bio;
