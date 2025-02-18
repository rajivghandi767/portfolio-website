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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-11/12 h-[80vh]">
        <DialogHeader className="flex flex-row items-center">
          <DialogTitle className="flex-1">Rajiv Wallace Resume</DialogTitle>
          <div className="flex items-center mr-8">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Download className="h-4 w-4" />
              {isLoading ? "Downloading..." : "Download PDF"}
            </Button>
          </div>
        </DialogHeader>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="flex-1 w-full h-full min-h-[60vh] bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading PDF...</p>
            </div>
          ) : pdfBlob ? (
            <embed
              src={pdfBlob}
              type="application/pdf"
              className="w-full h-full"
            />
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">
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
