import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ResumeModalProps } from "../types/index.ts";

const ResumeModal = ({ isOpen, onClose, apiUrl }: ResumeModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      handleViewResume();
    }
  }, [isOpen]);

  const handleViewResume = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${apiUrl}/resume/view/`);
      if (!response.ok) throw new Error("Failed to fetch PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfBlob(url);
    } catch (error) {
      console.error("Error fetching resume:", error);
      setError("Failed to load resume preview");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${apiUrl}/resume/download/`);
      if (!response.ok) throw new Error("Failed to download resume");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Rajiv_Wallace_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading resume:", error);
      setError("Failed to download resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup blob URL when modal closes
  useEffect(() => {
    return () => {
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
      }
    };
  }, [pdfBlob]);

  // Custom styles for the Dialog components to ensure AMOLED optimization
  const dialogContentStyles = `
    max-w-4xl w-11/12 h-[80vh] bg-white dark:bg-black 
    border-2 border-black dark:border-gray-800 
    rounded-lg shadow-lg
  `.trim();

  const dialogHeaderStyles = `
    flex flex-row items-center border-b-2 border-black dark:border-gray-800 
    py-2 px-4 bg-white dark:bg-black
  `.trim();

  const dialogTitleStyles = `
    flex-1 text-black dark:text-white text-xl font-semibold
  `.trim();

  const buttonStyles = `
    flex items-center gap-2 px-4 py-2 bg-black dark:bg-white 
    text-white dark:text-black rounded-md font-medium
    hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors 
    disabled:opacity-50 disabled:cursor-not-allowed
    border-2 border-black dark:border-white
  `.trim();

  const errorStyles = `
    text-red-600 dark:text-red-400 text-sm my-4 font-medium
    bg-red-50 dark:bg-black p-2 rounded-md
    border border-red-200 dark:border-red-900
  `.trim();

  const loaderContainerStyles = `
    flex items-center justify-center h-full w-full bg-white dark:bg-black
  `.trim();

  const loaderTextStyles = `
    text-black dark:text-gray-300 font-medium
  `.trim();

  const pdfContainerStyles = `
    w-full h-full bg-gray-100 dark:bg-black
    border-t-2 border-black dark:border-gray-800
  `.trim();

  const errorContainerStyles = `
    flex items-center justify-center h-full w-full 
    bg-white dark:bg-black
    border-t-2 border-black dark:border-gray-800
  `.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={dialogContentStyles}>
        <DialogHeader className={dialogHeaderStyles}>
          <DialogTitle className={dialogTitleStyles}>
            Rajiv Wallace Resume
          </DialogTitle>
          <div className="flex items-center mr-8">
            <Button
              onClick={handleDownload}
              className={buttonStyles}
              disabled={isLoading}
            >
              <Download className="h-4 w-4" />
              {isLoading ? "Downloading..." : "Download PDF"}
            </Button>
          </div>
        </DialogHeader>

        {error && <div className={errorStyles}>{error}</div>}

        <div className="flex-1 w-full h-full min-h-[60vh]">
          {isLoading ? (
            <div className={loaderContainerStyles}>
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black dark:border-gray-300 mb-2"></div>
                <p className={loaderTextStyles}>Loading PDF...</p>
              </div>
            </div>
          ) : pdfBlob ? (
            <div className={pdfContainerStyles}>
              <embed
                src={pdfBlob}
                type="application/pdf"
                className="w-full h-full"
              />
            </div>
          ) : error ? (
            <div className={errorContainerStyles}>
              <p className="text-red-600 dark:text-red-400">
                Failed to load PDF. Please try downloading instead.
              </p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeModal;
