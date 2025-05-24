import { FormControl, FormLabel, FormHelperText, Autocomplete, CircularProgress } from '@mui/joy'
import { FieldValues, Path, Control, FieldError, Controller } from 'react-hook-form'

export interface SelectOption {
    value: string;
    label: string;
}

interface AutocompleteFormFieldProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    label?: string
    placeholder?: string
    type?: string
    size?: "md" | "sm" | "lg"
    fullWidht?: boolean
    options: SelectOption[]
    disabled?: boolean
    readonly?: boolean
    error?: FieldError
    onChange?: (value: any) => any
    freeSolo?: boolean
    loading?: boolean
    onInputChange?: (event: React.SyntheticEvent, value: string) => void
    getOptionLabel?: (option: SelectOption) => string
}

const AutocompleteFormField = <T extends FieldValues>({
    name,
    control,
    label,
    placeholder,
    type = 'text',
    size = 'md',
    options,
    fullWidht = false,
    disabled = false,
    readonly = false,
    error,
    onChange,
    // Nuevas propiedades con valores por defecto
    freeSolo = false,
    loading = false,
    onInputChange,
    getOptionLabel = (option) => option.label,

}: AutocompleteFormFieldProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange: fieldOnChange, value: fieldValue, ...field } }) => {
                const selectedOption = options.find(option => option.value === fieldValue) || null
                return (
                    <FormControl error={!!error} sx={{ mb: 2, width: fullWidht ? '100%' : 'auto' }}>
                        <FormLabel>{label}</FormLabel>
                        <Autocomplete
                            {...field}
                            value={selectedOption}
                            type={type}
                            placeholder={placeholder}
                            size={size}
                            disabled={disabled}
                            readOnly={readonly}
                            options={options}
                            freeSolo={freeSolo}
                            onInputChange={onInputChange}
                            endDecorator={loading ? <CircularProgress size="sm" /> : null}
                            onChange={(_, newValue) => {
                                // Guardar solo el value del SelectOption
                                const newValueToStore = newValue ?
                                    (typeof newValue === 'string' ? newValue : newValue.value) :
                                    null;

                                fieldOnChange(newValueToStore);

                                if (onChange) {
                                    onChange(newValueToStore);
                                }
                            }}
                            getOptionLabel={(option) => {
                                if (typeof option === 'string') {
                                    return option;
                                }
                                return getOptionLabel(option);
                            }}
                        />
                        <FormHelperText>{error &&
                            (error.message)}
                        </FormHelperText>
                    </FormControl>
                )
            }}
        />
    )
}

export default AutocompleteFormField