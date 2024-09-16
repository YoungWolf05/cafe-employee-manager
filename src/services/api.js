import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000', // Use environment variable or default to localhost:4000
  headers: {
    'Content-Type': 'application/json',
  },
});
const versionOne = 'api/v1';
export const fetchCafes = () => apiClient.get(`${versionOne}/cafes`);
export const addCafe = (data) => apiClient.post(`${versionOne}/cafes`, data);
export const updateCafe = (id, data) => apiClient.put(`${versionOne}/cafes/${id}`, data);
export const deleteCafe = (id) => apiClient.delete(`${versionOne}/cafes/${id}`);
export const fetchEmployees = () => apiClient.get(`${versionOne}/employees`);
export const fetchEmployeesByCafe = (cafe) => apiClient.get(`${versionOne}/employees?cafe=${cafe}`);
export const addEmployee = (data) => apiClient.post(`${versionOne}/employees`, data);
export const updateEmployee = (id, data) => apiClient.put(`${versionOne}/employees/${id}`, data);
export const deleteEmployee = (id) => apiClient.delete(`${versionOne}/employees/${id}`);

export const fetchCafeById = async (id) => {
  const response = await apiClient.get(`${versionOne}/cafes/${id}`);
  return response.data;
};

export const fetchEmployeeById = async (id) => {
  const response = await apiClient.get(`${versionOne}/employees/${id}`);
  return response.data;
};