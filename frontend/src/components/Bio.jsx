import React from "react";
import { useEffect, useState } from "react";

const Bio = () => {
  const [info, setInfo] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const infoResponse = await fetch("http://localhost:8000/api/info");
    const infoData = await infoResponse.json();
    setInfo(infoData);

    console.log(infoData);
  };

  return info.map((info) => (
    <div id="bio" className="mx-auto p-2 md:flex md:w-5/6 lg:w-7/12">
      <img
        className="mx-auto object-cover object-top size-44 rounded-full shrink-0 grow-0"
        src="bio_photo.jpg"
        alt="profile_photo"
      />
      <div className="md:ml-3">
        <h1 className="text-xl font-semibold underline underline-offset-8 decoration-2 dark:border-white">
          {info.greeting}
        </h1>
        <p className="pt-3 text-sm">{info.bio}</p>
        <h5 className="mt-2 text-center md:text-left text-blue-500 hover:text-blue-700 transition cursor-pointer">
          <a href="" target="_blank" rel="noreferrer">
            View Resume
          </a>
        </h5>
      </div>
    </div>
  ));
};

export default Bio;
