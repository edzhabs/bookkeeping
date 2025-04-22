import { Button } from "@/components/ui/button";
import Student from "@/entities/student";

interface Props {
  data: Student;
  setSelectedStudent: (student: Student | null) => void;
}
const StudentDetailPage = ({ data: student, setSelectedStudent }: Props) => {
  console.log(student);
  return (
    <div>
      <Button
        onClick={() => setSelectedStudent(null)}
        variant={"secondary"}
        className="cursor-pointer"
      >
        back
      </Button>
      details
    </div>
  );
};

export default StudentDetailPage;
