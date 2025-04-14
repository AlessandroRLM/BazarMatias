import apiClient from '../utils/apiClient';

export const getUsers = async () => {
  const response = await apiClient.get('/users/');
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await apiClient.delete(`/users/${id}/`);
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await apiClient.post('/users/', userData);
  return response.data;
};

export const updateUser = async (id: string, userData: any) => {
  const response = await apiClient.put(`/users/${id}/`, userData);
  return response.data;
};