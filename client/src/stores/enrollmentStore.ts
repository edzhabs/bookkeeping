import { EnrollmentTable } from "@/types/enrollment";
import { create } from "zustand";

interface EnrollmentState {
  enrollments: EnrollmentTable[];
  setEnrollments: (data: EnrollmentTable[]) => void;
}

const useEnrollmentStore = create<EnrollmentState>((set) => ({
  enrollments: [],
  setEnrollments: (data) => set({ enrollments: data }),
}));

export default useEnrollmentStore;
