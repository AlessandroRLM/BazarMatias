import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress } from "@mui/joy";
import { useState } from "react";

import { userCreationSchema, UserCreationFormValues } from "../../../schemas/administracion/userCreationSchema";
import FormField from "../../core/FormField/FormField";
import FormSelect from "../../core/FormSelect/FormSelect";

// Definimos los posibles modos del formulario
type FormMode = 'create' | 'edit' | 'view';

interface FormUserCreationProps {
  mode?: FormMode; // Nuevo prop para controlar el modo
  disableRole?: boolean;
  disableRut?: boolean;
  initialValues?: Partial<UserCreationFormValues>;
  onSubmitForm: (data: UserCreationFormValues) => Promise<void>;
}

const FormUserCreation = ({ 
  mode = 'create', // Valor por defecto: modo creación
  disableRole = false,
  disableRut = false,
  initialValues, 
  onSubmitForm 
}: FormUserCreationProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<UserCreationFormValues>({
    resolver: zodResolver(userCreationSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      lastName: "",
      rut: "",
      email: "",
      role: "",
      ...initialValues,
    },
  });

  // Determina si un campo debe estar deshabilitado
  const isFieldDisabled = (fieldName: keyof UserCreationFormValues) => {
    if (isSubmitting) return true;
    if (mode === 'view') return true;
    
    switch(fieldName) {
      case 'rut': return disableRut || mode === 'edit';
      case 'role': return disableRole;
      default: return false;
    }
  };

  const onSubmit: SubmitHandler<UserCreationFormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);
      
      await onSubmitForm(data);
      
      setSubmitSuccess(true);
      if (mode === 'create') {
        reset(); // Reset solo para creación de usuarios
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Ocurrió un error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "70%",
        margin: "auto",
        gap: "1rem",
      }}
    >
      <FormField
        name="name"
        control={control}
        label="Nombre"
        placeholder="Nombre"
        size="lg"
        fullWidht={true}
        error={errors.name}
        disabled={isFieldDisabled('name')}
        readonly={mode === 'view'}
      />
      <FormField
        name="lastName"
        control={control}
        label="Apellido"
        placeholder="Apellido"
        size="lg"
        fullWidht={true}
        error={errors.lastName}
        disabled={isFieldDisabled('lastName')}
        readonly={mode === 'view'}
      />
      <FormField
        name="rut"
        control={control}
        label="Rut"
        placeholder="Rut"
        size="lg"
        fullWidht={true}
        error={errors.rut}
        disabled={isFieldDisabled('rut')}
        readonly={mode === 'view' || mode === 'edit'}
      />
      <FormField
        name="email"
        control={control}
        label="Correo"
        placeholder="Correo electrónico"
        type="email"
        size="lg"
        fullWidht={true}
        error={errors.email}
        disabled={isFieldDisabled('email')}
        readonly={mode === 'view'}
      />
      <FormSelect
        name="role"
        control={control}
        label="Cargo"
        size="lg"
        fullWidht={true}
        error={errors.role}
        disabled={isFieldDisabled('role')}
        options={[
          { value: "Admin", label: "Administrador" },
          { value: "Usuario", label: "Usuario" },
          { value: "Supervisor", label: "Supervisor" },
        ]}
      />

      {submitError && (
        <div style={{ color: "red", margin: "0.5rem 0" }}>
          {submitError}
        </div>
      )}

      {submitSuccess && (
        <div style={{ color: "green", margin: "0.5rem 0" }}>
          {mode === 'edit' ? "¡Cambios guardados con éxito!" : "¡Usuario creado con éxito!"}
        </div>
      )}

      {mode !== 'view' && (
        <Button 
          type="submit"
          variant="solid"
          size="lg"
          disabled={isSubmitting}
          endDecorator={isSubmitting ? <CircularProgress size="sm" /> : null}
        >
          {mode === 'edit' ? "Guardar Cambios" : "Crear Usuario"}
        </Button>
      )}
    </form>
  );
};

export default FormUserCreation;