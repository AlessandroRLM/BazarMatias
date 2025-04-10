import { Controller, Control, FieldValues, Path, FieldError } from 'react-hook-form';
import { FormControl, FormLabel, FormHelperText, Select, Option } from '@mui/joy';

// Definición de la interfaz para las opciones del select
export interface SelectOption {
    value: string;
    label: string;
}

// Props para el componente FormSelect
interface FormSelectProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label: string;
    placeholder?: string;
    options: SelectOption[];
    size?: "md" | "sm" | "lg"
    disabled?: boolean
    fullWidht?: boolean
    error?: FieldError;
    transform?: (value: any) => any;
}

// Componente reutilizable para los campos select del formulario
const FormSelect = <T extends FieldValues>({
    name,
    control,
    label,
    placeholder = 'Seleccione una opción',
    options,
    size = 'md',
    disabled = false,
    fullWidht = false,
    error,
    transform
}: FormSelectProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, ...field } }) => (
                <FormControl error={!!error} sx={{ mb: 2, width: fullWidht ? '100%' :'auto' }}>
                    <FormLabel>{label}</FormLabel>
                    <Select
                        {...field}
                        size={size}
                        disabled={disabled}
                        placeholder={placeholder}
                        onChange={(newValue) => {
                            // Aplicar transformación si existe
                            const transformedValue = transform ? transform(newValue) : newValue;
                            onChange(transformedValue);
                        }}                    >
                        {options.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                    <FormHelperText>{error && 
                        (error.message)}
                    </FormHelperText>
                </FormControl>
            )}
        />
    );
};

export default FormSelect;