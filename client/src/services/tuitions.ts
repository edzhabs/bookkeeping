import { AxiosError } from "axios";
import axiosClient from "./api-client";
import { APIerror } from "@/types/api";
import { TuitionPaymentBody } from "@/types/tuition";

export const fetchTuitions = async () => {
  try {
    const response = await axiosClient.get("/tuitions");
    return response.data;
  } catch (error) {
    console.error("Error fetching tuition data", error);
    throw error;
  }
};

export const fetchTuitionDetails = async (enrollmentID: string | undefined) => {
  try {
    const response = await axiosClient.get("/tuitions/" + enrollmentID);
    return response.data;
  } catch (error) {
    console.log(error);
    console.error("Error fetching tuition details data", error);
    throw error;
  }
};

export const fetchTuitionsDropdown = async () => {
  try {
    const response = await axiosClient.get("/tuitions/dropdown");
    return response.data;
  } catch (error) {
    console.error("Error fetching tuitions dropdown data", error);
    throw error;
  }
};

export const payTuition = async (body: TuitionPaymentBody) => {
  try {
    const response = await axiosClient.post("/payments/tuition", body);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<APIerror>;
    console.error(error);
    if (
      error.response?.data.error === "student with that record already exist"
    ) {
      throw new Error("O.R /Invoice Number already exist");
    } else {
      console.error("Error enrolling new student", error);
      throw new Error("Something went wrong while enrolling the student");
    }
  }
};
