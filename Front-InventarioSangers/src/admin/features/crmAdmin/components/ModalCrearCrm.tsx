import { X } from "lucide-react";
import { useState } from "react";

interface ModalCrearCrmProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (prospecto: any) => void;
}

export function ModalCrearCrm({ isOpen, onClose, onSubmit }: ModalCrearCrmProps) {
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [empresa, setEmpresa] = useState("");
    const [rucDni, setRucDni] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [montoPagado, setMontoPagado] = useState("");
    const [proceso, setProceso] = useState("sin_informacion");

    const procesosOptions = [
        { value: "sin_informacion", label: "Sin Información", color: "bg-slate-200" },
        { value: "interesado", label: "Interesado", color: "bg-blue-200" },
        { value: "contactado", label: "Contactado", color: "bg-yellow-200" },
        { value: "cliente_cerrado", label: "Cliente Cerrado", color: "bg-green-200" },
        { value: "no_realizado", label: "No Realizado", color: "bg-red-200" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const prospecto = {
            nombre,
            telefono,
            email,
            empresa,
            rucDni,
            descripcion,
            montoPagado: montoPagado ? parseFloat(montoPagado) : 0,
            proceso,
            fecha: new Date().toISOString().split('T')[0]
        };

        onSubmit(prospecto);
        handleClose();
    };

    const handleClose = () => {
        // Reset form
        setNombre("");
        setTelefono("");
        setEmail("");
        setEmpresa("");
        setRucDni("");
        setDescripcion("");
        setMontoPagado("");
        setProceso("sin_informacion");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-slate-200">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Nuevo Prospecto</h2>
                        <p className="mt-1 text-sm text-slate-600">Agrega un nuevo cliente potencial al pipeline</p>
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
                    {/* Nombre y Teléfono */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Nombre Completo <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Anthony López"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Teléfono <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="tel"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                placeholder="908 820 314"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="cliente@empresa.com"
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                        />
                    </div>

                    {/* Empresa y RUC/DNI */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Empresa
                            </label>
                            <input
                                type="text"
                                value={empresa}
                                onChange={(e) => setEmpresa(e.target.value)}
                                placeholder="Estructuras Metálicas SAC"
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                RUC / DNI
                            </label>
                            <input
                                type="text"
                                value={rucDni}
                                onChange={(e) => setRucDni(e.target.value)}
                                placeholder="20123456789"
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Descripción / Notas */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">Descripción / Notas</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Recarga de extintor 6 kg, EPP, etc."
                            rows={3}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                        />
                    </div>

                    {/* Monto Pagado y Proceso */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Monto Pagado (S/)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={montoPagado}
                                onChange={(e) => setMontoPagado(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Estado del Proceso <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={proceso}
                                onChange={(e) => setProceso(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            >
                                {procesosOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Preview del estado */}
                    <div className={`p-4 border-2 rounded-lg ${procesosOptions.find(p => p.value === proceso)?.color} bg-opacity-30 border-opacity-50`}>
                        <p className="text-sm font-medium text-slate-700">Estado seleccionado:</p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">
                            {procesosOptions.find(p => p.value === proceso)?.label}
                        </p>
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
                            className="px-6 py-2.5 text-sm font-medium text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700"
                        >
                            Agregar Prospecto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
