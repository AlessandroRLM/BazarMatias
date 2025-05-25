import { z } from "zod";

export const clientCreationSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  rut: z.string().min(8, "El RUT debe tener al menos 8 caracteres"),
  email: z.string().email("Ingrese un correo electrónico válido"),
  phone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos")
});

export type UserCreationFormValues = z.infer<typeof clientCreationSchema>;