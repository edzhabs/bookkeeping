import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import EnrollmentTabs from "@/components/Tabs/enrollment-tabs";

export default function NewEnrollmentPage() {
  const navigate = useNavigate();

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">New Enrollment</h1>
      </div>

      <EnrollmentTabs />
    </div>
  );
}
