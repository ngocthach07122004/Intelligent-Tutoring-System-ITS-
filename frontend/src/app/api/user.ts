import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1/user";

export const getAuthenticatedInfo = async () => {
  // TODO: Remove this mock when backend is ready
  // Mock response for development
  const mockResponse = {
    status: 200,
    data: {
      id: "1",
      name: "Nguyễn Thị Minh Anh",
      email: "minhanh.nguyen@student.edu.vn",
      role: "student"
    }
  };
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockResponse;
  
  /* 
  // Original API call - uncomment when backend is ready
  try {
    const response = await axios.get(`${BASE_URL}/me`, {
      withCredentials: true,
    });
    return { status: response.status, data: response.data }; // Return status and data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch user info");
  }
  */
};
