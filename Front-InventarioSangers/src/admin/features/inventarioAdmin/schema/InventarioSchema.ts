import { z } from 'zod';

export const productoSchema = z.object({
    sku: z
        .string()
        .min(1, 'El SKU es requerido')
        .min(3, 'El SKU debe tener al menos 3 caracteres')
        .max(50, 'El SKU no puede exceder 50 caracteres')
        .regex(/^[A-Z0-9-]+$/, 'El SKU solo puede contener letras mayúsculas, números y guiones'),
    nombre: z
        .string()
        .min(1, 'El nombre del producto es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(200, 'El nombre no puede exceder 200 caracteres'),
    descripcion: z
        .string()
        .max(500, 'La descripción no puede exceder 500 caracteres')
        .optional()
        .or(z.literal('')),
    precio_compra: z
        .number({ message: 'El precio de compra debe ser un número' })
        .positive('El precio de compra debe ser mayor a 0')
        .max(999999.99, 'El precio de compra no puede exceder 999,999.99'),
    precio_venta_unitario: z
        .number({ message: 'El precio de venta debe ser un número' })
        .positive('El precio de venta debe ser mayor a 0')
        .max(999999.99, 'El precio de venta no puede exceder 999,999.99'),
    stock_minimo: z
        .number({ message: 'El stock mínimo debe ser un número' })
        .int('El stock mínimo debe ser un número entero')
        .nonnegative('El stock mínimo no puede ser negativo')
        .max(99999, 'El stock mínimo no puede exceder 99,999'),
    id_categoria: z
        .number({ message: 'Debe seleccionar una categoría válida' })
        .positive('Debe seleccionar una categoría'),
    id_tipo: z
        .number({ message: 'Debe seleccionar un tipo válido' })
        .positive('Debe seleccionar un tipo'),
    activo: z.boolean().default(true),
}).refine(
    (data) => data.precio_venta_unitario > data.precio_compra,
    {
        message: 'El precio de venta debe ser mayor al precio de compra',
        path: ['precio_venta_unitario'],
    }
);

export type ProductoFormData = z.infer<typeof productoSchema>;

// Entrada Schema
export const entradaSchema = z.object({
    id_producto: z
        .number({ message: 'El ID del producto es requerido' })
        .positive('El ID del producto debe ser válido'),
    id_ubicacion: z
        .number({ message: 'Debe seleccionar una ubicación' })
        .positive('Debe seleccionar una ubicación válida'),
    cantidad: z
        .number({ message: 'La cantidad debe ser un número' })
        .int('La cantidad debe ser un número entero')
        .positive('La cantidad debe ser mayor a 0')
        .max(99999, 'La cantidad no puede exceder 99,999'),
    motivo: z
        .string()
        .min(1, 'El motivo es requerido')
        .max(200, 'El motivo no puede exceder 200 caracteres'),
    referencia: z
        .string()
        .max(100, 'La referencia no puede exceder 100 caracteres')
        .optional()
        .or(z.literal('')),
});

export type EntradaFormData = z.infer<typeof entradaSchema>;

// Salida Schema
export const salidaSchema = z.object({
    id_producto: z
        .number({ message: 'El ID del producto es requerido' })
        .positive('El ID del producto debe ser válido'),
    id_ubicacion: z
        .number({ message: 'Debe seleccionar una ubicación' })
        .positive('Debe seleccionar una ubicación válida'),
    cantidad: z
        .number({ message: 'La cantidad debe ser un número' })
        .int('La cantidad debe ser un número entero')
        .positive('La cantidad debe ser mayor a 0')
        .max(99999, 'La cantidad no puede exceder 99,999'),
    motivo: z
        .string()
        .min(1, 'El motivo es requerido')
        .max(200, 'El motivo no puede exceder 200 caracteres'),
    referencia: z
        .string()
        .max(100, 'La referencia no puede exceder 100 caracteres')
        .optional()
        .or(z.literal('')),
});

export type SalidaFormData = z.infer<typeof salidaSchema>;

// Traslado Schema
export const trasladoSchema = z.object({
    id_producto: z
        .number({ message: 'El ID del producto es requerido' })
        .positive('El ID del producto debe ser válido'),
    id_ubicacion_origen: z
        .number({ message: 'Debe seleccionar una ubicación de origen' })
        .positive('Debe seleccionar una ubicación de origen válida'),
    id_ubicacion_destino: z
        .number({ message: 'Debe seleccionar una ubicación de destino' })
        .positive('Debe seleccionar una ubicación de destino válida'),
    cantidad: z
        .number({ message: 'La cantidad debe ser un número' })
        .int('La cantidad debe ser un número entero')
        .positive('La cantidad debe ser mayor a 0')
        .max(99999, 'La cantidad no puede exceder 99,999'),
    motivo: z
        .string()
        .min(1, 'El motivo es requerido')
        .max(200, 'El motivo no puede exceder 200 caracteres'),
    referencia: z
        .string()
        .max(100, 'La referencia no puede exceder 100 caracteres')
        .optional()
        .or(z.literal('')),
}).refine(
    (data) => data.id_ubicacion_origen !== data.id_ubicacion_destino,
    {
        message: 'La ubicación de origen y destino deben ser diferentes',
        path: ['id_ubicacion_destino'],
    }
);

export type TrasladoFormData = z.infer<typeof trasladoSchema>;

// Promocion Schema
export const promocionSchema = z.object({
    id_producto: z
        .number({ message: 'El ID del producto es requerido' })
        .positive('El ID del producto debe ser válido'),
    cantidad_minima: z
        .number({ message: 'La cantidad mínima debe ser un número' })
        .int('La cantidad mínima debe ser un número entero')
        .positive('La cantidad mínima debe ser mayor a 0')
        .max(99999, 'La cantidad mínima no puede exceder 99,999'),
    precio_oferta: z
        .number({ message: 'El precio de oferta debe ser un número' })
        .positive('El precio de oferta debe ser mayor a 0')
        .max(999999.99, 'El precio de oferta no puede exceder 999,999.99'),
    prioridad: z
        .number({ message: 'La prioridad debe ser un número' })
        .int('La prioridad debe ser un número entero')
        .min(1, 'La prioridad debe ser al menos 1')
        .max(100, 'La prioridad no puede exceder 100'),
    activo: z.boolean().default(true),
});

export type PromocionFormData = z.infer<typeof promocionSchema>;

// Update Promocion Schema (todos los campos opcionales)
export const updatePromocionSchema = z.object({
    cantidad_minima: z
        .number({ message: 'La cantidad mínima debe ser un número' })
        .int('La cantidad mínima debe ser un número entero')
        .positive('La cantidad mínima debe ser mayor a 0')
        .max(99999, 'La cantidad mínima no puede exceder 99,999')
        .optional(),
    precio_oferta: z
        .number({ message: 'El precio de oferta debe ser un número' })
        .positive('El precio de oferta debe ser mayor a 0')
        .max(999999.99, 'El precio de oferta no puede exceder 999,999.99')
        .optional(),
    prioridad: z
        .number({ message: 'La prioridad debe ser un número' })
        .int('La prioridad debe ser un número entero')
        .min(1, 'La prioridad debe ser al menos 1')
        .max(100, 'La prioridad no puede exceder 100')
        .optional(),
    activo: z.boolean().optional(),
});

export type UpdatePromocionFormData = z.infer<typeof updatePromocionSchema>;
