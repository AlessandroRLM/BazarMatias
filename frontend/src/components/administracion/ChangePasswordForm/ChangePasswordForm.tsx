import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FormField from '../../core/FormField/FormField'
import { Button } from '@mui/joy'
import { changePasswordFormSchema, ChangePasswordFormValues, defaultValues } from '../../../schemas/administracion/changePasswordFormSchema'
import AxiosInstance from "../../../helpers/AxiosInstance";


const ProfileForm = () => {
    
    const { control, handleSubmit, formState: {errors} } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordFormSchema),
        mode: 'onBlur',
        defaultValues: defaultValues
    })

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
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70%'}}>
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
            <Button type='submitt' variant='solid' size='lg'>Confirmar</Button>
        </form>
    )
}

export default ProfileForm