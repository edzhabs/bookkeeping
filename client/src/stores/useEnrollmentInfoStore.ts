import { EnrollmentStore } from "@/types/enrollment";
import { create } from "zustand";

interface StudentInfo {
  enrollmentInfo: EnrollmentStore | null;
  setEnrollmentInfo: (data: EnrollmentStore | null) => void;
}

const useEnrollmentInfoStore = create<StudentInfo>((set) => ({
  enrollmentInfo: {
    enrollment_id: "",
    student_id: "",
    grade_level: "",
    school_year: "",
    total_tuition_amount_due: "",
    total_tuition_paid: "",
    tuition_balance: "",
  },
  setEnrollmentInfo: (data) => set({ enrollmentInfo: data }),
}));

export default useEnrollmentInfoStore;
