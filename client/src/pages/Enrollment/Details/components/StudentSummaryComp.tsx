import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StudentEnrollmentDetails } from "@/types/enrollment";
import { displayDiscounts, formatBirthDate, formatFullName } from "@/utils";
import {
  BookOpen,
  CalendarIcon,
  GraduationCap,
  MapPin,
  Phone,
  Users,
} from "lucide-react";

const StudentSummaryComp = ({
  enrollment,
}: {
  enrollment: StudentEnrollmentDetails;
}) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800 capitalize">
              {formatFullName(enrollment.student)}
            </CardTitle>
            <CardDescription className="text-slate-500 mt-1 capitalize">
              {enrollment.grade_level} • {enrollment.school_year}
            </CardDescription>
          </div>
          <Badge
            variant={enrollment.type === "new" ? "default" : "secondary"}
            className="capitalize text-sm"
          >
            {enrollment.type === "new" ? "New Student" : "Old Student"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600">
              Born: {formatBirthDate(enrollment.student.birthdate || "")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600">
              Discount:{" "}
              {enrollment.discount_types.length > 0
                ? displayDiscounts(enrollment.discount_types)
                : "None"}{" "}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600 capitalize">
              Gender: {enrollment.student.gender}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600 capitalize">
              Living with: {enrollment.student.living_with || "-"}
            </span>
          </div>
          <div className="flex items-start gap-2 md:col-span-2">
            <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
            <span className="text-sm text-slate-600 capitalize">
              {enrollment.student.address}
            </span>
          </div>
          {enrollment.student.contact_numbers &&
            enrollment.student.contact_numbers.length > 0 && (
              <div className="flex items-start gap-2 md:col-span-2">
                <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
                <div className="flex flex-wrap gap-2">
                  {enrollment.student.contact_numbers.map((number, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-slate-600 hover:bg-slate-100"
                    >
                      {number}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentSummaryComp;
