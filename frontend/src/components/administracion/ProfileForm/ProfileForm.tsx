import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { userProfileFormSchema, UserProfileFormValues,  } from '../../../schemas/administracion/userProfileFormSchema'
import useUserProfileFormContext from '../../../hooks/administracion/useUserProfileFormContext'
import FormField from '../../core/FormField/FormField'
import { Button } from '@mui/joy'
import FormSelect from '../../core/FormSelect/FormSelect'



const ProfileForm = () => {
    const {isEditMode, setIsEditMode} = useUserProfileFormContext()
    const { control, handleSubmit, formState: {errors} } = useForm<UserProfileFormValues>({
        resolver: zodResolver(userProfileFormSchema),
        mode: 'onBlur'
    })

    const onSubmit: SubmitHandler<UserProfileFormValues> = (data) => {
        console.log(data)
        setIsEditMode(!isEditMode)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <FormField
                name='firstName'
                control={control}
                label='Nombre'
                placeholder='Nombre'
                readonly={!isEditMode}
                error={errors.firstName}
                
            />
            <FormField
                name='lastName'
                control={control}
                label='Apellido'
                placeholder='Apellido'
                readonly={!isEditMode}
                error={errors.lastName} 
            />
            <FormField
                name='nationalId'
                control={control}
                label='Rut'
                placeholder='Rut'
                readonly={!isEditMode}
                error={errors.nationalId} 
            />
            <FormField
                name='email'
                control={control}
                label='Correo'
                placeholder='Correo'
                readonly={!isEditMode}
                error={errors.email} 
            />
            <FormSelect
                name='position'
                control={control}
                label='Cargo'
                disabled={!isEditMode}
                error={errors.position}
                options={[
                    {value: 'admin', label: 'Administrador'},
                    {value: 'seller', label: 'Vendedor'}
                ]}
            />
            <Button type='submitt' variant='solid' size='lg'>Confirmar</Button>
        </form>
    )
}

export default ProfileForm