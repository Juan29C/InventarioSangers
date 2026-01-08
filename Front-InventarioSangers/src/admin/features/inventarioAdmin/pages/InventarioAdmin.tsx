import { Edit, Plus, Search, Trash2, Package, TrendingDown, DollarSign, Warehouse, Settings } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { ModalAgregarProducto } from "../components/ModalAgregarProducto"
import { ModalGestionInventario } from "../components/ModalGestionInventario"
import { listarProductosService } from "../services/listarInventario"
import { listarStockService } from "../services/listarStock"
import type { ProductoResponse, StockUbicacionResponse } from "../schema/Interface"

const ITEMS_PER_PAGE = 5;

export default function InventarioAdmin() {
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [filterCategory, setFilterCategory] = useState("Todos");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGestionModalOpen, setIsGestionModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductoResponse | null>(null);
    const [productos, setProductos] = useState<ProductoResponse[]>([]);
    const [stockData, setStockData] = useState<StockUbicacionResponse[]>([]);

    // Cargar productos al montar el componente
    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        setLoading(true);
        setError("");
        try {
            const [productosData, stockDataResponse] = await Promise.all([
                listarProductosService(),
                listarStockService()
            ]);
            setProductos(productosData);
            setStockData(stockDataResponse);
        } catch (err: any) {
            console.error("Error al cargar productos:", err);
            setError(err.message || "Error al cargar los productos");
        } finally {
            setLoading(false);
        }
    };

    // Helper para obtener stock por producto y ubicación
    const getStockPorUbicacion = (idProducto: number, nombreUbicacion: string): number => {
        const stock = stockData.find(
            s => s.id_producto === idProducto && s.ubicacion.nombre_ubicacion === nombreUbicacion
        );
        return stock?.cantidad || 0;
    };

    // Helper para obtener stock total por producto
    const getStockTotal = (idProducto: number): number => {
        return stockData
            .filter(s => s.id_producto === idProducto)
            .reduce((sum, s) => sum + s.cantidad, 0);
    };

    // Obtener ubicaciones únicas con stock
    const ubicacionesUnicas = useMemo(() => {
        const ubicaciones = stockData.map(s => s.ubicacion.nombre_ubicacion);
        return [...new Set(ubicaciones)].sort();
    }, [stockData]);

    // Cálculos de estadísticas
    const totalProductos = productos.length;
    const stockTotal = stockData.reduce((sum, s) => sum + s.cantidad, 0);
    const valorInventario = stockData.reduce((sum, s) => {
        const producto = productos.find(p => p.id_producto === s.id_producto);
        return sum + (s.cantidad * parseFloat(producto?.precio_venta_unitario || '0'));
    }, 0);
    const alertasStockBajo = productos.filter(p => {
        const total = getStockTotal(p.id_producto);
        return total < p.stock_minimo;
    }).length;

    // Filtrado
    const filteredData = useMemo(() => {
        return productos.filter(item =>
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [productos, searchTerm]);

    // Paginación
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = filteredData.slice(startIndex, endIndex);

    // Reset página cuando cambia el filtro
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleEdit = (id: number) => {
        console.log("Editar producto:", id)
    }

    const handleDelete = (id: number) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            console.log("Eliminar producto:", id)
        }
    }

    const handleAddProduct = (producto: any) => {
        console.log("Nuevo producto agregado:", producto);
        alert(`Producto "${producto.nombre}" creado exitosamente con SKU: ${producto.sku}`);
        // Recargar la lista de productos
        fetchProductos();
    }

    const handleGestionInventario = (data: any) => {
        console.log("Gestión de inventario:", data);

        // Mostrar mensaje de éxito según el tipo de operación
        if (data.tipo === 'añadir' && data.ok) {
            alert(`Stock añadido exitosamente!\nCantidad: ${data.movimiento.cantidad}\nUbicación ID: ${data.movimiento.id_ubicacion}\nMotivo: ${data.movimiento.motivo}`);
            fetchProductos();
        }

        if (data.tipo === 'salida' && data.ok) {
            alert(`Salida registrada exitosamente!\nCantidad: ${data.movimiento.cantidad}\nUbicación ID: ${data.movimiento.id_ubicacion}\nMotivo: ${data.movimiento.motivo}`);
            fetchProductos();
        }

        if (data.tipo === 'mover' && data.ok) {
            alert(`Stock movido exitosamente!\nCantidad: ${data.salida.cantidad}\nOrigen: Ubicación ${data.salida.id_ubicacion}\nDestino: Ubicación ${data.entrada.id_ubicacion}\nMotivo: ${data.salida.motivo}`);
            fetchProductos();
        }

        // Aquí puedes agregar la lógica para otros tipos de operaciones
    }

    const handleOpenGestionModal = (product: ProductoResponse) => {
        setSelectedProduct(product);
        setIsGestionModalOpen(true);
    }

    // Generar números de página
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Inventario</h1>
                    <p className="mt-1 text-slate-600">Gestión de productos multialmacén</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2.5 space-x-2 text-white transition-colors bg-orange-600 rounded-lg shadow-sm hover:bg-orange-700"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Producto</span>
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Productos */}
                <div className="relative p-6 overflow-hidden bg-white border rounded-xl border-slate-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Productos</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{totalProductos}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-red-50">
                            <Package className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                {/* Stock Total */}
                <div className="relative p-6 overflow-hidden bg-white border rounded-xl border-slate-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Stock Total</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{stockTotal} <span className="text-base font-normal text-slate-500">uds</span></p>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-50">
                            <Warehouse className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Valor Inventario */}
                <div className="relative p-6 overflow-hidden bg-white border rounded-xl border-slate-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Valor Inventario</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">S/ {valorInventario.toFixed(2)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-50">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Alertas Stock Bajo */}
                <div className="relative p-6 overflow-hidden bg-white border rounded-xl border-slate-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Alertas Stock Bajo</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{alertasStockBajo}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-red-50">
                            <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Productos */}
            <div className="bg-white border rounded-xl border-slate-200">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Lista de Productos</h2>
                </div>

                <div className="p-6 border-b border-slate-200">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                                <input
                                    placeholder="Buscar por nombre o SKU..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                />
                            </div>
                        </div>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                        >
                            <option>Todos</option>
                            <option>Extintores</option>
                            <option>Accesorios</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b bg-slate-50 border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">SKU</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Producto</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Categoría</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Tipo</th>
                                {/* Columnas dinámicas de stock por ubicación */}
                                {ubicacionesUnicas.map(ubicacion => (
                                    <th key={ubicacion} className="px-4 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600 bg-orange-50">
                                        {ubicacion}
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600 bg-slate-100">Stock Total</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Precio Compra</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Precio Venta</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Stock Mínimo</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Estado</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading && (
                                <tr>
                                    <td colSpan={10 + ubicacionesUnicas.length} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <div className="w-8 h-8 border-4 border-orange-600 rounded-full border-t-transparent animate-spin"></div>
                                            <p className="text-sm text-slate-600">Cargando productos...</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!loading && error && (
                                <tr>
                                    <td colSpan={10 + ubicacionesUnicas.length} className="px-6 py-12 text-center">
                                        <div className="text-sm text-red-600">{error}</div>
                                    </td>
                                </tr>
                            )}
                            {!loading && !error &&
                                currentData.map((item) => (
                                    <tr key={item.id_producto} className="transition-colors hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">{item.sku}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{item.nombre}</p>
                                                <p className="text-xs text-slate-500">{item.descripcion || 'Sin descripción'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-700">{item.categoria.nombre_categoria}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-700">{item.tipo.nombre_tipo}</div>
                                        </td>
                                        {/* Columnas dinámicas de stock por ubicación */}
                                        {ubicacionesUnicas.map(ubicacion => {
                                            const stock = getStockPorUbicacion(item.id_producto, ubicacion);
                                            const isLow = stock < item.stock_minimo;
                                            return (
                                                <td key={ubicacion} className="px-4 py-4 text-center whitespace-nowrap bg-orange-50/30">
                                                    <span className={`inline-flex items-center justify-center w-14 h-8 text-sm font-bold text-white rounded-md ${stock === 0 ? 'bg-slate-400' : isLow ? 'bg-red-600' : 'bg-green-600'
                                                        }`}>
                                                        {stock}
                                                    </span>
                                                </td>
                                            );
                                        })}
                                        {/* Columna de Stock Total */}
                                        <td className="px-6 py-4 text-center whitespace-nowrap bg-slate-100">
                                            <span className={`inline-flex items-center justify-center w-16 h-8 text-sm font-bold text-white rounded-md ${getStockTotal(item.id_producto) < item.stock_minimo ? 'bg-red-600' : 'bg-slate-700'
                                                }`}>
                                                {getStockTotal(item.id_producto)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">S/ {parseFloat(item.precio_compra).toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">S/ {parseFloat(item.precio_venta_unitario).toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className="inline-flex items-center justify-center w-12 h-8 text-sm font-bold text-white bg-orange-600 rounded-md">
                                                {item.stock_minimo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${item.activo
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {item.activo ? 'ACTIVO' : 'INACTIVO'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button
                                                    className="p-2 transition-colors rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                                    onClick={() => handleOpenGestionModal(item)}
                                                    title="Gestión de inventario"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 transition-colors rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50"
                                                    onClick={() => handleEdit(item.id_producto)}
                                                    title="Editar producto"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 transition-colors rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(item.id_producto)}
                                                    title="Eliminar producto"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {!loading && !error && filteredData.length > 0 && (
                    <div className="flex flex-col items-center justify-between gap-4 px-6 py-4 border-t sm:flex-row border-slate-200">
                        <div className="text-sm text-slate-600">
                            Mostrando <span className="font-medium text-slate-900">{startIndex + 1}</span> a{" "}
                            <span className="font-medium text-slate-900">{Math.min(endIndex, filteredData.length)}</span> de{" "}
                            <span className="font-medium text-slate-900">{filteredData.length}</span> elementos
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Anterior
                            </button>

                            <div className="flex gap-1">
                                {getPageNumbers().map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${currentPage === pageNum
                                            ? "bg-slate-900 text-white"
                                            : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Agregar Producto */}
            <ModalAgregarProducto
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddProduct}
            />

            {/* Modal Gestión de Inventario */}
            <ModalGestionInventario
                isOpen={isGestionModalOpen}
                onClose={() => setIsGestionModalOpen(false)}
                onSubmit={handleGestionInventario}
                producto={selectedProduct}
            />
        </div>
    )
}