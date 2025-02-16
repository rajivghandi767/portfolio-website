import { Info } from "../types/index.ts";
import ResumeModal from "./ResumeModal";
import { React, useEffect, useState } from "react";
import API_URL from "./ApiConfig";

const Bio = () => {
  const [info, setInfo] = useState<Info[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async (): Promise<void> => {
    try {
      const infoResponse = await fetch(`${API_URL}/info`);
      const infoData: Info[] = await infoResponse.json();
      setInfo(infoData);
    } catch (error) {
      console.error("Error fetching info:", error);
    }
  };

  const handleViewResume = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/resume`);

      if (!response.ok) {
        throw new Error("Failed to fetch resume");
      }

      const data = await response.json();
      setPdfUrl(data.file_url);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching resume:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {info.map((infoItem) => (
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
            <h5 className="mt-2 text-center md:text-left">
              <button
                onClick={handleViewResume}
                disabled={isLoading}
                className="text-blue-500 hover:text-blue-700 transition cursor-pointer hover:underline focus:outline-none disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "View Resume"}
              </button>
            </h5>
          </div>
        </div>
      ))}
      <ResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pdfUrl={pdfUrl}
      />
    </>
  );
};

export default Bio;
