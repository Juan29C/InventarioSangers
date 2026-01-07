import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { listarCategoriasService } from "../../categoriaProductoAdmin/services/listarCategoria";
import { listarTiposService } from "../../categoriaProductoAdmin/services/tipo/listarTipoCate";
import type { CategoriaResponse, TipoResponse } from "../../categoriaProductoAdmin/schemas/Interface";
import { crearProductoService } from "../services/crearInventario";
import type { CreateProductoRequest } from "../schema/Interface";
import { productoSchema } from "../schema/InventarioSchema";

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

    // Estados para listas dinámicas
    const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
    const [tipos, setTipos] = useState<TipoResponse[]>([]);
    const [loadingCategorias, setLoadingCategorias] = useState(false);
    const [loadingTipos, setLoadingTipos] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar categorías al montar el componente
    useEffect(() => {
        const fetchCategorias = async () => {
            setLoadingCategorias(true);
            try {
                const data = await listarCategoriasService();
                setCategorias(data);
            } catch (error) {
                console.error("Error al cargar categorías:", error);
            } finally {
                setLoadingCategorias(false);
            }
        };

        if (isOpen) {
            fetchCategorias();
        }
    }, [isOpen]);

    // Cargar tipos cuando cambia la categoría
    useEffect(() => {
        const fetchTipos = async () => {
            if (!categoria) {
                setTipos([]);
                return;
            }

            setLoadingTipos(true);
            try {
                const data = await listarTiposService();
                // Filtrar tipos por la categoría seleccionada
                const categoriaSeleccionada = categorias.find(
                    cat => cat.nombre_categoria === categoria
                );
                if (categoriaSeleccionada) {
                    const tiposFiltrados = data.filter(
                        tipo => tipo.id_categoria === categoriaSeleccionada.id_categoria && tipo.activo
                    );
                    setTipos(tiposFiltrados);
                }
            } catch (error) {
                console.error("Error al cargar tipos:", error);
            } finally {
                setLoadingTipos(false);
            }
        };

        fetchTipos();
    }, [categoria, categorias]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            // Encontrar los IDs de categoría y tipo
            const categoriaSeleccionada = categorias.find(
                cat => cat.nombre_categoria === categoria
            );
            const tipoSeleccionado = tipos.find(
                t => t.nombre_tipo === tipo
            );

            if (!categoriaSeleccionada || !tipoSeleccionado) {
                throw new Error("Categoría o tipo no válido");
            }

            const productoData: CreateProductoRequest = {
                sku,
                nombre,
                descripcion: descripcion || undefined,
                precio_compra: parseFloat(precioCompra),
                precio_venta_unitario: parseFloat(precioVenta),
                stock_minimo: parseInt(stockMinimo),
                id_categoria: categoriaSeleccionada.id_categoria,
                id_tipo: tipoSeleccionado.id_tipo,
                activo: true,
            };

            // Validar con Zod
            const validationResult = productoSchema.safeParse(productoData);

            if (!validationResult.success) {
                // Extraer el primer error de validación
                const firstError = validationResult.error.issues[0];
                throw new Error(firstError.message);
            }

            const response = await crearProductoService(productoData);
            onSubmit(response);
            handleClose();
        } catch (err: any) {
            console.error("Error al crear producto:", err);
            setError(err.message || err.response?.data?.message || "Error al crear el producto. Por favor, intente nuevamente.");
        } finally {
            setSubmitting(false);
        }
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
        setError(null);
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
                        <p className="mt-1 text-sm text-slate-600">Complete los datos básicos del producto</p>
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
                                    setTipo('');
                                }}
                                required
                                disabled={loadingCategorias}
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                            >
                                <option value="">
                                    {loadingCategorias ? 'Cargando categorías...' : 'Seleccionar categoría'}
                                </option>
                                {categorias.map((cat) => (
                                    <option key={cat.id_categoria} value={cat.nombre_categoria}>
                                        {cat.nombre_categoria}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Tipo <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                required
                                disabled={!categoria || loadingTipos}
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                            >
                                <option value="">
                                    {!categoria
                                        ? 'Primero seleccione una categoría'
                                        : loadingTipos
                                            ? 'Cargando tipos...'
                                            : tipos.length === 0
                                                ? 'No hay tipos disponibles'
                                                : 'Seleccionar tipo'}
                                </option>
                                {tipos.map((tipo) => (
                                    <option key={tipo.id_tipo} value={tipo.nombre_tipo}>
                                        {tipo.nombre_tipo}
                                    </option>
                                ))}
                            </select>
                            {!categoria && (
                                <p className="mt-1 text-xs text-slate-500">
                                    Seleccione primero una categoría
                                </p>
                            )}
                        </div>
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

                    {/* Info Note */}
                    <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                        <p className="text-sm text-orange-800">
                            <strong>Nota:</strong> El stock inicial y las promociones se gestionan desde el botón "Gestión de Inventario" en la tabla de productos.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 border-l-4 border-red-500 bg-red-50">
                            <p className="text-sm text-red-800">
                                <strong>Error:</strong> {error}
                            </p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={submitting}
                            className="px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 text-sm font-medium text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Guardando...' : 'Agregar Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
