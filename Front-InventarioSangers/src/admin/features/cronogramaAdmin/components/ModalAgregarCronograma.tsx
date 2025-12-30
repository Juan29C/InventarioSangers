import { X } from "lucide-react";
import { useState } from "react";

interface ModalAgregarCronogramaProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (servicio: any) => void;
    selectedDate?: Date;
}

export function ModalAgregarCronograma({ isOpen, onClose, onSubmit, selectedDate }: ModalAgregarCronogramaProps) {
    const [cliente, setCliente] = useState("");
    const [direccion, setDireccion] = useState("");
    const [fecha, setFecha] = useState(selectedDate ? selectedDate.toISOString().split('T')[0] : "");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [tecnico, setTecnico] = useState("");
    const [tipoServicio, setTipoServicio] = useState("");
    const [notas, setNotas] = useState("");

    // Tipos de servicio con colores (basado en la leyenda del Excel)
    const tiposServicio = [
        { value: "fumigacion", label: "SER_Fumigación", color: "bg-blue-500" },
        { value: "limpieza_tanque", label: "SER_Limpieza de tanque ROTOPLAS", color: "bg-orange-500" },
        { value: "limpieza_pozo", label: "SER_Limpieza de POZO", color: "bg-pink-500" },
        { value: "desratizacion", label: "SER_Desratización", color: "bg-yellow-500" },
        { value: "recoger_extintor", label: "RECOGER EXTINTOR", color: "bg-gray-400" },
        { value: "entrega_extintor", label: "ENTREGA DE EXTINTOR", color: "bg-purple-500" },
        { value: "recarga_mantenimiento", label: "RECARGA Y MANTENIMIENTO DE EXTINTOR", color: "bg-red-500" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const servicio = {
            cliente,
            direccion,
            fecha,
            horaInicio,
            horaFin,
            tecnico,
            tipoServicio,
            notas
        };

        onSubmit(servicio);
        handleClose();
    };

    const handleClose = () => {
        // Reset form
        setCliente("");
        setDireccion("");
        setFecha("");
        setHoraInicio("");
        setHoraFin("");
        setTecnico("");
        setTipoServicio("");
        setNotas("");
        onClose();
    };

    if (!isOpen) return null;

    const selectedTipo = tiposServicio.find(t => t.value === tipoServicio);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-slate-200">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Nuevo Servicio</h2>
                        <p className="mt-1 text-sm text-slate-600">Programa un nuevo servicio en el cronograma</p>
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
                    {/* Cliente y Dirección */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Cliente / Empresa <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={cliente}
                                onChange={(e) => setCliente(e.target.value)}
                                placeholder="Empresa Industrial SAC"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Dirección <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                placeholder="Av. Industrial 123, Lima"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Fecha y Horario */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Fecha <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Hora Inicio <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="time"
                                value={horaInicio}
                                onChange={(e) => setHoraInicio(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Hora Fin
                            </label>
                            <input
                                type="time"
                                value={horaFin}
                                onChange={(e) => setHoraFin(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Tipo de Servicio (con colores) */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Tipo de Servicio / Leyenda <span className="text-red-600">*</span>
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {tiposServicio.map((tipo) => (
                                <label
                                    key={tipo.value}
                                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${tipoServicio === tipo.value
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="tipoServicio"
                                        value={tipo.value}
                                        checked={tipoServicio === tipo.value}
                                        onChange={(e) => setTipoServicio(e.target.value)}
                                        className="w-4 h-4 text-orange-600 border-slate-300 focus:ring-orange-500"
                                    />
                                    <div className="flex items-center flex-1 ml-3 space-x-3">
                                        <div className={`w-6 h-6 rounded ${tipo.color}`}></div>
                                        <span className="text-sm font-medium text-slate-900">{tipo.label}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Técnico Asignado */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Técnico Asignado
                        </label>
                        <select
                            value={tecnico}
                            onChange={(e) => setTecnico(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                        >
                            <option value="">Sin asignar</option>
                            <option value="Carlos Ruiz">Carlos Ruiz</option>
                            <option value="Juan Pérez">Juan Pérez</option>
                            <option value="María González">María González</option>
                        </select>
                    </div>

                    {/* Notas */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">Notas / Observaciones</label>
                        <textarea
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                            placeholder="Cliente solicita revisión completa..."
                            rows={3}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                        />
                    </div>

                    {/* Preview del servicio */}
                    {selectedTipo && (
                        <div className={`p-4 border-2 rounded-lg ${selectedTipo.color} bg-opacity-10 border-opacity-30`}>
                            <p className="text-sm font-medium text-slate-700">Vista previa:</p>
                            <div className="flex items-center mt-2 space-x-2">
                                <div className={`w-4 h-4 rounded ${selectedTipo.color}`}></div>
                                <span className="text-sm font-semibold text-slate-900">{selectedTipo.label}</span>
                            </div>
                            {cliente && <p className="mt-1 text-sm text-slate-600">{cliente}</p>}
                            {fecha && horaInicio && (
                                <p className="text-xs text-slate-500">
                                    {new Date(fecha).toLocaleDateString('es-ES')} - {horaInicio}
                                    {horaFin && ` a ${horaFin}`}
                                </p>
                            )}
                        </div>
                    )}

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
                            className="px-6 py-2.5 text-sm font-medium text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700"
                        >
                            Agregar Servicio
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
