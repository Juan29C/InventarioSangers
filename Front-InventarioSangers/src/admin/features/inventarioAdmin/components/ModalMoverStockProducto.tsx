import { X, ArrowRightLeft } from "lucide-react";
import { useState } from "react";

interface ModalMoverStockProductoProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    producto: {
        id: number;
        sku: string;
        nombre: string;
        tienda: number;
        almacen1: number;
        almacen2: number;
    } | null;
}

export function ModalMoverStockProducto({ isOpen, onClose, onSubmit, producto }: ModalMoverStockProductoProps) {
    const [origen, setOrigen] = useState("");
    const [destino, setDestino] = useState("");
    const [cantidad, setCantidad] = useState("");

    const ubicaciones = [
        { value: "tienda", label: "Tienda" },
        { value: "almacen1", label: "Almacén 1" },
        { value: "almacen2", label: "Almacén 2" }
    ];

    const getStockDisponible = () => {
        if (!producto || !origen) return 0;

        switch (origen) {
            case "tienda":
                return producto.tienda;
            case "almacen1":
                return producto.almacen1;
            case "almacen2":
                return producto.almacen2;
            default:
                return 0;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const stockDisponible = getStockDisponible();
        const cantidadNum = parseInt(cantidad);

        if (cantidadNum > stockDisponible) {
            alert(`No hay suficiente stock en ${ubicaciones.find(u => u.value === origen)?.label}. Stock disponible: ${stockDisponible}`);
            return;
        }

        const movimiento = {
            productoId: producto?.id,
            origen,
            destino,
            cantidad: cantidadNum
        };

        onSubmit(movimiento);
        handleClose();
    };

    const handleClose = () => {
        setOrigen("");
        setDestino("");
        setCantidad("");
        onClose();
    };

    // Filtrar ubicaciones de destino (no puede ser igual al origen)
    const ubicacionesDestino = ubicaciones.filter(u => u.value !== origen);

    if (!isOpen || !producto) return null;

    const stockDisponible = getStockDisponible();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-orange-50">
                            <ArrowRightLeft className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Mover Stock</h2>
                            <p className="mt-1 text-sm text-slate-600">Transferir productos entre ubicaciones</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 transition-colors rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Product Info */}
                <div className="p-6 border-b bg-slate-50 border-slate-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500">Producto</p>
                            <p className="mt-1 text-lg font-semibold text-slate-900">{producto.nombre}</p>
                            <p className="text-sm text-slate-600">SKU: {producto.sku}</p>
                        </div>
                    </div>

                    {/* Stock Actual */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="p-3 bg-white border rounded-lg border-slate-200">
                            <p className="text-xs font-medium text-slate-600">Tienda</p>
                            <p className="mt-1 text-xl font-bold text-slate-900">{producto.tienda}</p>
                        </div>
                        <div className="p-3 bg-white border rounded-lg border-slate-200">
                            <p className="text-xs font-medium text-slate-600">Almacén 1</p>
                            <p className="mt-1 text-xl font-bold text-slate-900">{producto.almacen1}</p>
                        </div>
                        <div className="p-3 bg-white border rounded-lg border-slate-200">
                            <p className="text-xs font-medium text-slate-600">Almacén 2</p>
                            <p className="mt-1 text-xl font-bold text-slate-900">{producto.almacen2}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Origen */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Desde (Origen) <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={origen}
                            onChange={(e) => {
                                setOrigen(e.target.value);
                                setDestino(""); // Reset destino cuando cambia origen
                                setCantidad(""); // Reset cantidad
                            }}
                            required
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                        >
                            <option value="">Seleccionar ubicación de origen</option>
                            {ubicaciones.map((ub) => (
                                <option key={ub.value} value={ub.value}>
                                    {ub.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Destino */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Hacia (Destino) <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={destino}
                            onChange={(e) => setDestino(e.target.value)}
                            required
                            disabled={!origen}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                        >
                            <option value="">Seleccionar ubicación de destino</option>
                            {ubicacionesDestino.map((ub) => (
                                <option key={ub.value} value={ub.value}>
                                    {ub.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Cantidad */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Cantidad a mover <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="number"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            min="1"
                            max={stockDisponible}
                            required
                            disabled={!origen}
                            placeholder="0"
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                        />
                        {origen && (
                            <p className="mt-1 text-xs text-slate-500">
                                Stock disponible en {ubicaciones.find(u => u.value === origen)?.label}: <span className="font-semibold text-slate-700">{stockDisponible} unidades</span>
                            </p>
                        )}
                    </div>

                    {/* Preview del movimiento */}
                    {origen && destino && cantidad && (
                        <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                            <div className="flex items-center justify-between text-sm">
                                <div className="text-center">
                                    <p className="font-medium text-slate-700">{ubicaciones.find(u => u.value === origen)?.label}</p>
                                    <p className="mt-1 text-lg font-bold text-orange-600">-{cantidad}</p>
                                </div>
                                <ArrowRightLeft className="w-5 h-5 text-orange-600" />
                                <div className="text-center">
                                    <p className="font-medium text-slate-700">{ubicaciones.find(u => u.value === destino)?.label}</p>
                                    <p className="mt-1 text-lg font-bold text-green-600">+{cantidad}</p>
                                </div>
                            </div>
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
                            Mover Stock
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
