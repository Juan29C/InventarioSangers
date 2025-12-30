import { Plus, Phone, Mail, Building2, FileText, TrendingUp, Users, UserCheck, UserX, Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import { ModalCrearCrm } from "../components/ModalCrearCrm";

interface Prospecto {
    id: number;
    nombre: string;
    telefono: string;
    email?: string;
    empresa?: string;
    rucDni?: string;
    descripcion: string;
    montoPagado: number;
    proceso: string;
    fecha: string;
}

export default function CrmAdmin() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterMes, setFilterMes] = useState("");
    const [filterProceso, setFilterProceso] = useState("");

    // Datos de ejemplo basados en el Excel
    const prospectos: Prospecto[] = [
        {
            id: 1,
            nombre: "Anthony López",
            telefono: "908 820 314",
            email: "anthony@email.com",
            descripcion: "No se registra información",
            montoPagado: 0,
            proceso: "sin_informacion",
            fecha: "2025-07-18"
        },
        {
            id: 2,
            nombre: "Dani",
            telefono: "972 670 130",
            descripcion: "No se registra información",
            montoPagado: 0,
            proceso: "sin_informacion",
            fecha: "2025-07-21"
        },
        {
            id: 3,
            nombre: "Katherin Montoya",
            telefono: "922 914 493",
            descripcion: "No se registra información",
            montoPagado: 0,
            proceso: "sin_informacion",
            fecha: "2025-07-24"
        },
        {
            id: 7,
            nombre: "Katherin Montoya",
            telefono: "922 914 493",
            descripcion: "No se registra información",
            montoPagado: 0,
            proceso: "sin_informacion",
            fecha: "2025-07-24"
        },
        {
            id: 4,
            nombre: "Estructuras Metálicas",
            telefono: "968811551",
            empresa: "Estructuras Metálicas SAC",
            descripcion: "Recarga de extintor 6 kg",
            montoPagado: 35,
            proceso: "interesado",
            fecha: "2025-08-07"
        },
        {
            id: 5,
            nombre: "Donna",
            telefono: "984 292 947",
            descripcion: "Precio de extintor de 6 kg",
            montoPagado: 0,
            proceso: "contactado",
            fecha: "2025-07-31"
        },
        {
            id: 6,
            nombre: "Alberto",
            telefono: "903 436 373",
            descripcion: "EPP",
            montoPagado: 0,
            proceso: "cliente_cerrado",
            fecha: "2025-08-04"
        },
    ];

    const columnas = [
        {
            id: "sin_informacion",
            titulo: "Sin Información",
            color: "bg-slate-100",
            borderColor: "border-slate-300",
            textColor: "text-slate-700",
            icon: Users
        },
        {
            id: "interesado",
            titulo: "Interesado",
            color: "bg-blue-50",
            borderColor: "border-blue-300",
            textColor: "text-blue-700",
            icon: TrendingUp
        },
        {
            id: "contactado",
            titulo: "Contactado",
            color: "bg-yellow-50",
            borderColor: "border-yellow-300",
            textColor: "text-yellow-700",
            icon: Phone
        },
        {
            id: "cliente_cerrado",
            titulo: "Cliente Cerrado",
            color: "bg-green-50",
            borderColor: "border-green-300",
            textColor: "text-green-700",
            icon: UserCheck
        },
        {
            id: "no_realizado",
            titulo: "No Realizado",
            color: "bg-red-50",
            borderColor: "border-red-300",
            textColor: "text-red-700",
            icon: UserX
        },
    ];

    const handleAddProspecto = (prospecto: any) => {
        console.log("Nuevo prospecto agregado:", prospecto);
        // Aquí puedes agregar la lógica para guardar el prospecto en tu backend
    };

    // Filtrar prospectos por búsqueda y filtros
    const filteredProspectos = useMemo(() => {
        let filtered = prospectos;

        // Filtro por búsqueda (nombre, teléfono, empresa)
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.telefono.includes(searchTerm) ||
                p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.empresa && p.empresa.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filtro por mes
        if (filterMes) {
            filtered = filtered.filter(p => {
                const fecha = new Date(p.fecha);
                const mes = fecha.getMonth() + 1; // getMonth() retorna 0-11
                return mes.toString() === filterMes;
            });
        }

        // Filtro por proceso
        if (filterProceso) {
            filtered = filtered.filter(p => p.proceso === filterProceso);
        }

        return filtered;
    }, [prospectos, searchTerm, filterMes, filterProceso]);

    // Agrupar prospectos por columna
    const prospectosPorColumna = useMemo(() => {
        const grupos: Record<string, Prospecto[]> = {};

        columnas.forEach(col => {
            grupos[col.id] = filteredProspectos.filter(p => p.proceso === col.id);
        });

        return grupos;
    }, [filteredProspectos, columnas]);

    // Estadísticas
    const stats = useMemo(() => {
        return {
            total: prospectos.length,
            sinInformacion: prospectos.filter(p => p.proceso === 'sin_informacion').length,
            interesados: prospectos.filter(p => p.proceso === 'interesado').length,
            clientesCerrados: prospectos.filter(p => p.proceso === 'cliente_cerrado').length,
        };
    }, [prospectos]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">CRM - Gestión de Prospectos</h1>
                    <p className="mt-1 text-slate-600">Pipeline de ventas y seguimiento de clientes potenciales</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2.5 space-x-2 text-white transition-colors bg-orange-600 rounded-lg shadow-sm hover:bg-orange-700"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Prospecto</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Prospectos</p>
                            <p className="mt-1 text-3xl font-bold text-slate-900">{stats.total}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-100">
                            <Users className="w-6 h-6 text-slate-600" />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Sin Información</p>
                            <p className="mt-1 text-3xl font-bold text-slate-900">{stats.sinInformacion}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-100">
                            <FileText className="w-6 h-6 text-slate-600" />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Interesados</p>
                            <p className="mt-1 text-3xl font-bold text-blue-600">{stats.interesados}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-100">
                            <Phone className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Clientes Cerrados</p>
                            <p className="mt-1 text-3xl font-bold text-green-600">{stats.clientesCerrados}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-100">
                            <UserCheck className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="flex-1 min-w-[250px]">
                        <div className="relative">
                            <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, teléfono o empresa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Filter by Month */}
                    <div className="w-48">
                        <select
                            value={filterMes}
                            onChange={(e) => setFilterMes(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                        >
                            <option value="">Todos los meses</option>
                            <option value="1">Enero</option>
                            <option value="2">Febrero</option>
                            <option value="3">Marzo</option>
                            <option value="4">Abril</option>
                            <option value="5">Mayo</option>
                            <option value="6">Junio</option>
                            <option value="7">Julio</option>
                            <option value="8">Agosto</option>
                            <option value="9">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                    </div>

                    {/* Filter by Process */}
                    <div className="w-48">
                        <select
                            value={filterProceso}
                            onChange={(e) => setFilterProceso(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                        >
                            <option value="">Todos los estados</option>
                            <option value="sin_informacion">Sin Información</option>
                            <option value="interesado">Interesado</option>
                            <option value="contactado">Contactado</option>
                            <option value="cliente_cerrado">Cliente Cerrado</option>
                            <option value="no_realizado">No Realizado</option>
                        </select>
                    </div>

                    {/* Clear Filters Button */}
                    {(searchTerm || filterMes || filterProceso) && (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setFilterMes("");
                                setFilterProceso("");
                            }}
                            className="flex items-center px-4 py-2.5 space-x-2 text-sm font-medium text-slate-700 transition-colors bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                        >
                            <X className="w-4 h-4" />
                            <span>Limpiar filtros</span>
                        </button>
                    )}
                </div>

                {/* Active Filters Info */}
                {(searchTerm || filterMes || filterProceso) && (
                    <div className="flex items-center gap-2 mt-3">
                        <span className="text-sm text-slate-600">Mostrando {filteredProspectos.length} de {prospectos.length} prospectos</span>
                    </div>
                )}
            </div>

            {/* Kanban Board */}
            <div className="overflow-x-auto">
                <div className="inline-flex gap-4 pb-4 min-w-full">
                    {columnas.map((columna) => {
                        const Icon = columna.icon;
                        const prospectosColumna = prospectosPorColumna[columna.id] || [];

                        return (
                            <div key={columna.id} className="flex-shrink-0 w-80">
                                {/* Column Header */}
                                <div className={`${columna.color} border-2 ${columna.borderColor} rounded-t-xl p-4`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Icon className={`w-5 h-5 ${columna.textColor}`} />
                                            <h3 className={`font-semibold ${columna.textColor}`}>{columna.titulo}</h3>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${columna.color} ${columna.textColor} border ${columna.borderColor}`}>
                                            {prospectosColumna.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Column Content */}
                                <div className={`bg-white border-2 border-t-0 ${columna.borderColor} rounded-b-xl p-3 min-h-[400px] max-h-[600px] overflow-y-auto space-y-3`}>
                                    {prospectosColumna.length === 0 ? (
                                        <div className="flex items-center justify-center h-32">
                                            <p className="text-sm text-slate-400">No hay prospectos</p>
                                        </div>
                                    ) : (
                                        prospectosColumna.map((prospecto) => (
                                            <div
                                                key={prospecto.id}
                                                className="p-4 transition-shadow bg-white border rounded-lg shadow-sm cursor-pointer border-slate-200 hover:shadow-md hover:border-orange-300"
                                            >
                                                {/* Nombre */}
                                                <h4 className="font-semibold text-slate-900">{prospecto.nombre}</h4>

                                                {/* Empresa */}
                                                {prospecto.empresa && (
                                                    <div className="flex items-center mt-2 space-x-2 text-xs text-slate-600">
                                                        <Building2 className="w-3 h-3" />
                                                        <span>{prospecto.empresa}</span>
                                                    </div>
                                                )}

                                                {/* Teléfono */}
                                                <div className="flex items-center mt-2 space-x-2 text-xs text-slate-600">
                                                    <Phone className="w-3 h-3" />
                                                    <span>{prospecto.telefono}</span>
                                                </div>

                                                {/* Email */}
                                                {prospecto.email && (
                                                    <div className="flex items-center mt-1 space-x-2 text-xs text-slate-600">
                                                        <Mail className="w-3 h-3" />
                                                        <span className="truncate">{prospecto.email}</span>
                                                    </div>
                                                )}

                                                {/* Descripción */}
                                                {prospecto.descripcion && (
                                                    <div className="mt-2">
                                                        <p className="text-xs text-slate-600 line-clamp-2">{prospecto.descripcion}</p>
                                                    </div>
                                                )}

                                                {/* Footer */}
                                                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                                                    <span className="text-xs text-slate-500">
                                                        {new Date(prospecto.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                    {prospecto.montoPagado > 0 && (
                                                        <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
                                                            S/ {prospecto.montoPagado.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal Crear CRM */}
            <ModalCrearCrm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddProspecto}
            />
        </div>
    );
}
