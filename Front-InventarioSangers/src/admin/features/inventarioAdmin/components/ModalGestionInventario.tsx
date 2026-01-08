import { X, Plus, Trash2, Package, TrendingDown, ArrowRightLeft, Edit2, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { listarUbicacionesService } from "../../ubicacionesAdmin/services/listarUbicaciones";
import type { UbicacionResponse } from "../../ubicacionesAdmin/schemas/Inferface";
import { registrarEntradaService } from "../services/Ajustes/registrarEntrada";
import { registrarSalidaService } from "../services/Ajustes/registrarSalida";
import { moverStockService } from "../services/Ajustes/moverStock";
import { listarStockService } from "../services/listarStock";
import { listarPromocionesService } from "../services/Promociones/listarPromocion";
import { crearPromocionService } from "../services/Promociones/crearPromocion";
import { actualizarPromocionService } from "../services/Promociones/actualizarPromocion";
import type { CreateEntradaRequest, CreateSalidaRequest, CreateTrasladoRequest, StockUbicacionResponse, PromocionResponse, CreatePromocionRequest, UpdatePromocionRequest } from "../schema/Interface";
import { entradaSchema, salidaSchema, trasladoSchema, promocionSchema, updatePromocionSchema } from "../schema/InventarioSchema";

interface ModalGestionInventarioProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    producto: any;
}

type TabType = 'añadir' | 'salida' | 'mover' | 'stock' | 'promociones';

