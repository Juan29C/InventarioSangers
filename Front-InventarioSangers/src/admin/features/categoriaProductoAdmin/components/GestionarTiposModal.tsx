import { X, Plus, Edit, Power, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ConfirmToggleModal } from './ConfirmToggleModal';
import { tipoSchema } from '../schemas/tipoSchema/TipoCateSchema';
import { listarTiposService } from '../services/tipo/listarTipoCate';
import { crearTipoService } from '../services/tipo/crearTipoCate';
import { actualizarTipoService } from '../services/tipo/actualizarTipoCate';
import type { TipoResponse, CreateTipoRequest } from '../schemas/Interface';

interface GestionarTiposModalProps {
    isOpen: boolean;
    onClose: () => void;
    idCategoria: number;
    nombreCategoria: string;
}

export const GestionarTiposModal = ({
    isOpen,
    onClose,
    idCategoria,
    nombreCategoria
}: GestionarTiposModalProps) => {
    const [tipos, setTipos] = useState<TipoResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [editingTipo, setEditingTipo] = useState<TipoResponse | null>(null);
    const [formData, setFormData] = useState({ nombre_tipo: '', activo: true });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
    const [tipoToToggle, setTipoToToggle] = useState<TipoResponse | null>(null);
    const [isToggling, setIsToggling] = useState(false);

    useEffect(() => {
        if (isOpen) {
            cargarTipos();
        }
    }, [isOpen]);

    const cargarTipos = async () => {
        setLoading(true);
        try {
            const data = await listarTiposService();
            // Filtrar solo los tipos de esta categoría
            const tiposFiltrados = data.filter(t => t.id_categoria === idCategoria);
            setTipos(tiposFiltrados);
        } catch (error) {
            console.error('Error al cargar tipos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            const validatedData = tipoSchema.parse(formData);

            const requestData: CreateTipoRequest = {
                id_categoria: idCategoria,
                nombre_tipo: validatedData.nombre_tipo,
                activo: validatedData.activo,
            };

            if (editingTipo) {
                await actualizarTipoService(editingTipo.id_tipo, requestData);
            } else {
                await crearTipoService(requestData);
            }

            // Recargar lista y limpiar formulario
            await cargarTipos();
            setFormData({ nombre_tipo: '', activo: true });
            setIsCreating(false);
            setEditingTipo(null);
        } catch (err: any) {
            if (err.name === 'ZodError') {
                const fieldErrors: Record<string, string> = {};
                err.errors.forEach((error: any) => {
                    if (error.path) {
                        fieldErrors[error.path[0]] = error.message;
                    }
                });
                setErrors(fieldErrors);
            }
        }
    };

    const handleEdit = (tipo: TipoResponse) => {
        setEditingTipo(tipo);
        setFormData({ nombre_tipo: tipo.nombre_tipo, activo: tipo.activo });
        setIsCreating(true);
    };

    const openToggleModal = (tipo: TipoResponse) => {
        setTipoToToggle(tipo);
        setIsToggleModalOpen(true);
    };

    const handleToggleActive = async () => {
        if (!tipoToToggle) return;

        setIsToggling(true);
        try {
            // Actualizar el tipo con el estado invertido
            const requestData: CreateTipoRequest = {
                id_categoria: tipoToToggle.id_categoria,
                nombre_tipo: tipoToToggle.nombre_tipo,
                activo: !tipoToToggle.activo,
            };
            await actualizarTipoService(tipoToToggle.id_tipo, requestData);
            await cargarTipos();
            setIsToggleModalOpen(false);
            setTipoToToggle(null);
        } catch (error) {
            console.error('Error al cambiar estado del tipo:', error);
            alert('Error al cambiar el estado del tipo');
        } finally {
            setIsToggling(false);
        }
    };

    const handleClose = () => {
        setFormData({ nombre_tipo: '', activo: true });
        setIsCreating(false);
        setEditingTipo(null);
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-2xl p-6 bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Gestionar Tipos</h2>
                        <p className="text-sm text-slate-600">Categoría: {nombreCategoria}</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Botón Crear Nuevo */}
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium text-white bg-[#132436] rounded-lg hover:bg-[#224666] transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Tipo
                    </button>
                )}

                {/* Formulario Crear/Editar */}
                {isCreating && (
                    <form onSubmit={handleSubmit} className="p-4 mb-4 border rounded-lg border-slate-200 bg-slate-50">
                        <h3 className="mb-3 text-sm font-semibold text-slate-900">
                            {editingTipo ? 'Editar Tipo' : 'Nuevo Tipo'}
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nombre del Tipo
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombre_tipo}
                                    onChange={(e) => setFormData({ ...formData, nombre_tipo: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.nombre_tipo ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                    placeholder="Ej: Clase A"
                                />
                                {errors.nombre_tipo && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nombre_tipo}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="activo"
                                    checked={formData.activo}
                                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="activo" className="text-sm font-medium text-slate-700">
                                    Activo
                                </label>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setEditingTipo(null);
                                        setFormData({ nombre_tipo: '', activo: true });
                                        setErrors({});
                                    }}
                                    className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-1.5 text-sm font-medium text-white bg-[#132436] rounded-lg hover:bg-[#224666] transition-colors"
                                >
                                    {editingTipo ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Lista de Tipos */}
                <div className="space-y-2">
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-8 h-8 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                    )}

                    {!loading && tipos.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <AlertCircle className="w-12 h-12 mb-2 text-slate-400" />
                            <p className="text-sm text-slate-600">No hay tipos creados para esta categoría</p>
                        </div>
                    )}

                    {!loading && tipos.map((tipo) => (
                        <div
                            key={tipo.id_tipo}
                            className="flex items-center justify-between p-3 border rounded-lg border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div>
                                    <p className="font-medium text-slate-900">{tipo.nombre_tipo}</p>
                                    <p className="text-xs text-slate-500">
                                        {tipo.activo ? (
                                            <span className="text-green-600">● Activo</span>
                                        ) : (
                                            <span className="text-red-600">● Inactivo</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleEdit(tipo)}
                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                    title="Editar"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => openToggleModal(tipo)}
                                    className={`p-2 rounded-lg transition-colors ${tipo.activo
                                        ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                        : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
                                        }`}
                                    title={tipo.activo ? 'Desactivar' : 'Activar'}
                                >
                                    <Power className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de Confirmación para Cambiar Estado */}
            <ConfirmToggleModal
                isOpen={isToggleModalOpen}
                onClose={() => setIsToggleModalOpen(false)}
                onConfirm={handleToggleActive}
                itemName={tipoToToggle?.nombre_tipo || ''}
                isActive={tipoToToggle?.activo || false}
                isToggling={isToggling}
            />
        </div>
    );
};
