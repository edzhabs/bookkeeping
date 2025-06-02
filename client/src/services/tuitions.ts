import axiosClient from "./api-client";

export const fetchTuitions = async () => {
  try {
    const response = await axiosClient.get("/tuitions");
    return response.data;
  } catch (error) {
    console.error("Error fetching enrollment data", error);
    throw error;
  }
};
