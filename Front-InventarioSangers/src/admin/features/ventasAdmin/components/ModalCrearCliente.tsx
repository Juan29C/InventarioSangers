import { X, UserPlus } from "lucide-react";
import { useState } from "react";

interface ModalCrearClienteProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (cliente: any) => void;
}

export function ModalCrearCliente({ isOpen, onClose, onSubmit }: ModalCrearClienteProps) {
    const [tipoPersona, setTipoPersona] = useState("Persona Natural");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [tipoDocumento, setTipoDocumento] = useState("DNI");
    const [numeroDocumento, setNumeroDocumento] = useState("");
    const [telefono, setTelefono] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const cliente = {
            tipoPersona,
            nombre: tipoPersona === "Persona Natural" ? `${nombre} ${apellido}` : nombre,
            tipoDocumento,
            numeroDocumento,
            telefono
        };

        onSubmit(cliente);
        handleClose();
    };

    const handleClose = () => {
        // Reset form
        setTipoPersona("Persona Natural");
        setNombre("");
        setApellido("");
        setTipoDocumento("DNI");
        setNumeroDocumento("");
        setTelefono("");
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
                            <UserPlus className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Agregar Nuevo Cliente</h2>
                            <p className="mt-1 text-sm text-slate-600">Complete los datos del cliente para agregarlo al sistema</p>
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
                    {/* Tipo de Persona */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Tipo de Persona
                        </label>
                        <select
                            value={tipoPersona}
                            onChange={(e) => setTipoPersona(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        >
                            <option value="Persona Natural">Persona Natural</option>
                            <option value="Persona Jurídica">Persona Jurídica</option>
                        </select>
                    </div>

                    {/* Nombre y Apellido (solo para Persona Natural) */}
                    {tipoPersona === "Persona Natural" ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Nombre <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Juan"
                                    required
                                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Apellido <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                    placeholder="Pérez"
                                    required
                                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Razón Social <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Empresa S.A.C."
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    )}

                    {/* Tipo de Documento y Número */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Tipo de Documento <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={tipoDocumento}
                                onChange={(e) => setTipoDocumento(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            >
                                <option value="DNI">DNI</option>
                                <option value="RUC">RUC</option>
                                <option value="Carnet de Extranjería">Carnet de Extranjería</option>
                                <option value="Pasaporte">Pasaporte</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                {tipoDocumento} <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={numeroDocumento}
                                onChange={(e) => setNumeroDocumento(e.target.value)}
                                placeholder={tipoDocumento === "DNI" ? "12345678" : "20123456789"}
                                required
                                maxLength={tipoDocumento === "DNI" ? 8 : tipoDocumento === "RUC" ? 11 : 20}
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Teléfono <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            placeholder="987654321"
                            required
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                            className="px-6 py-2.5 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Agregar Cliente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