export function ModalGestionInventario({ isOpen, onClose, onSubmit, producto }: ModalGestionInventarioProps) {
    const [activeTab, setActiveTab] = useState<TabType>('añadir');

    // Estados para ubicaciones dinámicas
    const [ubicaciones, setUbicaciones] = useState<UbicacionResponse[]>([]);
    const [loadingUbicaciones, setLoadingUbicaciones] = useState(false);

    // Estados para manejo de errores y carga
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Estados para Añadir Stock
    const [ubicacionAñadir, setUbicacionAñadir] = useState("");
    const [cantidadAñadir, setCantidadAñadir] = useState("");
    const [motivoAñadir, setMotivoAñadir] = useState("");
    const [referenciaAñadir, setReferenciaAñadir] = useState("");

    // Estados para Registrar Salida
    const [ubicacionSalida, setUbicacionSalida] = useState("");
    const [cantidadSalida, setCantidadSalida] = useState("");
    const [motivoSalida, setMotivoSalida] = useState("");
    const [referenciaSalida, setReferenciaSalida] = useState("");

    // Estados para Mover Stock
    const [ubicacionOrigen, setUbicacionOrigen] = useState("");
    const [ubicacionDestino, setUbicacionDestino] = useState("");
    const [cantidadMover, setCantidadMover] = useState("");
    const [motivoMover, setMotivoMover] = useState("");

    // Estados para Stock por Ubicación (dinámico)
    const [stockData, setStockData] = useState<StockUbicacionResponse[]>([]);
    const [loadingStock, setLoadingStock] = useState(false);

    // Estados para Promociones (dinámico)
    const [promociones, setPromociones] = useState<PromocionResponse[]>([]);
    const [loadingPromociones, setLoadingPromociones] = useState(false);
    const [editingPromocionId, setEditingPromocionId] = useState<number | null>(null);
    const [editedPromos, setEditedPromos] = useState<Record<number, PromocionResponse>>({});

    // Estado para nueva promoción
    const [showNewPromoForm, setShowNewPromoForm] = useState(false);
    const [newPromo, setNewPromo] = useState({
        cantidad_minima: '',
        precio_oferta: '',
        prioridad: '50',
        activo: true
    });

    // Cargar ubicaciones al abrir el modal
    useEffect(() => {
        const fetchUbicaciones = async () => {
            setLoadingUbicaciones(true);
            try {
                const data = await listarUbicacionesService();
                // Filtrar solo ubicaciones activas
                const ubicacionesActivas = data.filter(ub => ub.activo);
                setUbicaciones(ubicacionesActivas);
            } catch (error) {
                console.error("Error al cargar ubicaciones:", error);
            } finally {
                setLoadingUbicaciones(false);
            }
        };

        if (isOpen) {
            fetchUbicaciones();
        }
    }, [isOpen]);

    // Limpiar error cuando cambia de tab
    useEffect(() => {
        setError(null);
    }, [activeTab]);

    // Cargar stock cuando se activa el tab de stock
    useEffect(() => {
        const fetchStock = async () => {
            if (activeTab === 'stock' && producto?.id_producto) {
                setLoadingStock(true);
                try {
                    const data = await listarStockService(producto.id_producto);
                    setStockData(data);
                } catch (error) {
                    console.error("Error al cargar stock:", error);
                    setStockData([]);
                } finally {
                    setLoadingStock(false);
                }
            }
        };

        fetchStock();
    }, [activeTab, producto?.id_producto]);

    // Cargar promociones cuando se activa el tab de promociones
    useEffect(() => {
        const fetchPromociones = async () => {
            if (activeTab === 'promociones' && producto?.id_producto) {
                setLoadingPromociones(true);
                try {
                    const data = await listarPromocionesService(producto.id_producto);
                    setPromociones(data);
                } catch (error) {
                    console.error("Error al cargar promociones:", error);
                    setPromociones([]);
                } finally {
                    setLoadingPromociones(false);
                }
            }
        };

        fetchPromociones();
    }, [activeTab, producto?.id_producto]);

    const agregarPromocion = () => {
        setShowNewPromoForm(true);
        setError(null);
        // Calcular la siguiente cantidad mínima sugerida
        const cantidadesExistentes = promociones.map(p => p.cantidad_minima);
        const siguienteCantidad = cantidadesExistentes.length > 0
            ? Math.max(...cantidadesExistentes) + 1
            : 1;

        setNewPromo({
            cantidad_minima: siguienteCantidad.toString(),
            precio_oferta: (parseFloat(producto.precio_venta_unitario) * 0.9).toFixed(2),
            prioridad: '50',
            activo: true
        });
    };

    const cancelarNuevaPromo = () => {
        setShowNewPromoForm(false);
        setNewPromo({
            cantidad_minima: '',
            precio_oferta: '',
            prioridad: '50',
            activo: true
        });
        setError(null);
    };

    const guardarNuevaPromocion = async () => {
        if (!producto?.id_producto) return;

        setSubmitting(true);
        setError(null);

        try {
            const nuevaPromocion: CreatePromocionRequest = {
                id_producto: producto.id_producto,
                cantidad_minima: parseInt(newPromo.cantidad_minima) || 1,
                precio_oferta: parseFloat(newPromo.precio_oferta) || 0,
                prioridad: parseInt(newPromo.prioridad) || 50,
                activo: newPromo.activo,
            };

            // Validar con Zod
            const validationResult = promocionSchema.safeParse(nuevaPromocion);
            if (!validationResult.success) {
                throw new Error(validationResult.error.issues[0].message);
            }

            const response = await crearPromocionService(nuevaPromocion);
            setPromociones([...promociones, response]);
            cancelarNuevaPromo();
        } catch (err: any) {
            console.error("Error al crear promoción:", err);
            const errorMessage = err.response?.data?.message || err.message || "Error al crear la promoción";
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const guardarPromocionEditada = async (id_promo: number) => {
        const promo = editedPromos[id_promo];
        if (!promo) return;

        try {
            const updateData: UpdatePromocionRequest = {
                cantidad_minima: promo.cantidad_minima,
                precio_oferta: parseFloat(promo.precio_oferta),
                prioridad: promo.prioridad,
                activo: promo.activo
            };

            // Validar con Zod
            const validationResult = updatePromocionSchema.safeParse(updateData);
            if (!validationResult.success) {
                throw new Error(validationResult.error.issues[0].message);
            }

            const response = await actualizarPromocionService(id_promo, updateData);

            // Actualizar en el estado local
            setPromociones(promociones.map(p =>
                p.id_promo === id_promo ? response : p
            ));
            setEditingPromocionId(null); // Salir del modo edición
            // Limpiar el estado editado
            const newEditedPromos = { ...editedPromos };
            delete newEditedPromos[id_promo];
            setEditedPromos(newEditedPromos);
        } catch (err: any) {
            console.error("Error al actualizar promoción:", err);
            const errorMessage = err.response?.data?.message || err.message || "Error al actualizar la promoción";
            setError(errorMessage);
        }
    };

    const handleSubmitAñadir = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            // Encontrar el ID de la ubicación seleccionada
            const ubicacionSeleccionada = ubicaciones.find(
                ub => ub.nombre_ubicacion === ubicacionAñadir
            );

            if (!ubicacionSeleccionada) {
                throw new Error("Ubicación no válida");
            }

            const entradaData: CreateEntradaRequest = {
                id_producto: producto.id_producto,
                id_ubicacion: ubicacionSeleccionada.id_ubicacion,
                cantidad: parseInt(cantidadAñadir),
                motivo: motivoAñadir,
                referencia: referenciaAñadir || undefined,
            };

            // Validar con Zod
            const validationResult = entradaSchema.safeParse(entradaData);

            if (!validationResult.success) {
                // Extraer el primer error de validación
                const firstError = validationResult.error.issues[0];
                throw new Error(firstError.message);
            }

            const response = await registrarEntradaService(entradaData);

            // Llamar al callback con la respuesta
            onSubmit({
                tipo: 'añadir',
                ...response
            });

            resetFormAñadir();
            onClose();
        } catch (err: any) {
            console.error("Error al registrar entrada:", err);

            // Extraer mensaje de error del backend
            let errorMessage = "Error al registrar la entrada. Por favor, intente nuevamente.";

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitSalida = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            // Encontrar el ID de la ubicación seleccionada
            const ubicacionSeleccionada = ubicaciones.find(
                ub => ub.nombre_ubicacion === ubicacionSalida
            );

            if (!ubicacionSeleccionada) {
                throw new Error("Ubicación no válida");
            }

            const salidaData: CreateSalidaRequest = {
                id_producto: producto.id_producto,
                id_ubicacion: ubicacionSeleccionada.id_ubicacion,
                cantidad: parseInt(cantidadSalida),
                motivo: motivoSalida,
                referencia: referenciaSalida || undefined,
            };

            // Validar con Zod
            const validationResult = salidaSchema.safeParse(salidaData);

            if (!validationResult.success) {
                // Extraer el primer error de validación
                const firstError = validationResult.error.issues[0];
                throw new Error(firstError.message);
            }

            const response = await registrarSalidaService(salidaData);

            // Llamar al callback con la respuesta
            onSubmit({
                tipo: 'salida',
                ...response
            });

            resetFormSalida();
            onClose();
        } catch (err: any) {
            console.error("Error al registrar salida:", err);

            // Extraer mensaje de error del backend
            let errorMessage = "Error al registrar la salida. Por favor, intente nuevamente.";

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitMover = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            // Encontrar los IDs de las ubicaciones seleccionadas
            const ubicacionOrigenSeleccionada = ubicaciones.find(
                ub => ub.nombre_ubicacion === ubicacionOrigen
            );
            const ubicacionDestinoSeleccionada = ubicaciones.find(
                ub => ub.nombre_ubicacion === ubicacionDestino
            );

            if (!ubicacionOrigenSeleccionada) {
                throw new Error("Ubicación de origen no válida");
            }
            if (!ubicacionDestinoSeleccionada) {
                throw new Error("Ubicación de destino no válida");
            }

            const trasladoData: CreateTrasladoRequest = {
                id_producto: producto.id_producto,
                id_ubicacion_origen: ubicacionOrigenSeleccionada.id_ubicacion,
                id_ubicacion_destino: ubicacionDestinoSeleccionada.id_ubicacion,
                cantidad: parseInt(cantidadMover),
                motivo: motivoMover,
                referencia: undefined, // No hay campo de referencia en el formulario de mover
            };

            // Validar con Zod
            const validationResult = trasladoSchema.safeParse(trasladoData);

            if (!validationResult.success) {
                // Extraer el primer error de validación
                const firstError = validationResult.error.issues[0];
                throw new Error(firstError.message);
            }

            const response = await moverStockService(trasladoData);

            // Llamar al callback con la respuesta
            onSubmit({
                tipo: 'mover',
                ...response
            });

            resetFormMover();
            onClose();
        } catch (err: any) {
            console.error("Error al mover stock:", err);

            // Extraer mensaje de error del backend
            let errorMessage = "Error al mover el stock. Por favor, intente nuevamente.";

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const resetFormAñadir = () => {
        setUbicacionAñadir("");
        setCantidadAñadir("");
        setMotivoAñadir("");
        setReferenciaAñadir("");
        setError(null);
    };

    const resetFormSalida = () => {
        setUbicacionSalida("");
        setCantidadSalida("");
        setMotivoSalida("");
        setReferenciaSalida("");
        setError(null);
    };

    const resetFormMover = () => {
        setUbicacionOrigen("");
        setUbicacionDestino("");
        setCantidadMover("");
        setMotivoMover("");
        setError(null);
    };

    const handleClose = () => {
        resetFormAñadir();
        resetFormSalida();
        resetFormMover();
        setActiveTab('añadir');
        onClose();
    };

    if (!isOpen || !producto) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
                {/* Header */}
                <div className="sticky top-0 z-10 p-6 bg-white border-b border-slate-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Gestión de Inventario</h2>
                            <p className="mt-1 text-sm text-slate-600">
                                {producto.nombre} <span className="text-slate-400">({producto.sku})</span>
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 transition-colors rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-4 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('añadir')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === 'añadir'
                                ? 'bg-orange-100 text-orange-700'
                                : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <Package className="w-4 h-4" />
                            Añadir Stock
                        </button>
                        <button
                            onClick={() => setActiveTab('salida')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === 'salida'
                                ? 'bg-orange-100 text-orange-700'
                                : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <TrendingDown className="w-4 h-4" />
                            Registrar Salida
                        </button>
                        <button
                            onClick={() => setActiveTab('mover')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === 'mover'
                                ? 'bg-orange-100 text-orange-700'
                                : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <ArrowRightLeft className="w-4 h-4" />
                            Mover Stock
                        </button>
                        <button
                            onClick={() => setActiveTab('stock')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === 'stock'
                                ? 'bg-orange-100 text-orange-700'
                                : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <Edit2 className="w-4 h-4" />
                            Ver/Ajustar
                        </button>
                        <button
                            onClick={() => setActiveTab('promociones')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === 'promociones'
                                ? 'bg-orange-100 text-orange-700'
                                : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <Tag className="w-4 h-4" />
                            Promociones
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Tab: Añadir Stock */}
                    {activeTab === 'añadir' && (
                        <form onSubmit={handleSubmitAñadir} className="space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Ubicación <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={ubicacionAñadir}
                                    onChange={(e) => setUbicacionAñadir(e.target.value)}
                                    required
                                    disabled={loadingUbicaciones}
                                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">
                                        {loadingUbicaciones ? 'Cargando ubicaciones...' : 'Seleccionar ubicación'}
                                    </option>
                                    {ubicaciones.map((ub) => (
                                        <option key={ub.id_ubicacion} value={ub.nombre_ubicacion}>
                                            {ub.nombre_ubicacion}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Cantidad <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={cantidadAñadir}
                                    onChange={(e) => setCantidadAñadir(e.target.value)}
                                    placeholder="20"
                                    required
                                    min="1"
                                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Motivo <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={motivoAñadir}
                                    onChange={(e) => setMotivoAñadir(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar motivo</option>
                                    <option value="Compra a proveedor">Compra a proveedor</option>
                                    <option value="Devolución">Devolución</option>
                                    <option value="Ajuste">Ajuste</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Referencia (Factura/Documento)
                                </label>
                                <input
                                    type="text"
                                    value={referenciaAñadir}
                                    onChange={(e) => setReferenciaAñadir(e.target.value)}
                                    placeholder="FAC-001"
                                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            {/* Error Message */}
                            {error && activeTab === 'añadir' && (
                                <div className="p-4 border-l-4 border-red-500 bg-red-50">
                                    <p className="text-sm text-red-800">
                                        <strong>Error:</strong> {error}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Guardando...' : 'Añadir Stock'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Tab: Registrar Salida */}
                    {activeTab === 'salida' && (
                        <form onSubmit={handleSubmitSalida} className="space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Ubicación Origen <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={ubicacionSalida}
                                    onChange={(e) => setUbicacionSalida(e.target.value)}
                                    required
                                    disabled={loadingUbicaciones}
                                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">
                                        {loadingUbicaciones ? 'Cargando ubicaciones...' : 'Seleccionar ubicación'}
                                    </option>
                                    {ubicaciones.map((ub) => (
                                        <option key={ub.id_ubicacion} value={ub.nombre_ubicacion}>
                                            {ub.nombre_ubicacion}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Cantidad a Retirar <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={cantidadSalida}
                                    onChange={(e) => setCantidadSalida(e.target.value)}
                                    placeholder="5"
                                    required
                                    min="1"
                                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Motivo <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={motivoSalida}
                                    onChange={(e) => setMotivoSalida(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar motivo</option>
                                    <option value="Consumo interno">Consumo interno</option>
                                    <option value="Merma">Merma</option>
                                    <option value="Ajuste">Ajuste</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Referencia/Nota
                                </label>
                                <textarea
                                    value={referenciaSalida}
                                    onChange={(e) => setReferenciaSalida(e.target.value)}
                                    placeholder="Descripción del motivo..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                />
                            </div>

                            {/* Error Message */}
                            {error && activeTab === 'salida' && (
                                <div className="p-4 border-l-4 border-red-500 bg-red-50">
                                    <p className="text-sm text-red-800">
                                        <strong>Error:</strong> {error}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Guardando...' : 'Registrar Salida'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Tab: Mover Stock */}
                    {activeTab === 'mover' && (
                        <form onSubmit={handleSubmitMover} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-slate-700">
                                        Ubicación Origen <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        value={ubicacionOrigen}
                                        onChange={(e) => setUbicacionOrigen(e.target.value)}
                                        required
                                        disabled={loadingUbicaciones}
                                        className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="">
                                            {loadingUbicaciones ? 'Cargando ubicaciones...' : 'Seleccionar origen'}
                                        </option>
                                        {ubicaciones.map((ub) => (
                                            <option key={ub.id_ubicacion} value={ub.nombre_ubicacion}>
                                                {ub.nombre_ubicacion}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-slate-700">
                                        Ubicación Destino <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        value={ubicacionDestino}
                                        onChange={(e) => setUbicacionDestino(e.target.value)}
                                        required
                                        disabled={loadingUbicaciones}
                                        className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="">
                                            {loadingUbicaciones ? 'Cargando ubicaciones...' : 'Seleccionar destino'}
                                        </option>
                                        {ubicaciones.map((ub) => (
                                            <option key={ub.id_ubicacion} value={ub.nombre_ubicacion}>
                                                {ub.nombre_ubicacion}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Cantidad a Mover <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={cantidadMover}
                                    onChange={(e) => setCantidadMover(e.target.value)}
                                    placeholder="10"
                                    required
                                    min="1"
                                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Motivo/Nota
                                </label>
                                <textarea
                                    value={motivoMover}
                                    onChange={(e) => setMotivoMover(e.target.value)}
                                    placeholder="Motivo del traslado..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                />
                            </div>

                            {/* Error Message */}
                            {error && activeTab === 'mover' && (
                                <div className="p-4 border-l-4 border-red-500 bg-red-50">
                                    <p className="text-sm text-red-800">
                                        <strong>Error:</strong> {error}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Guardando...' : 'Mover Stock'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Tab: Ver/Ajustar Stock */}
                    {activeTab === 'stock' && (
                        <div className="space-y-4">
                            <div className="overflow-hidden border rounded-lg border-slate-200">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                                                Ubicación
                                            </th>
                                            <th className="px-6 py-3 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">
                                                Stock Actual
                                            </th>
                                            <th className="px-6 py-3 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {loadingStock ? (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center space-y-2">
                                                        <div className="w-8 h-8 border-4 border-orange-600 rounded-full border-t-transparent animate-spin"></div>
                                                        <p className="text-sm text-slate-600">Cargando stock...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : stockData.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">
                                                    No hay stock registrado para este producto
                                                </td>
                                            </tr>
                                        ) : (
                                            <>
                                                {stockData.map((item) => (
                                                    <tr key={item.id_stock} className="hover:bg-slate-50">
                                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                                            {item.ubicacion.nombre_ubicacion}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`inline-flex items-center justify-center w-16 h-8 text-sm font-bold text-white rounded-md ${item.cantidad < producto.stock_minimo ? 'bg-red-600' : 'bg-orange-600'
                                                                }`}>
                                                                {item.cantidad}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <button
                                                                type="button"
                                                                className="px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
                                                            >
                                                                Ajustar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {/* Fila de Total */}
                                                <tr className="bg-slate-50 font-semibold">
                                                    <td className="px-6 py-4 text-sm text-slate-900">
                                                        TOTAL
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-flex items-center justify-center w-16 h-8 text-sm font-bold text-white bg-slate-700 rounded-md">
                                                            {stockData.reduce((sum, item) => sum + item.cantidad, 0)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4"></td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                                <p className="text-sm text-blue-800">
                                    <strong>Nota:</strong> Use "Añadir Stock" o "Registrar Salida" para modificar el inventario con trazabilidad completa.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Tab: Promociones */}
                    {activeTab === 'promociones' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">Promociones por Mayor</h3>
                                    <p className="text-xs text-slate-600">Configure descuentos automáticos al comprar grandes cantidades</p>
                                </div>
                                {!showNewPromoForm && (
                                    <button
                                        type="button"
                                        onClick={agregarPromocion}
                                        disabled={submitting || loadingPromociones}
                                        className="flex items-center px-3 py-1.5 space-x-1 text-sm font-medium text-orange-700 transition-colors bg-orange-100 rounded-lg hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Agregar</span>
                                    </button>
                                )}
                            </div>

                            {/* Error Message */}
                            {error && activeTab === 'promociones' && (
                                <div className="p-4 border-l-4 border-red-500 bg-red-50">
                                    <p className="text-sm text-red-800">
                                        <strong>Error:</strong> {error}
                                    </p>
                                </div>
                            )}

                            {/* Formulario Nueva Promoción */}
                            {showNewPromoForm && (
                                <div className="p-4 border-2 border-orange-300 rounded-lg bg-orange-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-semibold text-slate-900">Nueva Promoción</h4>
                                        <button
                                            type="button"
                                            onClick={cancelarNuevaPromo}
                                            className="p-1 transition-colors rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                        <div>
                                            <label className="block mb-1 text-xs font-medium text-slate-700">
                                                Cantidad mínima <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={newPromo.cantidad_minima}
                                                onChange={(e) => setNewPromo({ ...newPromo, cantidad_minima: e.target.value })}
                                                placeholder="3"
                                                min="1"
                                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-xs font-medium text-slate-700">
                                                Precio oferta (S/) <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={newPromo.precio_oferta}
                                                onChange={(e) => setNewPromo({ ...newPromo, precio_oferta: e.target.value })}
                                                placeholder="150.00"
                                                min="0"
                                                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${parseFloat(newPromo.precio_oferta) >= parseFloat(producto.precio_venta_unitario)
                                                        ? 'border-red-300 bg-red-50'
                                                        : 'border-slate-300'
                                                    }`}
                                            />
                                            {parseFloat(newPromo.precio_oferta) >= parseFloat(producto.precio_venta_unitario) && (
                                                <p className="mt-1 text-xs text-red-600 font-medium">
                                                    ⚠️ El precio es mayor al precio base (S/ {parseFloat(producto.precio_venta_unitario).toFixed(2)})
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-xs font-medium text-slate-700">
                                                Prioridad (1-100)
                                            </label>
                                            <input
                                                type="number"
                                                value={newPromo.prioridad}
                                                onChange={(e) => setNewPromo({ ...newPromo, prioridad: e.target.value })}
                                                placeholder="50"
                                                min="1"
                                                max="100"
                                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-orange-200">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newPromo.activo}
                                                onChange={(e) => setNewPromo({ ...newPromo, activo: e.target.checked })}
                                                className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                                            />
                                            <span className="text-xs font-medium text-slate-700">Promoción activa</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={guardarNuevaPromocion}
                                            disabled={submitting}
                                            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {submitting ? 'Guardando...' : 'Guardar Promoción'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Loading State */}
                            {loadingPromociones ? (
                                <div className="flex flex-col items-center justify-center py-12 space-y-2">
                                    <div className="w-8 h-8 border-4 border-orange-600 rounded-full border-t-transparent animate-spin"></div>
                                    <p className="text-sm text-slate-600">Cargando promociones...</p>
                                </div>
                            ) : promociones.length === 0 && !showNewPromoForm ? (
                                <div className="py-12 text-center">
                                    <p className="text-sm text-slate-500">No hay promociones configuradas</p>
                                    <p className="text-xs text-slate-400 mt-1">Haz clic en "Agregar" para crear una nueva promoción</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {promociones.map((promo) => {
                                        const isEditing = editingPromocionId === promo.id_promo;
                                        const currentPromo = isEditing ? (editedPromos[promo.id_promo] || promo) : promo;

                                        const updateEditedPromo = (field: keyof PromocionResponse, value: any) => {
                                            setEditedPromos({
                                                ...editedPromos,
                                                [promo.id_promo]: {
                                                    ...currentPromo,
                                                    [field]: value
                                                }
                                            });
                                        };

                                        return (
                                            <div key={promo.id_promo} className={`p-4 border rounded-lg ${isEditing ? 'border-blue-300 bg-blue-50' : 'bg-slate-50 border-slate-200'}`}>
                                                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                                    <div>
                                                        <label className="block mb-1 text-xs font-medium text-slate-700">
                                                            Cantidad mínima
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={currentPromo.cantidad_minima}
                                                            onChange={(e) => isEditing && updateEditedPromo('cantidad_minima', parseInt(e.target.value) || 1)}
                                                            disabled={!isEditing}
                                                            min="1"
                                                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block mb-1 text-xs font-medium text-slate-700">
                                                            Precio oferta (S/)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={parseFloat(currentPromo.precio_oferta)}
                                                            onChange={(e) => isEditing && updateEditedPromo('precio_oferta', e.target.value)}
                                                            disabled={!isEditing}
                                                            min="0"
                                                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed ${isEditing && parseFloat(currentPromo.precio_oferta) >= parseFloat(producto.precio_venta_unitario)
                                                                ? 'border-red-300 bg-red-50'
                                                                : 'border-slate-300'
                                                                }`}
                                                        />
                                                        {isEditing && parseFloat(currentPromo.precio_oferta) >= parseFloat(producto.precio_venta_unitario) && (
                                                            <p className="mt-1 text-xs text-red-600 font-medium">
                                                                ⚠️ El precio es mayor al precio base
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block mb-1 text-xs font-medium text-slate-700">
                                                            Prioridad (1-100)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={currentPromo.prioridad}
                                                            onChange={(e) => isEditing && updateEditedPromo('prioridad', parseInt(e.target.value) || 50)}
                                                            disabled={!isEditing}
                                                            min="1"
                                                            max="100"
                                                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                                                    <div className="flex items-center space-x-4">
                                                        <label className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={currentPromo.activo}
                                                                onChange={(e) => isEditing && updateEditedPromo('activo', e.target.checked)}
                                                                disabled={!isEditing}
                                                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                                                            />
                                                            <span className="text-xs font-medium text-slate-700">Activa</span>
                                                        </label>
                                                        <div className="text-xs text-slate-500">
                                                            Normal: S/ {parseFloat(producto.precio_venta_unitario).toFixed(2)} •
                                                            Ahorro: S/ {(parseFloat(producto.precio_venta_unitario) - parseFloat(promo.precio_oferta)).toFixed(2)}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {isEditing ? (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEditingPromocionId(null);
                                                                        // Limpiar ediciones
                                                                        const newEditedPromos = { ...editedPromos };
                                                                        delete newEditedPromos[promo.id_promo];
                                                                        setEditedPromos(newEditedPromos);
                                                                    }}
                                                                    className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
                                                                >
                                                                    Cancelar
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => guardarPromocionEditada(promo.id_promo)}
                                                                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                                                >
                                                                    Guardar
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditingPromocionId(promo.id_promo);
                                                                    setEditedPromos({ ...editedPromos, [promo.id_promo]: promo });
                                                                }}
                                                                className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                                                            >
                                                                <Edit2 className="w-4 h-4 inline mr-1" />
                                                                Editar
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                                <p className="text-sm text-blue-800">
                                    <strong>Nota:</strong> Las promociones se guardan al hacer clic en "Guardar". La prioridad determina qué promoción se aplica cuando hay múltiples opciones.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
