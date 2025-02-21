import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/";

export const login = async (username, password) => {
  try {
    // Adjust the payload to use username
    const response = await axios.post(`${API_URL}token/`, { username, password });
    localStorage.setItem("token", response.data.access);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const scanFile = async (file) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_URL}scan/`, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error scanning file:", error);
    return { status: "error", message: "Scan failed" };
  }
};

export const getScanResult = async (taskId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}results/${taskId}/`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching result:", error);
    return { status: "error", message: "Failed to fetch results" };
  }
};
