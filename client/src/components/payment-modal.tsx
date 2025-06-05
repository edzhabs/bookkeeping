import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Receipt } from "lucide-react";

interface PaymentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTuition: () => void;
  onSelectOther: () => void;
  studentName: string;
}

export function PaymentSelectionModal({
  isOpen,
  onClose,
  onSelectTuition,
  onSelectOther,
  studentName,
}: PaymentSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Payment Type</DialogTitle>
          <DialogDescription>
            Choose the type of payment you want to make for {studentName}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={onSelectTuition}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Pay Tuition</CardTitle>
                  <CardDescription>Make tuition fee payments</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={onSelectTuition}
              >
                Select Tuition Payment
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={onSelectOther}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Receipt className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Other Payment</CardTitle>
                  <CardDescription>
                    Pay for books, uniforms, fees, etc.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                variant="outline"
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                onClick={onSelectOther}
              >
                Select Other Payment
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
