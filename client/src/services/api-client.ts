import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  // baseURL: "http://localhost:5173/test_data",
  timeout: 5000, // Timeout in milliseconds
});

// const PUBLIC_ROUTES = ["/login", "/forgot-password"];

// axiosClient.interceptors.request.use(
//   (config) => {
//     const isPublicRoute = PUBLIC_ROUTES.some((route) =>
//       config.url?.includes(route)
//     );

//     if (!isPublicRoute) {
//       const token = localStorage.getItem("authToken");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }

//     return config;
//   },
//   (error) => {
//     // Handle request errors
//     console.error("Request Error:", error);
//     return Promise.reject(error);
//   }
// );

// axiosClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle response errors globally
//     if (error.response) {
//       const { status } = error.response;

//       if (status === 401) {
//         console.error("Unauthorized: Redirecting to login...");
//         window.location.href = "/login"; // Redirect to login page
//       }

//       if (status === 403) {
//         console.error("Forbidden: You do not have access to this resource.");
//         alert("You do not have access to this resource.");
//       }

//       // Handle other errors
//       console.error("Response Error:", error.response);
//     } else if (error.request) {
//       // No response received
//       console.error("No Response:", error.request);
//     } else {
//       // Other errors
//       console.error("Error:", error.message);
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosClient;
