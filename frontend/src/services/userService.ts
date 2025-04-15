import AxiosInstance from '../helpers/AxiosInstance';

export const getUsers = async () => {
  const response = await AxiosInstance.get('/api/users/');
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await AxiosInstance.delete(`/api/users/${id}/`);
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await AxiosInstance.post('/api/users/', userData);
  return response.data;
};

export const updateUser = async (id: string, userData: any) => {
  const response = await AxiosInstance.put(`/api/users/${id}/`, userData);
  return response.data;
};