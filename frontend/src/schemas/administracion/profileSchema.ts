import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Debe ser un correo válido"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;