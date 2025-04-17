import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '../../core/FormField/FormField';
import { Button, Box } from '@mui/joy';
import { changePasswordFormSchema, ChangePasswordFormValues, defaultValues } from '../../../schemas/administracion/changePasswordFormSchema'
import AxiosInstance from "../../../helpers/AxiosInstance";

const ChangePasswordForm = () => {
  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    mode: 'onBlur',
    defaultValues: defaultValues
  });

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (data) => {
    try {
      await AxiosInstance.post("/api/users/change-password/", {
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      alert("Contraseña cambiada con éxito!");
    } catch (error) {
      alert("Error al cambiar la contraseña");
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name='password'
          control={control}
          label='Contraseña'
          placeholder='Contraseña'
          type='password'
          fullWidht={true}
          error={errors.password}
        />
        <FormField
          name='confirmPassword'
          control={control}
          label='Confirmar Contraseña'
          placeholder='Confirmar Contraseña'
          type='password'
          fullWidht={true}
          error={errors.confirmPassword}
        /> 
        <Button 
          type='submit'
          variant='solid' 
          size='lg'
          fullWidth
          sx={{ mt: 2 }}
        >
          Confirmar
        </Button>
      </form>
    </Box>
  );
};

export default ChangePasswordForm;