import { z } from 'zod';

export const tipoSchema = z.object({
    nombre_tipo: z
        .string()
        .min(1, 'El nombre del tipo es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
    activo: z.boolean().default(true),
});

export type TipoFormData = z.infer<typeof tipoSchema>;
