import { ResumeModalProps } from "../types";

// components/ResumeModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ResumeModal = ({ isOpen, onClose, pdfUrl }: ResumeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-11/12 h-[80vh]">
        <DialogHeader>
          <DialogTitle>Resume</DialogTitle>
        </DialogHeader>
        <div className="flex-1 w-full h-full min-h-[60vh]">
          <iframe
            src={`${pdfUrl}#toolbar=0`}
            className="w-full h-full border-none"
            title="Resume Preview"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeModal;
