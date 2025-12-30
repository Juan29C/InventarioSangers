import { X, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface ModalEditarSeguimientoProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    extintor: any;
}

export function ModalEditarSeguimiento({ isOpen, onClose, onSubmit, extintor }: ModalEditarSeguimientoProps) {
    const [proximaRecarga, setProximaRecarga] = useState("");
    const [frecuenciaRevision, setFrecuenciaRevision] = useState("");
    const [proximaRevision, setProximaRevision] = useState("");
    const [notas, setNotas] = useState("");

    useEffect(() => {
        if (extintor) {
            setProximaRecarga(extintor.proximaRecarga || "");
            setFrecuenciaRevision(extintor.frecuenciaRevision || "");
            setProximaRevision(extintor.proximaRevision || "");
            setNotas(extintor.notas || "");
        }
    }, [extintor]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            proximaRecarga,
            frecuenciaRevision,
            proximaRevision,
            notas
        };

        onSubmit(data);
        handleClose();
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen || !extintor) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-slate-200">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Editar Seguimiento</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Extintor: <span className="font-medium">{extintor.codigoSerie}</span> - {extintor.nombreEmpresa}
                        </p>
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
                    {/* Info del Extintor */}
                    <div className="p-4 border rounded-lg bg-slate-50 border-slate-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-slate-700">Tipo:</span>
                                <span className="ml-2 text-slate-900">{extintor.tipoExtintor}</span>
                            </div>
                            <div>
                                <span className="font-medium text-slate-700">Capacidad:</span>
                                <span className="ml-2 text-slate-900">{extintor.capacidad}</span>
                            </div>
                            <div>
                                <span className="font-medium text-slate-700">Última Recarga:</span>
                                <span className="ml-2 text-slate-900">
                                    {new Date(extintor.fechaRecarga).toLocaleDateString('es-ES')}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-slate-700">Cliente:</span>
                                <span className="ml-2 text-slate-900">{extintor.nombreEmpresa}</span>
                            </div>
                        </div>
                    </div>

                    {/* Próxima Recarga / Vencimiento */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-orange-600" />
                                <span>Próxima Recarga / Vencimiento <span className="text-red-600">*</span></span>
                            </div>
                        </label>
                        <input
                            type="date"
                            value={proximaRecarga}
                            onChange={(e) => setProximaRecarga(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                        />
                        <p className="mt-1 text-xs text-slate-500">
                            Fecha en la que vence la recarga anual del extintor
                        </p>
                    </div>

                    {/* Frecuencia de Revisión */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span>Frecuencia de Revisión</span>
                            </div>
                        </label>
                        <select
                            value={frecuenciaRevision}
                            onChange={(e) => setFrecuenciaRevision(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                        >
                            <option value="">No definida</option>
                            <option value="mensual">Mensual (cada mes)</option>
                            <option value="bimestral">Bimestral (cada 2 meses)</option>
                            <option value="trimestral">Trimestral (cada 3 meses)</option>
                            <option value="semestral">Semestral (cada 6 meses)</option>
                        </select>
                        <p className="mt-1 text-xs text-slate-500">
                            Con qué frecuencia se debe revisar este extintor
                        </p>
                    </div>

                    {/* Próxima Revisión */}
                    {frecuenciaRevision && (
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Próxima Revisión Programada
                            </label>
                            <input
                                type="date"
                                value={proximaRevision}
                                onChange={(e) => setProximaRevision(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Fecha de la próxima revisión según la frecuencia definida
                            </p>
                        </div>
                    )}

                    {/* Notas */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Notas / Observaciones
                        </label>
                        <textarea
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                            placeholder="Ej: Cliente solicita revisión cada 3 meses por normativa industrial..."
                            rows={4}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                        />
                    </div>

                    {/* Preview de alertas */}
                    {proximaRecarga && (
                        <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                            <p className="text-sm font-medium text-blue-900">Vista previa de alertas:</p>
                            <ul className="mt-2 space-y-1 text-xs text-blue-700">
                                <li>• Se notificará 15 días antes del vencimiento</li>
                                <li>• El estado cambiará a "Por Vencer" cuando falten 15 días</li>
                                <li>• El estado cambiará a "Vencido" después de la fecha de vencimiento</li>
                                {frecuenciaRevision && (
                                    <li>• Se programarán revisiones {frecuenciaRevision}es automáticamente</li>
                                )}
                            </ul>
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
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
