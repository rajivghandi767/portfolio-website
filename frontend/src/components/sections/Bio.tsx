import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Info } from "../../types";
import apiService from "../../services/api";
import useApi from "../../hooks/useApi";
import imageUtils from "../../utils/imageUtils";
import DataLoader from "../common/DataLoader";

const Bio = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isLoadingResume, setIsLoadingResume] = useState<boolean>(false);

  const {
    data: info,
    isLoading,
    error,
  } = useApi<Info[]>(() => apiService.info.get());

  useEffect(() => {
    return () => {
      if (resumeUrl) {
        URL.revokeObjectURL(resumeUrl);
      }
    };
  }, [resumeUrl]);

  const handleViewResume = async (): Promise<void> => {
    setIsLoadingResume(true);
    setResumeError(null);
    try {
      const blob = await apiService.resume.view();
      const url = URL.createObjectURL(blob);
      setResumeUrl(url);
      setIsModalOpen(true);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error fetching resume:", err);
      }
      setResumeError(
        err instanceof Error ? err.message : "Failed to load resume preview",
      );
    } finally {
      setIsLoadingResume(false);
    }
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    if (resumeUrl) {
      URL.revokeObjectURL(resumeUrl);
      setResumeUrl(null);
    }
  };

  const handleDownload = async (): Promise<void> => {
    setIsDownloading(true);
    setResumeError(null);
    try {
      const blob = await apiService.resume.download();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Rajiv_Wallace_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error downloading resume:", err);
      }
      setResumeError("Failed to download resume. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleModalBackdropClick = (
    e: React.MouseEvent<HTMLDivElement>,
  ): void => {
    if (e.target === e.currentTarget) handleCloseModal();
  };

  return (
    <>
      <DataLoader<Info>
        isLoading={isLoading}
        error={error}
        data={info}
        emptyMessage="Bio Coming Soon!"
      >
        {(infoData) => {
          const bioInfo = infoData[0];

          const imageUrl = imageUtils.getImageUrl(
            bioInfo.profile_photo_url,
            "profile",
          );

          return (
            <div id="bio" className="mx-auto p-4 md:flex md:w-5/6 lg:w-7/12">
              <div className="flex justify-center mb-4 md:mb-0">
                <div className="w-44 h-44 rounded-full overflow-hidden shrink-0 grow-0 ring-4 ring-gray-200 dark:ring-neutral-800">
                  <img
                    src={imageUrl}
                    alt={`Profile photo of ${bioInfo.greeting || "user"}`}
                    className="object-cover object-top w-full h-full"
                  />
                </div>
              </div>
              <div className="md:ml-6">
                <h1 className="text-xl font-semibold underline underline-offset-8 decoration-2">
                  {bioInfo.greeting || "Welcome"}
                </h1>
                <p className="pt-3 text-sm">
                  {bioInfo.bio || "Bio information not available"}
                </p>
                <div className="mt-4 text-center md:text-left">
                  <button
                    onClick={handleViewResume}
                    disabled={isLoadingResume}
                    // Replaced .btn .btn-primary
                    className="inline-flex items-center justify-center bg-brand-light dark:bg-brand-dark text-bg-light dark:text-bg-dark hover:bg-neutral-800 dark:hover:bg-gray-200 transition-colors duration-200 px-4 py-2 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingResume ? "Loading..." : "View Resume"}
                  </button>
                </div>
              </div>
            </div>
          );
        }}
      </DataLoader>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleModalBackdropClick}
        >
          {/* Replaced .card with inline styles */}
          <div className="bg-bg-light dark:bg-bg-dark text-brand-light dark:text-brand-dark border-2 border-gray-200 dark:border-neutral-800 rounded-lg shadow-sm w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col">
            {/* Replaced .border-default */}
            <div className="flex justify-between items-center p-4 border-b-2 border-gray-200 dark:border-neutral-800">
              <h3 className="text-lg font-semibold">Rajiv Wallace Resume</h3>
              <button
                onClick={handleCloseModal}
                className="hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              {isLoadingResume ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-light dark:border-brand-dark"></div>
                </div>
              ) : resumeError ? (
                <div className="h-full flex items-center justify-center p-4 text-center">
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg border border-red-200 dark:border-red-900">
                    {resumeError}
                  </div>
                </div>
              ) : resumeUrl ? (
                <iframe
                  src={resumeUrl}
                  title="Resume Preview"
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p>Could not load resume preview.</p>
                </div>
              )}
            </div>
            {/* Replaced .border-default */}
            <div className="border-t-2 border-gray-200 dark:border-neutral-800 p-4 flex justify-end items-center">
              <button
                onClick={handleDownload}
                disabled={isDownloading || !resumeUrl}
                // Replaced .btn .btn-primary
                className="inline-flex items-center justify-center bg-brand-light dark:bg-brand-dark text-bg-light dark:text-bg-dark hover:bg-neutral-800 dark:hover:bg-gray-200 transition-colors duration-200 px-4 py-2 text-sm rounded-md disabled:opacity-50"
              >
                {isDownloading ? "Downloading..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Bio;
