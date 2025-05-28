import axiosClient from "./api-client";

export const fetchStudentsDropdown = async () => {
  try {
    const response = await axiosClient.get("/students/dropdown");
    return response.data;
  } catch (error) {
    console.error("Error fetching student details data", error);
    throw error;
  }
};
