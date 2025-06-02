import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress } from "@mui/joy";
import { useState, useEffect } from "react";

import { clientCreationSchema, UserCreationFormValues } from "../../schemas/clientes/clientCreationSchema";
import FormField from "../core/FormField/FormField";

type FormMode = 'create' | 'edit' | 'view';

interface FormUserCreationProps {
  mode?: FormMode;
  disableRut?: boolean;
  initialValues?: Partial<UserCreationFormValues>;
  onSubmitForm: (data: UserCreationFormValues) => Promise<void>;
  onSuccess?: () => void;
  onCancel?: () => void;
  submitSuccessExternal?: boolean;
  onSuccessReset?: () => void;
  successMessage?: string;
}

const FormUserCreation = ({ 
  mode = 'create',
  disableRut = false,
  initialValues, 
  onSubmitForm,
  onSuccess,
  onCancel,
  submitSuccessExternal = false,
  onSuccessReset = () => {},
  successMessage
}: FormUserCreationProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<UserCreationFormValues>({
    resolver: zodResolver(clientCreationSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      lastName: "",
      rut: "",
      email: "",
      phone: "",
      ...initialValues,
    },
  });

  useEffect(() => {
    if (submitSuccessExternal) {
      setSubmitSuccess(true);
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
        onSuccessReset();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [submitSuccessExternal, onSuccessReset]);

  const isFieldDisabled = (fieldName: keyof UserCreationFormValues) => {
    if (isSubmitting) return true;
    if (mode === 'view') return true;
    
    switch(fieldName) {
      case 'rut': return disableRut || mode === 'edit';
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
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
      
      if (mode === 'create') {
        reset();
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
        fullWidth={true}
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
        fullWidth={true}
        error={errors.lastName}
        disabled={isFieldDisabled('lastName')}
        readonly={mode === 'view'}
      />
      <FormField
        name="rut"
        control={control}
        label="RUT"
        placeholder="Ej: 12.345.678-9"
        size="lg"
        fullWidth={true}
        error={errors.rut}
        disabled={isFieldDisabled('rut')}
        readonly={mode === 'view' || mode === 'edit'}
      />
      <FormField
        name="email"
        control={control}
        label="Correo Electrónico"
        placeholder="correo@ejemplo.com"
        type="email"
        size="lg"
        fullWidth={true}
        error={errors.email}
        disabled={isFieldDisabled('email')}
        readonly={mode === 'view'}
      />
      <FormField
        name="phone"
        control={control}
        label="Teléfono"
        placeholder="+56912345678"
        size="lg"
        fullWidth={true}
        error={errors.phone}
        disabled={isFieldDisabled('phone')}
        readonly={mode === 'view'}
      />

      {submitError && (
        <div style={{ color: "red", margin: "0.5rem 0" }}>
          {submitError}
        </div>
      )}

      {submitSuccess && (
        <div style={{ color: "green", margin: "0.5rem 0" }}>
          {successMessage || (mode === 'edit' ? "¡Cambios guardados con éxito!" : "¡Cliente creado con éxito!")}
        </div>
      )}

      {mode !== 'view' && (
        <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center' }}>
          <Button 
            type="submit"
            variant="solid"
            size="lg"
            disabled={isSubmitting}
            endDecorator={isSubmitting ? <CircularProgress size="sm" /> : null}
            sx={{ flex: 1 }}
          >
            {mode === 'edit' ? "Guardar Cambios" : "Crear Cliente"}
          </Button>
          
          {onCancel && (
            <Button 
              variant="outlined"
              size="lg"
              onClick={onCancel}
              disabled={isSubmitting}
              sx={{ flex: 1 }}
            >
              Cancelar
            </Button>
          )}
        </div>
      )}
    </form>
  );
};

export default FormUserCreation;