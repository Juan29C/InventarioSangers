import { X, FileText } from "lucide-react";
import { useState } from "react";

interface ModalCrearServicioProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (servicio: any) => void;
}

export function ModalCrearServicio({ isOpen, onClose, onSubmit }: ModalCrearServicioProps) {
    const [mes, setMes] = useState("");
    const [nombreEmpresa, setNombreEmpresa] = useState("");
    const [telefono, setTelefono] = useState("");
    const [rucDni, setRucDni] = useState("");
    const [capacidad, setCapacidad] = useState("");
    const [proceso, setProceso] = useState("PENDIENTE");
    const [tecnicoResponsable, setTecnicoResponsable] = useState("");
    const [fechaServicioRealizado, setFechaServicioRealizado] = useState("");
    const [fechaProximoServicio, setFechaProximoServicio] = useState("");
    const [montoPagadoPrimerServicio, setMontoPagadoPrimerServicio] = useState("");
    const [montoPagadoSegundoServicio, setMontoPagadoSegundoServicio] = useState("");
    const [tipoServicio, setTipoServicio] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const servicio = {
            mes,
            nombreEmpresa,
            telefono,
            rucDni,
            capacidad: capacidad ? parseInt(capacidad) : undefined,
            proceso,
            tecnicoResponsable,
            fechaServicioRealizado,
            fechaProximoServicio,
            montoPagadoPrimerServicio: montoPagadoPrimerServicio ? parseFloat(montoPagadoPrimerServicio) : undefined,
            montoPagadoSegundoServicio: montoPagadoSegundoServicio ? parseFloat(montoPagadoSegundoServicio) : undefined,
            tipoServicio,
            fechaCreacion: new Date().toISOString().split('T')[0]
        };

        onSubmit(servicio);
        handleClose();
    };

    const handleClose = () => {
        // Reset form
        setMes("");
        setNombreEmpresa("");
        setTelefono("");
        setRucDni("");
        setCapacidad("");
        setProceso("PENDIENTE");
        setTecnicoResponsable("");
        setFechaServicioRealizado("");
        setFechaProximoServicio("");
        setMontoPagadoPrimerServicio("");
        setMontoPagadoSegundoServicio("");
        setTipoServicio("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-blue-50">
                            <FileText className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Agregar Nuevo Servicio</h2>
                            <p className="mt-1 text-sm text-slate-600">Complete los datos del servicio solicitado</p>
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
                    {/* Mes, Nombre Empresa y Teléfono */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Mes <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={mes}
                                onChange={(e) => setMes(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            >
                                <option value="">Seleccionar mes</option>
                                <option value="Enero">Enero</option>
                                <option value="Febrero">Febrero</option>
                                <option value="Marzo">Marzo</option>
                                <option value="Abril">Abril</option>
                                <option value="Mayo">Mayo</option>
                                <option value="Junio">Junio</option>
                                <option value="Julio">Julio</option>
                                <option value="Agosto">Agosto</option>
                                <option value="Septiembre">Septiembre</option>
                                <option value="Octubre">Octubre</option>
                                <option value="Noviembre">Noviembre</option>
                                <option value="Diciembre">Diciembre</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Nombre - Empresa <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={nombreEmpresa}
                                onChange={(e) => setNombreEmpresa(e.target.value)}
                                placeholder="Empresa S.A.C."
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                        </div>
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
                    </div>

                    {/* RUC/DNI, Capacidad y Tipo de Servicio */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                RUC - DNI <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={rucDni}
                                onChange={(e) => setRucDni(e.target.value)}
                                placeholder="20123456789"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Capacidad
                            </label>
                            <input
                                type="number"
                                value={capacidad}
                                onChange={(e) => setCapacidad(e.target.value)}
                                placeholder="100"
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Tipo de Servicio <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={tipoServicio}
                                onChange={(e) => setTipoServicio(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            >
                                <option value="">Seleccionar tipo</option>
                                <option value="Mantenimiento">Mantenimiento</option>
                                <option value="Instalación">Instalación</option>
                                <option value="Recarga">Recarga</option>
                                <option value="Inspección">Inspección</option>
                                <option value="Capacitación">Capacitación</option>
                            </select>
                        </div>
                    </div>

                    {/* Proceso y Técnico Responsable */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Proceso <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={proceso}
                                onChange={(e) => setProceso(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            >
                                <option value="NO INICIA" className="bg-red-100">NO INICIA</option>
                                <option value="PENDIENTE" className="bg-yellow-100">PENDIENTE</option>
                                <option value="REALIZADO" className="bg-green-100">REALIZADO</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Técnico Responsable
                            </label>
                            <input
                                type="text"
                                value={tecnicoResponsable}
                                onChange={(e) => setTecnicoResponsable(e.target.value)}
                                placeholder="Juan Pérez"
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Fecha de Servicio (Realizado)
                            </label>
                            <input
                                type="date"
                                value={fechaServicioRealizado}
                                onChange={(e) => setFechaServicioRealizado(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Fecha de Próximo Servicio (Programada)
                            </label>
                            <input
                                type="date"
                                value={fechaProximoServicio}
                                onChange={(e) => setFechaProximoServicio(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Montos */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Monto Pagado (Primer Servicio) S/
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={montoPagadoPrimerServicio}
                                onChange={(e) => setMontoPagadoPrimerServicio(e.target.value)}
                                placeholder="150.00"
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Monto Pagado (Segundo Servicio) S/
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={montoPagadoSegundoServicio}
                                onChange={(e) => setMontoPagadoSegundoServicio(e.target.value)}
                                placeholder="150.00"
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
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
                            Agregar Servicio
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
