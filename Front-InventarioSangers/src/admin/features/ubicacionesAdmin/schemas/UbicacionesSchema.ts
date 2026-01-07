import { z } from 'zod';

export const ubicacionSchema = z.object({
    nombre_ubicacion: z
        .string()
        .min(1, 'El nombre de la ubicación es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
});

export type UbicacionFormData = z.infer<typeof ubicacionSchema>;
