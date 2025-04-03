// src/components/sections/Bio.tsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Info } from "../../types";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import imageUtils from "../../utils/imageUtils";

const Bio = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch bio information
  const {
    data: info,
    isLoading: bioLoading,
    error: bioError,
  } = useApi<Info[]>(() => apiService.info.get());

  // Clean up blob URL when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (resumeUrl) {
        URL.revokeObjectURL(resumeUrl);
      }
    };
  }, [resumeUrl]);

  const handleViewResume = async () => {
    try {
      setIsLoading(true);
      setResumeError(null);

      const blob = await apiService.resume.view();

      // Create a blob URL
      const url = URL.createObjectURL(blob);
      setResumeUrl(url);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching resume:", error);
      setResumeError(
        error instanceof Error ? error.message : "Failed to load resume preview"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (resumeUrl) {
      URL.revokeObjectURL(resumeUrl);
      setResumeUrl(null);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setResumeError(null);

      const blob = await apiService.resume.download();
      const url = URL.createObjectURL(blob);

      // Create temporary anchor element to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "Rajiv_Wallace_Resume.pdf";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading resume:", error);
      setResumeError("Failed to download resume. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (bioLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (bioError) {
    return (
      <div className="max-w-lg mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg border border-red-200 dark:border-red-900">
          {bioError}
        </div>
      </div>
    );
  }

  // No bio information available
  if (!info || info.length === 0) {
    return (
      <div className="text-center p-4">
        Profile information not available at this time.
      </div>
    );
  }

  const bioInfo = info[0]; // Get the first bio item
  // Use imageUtils to handle the profile image with proper placeholder
  const imageUrl = imageUtils.getImageUrl(bioInfo.profile_photo, "profile");

  return (
    <>
      <div id="bio" className="mx-auto p-4 md:flex md:w-5/6 lg:w-7/12">
        {/* Profile Photo - with imageUtils handling */}
        <div className="flex justify-center mb-4 md:mb-0">
          <div className="w-44 h-44 rounded-full overflow-hidden shrink-0 grow-0 ring-3 ring-black dark:ring-gray-900">
            <img
              src={imageUrl}
              alt="Profile"
              className="object-cover object-top w-full h-full"
            />
          </div>
        </div>

        {/* Bio Content */}
        <div className="md:ml-6">
          <h1 className="text-xl font-semibold underline underline-offset-8 decoration-2">
            {bioInfo.greeting}
          </h1>

          <p className="pt-3 text-sm">{bioInfo.bio}</p>

          <div className="mt-4 text-center md:text-left">
            <button
              onClick={handleViewResume}
              disabled={isLoading}
              className="btn btn-primary px-4 py-2 text-sm rounded-md"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white dark:border-black border-t-transparent dark:border-t-transparent rounded-full"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                "View Resume"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Resume Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b-2 border-default">
              <h3 className="text-lg font-semibold">Rajiv Wallace Resume</h3>
              <button onClick={handleCloseModal} className="hover:text-primary">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 w-full h-full min-h-[60vh]">
              {resumeError ? (
                <div className="h-full flex items-center justify-center">
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg border border-red-200 dark:border-red-900 max-w-md">
                    {resumeError}
                  </div>
                </div>
              ) : isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-2"></div>
                    <p>Loading PDF...</p>
                  </div>
                </div>
              ) : resumeUrl ? (
                <div className="w-full h-[70vh] bg-white dark:bg-gray-900 border-t-2 border-default">
                  <iframe
                    src={resumeUrl}
                    title="Resume Preview"
                    className="w-full h-full"
                    style={{ display: "block" }}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p>No resume data available.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t-2 border-default p-4 flex justify-end items-center">
              <button
                onClick={handleDownload}
                disabled={isDownloading || !resumeUrl}
                className="btn btn-primary px-4 py-2 text-sm flex items-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white dark:border-black border-t-transparent dark:border-t-transparent rounded-full"></div>
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg">📥</span>
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Bio;
