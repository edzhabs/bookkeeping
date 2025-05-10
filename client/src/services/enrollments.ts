import axiosClient from "./api-client";

export const fetchEnrollment = async () => {
  try {
    const response = await axiosClient.get("/enrollments");
    return response.data;
  } catch (error) {
    console.error("Error fetching enrollment data", error);
    throw error;
  }
};
