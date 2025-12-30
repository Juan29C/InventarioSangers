import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, MapPin, User } from "lucide-react";
import { useState, useMemo } from "react";
import { ModalAgregarCronograma } from "../components/ModalAgregarCronograma";

interface Servicio {
    id: number;
    cliente: string;
    direccion: string;
    fecha: string;
    horaInicio: string;
    horaFin?: string;
    tecnico?: string;
    tipoServicio: string;
    notas?: string;
}

export default function CronogramaAdmin() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null);

    // Tipos de servicio con colores (matching the Excel legend)
    const tiposServicio: Record<string, { label: string; color: string; bgColor: string }> = {
        fumigacion: { label: "SER_Fumigación", color: "text-blue-700", bgColor: "bg-blue-500" },
        limpieza_tanque: { label: "SER_Limpieza de tanque ROTOPLAS", color: "text-orange-700", bgColor: "bg-orange-500" },
        limpieza_pozo: { label: "SER_Limpieza de POZO", color: "text-pink-700", bgColor: "bg-pink-500" },
        desratizacion: { label: "SER_Desratización", color: "text-yellow-700", bgColor: "bg-yellow-500" },
        recoger_extintor: { label: "RECOGER EXTINTOR", color: "text-gray-700", bgColor: "bg-gray-400" },
        entrega_extintor: { label: "ENTREGA DE EXTINTOR", color: "text-purple-700", bgColor: "bg-purple-500" },
        recarga_mantenimiento: { label: "RECARGA Y MANTENIMIENTO DE EXTINTOR", color: "text-red-700", bgColor: "bg-red-500" },
    };

    // Datos de ejemplo
    const servicios: Servicio[] = [
        {
            id: 1,
            cliente: "Empresa Industrial SAC",
            direccion: "Av. Industrial 123, Lima",
            fecha: "2025-12-18",
            horaInicio: "09:00",
            horaFin: "11:00",
            tecnico: "Carlos Ruiz",
            tipoServicio: "fumigacion",
            notas: "Inspección completa"
        },
        {
            id: 2,
            cliente: "Comercial del Norte EIRL",
            direccion: "Jr. Comercio 455, Trujillo",
            fecha: "2025-12-20",
            horaInicio: "14:00",
            tecnico: "",
            tipoServicio: "recarga_mantenimiento",
            notas: "Cliente solicita revisión completa"
        },
        {
            id: 3,
            cliente: "Hotel Plaza",
            direccion: "Av. Principal 789, Lima",
            fecha: "2025-12-23",
            horaInicio: "10:00",
            horaFin: "12:00",
            tecnico: "Juan Pérez",
            tipoServicio: "limpieza_tanque"
        },
    ];

    const handleAddServicio = (servicio: any) => {
        console.log("Nuevo servicio agregado:", servicio);
        // Aquí puedes agregar la lógica para guardar el servicio en tu backend
    };

    const handleOpenModal = (date?: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handleDayClick = (date: Date) => {
        const dayServices = getServiciosForDate(date);

        // Si el día tiene servicios, mostrarlos en el sidebar
        if (dayServices.length > 0) {
            setSelectedDayDate(date);
        } else {
            // Si el día está vacío, abrir el modal para agregar servicio
            handleOpenModal(date);
        }
    };

    // Calendar logic
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const getServiciosForDate = (date: Date | null) => {
        if (!date) return [];
        const dateStr = date.toISOString().split('T')[0];
        return servicios.filter(s => s.fecha === dateStr);
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const isToday = (date: Date | null) => {
        if (!date) return false;
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const days = getDaysInMonth(currentDate);

    // Get services to display in sidebar (selected day or upcoming)
    const sidebarServices = useMemo(() => {
        if (selectedDayDate) {
            return getServiciosForDate(selectedDayDate);
        }

        // Get upcoming services
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return servicios
            .filter(s => new Date(s.fecha) >= today)
            .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
            .slice(0, 5);
    }, [servicios, selectedDayDate]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Cronograma de Servicios</h1>
                    <p className="mt-1 text-slate-600">Calendario interactivo y asignación de tareas a técnicos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Calendar */}
                <div className="lg:col-span-2">
                    <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={goToToday}
                                    className="px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                                >
                                    Hoy
                                </button>
                                <button
                                    onClick={previousMonth}
                                    className="p-2 transition-colors rounded-lg text-slate-600 hover:bg-slate-100"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextMonth}
                                    className="p-2 transition-colors rounded-lg text-slate-600 hover:bg-slate-100"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="flex items-center px-3 py-1.5 ml-2 space-x-1 text-sm font-medium text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Nuevo</span>
                                </button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="p-4">
                            {/* Day names */}
                            <div className="grid grid-cols-7 mb-2">
                                {dayNames.map((day) => (
                                    <div key={day} className="p-2 text-xs font-semibold text-center text-slate-600">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar days */}
                            <div className="grid grid-cols-7 gap-1">
                                {days.map((date, index) => {
                                    const dayServices = getServiciosForDate(date);
                                    const isCurrentDay = isToday(date);

                                    return (
                                        <div
                                            key={index}
                                            className={`min-h-[100px] p-2 border rounded-lg transition-colors ${date
                                                ? 'bg-white border-slate-200 hover:border-orange-300 cursor-pointer'
                                                : 'bg-slate-50 border-slate-100'
                                                } ${isCurrentDay ? 'ring-2 ring-orange-500' : ''}`}
                                            onClick={() => date && handleDayClick(date)}
                                        >
                                            {date && (
                                                <>
                                                    <div className={`text-sm font-semibold mb-1 ${isCurrentDay ? 'text-orange-600' : 'text-slate-900'
                                                        }`}>
                                                        {date.getDate()}
                                                    </div>
                                                    <div className="space-y-1">
                                                        {dayServices.map((servicio) => {
                                                            const tipo = tiposServicio[servicio.tipoServicio];
                                                            return (
                                                                <div
                                                                    key={servicio.id}
                                                                    className={`${tipo.bgColor} bg-opacity-20 border-l-2 ${tipo.bgColor.replace('bg-', 'border-')} px-1.5 py-1 rounded text-xs`}
                                                                >
                                                                    <p className={`font-medium ${tipo.color} truncate`}>
                                                                        {servicio.horaInicio}
                                                                    </p>
                                                                    <p className="text-slate-700 truncate">{servicio.cliente}</p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Upcoming Services */}
                <div className="space-y-6">
                    {/* Próximos Servicios */}
                    <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
                        <div className="p-4 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <CalendarIcon className="w-5 h-5 text-orange-600" />
                                    <h3 className="font-semibold text-slate-900">
                                        {selectedDayDate
                                            ? `Servicios del ${selectedDayDate.getDate()} de ${monthNames[selectedDayDate.getMonth()]}`
                                            : 'Próximos Servicios'
                                        }
                                    </h3>
                                </div>
                                {selectedDayDate && (
                                    <button
                                        onClick={() => setSelectedDayDate(null)}
                                        className="text-xs text-slate-500 hover:text-slate-700"
                                    >
                                        Ver próximos
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            {sidebarServices.length === 0 ? (
                                <div className="text-center">
                                    <p className="text-sm text-slate-500">
                                        {selectedDayDate
                                            ? 'No hay servicios programados para este día'
                                            : 'No hay servicios programados'
                                        }
                                    </p>
                                    {selectedDayDate && (
                                        <button
                                            onClick={() => handleOpenModal(selectedDayDate)}
                                            className="mt-3 text-sm font-medium text-orange-600 hover:text-orange-700"
                                        >
                                            + Agregar servicio para este día
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {sidebarServices.map((servicio) => {
                                        const tipo = tiposServicio[servicio.tipoServicio];
                                        return (
                                            <div key={servicio.id} className="p-3 border rounded-lg border-slate-200 hover:border-orange-300">
                                                <div className="flex items-start justify-between mb-2">
                                                    <p className="text-sm font-semibold text-slate-900">{servicio.cliente}</p>
                                                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${tipo.bgColor} text-white`}>
                                                        {tipo.label.split('_')[0]}
                                                    </span>
                                                </div>
                                                <div className="space-y-1 text-xs text-slate-600">
                                                    {!selectedDayDate && (
                                                        <div className="flex items-center space-x-1">
                                                            <CalendarIcon className="w-3 h-3" />
                                                            <span>{new Date(servicio.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{servicio.horaInicio}{servicio.horaFin && ` - ${servicio.horaFin}`}</span>
                                                    </div>
                                                    {servicio.direccion && (
                                                        <div className="flex items-start space-x-1">
                                                            <MapPin className="w-3 h-3 mt-0.5" />
                                                            <span className="flex-1">{servicio.direccion}</span>
                                                        </div>
                                                    )}
                                                    {servicio.tecnico && (
                                                        <div className="flex items-center space-x-1">
                                                            <User className="w-3 h-3" />
                                                            <span>{servicio.tecnico}</span>
                                                        </div>
                                                    )}
                                                    {!servicio.tecnico && (
                                                        <div className="flex items-center space-x-1">
                                                            <User className="w-3 h-3" />
                                                            <span className="text-orange-600">Sin asignar</span>
                                                        </div>
                                                    )}
                                                    {servicio.notas && (
                                                        <div className="pt-2 mt-2 border-t border-slate-200">
                                                            <p className="text-slate-600">{servicio.notas}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {selectedDayDate && (
                                        <button
                                            onClick={() => handleOpenModal(selectedDayDate)}
                                            className="w-full py-2 text-sm font-medium text-orange-600 transition-colors border border-orange-300 rounded-lg hover:bg-orange-50"
                                        >
                                            + Agregar otro servicio
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Leyenda */}
                    <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
                        <div className="p-4 border-b border-slate-200">
                            <h3 className="font-semibold text-slate-900">Leyenda de Servicios</h3>
                        </div>
                        <div className="p-4 space-y-2">
                            {Object.entries(tiposServicio).map(([key, tipo]) => (
                                <div key={key} className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded ${tipo.bgColor}`}></div>
                                    <span className="text-xs text-slate-700">{tipo.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Agregar Cronograma */}
            <ModalAgregarCronograma
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddServicio}
                selectedDate={selectedDate}
            />
        </div>
    );
}
