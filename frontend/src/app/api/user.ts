import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1/user";

export const getAuthenticatedInfo = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/me`, {
      withCredentials: true,
    });
    return { status: response.status, data: response.data }; // Return status and data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch user info");
  }
};
