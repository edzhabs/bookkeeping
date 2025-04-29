import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RemarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remarks: string) => void;
  title: string;
  description: string;
  actionLabel: string;
  actionVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export function RemarksModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionLabel,
  actionVariant = "default",
}: RemarksModalProps) {
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!remarks.trim()) {
      setError("Please provide a reason");
      return;
    }

    if (remarks.trim().length < 3) {
      setError("Please provide a more detailed reason");
      return;
    }

    onConfirm(remarks);
    setRemarks("");
    setError("");
  };

  const handleClose = () => {
    setRemarks("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="remarks" className="font-medium">
              Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
                if (e.target.value.trim()) {
                  setError("");
                }
              }}
              placeholder="Please provide a detailed reason"
              className="min-h-[100px]"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant={actionVariant} onClick={handleConfirm}>
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
