import { X, Tag } from "lucide-react";
import { useState } from "react";

interface ModalCrearTipoServiciosProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (tipoServicio: any) => void;
}

export function ModalCrearTipoServicios({ isOpen, onClose, onSubmit }: ModalCrearTipoServiciosProps) {
    const [nombreServicio, setNombreServicio] = useState("");
    const [colorHex, setColorHex] = useState("#3B82F6"); // Color azul por defecto
    const [descripcion, setDescripcion] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const tipoServicio = {
            nombreServicio,
            colorHex,
            descripcion
        };

        onSubmit(tipoServicio);
        handleClose();
    };

    const handleClose = () => {
        // Reset form
        setNombreServicio("");
        setColorHex("#3B82F6");
        setDescripcion("");
        onClose();
    };

    if (!isOpen) return null;

    // Colores predefinidos sugeridos
    const coloresSugeridos = [
        { nombre: "Azul", hex: "#3B82F6" },
        { nombre: "Verde", hex: "#10B981" },
        { nombre: "Rojo", hex: "#EF4444" },
        { nombre: "Amarillo", hex: "#F59E0B" },
        { nombre: "Púrpura", hex: "#8B5CF6" },
        { nombre: "Rosa", hex: "#EC4899" },
        { nombre: "Índigo", hex: "#6366F1" },
        { nombre: "Naranja", hex: "#F97316" },
        { nombre: "Turquesa", hex: "#14B8A6" },
        { nombre: "Gris", hex: "#6B7280" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-blue-50">
                            <Tag className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Agregar Tipo de Servicio</h2>
                            <p className="mt-1 text-sm text-slate-600">Define un nuevo tipo de servicio con su color identificador</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 transition-colors rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Nombre del Servicio */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Nombre del Servicio <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={nombreServicio}
                            onChange={(e) => setNombreServicio(e.target.value)}
                            placeholder="Ej: Mantenimiento Preventivo"
                            required
                            maxLength={100}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        />
                        <p className="mt-1 text-xs text-slate-500">Máximo 100 caracteres</p>
                    </div>

                    {/* Color Hex */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Color Identificador <span className="text-red-600">*</span>
                        </label>
                        <div className="space-y-3">
                            {/* Selector de color personalizado */}
                            <div className="flex items-center space-x-3">
                                <input
                                    type="color"
                                    value={colorHex}
                                    onChange={(e) => setColorHex(e.target.value)}
                                    className="w-16 h-12 border-2 rounded-lg cursor-pointer border-slate-300"
                                />
                                <input
                                    type="text"
                                    value={colorHex}
                                    onChange={(e) => setColorHex(e.target.value)}
                                    placeholder="#3B82F6"
                                    required
                                    maxLength={7}
                                    pattern="^#[0-9A-Fa-f]{6}$"
                                    className="flex-1 px-4 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                                <div
                                    className="flex items-center justify-center w-12 h-12 text-xs font-medium text-white rounded-lg shadow-sm"
                                    style={{ backgroundColor: colorHex }}
                                >
                                    Vista
                                </div>
                            </div>
                            <p className="text-xs text-slate-500">Formato hexadecimal (Ej: #3B82F6 para azul)</p>

                            {/* Colores sugeridos */}
                            <div>
                                <p className="mb-2 text-xs font-medium text-slate-700">Colores sugeridos:</p>
                                <div className="grid grid-cols-5 gap-2">
                                    {coloresSugeridos.map((color) => (
                                        <button
                                            key={color.hex}
                                            type="button"
                                            onClick={() => setColorHex(color.hex)}
                                            className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${colorHex === color.hex ? 'border-slate-900 ring-2 ring-slate-900' : 'border-slate-200'
                                                }`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.nombre}
                                        >
                                            <span className="sr-only">{color.nombre}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Descripción
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Descripción opcional del tipo de servicio..."
                            rows={3}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                        />
                    </div>

                    {/* Preview del badge */}
                    <div className="p-4 border rounded-lg bg-slate-50 border-slate-200">
                        <p className="mb-2 text-sm font-medium text-slate-700">Vista previa:</p>
                        <div className="flex items-center space-x-2">
                            <span
                                className="px-3 py-1.5 text-sm font-medium text-white rounded-full shadow-sm"
                                style={{ backgroundColor: colorHex }}
                            >
                                {nombreServicio || "Nombre del servicio"}
                            </span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 text-sm font-medium text-white transition-colors bg-[#132436] rounded-lg hover:bg-[#224666]"
                        >
                            Agregar Tipo de Servicio
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
