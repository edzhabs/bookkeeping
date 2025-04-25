import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Student from "@/entities/student";
import { formatBirthDate, formatDate, getInitials } from "@/utils";
import {
  Briefcase,
  Calendar,
  GraduationCap,
  History,
  MapPin,
  Mars,
  Phone,
  User,
  Users,
  Venus,
} from "lucide-react";
import activityLogs from "../../../test_data/activity_logs";

interface Props {
  data: Student;
  setSelectedStudent: (student: Student | null) => void;
}

const StudentDetailPage = ({ data: student, setSelectedStudent }: Props) => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Student Details
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none cursor-pointer"
          >
            Edit
          </Button>
          <Button
            className="flex-1 sm:flex-none cursor-pointer"
            onClick={() => setSelectedStudent(null)}
          >
            Back to List
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Profile Card */}
        <Card className="lg:col-span-1 h-auto">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {getInitials(student.first_name, student.last_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl break-words">
                {student.full_name}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Separator />

              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  {student.gender === "male" ? (
                    <Mars className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  ) : (
                    <Venus className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  )}
                  <div>
                    <span className="text-muted-foreground">Gender:</span>
                    <p className="break-words capitalize">{student.gender}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Birthdate:</span>
                    <p className="break-words">
                      {formatBirthDate(student.birthdate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Address:</span>
                    <p className="break-words">{student.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Contact:</span>
                    {student.contact_numbers.map((num) => (
                      <ul key={num}>{num}</ul>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <Users className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Living with:</span>
                    <p className="break-words capitalize">
                      {student.living_with}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Detailed Information</CardTitle>
            <CardDescription>
              Complete student and family information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <div className="overflow-x-auto pb-2">
                <TabsList className="w-full min-w-fit flex flex-nowrap">
                  <TabsTrigger value="personal" className="flex-1">
                    Personal Info
                  </TabsTrigger>
                  <TabsTrigger value="family" className="flex-1">
                    Family Info
                  </TabsTrigger>
                  <TabsTrigger value="logs" className="flex-1">
                    Activity Logs
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="personal" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      First Name
                    </h3>
                    <p className="break-words">{student.first_name}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Middle Name
                    </h3>
                    <p className="break-words">{student.middle_name}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Last Name
                    </h3>
                    <p className="break-words">{student.last_name}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Suffix
                    </h3>
                    <p>{student.suffix || "-"}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Gender
                    </h3>
                    <p className="capitalize">{student.gender}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Age
                    </h3>
                    <p>{student.Age} years old</p>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Address
                    </h3>
                    <p className="break-words">{student.address}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="family" className="space-y-6 pt-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Mother's Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Name
                        </h4>
                      </div>
                      <p className="break-words">
                        {student.mother_name || "-"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Occupation
                        </h4>
                      </div>
                      <p className="break-words">
                        {student.mother_occupation || "-"}
                      </p>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Educational Attainment
                        </h4>
                      </div>
                      <p className="break-words">
                        {student.mother_education_attain || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Father's Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Name
                        </h4>
                      </div>
                      <p className="break-words">
                        {student.father_name || "-"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Occupation
                        </h4>
                      </div>
                      <p className="break-words">
                        {student.father_occupation || "-"}
                      </p>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Educational Attainment
                        </h4>
                      </div>
                      <p className="break-words">
                        {student.father_education_attain || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Living Arrangement
                  </h3>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <p className="capitalize">{student.living_with || "-"}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="logs" className="pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Activity History
                    </CardTitle>
                    <CardDescription>
                      Record of all changes and activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-4">
                        {activityLogs.map((log, index) => (
                          <div key={index} className="relative pl-6 pb-4">
                            {index !== activityLogs.length - 1 && (
                              <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-muted" />
                            )}
                            <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-primary" />
                            <div className="space-y-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span className="font-medium">
                                  {log.action}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  by{" "}
                                  <span className="font-medium">
                                    {log.user}
                                  </span>
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(log.timestamp)}
                              </p>
                              <p className="text-sm mt-1">{log.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDetailPage;
