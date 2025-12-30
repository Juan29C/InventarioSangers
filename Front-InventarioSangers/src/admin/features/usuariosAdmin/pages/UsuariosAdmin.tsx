import { Edit, Plus, Search, Trash2, Users as UsersIcon } from "lucide-react"
import { useState, useMemo } from "react"
import { ModalCrearUsuario } from "../components/ModalCrearUsuario"

const ITEMS_PER_PAGE = 5;

interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
    activo: boolean;
}

export default function UsuariosAdmin() {
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Datos de ejemplo - reemplazar con tu hook personalizado
    const allData: Usuario[] = [
        {
            id: 1,
            nombre: "Admin",
            apellido: "Principal",
            correo: "admin@seguridad.com",
            rol: "Administrador",
            activo: true
        },
        {
            id: 2,
            nombre: "Roberto",
            apellido: "Sánchez",
            correo: "roberto@seguridad.com",
            rol: "Vendedor",
            activo: true
        },
        {
            id: 3,
            nombre: "Juan",
            apellido: "Pérez",
            correo: "juan@seguridad.com",
            rol: "Técnico",
            activo: true
        },
        {
            id: 4,
            nombre: "María",
            apellido: "González",
            correo: "maria@seguridad.com",
            rol: "Técnico",
            activo: true
        },
        {
            id: 5,
            nombre: "Carlos",
            apellido: "Ruiz",
            correo: "carlos@seguridad.com",
            rol: "Técnico",
            activo: true
        },
    ];

    // Filtrado
    const filteredData = useMemo(() => {
        return allData.filter(item =>
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.correo.toLowerCase().includes(searchTerm.toLowerCase())
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

    const handleAddUser = (usuario: any) => {
        console.log("Nuevo usuario creado:", usuario);
        // Aquí puedes agregar la lógica para guardar el usuario en tu backend
    };

    const handleEdit = (id: number) => {
        console.log("Editar usuario:", id)
    }

    const handleDelete = (id: number) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            console.log("Eliminar usuario:", id)
        }
    }

    // Generar números de página
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    // Obtener iniciales para el avatar
    const getInitials = (nombre: string, apellido: string) => {
        return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
    };

    // Colores para avatares
    const avatarColors = [
        'bg-red-500',
        'bg-orange-500',
        'bg-amber-500',
        'bg-green-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-purple-500',
        'bg-pink-500'
    ];

    const getAvatarColor = (id: number) => {
        return avatarColors[id % avatarColors.length];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Usuarios del Sistema</h1>
                    <p className="mt-1 text-slate-600">Gestiona los usuarios y sus permisos</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2.5 space-x-2 text-white transition-colors bg-orange-600 rounded-lg shadow-sm hover:bg-orange-700"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Usuario</span>
                </button>
            </div>

            {/* Search */}
            <div className="flex items-center max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                    <input
                        placeholder="Buscar por nombre o email..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b bg-slate-50 border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Nombre</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Email</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Rol</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Estado</th>
                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {!loading &&
                                currentData.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">

                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{item.nombre} {item.apellido}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600">{item.correo}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${item.rol === 'Administrador'
                                                    ? 'bg-red-100 text-red-800'
                                                    : item.rol === 'Vendedor'
                                                        ? 'bg-slate-100 text-slate-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {item.rol}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${item.activo
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {item.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button
                                                    className="p-2 transition-colors rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50"
                                                    onClick={() => handleEdit(item.id)}
                                                    title="Editar usuario"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 transition-colors rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(item.id)}
                                                    title="Eliminar usuario"
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
                            <span className="font-medium text-slate-900">{filteredData.length}</span> usuarios
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

            {/* Modal Crear Usuario */}
            <ModalCrearUsuario
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddUser}
            />
        </div>
    )
}