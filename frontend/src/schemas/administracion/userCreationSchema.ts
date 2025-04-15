import { z } from "zod";

// Esquema de validación para el formulario de creación de usuario
export const userCreationSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  rut: z.string().min(1, "El RUT es obligatorio"),
  email: z.string().email("Debe ser un correo válido"),
  role: z.string().min(1, "El cargo es obligatorio"),
});

// Tipos inferidos del esquema
export type UserCreationFormValues = z.infer<typeof userCreationSchema>;