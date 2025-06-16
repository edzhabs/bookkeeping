import axiosClient from "./api-client";

export const fetchTransactions = async () => {
  try {
    const response = await axiosClient.get("/transactions");
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions data", error);
    throw error;
  }
};
