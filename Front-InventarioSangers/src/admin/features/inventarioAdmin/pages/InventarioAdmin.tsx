import { Edit, Plus, Search, Trash2, Package, TrendingDown, DollarSign, Warehouse, ArrowRightLeft } from "lucide-react"
import { useState, useMemo } from "react"
import { ModalAgregarProducto } from "../components/ModalAgregarProducto"
import { ModalMoverStockProducto } from "../components/ModalMoverStockProducto"

const ITEMS_PER_PAGE = 5;

interface Product {
    id: number;
    sku: string;
    nombre: string;
    descripcion: string;
    tienda: number;
    almacen1: number;
    almacen2: number;
    precioVenta: number;
    precioMayor: number;
    estado: 'OK' | 'BAJO';
}

export default function InventarioAdmin() {
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [filterCategory, setFilterCategory] = useState("Todos");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Datos de ejemplo - reemplazar con tu hook personalizado
    const allData: Product[] = [
        {
            id: 1,
            sku: "EXT-PQS-6KG",
            nombre: "Extintor PQS 6kg",
            descripcion: "Extintor de polvo seco 6kg",
            tienda: 15,
            almacen1: 30,
            almacen2: 20,
            precioVenta: 120,
            precioMayor: 110,
            estado: 'OK'
        },
        {
            id: 2,
            sku: "EXT-CO2-5KG",
            nombre: "Extintor CO2 5kg",
            descripcion: "Extintor de dióxido de carbono 5kg",
            tienda: 8,
            almacen1: 15,
            almacen2: 10,
            precioVenta: 210,
            precioMayor: 195,
            estado: 'OK'
        },
        {
            id: 3,
            sku: "EXT-ABC-4KG",
            nombre: "Extintor ABC 4kg",
            descripcion: "Extintor multiuso ABC 4kg",
            tienda: 12,
            almacen1: 25,
            almacen2: 18,
            precioVenta: 95,
            precioMayor: 85,
            estado: 'OK'
        },
        {
            id: 4,
            sku: "EXT-H2O-10L",
            nombre: "Extintor H2O 10L",
            descripcion: "Extintor de agua 10 litros",
            tienda: 5,
            almacen1: 8,
            almacen2: 6,
            precioVenta: 150,
            precioMayor: 140,
            estado: 'BAJO'
        },
    ];

    // Cálculos de estadísticas
    const totalProductos = allData.length;
    const stockTotal = allData.reduce((sum, p) => sum + p.tienda + p.almacen1 + p.almacen2, 0);
    const valorInventario = allData.reduce((sum, p) => sum + (p.tienda + p.almacen1 + p.almacen2) * p.precioVenta, 0);
    const alertasStockBajo = allData.filter(p => p.estado === 'BAJO').length;

    // Filtrado
    const filteredData = useMemo(() => {
        return allData.filter(item =>
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allData, searchTerm]);

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
        // Aquí puedes agregar la lógica para guardar el producto en tu backend
    }

    const handleMoverStock = (movimiento: any) => {
        console.log("Movimiento de stock:", movimiento);
        // Aquí puedes agregar la lógica para actualizar el stock en tu backend
    }

    const handleOpenTransferModal = (product: Product) => {
        setSelectedProduct(product);
        setIsTransferModalOpen(true);
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
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Tienda</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Almacén 1</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Almacén 2</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Precio Venta</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Precio Mayor</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Estado</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {!loading &&
                                currentData.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">{item.sku}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{item.nombre}</p>
                                                <p className="text-xs text-slate-500">{item.descripcion}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className={`inline-flex items-center justify-center w-12 h-8 text-sm font-bold text-white rounded-md ${item.tienda > 10 ? 'bg-orange-600' : 'bg-orange-400'
                                                }`}>
                                                {item.tienda}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className={`inline-flex items-center justify-center w-12 h-8 text-sm font-bold text-white rounded-md ${item.almacen1 > 20 ? 'bg-orange-600' : 'bg-orange-400'
                                                }`}>
                                                {item.almacen1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className={`inline-flex items-center justify-center w-12 h-8 text-sm font-bold text-white rounded-md ${item.almacen2 > 15 ? 'bg-orange-600' : 'bg-orange-400'
                                                }`}>
                                                {item.almacen2}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">S/ {item.precioVenta}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-600">
                                                S/ {item.precioMayor} <span className="text-xs text-slate-400">(3+ uds)</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${item.estado === 'OK'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {item.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button
                                                    className="p-2 transition-colors rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                                    onClick={() => handleOpenTransferModal(item)}
                                                    title="Mover stock"
                                                >
                                                    <ArrowRightLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 transition-colors rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50"
                                                    onClick={() => handleEdit(item.id)}
                                                    title="Editar producto"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 transition-colors rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(item.id)}
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

            {/* Modal Mover Stock */}
            <ModalMoverStockProducto
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                onSubmit={handleMoverStock}
                producto={selectedProduct}
            />
        </div>
    )
}