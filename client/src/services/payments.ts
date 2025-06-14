import { OtherPaymentBody } from "@/types/payment";
import axiosClient from "./api-client";
import { AxiosError } from "axios";
import { APIerror } from "@/types/api";
import { TuitionPaymentBody } from "@/types/tuition";

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
      console.error("Error tuition payment", error);
      throw new Error("Something went wrong while recording tuition payment");
    }
  }
};

export const payOtherPayment = async (body: OtherPaymentBody) => {
  try {
    const response = await axiosClient.post("/payments/other_payment", body);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<APIerror>;
    console.error(error);
    if (
      error.response?.data.error === "student with that record already exist"
    ) {
      throw new Error("O.R /Invoice Number already exist");
    } else {
      console.error("Error other payment", error);
      throw new Error("Something went wrong while recording other payment");
    }
  }
};

export const fetchTuitionPaymentsByID = async (
  enrollmentID: string | undefined
) => {
  try {
    const response = await axiosClient.get(
      `/payments/${enrollmentID}/tuitions`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    console.error("Error fetching student details data", error);
    throw error;
  }
};

export const fetchOtherPaymentsByID = async (
  enrollmentID: string | undefined
) => {
  try {
    const response = await axiosClient.get(
      `/payments/${enrollmentID}/other_payments`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    console.error("Error fetching student details data", error);
    throw error;
  }
};
