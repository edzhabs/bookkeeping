import axiosClient from "./api-client";

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
