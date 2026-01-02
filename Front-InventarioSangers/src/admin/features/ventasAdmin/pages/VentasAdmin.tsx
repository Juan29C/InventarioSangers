import { ShoppingCart, History, Plus, Minus, Trash2, TrendingUp, TrendingDown, DollarSign, UserPlus } from "lucide-react"
import { useState } from "react"
import { ModalCrearEgreso } from "../components/ModalCrearEgreso"
import { ModalCrearCliente } from "../components/ModalCrearCliente"

type TabType = "punto-venta" | "historial";
type HistorialFilter = "TODO" | "VENTAS_DIA" | "EGRESOS_DIA";

interface ProductoCarrito {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
}

interface Transaccion {
    id: number;
    fecha: string;
    tipo: "VENTA" | "EGRESO";
    cliente?: string;
    proveedor?: string;
    detalle: string;
    subtotal?: number;
    igv?: number;
    total: number;
    metodoPago?: string;
    comprobante?: string;
}

export default function VentasAdmin() {
    const [activeTab, setActiveTab] = useState<TabType>("punto-venta");
    const [historialFilter, setHistorialFilter] = useState<HistorialFilter>("TODO");
    const [isEgresoModalOpen, setIsEgresoModalOpen] = useState(false);
    const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);

    // Punto de Venta State
    const [clienteSeleccionado, setClienteSeleccionado] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState("");
    const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
    const [metodoPago, setMetodoPago] = useState("Efectivo");
    const [tipoComprobante, setTipoComprobante] = useState("Boleta");

    // Datos de ejemplo
    const clientes = [
        { id: 1, nombre: "Cliente General" },
        { id: 2, nombre: "Juan Pérez" },
        { id: 3, nombre: "María García" },
    ];

    const productosDisponibles = [
        { id: 1, nombre: "Extintor PQS 6kg", precio: 120.00 },
        { id: 2, nombre: "Extintor CO2 5kg", precio: 150.00 },
        { id: 3, nombre: "Señalética de Seguridad", precio: 25.00 },
        { id: 4, nombre: "Botiquín Básico", precio: 80.00 },
    ];

    const transacciones: Transaccion[] = [
        {
            id: 1,
            fecha: new Date().toISOString().split('T')[0],
            tipo: "VENTA",
            cliente: "Juan Pérez",
            detalle: "Extintor PQS 6kg x2",
            subtotal: 240.00,
            igv: 43.20,
            total: 283.20,
            metodoPago: "Efectivo",
            comprobante: "Boleta"
        },
        {
            id: 2,
            fecha: new Date().toISOString().split('T')[0],
            tipo: "EGRESO",
            proveedor: "Proveedor ABC",
            detalle: "Compra de materiales",
            total: 500.00
        },
        {
            id: 3,
            fecha: "2026-01-01",
            tipo: "VENTA",
            cliente: "María García",
            detalle: "Botiquín Básico x1",
            subtotal: 80.00,
            igv: 14.40,
            total: 94.40,
            metodoPago: "Tarjeta",
            comprobante: "Factura"
        },
    ];

    // Cálculos del carrito
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    // Funciones del carrito
    const agregarProducto = () => {
        if (!productoSeleccionado) return;

        const producto = productosDisponibles.find(p => p.id === parseInt(productoSeleccionado));
        if (!producto) return;

        const existente = carrito.find(item => item.id === producto.id);
        if (existente) {
            setCarrito(carrito.map(item =>
                item.id === producto.id
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            ));
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
        setProductoSeleccionado("");
    };

    const actualizarCantidad = (id: number, cantidad: number) => {
        if (cantidad <= 0) {
            setCarrito(carrito.filter(item => item.id !== id));
        } else {
            setCarrito(carrito.map(item =>
                item.id === id ? { ...item, cantidad } : item
            ));
        }
    };

    const eliminarProducto = (id: number) => {
        setCarrito(carrito.filter(item => item.id !== id));
    };

    const procesarVenta = () => {
        if (carrito.length === 0) {
            alert("Agrega productos al carrito");
            return;
        }
        if (!clienteSeleccionado) {
            alert("Selecciona un cliente");
            return;
        }

        console.log("Venta procesada:", {
            cliente: clienteSeleccionado,
            productos: carrito,
            subtotal,
            igv,
            total,
            metodoPago,
            tipoComprobante
        });

        // Limpiar formulario
        setCarrito([]);
        setClienteSeleccionado("");
        alert("Venta procesada exitosamente");
    };

    const handleEgresoSubmit = (egreso: any) => {
        console.log("Egreso registrado:", egreso);
    };

    const handleClienteSubmit = (cliente: any) => {
        console.log("Cliente registrado:", cliente);
        // Aquí puedes agregar la lógica para guardar el cliente y agregarlo a la lista
    };

    // Filtrar transacciones
    const transaccionesFiltradas = transacciones.filter(t => {
        const hoy = new Date().toISOString().split('T')[0];

        if (historialFilter === "TODO") return true;
        if (historialFilter === "VENTAS_DIA") return t.tipo === "VENTA" && t.fecha === hoy;
        if (historialFilter === "EGRESOS_DIA") return t.tipo === "EGRESO" && t.fecha === hoy;
        return true;
    });

    // Calcular totales del historial
    const totalIngresos = transaccionesFiltradas
        .filter(t => t.tipo === "VENTA")
        .reduce((sum, t) => sum + t.total, 0);

    const totalEgresos = transaccionesFiltradas
        .filter(t => t.tipo === "EGRESO")
        .reduce((sum, t) => sum + t.total, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white border shadow-sm rounded-xl border-slate-200">
                <div className="p-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-blue-50">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Gestión de Ventas y Egresos</h1>
                            <p className="mt-1 text-slate-600">Registra ventas, egresos y consulta el historial</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200">
                    <div className="flex px-6 space-x-8">
                        <button
                            onClick={() => setActiveTab("punto-venta")}
                            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "punto-venta"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <ShoppingCart className="w-4 h-4" />
                                <span>Punto de Venta</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("historial")}
                            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "historial"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <History className="w-4 h-4" />
                                <span>Historial</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Punto de Venta Tab */}
            {activeTab === "punto-venta" && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Formulario de Venta */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border shadow-sm rounded-xl border-slate-200">
                            <div className="p-6 border-b border-slate-200">
                                <h2 className="text-lg font-semibold text-slate-900">Nueva Venta</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Cliente */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-slate-700">
                                        Cliente <span className="text-red-600">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            value={clienteSeleccionado}
                                            onChange={(e) => setClienteSeleccionado(e.target.value)}
                                            className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        >
                                            <option value="">Seleccionar cliente</option>
                                            {clientes.map(cliente => (
                                                <option key={cliente.id} value={cliente.nombre}>{cliente.nombre}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsClienteModalOpen(true)}
                                            className="p-2.5 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                                            title="Agregar nuevo cliente"
                                        >
                                            <UserPlus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Producto y Cantidad */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="md:col-span-2">
                                        <label className="block mb-2 text-sm font-medium text-slate-700">Producto</label>
                                        <select
                                            value={productoSeleccionado}
                                            onChange={(e) => setProductoSeleccionado(e.target.value)}
                                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        >
                                            <option value="">Buscar producto...</option>
                                            {productosDisponibles.map(producto => (
                                                <option key={producto.id} value={producto.id}>
                                                    {producto.nombre} - S/ {producto.precio.toFixed(2)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-slate-700">&nbsp;</label>
                                        <button
                                            onClick={agregarProducto}
                                            disabled={!productoSeleccionado}
                                            className="w-full px-4 py-2.5 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </div>

                                {/* Carrito */}
                                <div className="border rounded-lg border-slate-200">
                                    <div className="p-4 border-b bg-slate-50 border-slate-200">
                                        <h3 className="text-sm font-semibold text-slate-900">Productos Agregados</h3>
                                    </div>
                                    <div className="p-4">
                                        {carrito.length === 0 ? (
                                            <div className="py-8 text-center text-slate-500">
                                                <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                                                <p className="text-sm">No hay productos agregados</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {carrito.map(item => (
                                                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg border-slate-200">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-slate-900">{item.nombre}</p>
                                                            <p className="text-xs text-slate-500">S/ {item.precio.toFixed(2)} c/u</p>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                                                                className="p-1 transition-colors rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <span className="w-8 text-sm font-medium text-center text-slate-900">{item.cantidad}</span>
                                                            <button
                                                                onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                                                                className="p-1 transition-colors rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => eliminarProducto(item.id)}
                                                                className="p-1 ml-2 transition-colors rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                            <span className="ml-4 text-sm font-semibold text-slate-900">
                                                                S/ {(item.precio * item.cantidad).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resumen y Pago */}
                    <div className="space-y-6">
                        {/* Resumen */}
                        <div className="bg-white border shadow-sm rounded-xl border-slate-200">
                            <div className="p-6 border-b border-slate-200">
                                <h2 className="text-lg font-semibold text-slate-900">Resumen</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Subtotal</span>
                                    <span className="font-medium text-slate-900">S/ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">IGV (18%)</span>
                                    <span className="font-medium text-slate-900">S/ {igv.toFixed(2)}</span>
                                </div>
                                <div className="pt-4 border-t border-slate-200">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold text-slate-900">Total</span>
                                        <span className="text-2xl font-bold text-green-600">S/ {total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Método de Pago */}
                                <div className="pt-4">
                                    <label className="block mb-2 text-sm font-medium text-slate-700">Método de Pago</label>
                                    <select
                                        value={metodoPago}
                                        onChange={(e) => setMetodoPago(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Tarjeta">Tarjeta</option>
                                        <option value="Transferencia">Transferencia</option>
                                        <option value="Yape">Yape</option>
                                        <option value="Plin">Plin</option>
                                    </select>
                                </div>

                                {/* Tipo de Comprobante */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-slate-700">Tipo de Comprobante</label>
                                    <select
                                        value={tipoComprobante}
                                        onChange={(e) => setTipoComprobante(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="Boleta">Boleta</option>
                                        <option value="Factura">Factura</option>
                                    </select>
                                </div>

                                {/* Botón Procesar */}
                                <button
                                    onClick={procesarVenta}
                                    disabled={carrito.length === 0 || !clienteSeleccionado}
                                    className="w-full px-4 py-3 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Procesar Venta
                                </button>
                            </div>
                        </div>

                        {/* Comprobantes */}
                        <div className="bg-white border shadow-sm rounded-xl border-slate-200">
                            <div className="p-6 border-b border-slate-200">
                                <h2 className="text-sm font-semibold text-slate-900">Comprobantes</h2>
                            </div>
                            <div className="p-4 space-y-2">
                                <button className="w-full px-4 py-2 text-sm font-medium text-left transition-colors rounded-lg text-slate-700 hover:bg-slate-50">
                                    📄 Generar Factura
                                </button>
                                <button className="w-full px-4 py-2 text-sm font-medium text-left transition-colors rounded-lg text-slate-700 hover:bg-slate-50">
                                    📋 Generar Guía de Remisión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Historial Tab */}
            {activeTab === "historial" && (
                <div className="space-y-6">
                    {/* Filtros y Botón Egreso */}
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setHistorialFilter("TODO")}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${historialFilter === "TODO"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                Todo
                            </button>
                            <button
                                onClick={() => setHistorialFilter("VENTAS_DIA")}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${historialFilter === "VENTAS_DIA"
                                    ? "bg-green-600 text-white"
                                    : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                Ventas del Día
                            </button>
                            <button
                                onClick={() => setHistorialFilter("EGRESOS_DIA")}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${historialFilter === "EGRESOS_DIA"
                                    ? "bg-red-600 text-white"
                                    : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                Egresos del Día
                            </button>
                        </div>
                        <button
                            onClick={() => setIsEgresoModalOpen(true)}
                            className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                        >
                            <TrendingDown className="w-4 h-4" />
                            <span>Registrar Egreso</span>
                        </button>
                    </div>

                    {/* Resumen de Totales */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600">Total Ingresos</p>
                                    <p className="mt-1 text-2xl font-bold text-green-600">S/ {totalIngresos.toFixed(2)}</p>
                                </div>
                                <div className="p-3 rounded-full bg-green-50">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600">Total Egresos</p>
                                    <p className="mt-1 text-2xl font-bold text-red-600">S/ {totalEgresos.toFixed(2)}</p>
                                </div>
                                <div className="p-3 rounded-full bg-red-50">
                                    <TrendingDown className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600">Balance</p>
                                    <p className={`mt-1 text-2xl font-bold ${totalIngresos - totalEgresos >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        S/ {(totalIngresos - totalEgresos).toFixed(2)}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-blue-50">
                                    <DollarSign className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Historial */}
                    <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-slate-50 border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Fecha</th>
                                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Tipo</th>
                                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Cliente/Proveedor</th>
                                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Detalle</th>
                                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Total</th>
                                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">Método/Comprobante</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {transaccionesFiltradas.map(transaccion => (
                                        <tr key={transaccion.id} className="transition-colors hover:bg-slate-50">
                                            <td className="px-6 py-4 text-sm text-center text-slate-900 whitespace-nowrap">
                                                {transaccion.fecha}
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${transaccion.tipo === "VENTA"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}>
                                                    {transaccion.tipo === "VENTA" ? "Ingreso" : "Egreso"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center text-slate-900">
                                                {transaccion.cliente || transaccion.proveedor}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center text-slate-600">
                                                {transaccion.detalle}
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <span className={`text-sm font-semibold ${transaccion.tipo === "VENTA" ? "text-green-600" : "text-red-600"
                                                    }`}>
                                                    S/ {transaccion.total.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center text-slate-600 whitespace-nowrap">
                                                {transaccion.metodoPago && transaccion.comprobante
                                                    ? `${transaccion.metodoPago} / ${transaccion.comprobante}`
                                                    : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Egreso */}
            <ModalCrearEgreso
                isOpen={isEgresoModalOpen}
                onClose={() => setIsEgresoModalOpen(false)}
                onSubmit={handleEgresoSubmit}
            />

            {/* Modal de Cliente */}
            <ModalCrearCliente
                isOpen={isClienteModalOpen}
                onClose={() => setIsClienteModalOpen(false)}
                onSubmit={handleClienteSubmit}
            />
        </div>
    )
}
