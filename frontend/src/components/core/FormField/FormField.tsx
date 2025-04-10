import { FormControl, FormLabel, Input, FormHelperText } from '@mui/joy'
import { FieldValues, Path, Control, FieldError, Controller } from 'react-hook-form'

interface FormFieldProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    label: string
    placeholder?: string
    type?: string
    size?: "md" | "sm" | "lg"
    fullWidht?: boolean
    disabled?: boolean
    readonly?: boolean
    error?: FieldError
    transform?: (value: any) => any
}

const FormField = <T extends FieldValues>({
    name,
    control,
    label,
    placeholder,
    type = 'text',
    size = 'md',
    fullWidht = false,
    disabled = false,
    readonly = false,
    error,
    transform
}: FormFieldProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, ...field } }) => (
                <FormControl error={!!error} sx={{ mb: 2, width: fullWidht ? '100%' : 'auto' }}>
                    <FormLabel>{label}</FormLabel>
                    <Input
                        {...field}
                        type={type}
                        placeholder={placeholder}
                        size={size}
                        fullWidth={fullWidht}
                        disabled={disabled}
                        readOnly={readonly}
                        onChange={(e) => {
                            const value = e.target.value
                            // Aplicar transformación si existe
                            const transformedValue = transform ? transform(value) : value
                            onChange(transformedValue)
                        }}
                    />
                    <FormHelperText>{error && 
                        (error.message)}
                    </FormHelperText>
                </FormControl>
            )}
        />
    )
}

export default FormField