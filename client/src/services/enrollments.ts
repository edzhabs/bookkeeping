import { EnrollStudent } from "@/types/enrollment";
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

export const enrollStudent = async (
  body: EnrollStudent | null,
  enrollmentID?: string
) => {
  try {
    let response;
    if (enrollmentID) {
      response = await axiosClient.patch(`/enrollments/${enrollmentID}`, body);
    } else {
      if (body?.type === "new") {
        response = await axiosClient.post("/enrollments/new", body);
      }
      if (body?.type === "old") {
        response = await axiosClient.post("/enrollments/existing", body);
      }
    }

    return response?.data;
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

export const deleteEnrollment = async (enrollmentID: string | undefined) => {
  try {
    const response = await axiosClient.delete("/enrollments/" + enrollmentID);

    return response.status;
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

export const fetchEnrollmentDetails = async (
  enrollmentID: string | undefined
) => {
  try {
    const response = await axiosClient.get("/enrollments/" + enrollmentID);
    return response.data;
  } catch (error) {
    console.log(error);
    console.error("Error fetching student details data", error);
    throw error;
  }
};

export const fetchEditEnrollmentDetails = async (
  enrollmentID: string | undefined
) => {
  try {
    const response = await axiosClient.get(`/enrollments/${enrollmentID}/edit`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student details data", error);
    throw error;
  }
};
