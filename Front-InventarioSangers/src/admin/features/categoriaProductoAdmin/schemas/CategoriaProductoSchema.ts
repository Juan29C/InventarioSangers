import { z } from 'zod';

export const categoriaProductoSchema = z.object({
    nombre_categoria: z
        .string()
        .min(1, 'El nombre de la categoría es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
});

export type CategoriaProductoFormData = z.infer<typeof categoriaProductoSchema>;
