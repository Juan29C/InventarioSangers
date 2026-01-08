import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ubicacionSchema } from '../schemas/UbicacionesSchema';
import type { CreateUbicacionRequest, UbicacionResponse } from '../schemas/Inferface';

interface ActualizarUbicacionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: number, data: CreateUbicacionRequest) => Promise<void>;
    ubicacion: UbicacionResponse | null;
}

export const ActualizarUbicacionModal = ({
    isOpen,
    onClose,
    onSubmit,
    ubicacion
}: ActualizarUbicacionModalProps) => {
    const [formData, setFormData] = useState<CreateUbicacionRequest>({
        nombre_ubicacion: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cargar datos de la ubicación cuando se abre el modal
    useEffect(() => {
        if (ubicacion) {
            setFormData({
                nombre_ubicacion: ubicacion.nombre_ubicacion,
            });
        }
    }, [ubicacion]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error del campo al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!ubicacion) return;

        try {
            // Validar con Zod
            const validatedData = ubicacionSchema.parse(formData);
            setIsSubmitting(true);

            // Llamar al servicio
            await onSubmit(ubicacion.id_ubicacion, validatedData);

            // Cerrar modal
            handleClose();
        } catch (err: any) {
            if (err.name === 'ZodError') {
                // Mapear errores de Zod
                const fieldErrors: Record<string, string> = {};
                err.errors.forEach((error: any) => {
                    if (error.path) {
                        fieldErrors[error.path[0]] = error.message;
                    }
                });
                setErrors(fieldErrors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({ nombre_ubicacion: '' });
        setErrors({});
        onClose();
    };

    if (!isOpen || !ubicacion) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md p-6 bg-white rounded-xl shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Editar Ubicación</h2>
                    <button
                        onClick={handleClose}
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nombre_ubicacion" className="block text-sm font-medium text-slate-700 mb-1">
                            Nombre de la Ubicación
                        </label>
                        <input
                            id="nombre_ubicacion"
                            name="nombre_ubicacion"
                            type="text"
                            value={formData.nombre_ubicacion}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.nombre_ubicacion ? 'border-red-500' : 'border-slate-300'
                                }`}
                            placeholder="Ej: Almacén Central"
                        />
                        {errors.nombre_ubicacion && (
                            <p className="mt-1 text-sm text-red-600">{errors.nombre_ubicacion}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#132436] rounded-lg hover:bg-[#224666] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Actualizando...' : 'Actualizar Ubicación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
