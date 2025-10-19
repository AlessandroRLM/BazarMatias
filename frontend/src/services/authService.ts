import AxiosInstance from "../helpers/AxiosInstance" 
import { ResetPasswordConfirmSchemaType } from "../schemas/auth/ResetPasswordConfirmSchema"


export const requestPasswordReset = async (data: {email: string}) => {
  try {
    const response = await AxiosInstance.post('/api/auth/reset-password/', data )
    return response.data
  } catch (error) {
    throw error
  }
}

export const confirmPasswordReset = async (data: ResetPasswordConfirmSchemaType) => {
  try {
    const response = await AxiosInstance.post(
      '/api/auth/reset-password-confirm/', data
    )
    return response.data
  } catch (error) {
    throw error
  }
}