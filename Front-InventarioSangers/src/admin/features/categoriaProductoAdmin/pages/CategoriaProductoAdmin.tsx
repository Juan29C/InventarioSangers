import { Edit, Plus, Search, Trash2, AlertCircle, Tag, BadgePlus } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { CrearCategoriaProModal } from "../components/CrearCategoriaProModal"
import { ActualizarCategoriaProModal } from "../components/ActualizarCategoriaProModal"
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal"
import { GestionarTiposModal } from "../components/GestionarTiposModal"
import { crearCategoriaService } from "../services/crearCategoria"
import { listarCategoriasService } from "../services/listarCategoria"
import { eliminarCategoriaService } from "../services/eliminarCategoria"
import { actualizarCategoriaService } from "../services/actualizarCategoria"
import type { CreateCategoriaRequest, CategoriaResponse } from "../schemas/Interface"

const ITEMS_PER_PAGE = 5;

export default function CategoriaProductoAdmin() {
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isTiposModalOpen, setIsTiposModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
    const [selectedCategoria, setSelectedCategoria] = useState<CategoriaResponse | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Cargar categorías al montar el componente
    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await listarCategoriasService();
            setCategorias(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cargar las categorías");
        } finally {
            setLoading(false);
        }
    };

    // Filtrado
    const filteredData = useMemo(() => {
        return categorias.filter(item =>
            item.nombre_categoria.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categorias, searchTerm]);

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

    const openModal = () => setIsModalOpen(true);

    const handleSubmit = async (data: CreateCategoriaRequest) => {
        try {
            await crearCategoriaService(data);
            // Recargar la lista de categorías
            await cargarCategorias();
        } catch (error) {
            console.error("Error al crear categoría:", error);
        }
    }

    const handleEdit = (categoria: CategoriaResponse) => {
        setSelectedCategoria(categoria);
        setIsEditModalOpen(true);
    }

    const handleUpdate = async (id: number, data: CreateCategoriaRequest) => {
        try {
            await actualizarCategoriaService(id, data);
            // Recargar la lista de categorías
            await cargarCategorias();
        } catch (error) {
            console.error("Error al actualizar categoría:", error);
            throw error;
        }
    }

    const openDeleteModal = (categoria: CategoriaResponse) => {
        setSelectedCategoria(categoria);
        setIsDeleteModalOpen(true);
    }

    const handleDelete = async () => {
        if (!selectedCategoria) return;

        setIsDeleting(true);
        try {
            await eliminarCategoriaService(selectedCategoria.id_categoria);
            // Recargar la lista de categorías
            await cargarCategorias();
            setIsDeleteModalOpen(false);
            setSelectedCategoria(null);
        } catch (error) {
            console.error("Error al eliminar categoría:", error);
            alert("Error al eliminar la categoría");
        } finally {
            setIsDeleting(false);
        }
    }

    const handleOpenTiposModal = (categoria: CategoriaResponse) => {
        setSelectedCategoria(categoria);
        setIsTiposModalOpen(true);
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
            <div className="bg-white border shadow-sm rounded-xl border-slate-200">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-blue-50">
                                <Tag className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Gestión de Categorías</h1>
                                <p className="mt-1 text-slate-600">Administra las categorías de productos</p>
                            </div>
                        </div>
                        <button
                            className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-[#132436] rounded-lg shadow-sm hover:bg-[#224666]"
                            onClick={openModal}
                        >
                            <Plus className="w-4 h-4" />
                            <span>Nueva Categoría</span>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                                <input
                                    placeholder="Buscar por nombre de categoría..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex items-center px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200">
                            <span className="font-medium text-slate-700">{filteredData.length}</span>
                            <span className="ml-1 text-slate-500">categorías</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b bg-slate-50 border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">ID</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Nombre de Categoría</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading && (
                                <tr>
                                    <td colSpan={3} className="py-16 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="w-8 h-8 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                            <p className="text-slate-600">Cargando categorías...</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {error && (
                                <tr>
                                    <td colSpan={3} className="py-16 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="p-3 rounded-full bg-red-50">
                                                <AlertCircle className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-red-900">Error al cargar las categorías</p>
                                                <p className="mt-1 text-sm text-red-600">{error}</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!loading && !error && filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="py-16 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="p-3 rounded-full bg-slate-100">
                                                <Search className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-700">No se encontraron categorías</p>
                                                <p className="mt-1 text-sm text-slate-500">Intenta con otros términos de búsqueda</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!loading &&
                                currentData.map((item) => (
                                    <tr key={item.id_categoria} className="transition-colors hover:bg-slate-50 items-center">
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">{item.id_categoria}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="max-w-xs mx-auto">
                                                <p className="text-sm font-medium text-slate-900">{item.nombre_categoria}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button
                                                    className="p-2 transition-colors rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                                    onClick={() => handleOpenTiposModal(item)}
                                                    title="Agregar Tipo"
                                                >
                                                    <BadgePlus className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 transition-colors rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                                    onClick={() => handleEdit(item)}
                                                    title="Editar categoría"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 transition-colors rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => openDeleteModal(item)}
                                                    title="Eliminar categoría"
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
                            <span className="font-medium text-slate-900">{filteredData.length}</span> categorías
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
                                            ? "bg-[#132436] text-white"
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

            {/* Modales */}
            <CrearCategoriaProModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
            />

            <ActualizarCategoriaProModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleUpdate}
                categoria={selectedCategoria}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                itemName={selectedCategoria?.nombre_categoria || ''}
                isDeleting={isDeleting}
            />

            <GestionarTiposModal
                isOpen={isTiposModalOpen}
                onClose={() => setIsTiposModalOpen(false)}
                idCategoria={selectedCategoria?.id_categoria || 0}
                nombreCategoria={selectedCategoria?.nombre_categoria || ''}
            />
        </div>
    )
}