import { X, MapPin } from "lucide-react";
import { useState } from "react";

interface CrearUbicacionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (ubicacion: any) => void;
}

export function CrearUbicacionModal({ isOpen, onClose, onSubmit }: CrearUbicacionModalProps) {
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [telefono, setTelefono] = useState("");
    const [responsable, setResponsable] = useState("");
    const [capacidad, setCapacidad] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const ubicacion = {
            nombre,
            tipo,
            direccion,
            ciudad,
            telefono,
            responsable,
            capacidad: capacidad ? parseInt(capacidad) : undefined,
            descripcion,
            fechaCreacion: new Date().toISOString().split('T')[0]
        };

        onSubmit(ubicacion);
        handleClose();
    };

    const handleClose = () => {
        // Reset form
        setNombre("");
        setTipo("");
        setDireccion("");
        setCiudad("");
        setTelefono("");
        setResponsable("");
        setCapacidad("");
        setDescripcion("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-blue-50">
                            <MapPin className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Agregar Nueva Ubicación</h2>
                            <p className="mt-1 text-sm text-slate-600">Complete los datos de la ubicación (almacén/tienda)</p>
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
                    {/* Nombre y Tipo */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Nombre de la Ubicación <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Almacén Central"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Tipo <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            >
                                <option value="">Seleccionar tipo</option>
                                <option value="Almacén">Almacén</option>
                                <option value="Tienda">Tienda</option>
                                <option value="Sucursal">Sucursal</option>
                                <option value="Depósito">Depósito</option>
                            </select>
                        </div>
                    </div>

                    {/* Dirección y Ciudad */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Dirección <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                placeholder="Av. Principal 123"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Ciudad <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={ciudad}
                                onChange={(e) => setCiudad(e.target.value)}
                                placeholder="Lima"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Teléfono y Responsable */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                placeholder="+51 999 999 999"
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Responsable
                            </label>
                            <input
                                type="text"
                                value={responsable}
                                onChange={(e) => setResponsable(e.target.value)}
                                placeholder="Juan Pérez"
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Capacidad */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Capacidad Máxima (unidades)
                        </label>
                        <input
                            type="number"
                            value={capacidad}
                            onChange={(e) => setCapacidad(e.target.value)}
                            placeholder="1000"
                            min="0"
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        />
                        <p className="mt-1 text-xs text-slate-500">Cantidad máxima de productos que puede almacenar esta ubicación</p>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">Descripción</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Información adicional sobre la ubicación..."
                            rows={3}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                        />
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
                            Agregar Ubicación
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
