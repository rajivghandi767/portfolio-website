import { Info } from "../types/index.ts";
import { React, useEffect, useState } from "react";
import API_URL from "./ApiConfig.tsx";

const Bio = () => {
  const [info, setInfo] = useState<Info[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async (): Promise<void> => {
    try {
      const infoResponse = await fetch(`${API_URL}${"/info"}`);
      const infoData: Info[] = await infoResponse.json();
      setInfo(infoData);
    } catch (error) {
      console.error("Error fetching info:", error);
    }
  };

  return info.map((infoItem) => (
    <div
      key={infoItem.id}
      id="bio"
      className="mx-auto p-2 md:flex md:w-5/6 lg:w-7/12"
    >
      <img
        className="mx-auto object-cover object-top size-44 rounded-full shrink-0 grow-0"
        src="bio_photo.jpg"
        alt="profile_photo"
      />
      <div className="md:ml-3">
        <h1 className="text-xl font-semibold underline underline-offset-8 decoration-2 dark:border-white">
          {infoItem.greeting}
        </h1>
        <p className="pt-3 text-sm">{infoItem.bio}</p>
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
