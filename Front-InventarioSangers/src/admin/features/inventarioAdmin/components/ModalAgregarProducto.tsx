import { X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Promocion {
    id: number;
    cantidadMinima: number;
    descuento: number;
}

interface ModalAgregarProductoProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (producto: any) => void;
}

export function ModalAgregarProducto({ isOpen, onClose, onSubmit }: ModalAgregarProductoProps) {
    const [sku, setSku] = useState("");
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("");
    const [tipo, setTipo] = useState("");
    const [precioCompra, setPrecioCompra] = useState("");
    const [precioVenta, setPrecioVenta] = useState("");
    const [stockMinimo, setStockMinimo] = useState("");
    const [tienda, setTienda] = useState("");
    const [almacen1, setAlmacen1] = useState("");
    const [almacen2, setAlmacen2] = useState("");

    const [promociones, setPromociones] = useState<Promocion[]>([
        { id: 1, cantidadMinima: 3, descuento: 2.0 }
    ]);

    const agregarPromocion = () => {
        const newId = Math.max(...promociones.map(p => p.id), 0) + 1;
        setPromociones([...promociones, { id: newId, cantidadMinima: 0, descuento: 0 }]);
    };

    const eliminarPromocion = (id: number) => {
        if (promociones.length > 1) {
            setPromociones(promociones.filter(p => p.id !== id));
        }
    };

    const actualizarPromocion = (id: number, field: 'cantidadMinima' | 'descuento', value: number) => {
        setPromociones(promociones.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        ));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const producto = {
            sku,
            nombre,
            descripcion,
            categoria,
            tipo: categoria === 'Extintores' ? tipo : undefined,
            precioCompra: parseFloat(precioCompra),
            precioVenta: parseFloat(precioVenta),
            stockMinimo: parseInt(stockMinimo),
            tienda: parseInt(tienda),
            almacen1: parseInt(almacen1),
            almacen2: parseInt(almacen2),
            promociones
        };

        onSubmit(producto);
        handleClose();
    };

    const handleClose = () => {
        // Reset form
        setSku("");
        setNombre("");
        setDescripcion("");
        setCategoria("");
        setTipo("");
        setPrecioCompra("");
        setPrecioVenta("");
        setStockMinimo("");
        setTienda("");
        setAlmacen1("");
        setAlmacen2("");
        setPromociones([{ id: 1, cantidadMinima: 3, descuento: 2.0 }]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-slate-200">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Agregar Nuevo Producto</h2>
                        <p className="mt-1 text-sm text-slate-600">Complete los datos del producto y su inventario inicial</p>
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
                    {/* SKU y Nombre */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                SKU <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                placeholder="EXT-PQS-6KG"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Nombre del Producto <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Extintor PQS 6kg"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">Descripción</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Descripción detallada del producto"
                            rows={3}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                        />
                    </div>

                    {/* Categoría y Tipo */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Categoría <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={categoria}
                                onChange={(e) => {
                                    setCategoria(e.target.value);
                                    // Reset tipo when changing category
                                    if (e.target.value !== 'Extintores') {
                                        setTipo('');
                                    }
                                }}
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            >
                                <option value="">Seleccionar categoría</option>
                                <option value="Seguridad">Seguridad</option>
                                <option value="Extintores">Extintores</option>
                            </select>
                        </div>

                        {/* Tipo - Solo visible cuando categoría es Extintores */}
                        {categoria === 'Extintores' && (
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Tipo <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                >
                                    <option value="">Seleccionar tipo</option>
                                    <option value="A">Tipo A</option>
                                    <option value="B">Tipo B</option>
                                    <option value="C">Tipo C</option>
                                    <option value="D">Tipo D</option>
                                </select>
                            </div>
                        )}
                    </div>


                    {/* Precios y Stock Mínimo */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Precio Compra (S/) <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={precioCompra}
                                onChange={(e) => setPrecioCompra(e.target.value)}
                                placeholder="85.00"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Precio Venta (S/) <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={precioVenta}
                                onChange={(e) => setPrecioVenta(e.target.value)}
                                placeholder="120.00"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Stock Mínimo <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="number"
                                value={stockMinimo}
                                onChange={(e) => setStockMinimo(e.target.value)}
                                placeholder="10"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Promoción por Mayor */}
                    <div className="p-4 border rounded-lg bg-slate-50 border-slate-200">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">Promoción por Mayor</h3>
                                <p className="text-xs text-slate-600">Configure descuentos automáticos al comprar grandes cantidades</p>
                            </div>
                            <button
                                type="button"
                                onClick={agregarPromocion}
                                className="flex items-center px-3 py-1.5 space-x-1 text-sm font-medium text-orange-700 transition-colors bg-orange-100 rounded-lg hover:bg-orange-200"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Agregar</span>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {promociones.map((promo) => (
                                <div key={promo.id} className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div>
                                        <label className="block mb-1 text-xs font-medium text-slate-700">
                                            Cantidad mínima
                                        </label>
                                        <input
                                            type="number"
                                            value={promo.cantidadMinima}
                                            onChange={(e) => actualizarPromocion(promo.id, 'cantidadMinima', parseInt(e.target.value) || 0)}
                                            placeholder="3"
                                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <label className="block mb-1 text-xs font-medium text-slate-700">
                                                Descuento (S/) por unidad
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={promo.descuento}
                                                onChange={(e) => actualizarPromocion(promo.id, 'descuento', parseFloat(e.target.value) || 0)}
                                                placeholder="2.00"
                                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                            />
                                        </div>
                                        {promociones.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => eliminarPromocion(promo.id)}
                                                className="self-end p-2 transition-colors rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                title="Eliminar promoción"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stock Inicial por Ubicación */}
                    <div className="p-4 border rounded-lg bg-slate-50 border-slate-200">
                        <h3 className="mb-3 text-sm font-semibold text-slate-900">Stock Inicial por Ubicación</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="block mb-2 text-xs font-medium text-slate-700">Tienda</label>
                                <input
                                    type="number"
                                    value={tienda}
                                    onChange={(e) => setTienda(e.target.value)}
                                    placeholder="15"
                                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-xs font-medium text-slate-700">Almacén 1</label>
                                <input
                                    type="number"
                                    value={almacen1}
                                    onChange={(e) => setAlmacen1(e.target.value)}
                                    placeholder="30"
                                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-xs font-medium text-slate-700">Almacén 2</label>
                                <input
                                    type="number"
                                    value={almacen2}
                                    onChange={(e) => setAlmacen2(e.target.value)}
                                    placeholder="20"
                                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                />
                            </div>
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
                            className="px-6 py-2.5 text-sm font-medium text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700"
                        >
                            Agregar Producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
