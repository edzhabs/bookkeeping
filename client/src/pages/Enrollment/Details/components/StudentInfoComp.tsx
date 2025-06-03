import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { StudentEnrollmentDetails } from "@/types/enrollment";
import { formatFullName, formatBirthDate, displayDiscounts } from "@/utils";

const StudentInfoComp = ({
  enrollment,
}: {
  enrollment: StudentEnrollmentDetails;
}) => {
  return (
    <TabsContent value="details" className="space-y-4 pt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">
                Personal Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-sm text-slate-600 capitalize">
                    {formatFullName(enrollment.student)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Gender</p>
                  <p className="text-sm text-slate-600 capitalize">
                    {enrollment.student.gender}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Birthdate</p>
                  <p className="text-sm text-slate-600">
                    {formatBirthDate(enrollment.student.birthdate || "")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Living With</p>
                  <p className="text-sm text-slate-600">
                    {enrollment.student.living_with || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">
                Academic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">School Year</p>
                  <p className="text-sm text-slate-600">
                    {enrollment.school_year}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Grade Level</p>
                  <p className="text-sm text-slate-600 capitalize">
                    {enrollment.grade_level}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Discount</p>
                  <p className="text-sm text-slate-600">
                    {displayDiscounts(enrollment.discount_types)}{" "}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-slate-600 capitalize">
                    {enrollment.type || "New"} Student
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-500 mb-2">
              Contact Information
            </h3>
            <div className="space-y-3 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Contact Numbers</p>
                {enrollment.student.contact_numbers &&
                enrollment.student.contact_numbers.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
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
                ) : (
                  <p className="text-sm text-slate-600">
                    No contact numbers provided
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-slate-600">
                  {enrollment.student.address}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">
              Parents Information
            </h3>
            <h3 className="text-sm font-medium text-slate-500">Father</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-slate-600 capitalize">
                  {enrollment.student.father_name || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Occupation</p>
                <p className="text-sm text-slate-600 capitalize">
                  {enrollment.student.father_job || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Education</p>
                <p className="text-sm text-slate-600 capitalize">
                  {enrollment.student.father_education || "Not specified"}
                </p>
              </div>
            </div>

            <h3 className="mt-3 text-sm font-medium text-slate-600">Mother</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-slate-600 capitalize">
                  {enrollment.student.mother_name || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Occupation</p>
                <p className="text-sm text-slate-600 capitalize">
                  {enrollment.student.mother_job || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Education</p>
                <p className="text-sm text-slate-600 capitalize">
                  {enrollment.student.mother_education || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default StudentInfoComp;
