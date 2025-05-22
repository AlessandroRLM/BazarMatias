import { FormControl, FormLabel, Select, Option, FormHelperText } from "@mui/joy";
import { Controller, FieldValues, Path, Control, FieldError } from "react-hook-form";

// Definición de la interfaz para las opciones del select
export interface SelectOption {
  value: string;
  label: string;
}

// Props para el componente FormSelect
interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  size?: "md" | "sm" | "lg";
  disabled?: boolean;
  fullWidth?: boolean;
  error?: FieldError;
  onChange?: (value: any) => void
}

const FormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Seleccione una opción",
  options,
  size = "md",
  disabled = false,
  fullWidth = false,
  error,
  onChange
}: FormSelectProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange: fieldOnChange, value, ...field } }) => (
        <FormControl
          error={!!error}
          sx={{ mb: 2, width: fullWidth ? "100%" : "auto" }}
        >
          <FormLabel>{label}</FormLabel>
          <Select
            {...field}
            value={value || ""}
            onChange={(e, newValue) => {
              // Primero actualizamos el estado del formulario
              fieldOnChange(newValue);
              
              // Luego ejecutamos el manejador personalizado si existe
              if (onChange) {
                onChange(newValue);
              }
            }}
            size={size}
            disabled={disabled}
            placeholder={placeholder}
          >
            {options.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          <FormHelperText>{error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default FormSelect;