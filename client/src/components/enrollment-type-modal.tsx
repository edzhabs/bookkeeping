"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EnrollmentTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnrollmentTypeModal({
  isOpen,
  onClose,
}: EnrollmentTypeModalProps) {
  const navigate = useNavigate();

  const handleNewStudent = () => {
    navigate("/enrollment/new");
    onClose();
  };

  const handleExistingStudent = () => {
    navigate("/enrollment/existing");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enrollment Type</DialogTitle>
          <DialogDescription>
            Choose whether you want to enroll a new student or an existing
            student for a new school year.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
          <Button
            onClick={handleNewStudent}
            className="flex h-24 flex-col items-center justify-center gap-2 p-4"
            variant="outline"
          >
            <UserPlus className="h-6 w-6" />
            <span className="text-sm font-medium">New Student</span>
          </Button>
          <Button
            onClick={handleExistingStudent}
            className="flex h-24 flex-col items-center justify-center gap-2 p-4"
            variant="outline"
          >
            <UserCheck className="h-6 w-6" />
            <span className="text-sm font-medium">Existing Student</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
