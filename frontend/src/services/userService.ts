import AxiosInstance from '../helpers/AxiosInstance';

export const getUsers = async () => {
  const response = await AxiosInstance.get('/api/users/users/');
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await AxiosInstance.delete(`/api/users/users/${id}/`);
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await AxiosInstance.post('/api/users/users/', userData);
  return response.data;
};

export const updateUser = async (id: string, userData: any) => {
  const response = await AxiosInstance.put(`/api/users/users/${id}/`, userData);
  return response.data;
};