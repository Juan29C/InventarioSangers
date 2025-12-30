import { Search, AlertTriangle, CheckCircle, Clock, Calendar, Edit, FileText, Shield } from "lucide-react";
import { useState, useMemo } from "react";
import { ModalEditarSeguimiento } from "../components/ModalEditarSeguimiento";

interface Extintor {
    id: number;
    mes: string;
    codigoSerie: string;
    nombreEmpresa: string;
    rucDni: string;
    telefono: string;
    tipoExtintor: string;
    capacidad: string;
    fechaRecarga: string;
    proximaRecarga: string;
    proceso: string;
    montoPagado: number;
    nroCertificado?: string;
    proximaRecariaVencimiento?: string;
    tipoCliente?: string;
    frecuenciaRevision?: string; // "mensual", "bimestral", "trimestral"
    notas?: string;
}

export default function ExtintoresAdmin() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEstado, setFilterEstado] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExtintor, setSelectedExtintor] = useState<Extintor | null>(null);

    // Datos de ejemplo - estos vendrían automáticamente de las ventas
    const extintores: Extintor[] = [
        {
            id: 1,
            mes: "Enero",
            codigoSerie: "EXT-2024-001",
            nombreEmpresa: "Empresa Industrial SAC",
            rucDni: "20123456789",
            telefono: "987654321",
            tipoExtintor: "PQS",
            capacidad: "6kg",
            fechaRecarga: "2024-01-14",
            proximaRecarga: "2026-01-14",
            proceso: "vigente",
            montoPagado: 150,
            nroCertificado: "CERT-2024-001",
            frecuenciaRevision: "trimestral",
            notas: "Cliente solicita revisión cada 3 meses"
        },
        {
            id: 2,
            mes: "Junio",
            codigoSerie: "EXT-2024-002",
            nombreEmpresa: "Empresa Industrial SAC",
            rucDni: "20123456789",
            telefono: "987654321",
            tipoExtintor: "CO2",
            capacidad: "5kg",
            fechaRecarga: "2024-06-09",
            proximaRecarga: "2026-06-09",
            proceso: "vigente",
            montoPagado: 180,
            frecuenciaRevision: "bimestral"
        },
        {
            id: 3,
            mes: "Diciembre",
            codigoSerie: "EXT-2023-045",
            nombreEmpresa: "Comercial del Norte EIRL",
            rucDni: "10987654321",
            telefono: "912345678",
            tipoExtintor: "PQS",
            capacidad: "12kg",
            fechaRecarga: "2023-12-15",
            proximaRecarga: "2025-12-15",
            proceso: "por_vencer",
            montoPagado: 200,
            frecuenciaRevision: "mensual",
            notas: "Requiere inspección mensual por normativa industrial"
        },
        {
            id: 4,
            mes: "Octubre",
            codigoSerie: "EXT-2023-032",
            nombreEmpresa: "Hotel Plaza",
            rucDni: "20555666777",
            telefono: "998877665",
            tipoExtintor: "CO2",
            capacidad: "9kg",
            fechaRecarga: "2023-10-20",
            proximaRecarga: "2024-10-20",
            proceso: "vencido",
            montoPagado: 175
        },
    ];

    // Calcular días restantes para vencimiento
    const getDiasRestantes = (proximaRecarga: string) => {
        const hoy = new Date();
        const fechaProxima = new Date(proximaRecarga);
        const diffTime = fechaProxima.getTime() - hoy.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Determinar estado automáticamente
    const getEstado = (proximaRecarga: string) => {
        const dias = getDiasRestantes(proximaRecarga);
        if (dias < 0) return "vencido";
        if (dias <= 15) return "por_vencer";
        return "vigente";
    };

    // Filtrar extintores
    const filteredExtintores = useMemo(() => {
        let filtered = extintores;

        // Filtro por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(e =>
                e.codigoSerie.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.rucDni.includes(searchTerm) ||
                e.telefono.includes(searchTerm)
            );
        }

        // Filtro por estado
        if (filterEstado) {
            filtered = filtered.filter(e => getEstado(e.proximaRecarga) === filterEstado);
        }

        return filtered;
    }, [extintores, searchTerm, filterEstado]);

    // Estadísticas
    const stats = useMemo(() => {
        const total = extintores.length;
        const vigentes = extintores.filter(e => getEstado(e.proximaRecarga) === "vigente").length;
        const porVencer = extintores.filter(e => getEstado(e.proximaRecarga) === "por_vencer").length;
        const vencidos = extintores.filter(e => getEstado(e.proximaRecarga) === "vencido").length;

        return { total, vigentes, porVencer, vencidos };
    }, [extintores]);

    const handleEditarExtintor = (extintor: Extintor) => {
        setSelectedExtintor(extintor);
        setIsModalOpen(true);
    };

    const handleGuardarSeguimiento = (data: any) => {
        console.log("Guardar seguimiento:", data);
        // Aquí actualizarías el extintor en tu backend
    };

    const getEstadoBadge = (proximaRecarga: string) => {
        const estado = getEstado(proximaRecarga);
        const dias = getDiasRestantes(proximaRecarga);

        if (estado === "vencido") {
            return (
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Vencido ({Math.abs(dias)} días)
                </span>
            );
        }

        if (estado === "por_vencer") {
            return (
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">
                    <Clock className="w-3 h-3 mr-1" />
                    Por vencer ({dias} días)
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                <CheckCircle className="w-3 h-3 mr-1" />
                Vigente ({dias} días)
            </span>
        );
    };

    const getFrecuenciaLabel = (frecuencia?: string) => {
        if (!frecuencia) return "No definida";
        const labels: Record<string, string> = {
            mensual: "Mensual",
            bimestral: "Cada 2 meses",
            trimestral: "Cada 3 meses",
            semestral: "Cada 6 meses"
        };
        return labels[frecuencia] || frecuencia;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Gestión de Extintores</h1>
                    <p className="mt-1 text-slate-600">Seguimiento de vencimientos y mantenimiento de equipos de seguridad</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Extintores</p>
                            <p className="mt-1 text-3xl font-bold text-slate-900">{stats.total}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-100">
                            <Shield className="w-6 h-6 text-slate-600" />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Vigentes</p>
                            <p className="mt-1 text-3xl font-bold text-green-600">{stats.vigentes}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-100">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Por Vencer (15 días)</p>
                            <p className="mt-1 text-3xl font-bold text-yellow-600">{stats.porVencer}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-yellow-100">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Vencidos</p>
                            <p className="mt-1 text-3xl font-bold text-red-600">{stats.vencidos}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-red-100">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="flex-1 min-w-[300px]">
                        <div className="relative">
                            <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar por N° Serie, Cliente, RUC o Teléfono..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Filter by Estado */}
                    <div className="w-48">
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                        >
                            <option value="">Todos los estados</option>
                            <option value="vigente">Vigentes</option>
                            <option value="por_vencer">Por Vencer</option>
                            <option value="vencido">Vencidos</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b bg-slate-50 border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Mes</th>
                                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">N° Serie</th>
                                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Cliente</th>
                                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">RUC/DNI</th>
                                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Tipo</th>
                                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Capacidad</th>
                                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Última Recarga</th>
                                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Próxima Recarga</th>
                                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Estado</th>
                                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Frecuencia Rev.</th>
                                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredExtintores.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="px-4 py-8 text-center text-slate-500">
                                        No se encontraron extintores
                                    </td>
                                </tr>
                            ) : (
                                filteredExtintores.map((extintor) => (
                                    <tr key={extintor.id} className="transition-colors hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm text-slate-900">{extintor.mes}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-medium text-slate-900">{extintor.codigoSerie}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{extintor.nombreEmpresa}</p>
                                                <p className="text-xs text-slate-500">{extintor.telefono}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{extintor.rucDni}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-slate-100 text-slate-700">
                                                {extintor.tipoExtintor}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-900">{extintor.capacidad}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {new Date(extintor.fechaRecarga).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{new Date(extintor.proximaRecarga).toLocaleDateString('es-ES')}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {getEstadoBadge(extintor.proximaRecarga)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {getFrecuenciaLabel(extintor.frecuenciaRevision)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button
                                                    onClick={() => handleEditarExtintor(extintor)}
                                                    className="p-2 transition-colors rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50"
                                                    title="Editar seguimiento"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                {extintor.notas && (
                                                    <button
                                                        className="p-2 transition-colors rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                                        title="Ver notas"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Note */}
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <strong>Nota:</strong> Los extintores se registran automáticamente cuando se realiza una venta de categoría "Extintor".
                            Aquí solo se gestiona el seguimiento de vencimientos, frecuencia de revisiones y notas adicionales.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal Editar Seguimiento */}
            <ModalEditarSeguimiento
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleGuardarSeguimiento}
                extintor={selectedExtintor}
            />
        </div>
    );
}
