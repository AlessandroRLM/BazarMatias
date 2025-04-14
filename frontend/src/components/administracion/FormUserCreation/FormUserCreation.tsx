import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button } from "@mui/joy";

import { userCreationSchema, UserCreationFormValues } from "../../../schemas/administracion/userCreationSchema";
import FormField from "../../core/FormField/FormField";
import FormSelect from "../../core/FormSelect/FormSelect";

// Agrega la propiedad isEditMode
interface FormUserCreationProps {
  isEditMode?: boolean;
}

const FormUserCreation = ({ isEditMode = false }: FormUserCreationProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm<UserCreationFormValues>({
    resolver: zodResolver(userCreationSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      lastName: "",
      rut: "",
      email: "",
      role: "", // Valor inicial vacío
    },
  });

  const onSubmit: SubmitHandler<UserCreationFormValues> = (data) => {
    alert(`Usuario ${isEditMode ? "editado" : "creado"}: ${data.name} ${data.lastName}, ${data.email}, ${data.role}`);
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
      />
      <FormField
        name="lastName"
        control={control}
        label="Apellido"
        placeholder="Apellido"
        size="lg"
        fullWidht={true}
        error={errors.lastName}
      />
      <FormField
        name="rut"
        control={control}
        label="Rut"
        placeholder="Rut"
        size="lg"
        fullWidht={true}
        error={errors.rut}
        disabled={isEditMode} // Deshabilita el campo si está en modo de edición
      />
      <FormField
        name="email"
        control={control}
        label="Correo"
        placeholder="Correo"
        type="email"
        size="lg"
        fullWidht={true}
        error={errors.email}
      />
      <FormSelect
        name="role"
        control={control}
        label="Cargo"
        size="lg"
        fullWidht={true}
        error={errors.role}
        options={[
          { value: "Admin", label: "Administrador" },
          { value: "Usuario", label: "Usuario" },
          { value: "Supervisor", label: "Supervisor" },
        ]}
      />
      <Button type="submit" variant="solid" size="lg">
        {isEditMode ? "Guardar Cambios" : "Crear Usuario"}
      </Button>
    </form>
  );
};

export default FormUserCreation;