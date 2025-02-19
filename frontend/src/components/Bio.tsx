import { React, useEffect, useState } from "react";
import { Info } from "../types/index.ts";
import ResumeModal from "./ResumeModal";
import API_URL from "./ApiConfig";

const Bio = () => {
  const [info, setInfo] = useState<Info[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getData = async () => {
      try {
        console.log("Fetching info from:", `${API_URL}/info`);
        const infoResponse = await fetch(`${API_URL}/info`);

        if (!infoResponse.ok) {
          throw new Error(`HTTP error! status: ${infoResponse.status}`);
        }

        const infoData: Info[] = await infoResponse.json();
        console.log("Received info data:", infoData);

        if (isMounted) {
          setInfo(infoData);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching info:", error);
        if (isMounted) {
          setError(
            error instanceof Error ? error.message : "An error occurred"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getData();

    return () => {
      isMounted = false;
    };
  }, []);

  const getImageUrl = (photoPath: string | null) => {
    if (!photoPath) return null;

    // If the path is already a full URL, return it as is
    if (photoPath.startsWith("http")) {
      return photoPath;
    }

    // Remove API_URL if it's accidentally included in the path
    const cleanPath = photoPath.replace(API_URL, "").replace(/^\/+/, "");

    // Get the base URL (without any path)
    const baseUrl = API_URL.split("/").slice(0, 3).join("/");

    // Construct the full URL
    return `${baseUrl}/${cleanPath}`;
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <>
      {info.map((infoItem) => {
        const imageUrl = getImageUrl(infoItem.profile_photo);
        console.log("Profile photo path:", infoItem.profile_photo);
        console.log("Constructed image URL:", imageUrl);

        return (
          <div
            key={infoItem.id}
            id="bio"
            className="mx-auto p-2 md:flex md:w-5/6 lg:w-7/12"
          >
            {imageUrl ? (
              <img
                className="mx-auto object-cover object-top size-44 rounded-full shrink-0 grow-0 
                         ring-2 ring-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-700 dark:to-gray-600"
                src={imageUrl}
                alt="Profile"
                onError={(e) => {
                  console.log("Image failed to load:", imageUrl);
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div
                className="mx-auto size-44 rounded-full shrink-0 grow-0 
                           ring-2 ring-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-700 dark:to-gray-600
                           bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
              >
                <span className="text-gray-500 dark:text-gray-400">
                  No Image
                </span>
              </div>
            )}
            <div className="md:ml-3">
              <h1
                className="text-xl font-semibold underline underline-offset-8 decoration-2 
                            text-transparent bg-clip-text bg-gradient-to-r from-gray-950 to-gray-800 
                            dark:from-gray-50 dark:to-gray-300"
              >
                {infoItem.greeting}
              </h1>
              <p className="pt-3 text-sm text-gray-800 dark:text-gray-300">
                {infoItem.bio}
              </p>
              <h5 className="mt-2 text-center md:text-left">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-600 
                            dark:from-blue-400 dark:to-blue-300 hover:from-blue-800 hover:to-blue-700 
                            dark:hover:from-blue-300 dark:hover:to-blue-200 transition-all duration-200 
                            cursor-pointer hover:underline focus:outline-none"
                >
                  View Resume
                </button>
              </h5>
            </div>
          </div>
        );
      })}
      <ResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        apiUrl={API_URL}
      />
    </>
  );
};

export default Bio;
