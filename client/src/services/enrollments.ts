import { EnrollNewStudent } from "@/types/enrollment";
import axiosClient from "./api-client";
import { AxiosError } from "axios";
import { APIerror } from "@/types/api";

export const fetchEnrollment = async () => {
  try {
    const response = await axiosClient.get("/enrollments");
    return response.data;
  } catch (error) {
    console.error("Error fetching enrollment data", error);
    throw error;
  }
};

export const enrollNewStudent = async (body: EnrollNewStudent) => {
  try {
    const response = await axiosClient.post("/enrollments", body);

    return response.data;
  } catch (err) {
    const error = err as AxiosError<APIerror>;

    if (
      error.response?.data.error === "student with that record already exist"
    ) {
      throw new Error(error.response.data.error);
    } else {
      console.error("Error enrolling new student", error);
      throw new Error("Something went wrong while enrolling the student");
    }
  }
};
