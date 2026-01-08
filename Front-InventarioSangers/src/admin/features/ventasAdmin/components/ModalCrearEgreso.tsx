import { X, TrendingDown } from "lucide-react";
import { useState } from "react";

interface ModalCrearEgresoProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (egreso: any) => void;
}

export function ModalCrearEgreso({ isOpen, onClose, onSubmit }: ModalCrearEgresoProps) {
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [numeroCuota, setNumeroCuota] = useState("");
    const [proveedor, setProveedor] = useState("");
    const [detalle, setDetalle] = useState("");
    const [montoPago, setMontoPago] = useState("");
    const [importe, setImporte] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const egreso = {
            fecha,
            numeroCuota,
            proveedor,
            detalle,
            montoPago: montoPago ? parseFloat(montoPago) : 0,
            importe: importe ? parseFloat(importe) : 0,
            tipo: "EGRESO"
        };

        onSubmit(egreso);
        handleClose();
    };

    const handleClose = () => {
        // Reset form
        setFecha(new Date().toISOString().split('T')[0]);
        setNumeroCuota("");
        setProveedor("");
        setDetalle("");
        setMontoPago("");
        setImporte("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-red-50">
                            <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Registrar Egreso</h2>
                            <p className="mt-1 text-sm text-slate-600">Registra un gasto o salida de dinero</p>
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
                    {/* Fecha y N° Cuota */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Fecha <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                N° Cuota
                            </label>
                            <input
                                type="text"
                                value={numeroCuota}
                                onChange={(e) => setNumeroCuota(e.target.value)}
                                placeholder="001"
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Proveedor */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Proveedor <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={proveedor}
                            onChange={(e) => setProveedor(e.target.value)}
                            placeholder="Nombre del proveedor"
                            required
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                        />
                    </div>

                    {/* Detalle */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Detalle <span className="text-red-600">*</span>
                        </label>
                        <textarea
                            value={detalle}
                            onChange={(e) => setDetalle(e.target.value)}
                            placeholder="Descripción del gasto..."
                            required
                            rows={3}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
                        />
                    </div>

                    {/* Monto de Pago e Importe */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Monto de Pago (S/)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={montoPago}
                                onChange={(e) => setMontoPago(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Importe (S/) <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={importe}
                                onChange={(e) => setImporte(e.target.value)}
                                placeholder="0.00"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Preview del egreso */}
                    <div className="p-4 border rounded-lg bg-red-50 border-red-200">
                        <p className="mb-2 text-sm font-medium text-red-900">Resumen del Egreso:</p>
                        <div className="space-y-1 text-sm text-red-800">
                            <p><span className="font-medium">Proveedor:</span> {proveedor || "-"}</p>
                            <p><span className="font-medium">Detalle:</span> {detalle || "-"}</p>
                            <p className="text-lg font-bold">
                                <span className="font-medium">Total:</span> S/ {importe || "0.00"}
                            </p>
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
                            className="px-6 py-2.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                        >
                            Registrar Egreso
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
