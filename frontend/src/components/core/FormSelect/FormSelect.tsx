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
  label: string;
  placeholder?: string;
  options: SelectOption[];
  size?: "md" | "sm" | "lg";
  disabled?: boolean;
  fullWidht?: boolean;
  error?: FieldError;
}

const FormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Seleccione una opción",
  options,
  size = "md",
  disabled = false,
  fullWidht = false,
  error,
}: FormSelectProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ...field } }) => (
        <FormControl
          error={!!error}
          sx={{ mb: 2, width: fullWidht ? "100%" : "auto" }}
        >
          <FormLabel>{label}</FormLabel>
          <Select
            {...field}
            value={value || ""}
            onChange={(e, newValue) => onChange(newValue)}
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