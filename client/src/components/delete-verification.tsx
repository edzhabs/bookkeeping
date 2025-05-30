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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Shield } from "lucide-react";

interface DeleteVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  verificationText: string;
  verificationLabel: string;
  placeholder?: string;
}

export function DeleteVerification({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  verificationText,
  verificationLabel,
  placeholder = "Enter to confirm",
}: DeleteVerificationProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (inputValue.trim().toLowerCase() !== verificationText.toLowerCase()) {
      setError(`Please enter "${verificationText}" exactly as shown`);
      return;
    }

    setError("");
    setInputValue("");
    onConfirm();
  };

  const handleClose = () => {
    setInputValue("");
    setError("");
    onClose();
  };

  const isValid =
    inputValue.trim().toLowerCase() === verificationText.toLowerCase();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Shield className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <span className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-800">{description}</span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="verification-input" className="text-sm font-medium">
              {verificationLabel}
            </Label>
            <div className="space-y-1">
              <div className="p-2 bg-slate-100 border rounded-md">
                <code className="text-sm font-mono text-slate-800">
                  {verificationText}
                </code>
              </div>
              <Input
                id="verification-input"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (error) setError("");
                }}
                placeholder={placeholder}
                className={`${
                  error ? "border-red-500 focus:border-red-500" : ""
                } ${isValid ? "border-green-500 focus:border-green-500" : ""}`}
                autoComplete="off"
                autoFocus
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isValid}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
