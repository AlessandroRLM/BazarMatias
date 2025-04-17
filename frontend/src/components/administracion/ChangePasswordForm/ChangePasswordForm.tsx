import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '../../core/FormField/FormField';
import { Button, Box, Stack } from '@mui/joy';
import { changePasswordFormSchema, ChangePasswordFormValues, defaultValues } from '../../../schemas/administracion/changePasswordFormSchema'
import AxiosInstance from "../../../helpers/AxiosInstance";

interface ChangePasswordFormProps {
  onSuccess: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSuccess }) => {
  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    reset
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
      reset();
      onSuccess();
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
        p: 2,
        margin: '0 auto'
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
        
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button 
            type="button" 
            variant="outlined" 
            fullWidth
            onClick={onSuccess}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            variant="solid" 
            fullWidth
          >
            Confirmar
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ChangePasswordForm;