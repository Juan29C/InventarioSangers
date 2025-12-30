import { X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface ModalCrearUsuarioProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (usuario: any) => void;
}

export function ModalCrearUsuario({ isOpen, onClose, onSubmit }: ModalCrearUsuarioProps) {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [repetirContrasena, setRepetirContrasena] = useState("");
    const [rol, setRol] = useState("");
    const [activo, setActivo] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar que las contraseñas coincidan
        if (contrasena !== repetirContrasena) {
            alert("Las contraseñas no coinciden");
            return;
        }

        // Validar longitud mínima de contraseña
        if (contrasena.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        const usuario = {
            nombre,
            apellido,
            correo,
            contrasena,
            rol,
            activo
        };

        onSubmit(usuario);
        handleClose();
    };

    const handleClose = () => {
        // Reset form
        setNombre("");
        setApellido("");
        setCorreo("");
        setContrasena("");
        setRepetirContrasena("");
        setRol("");
        setActivo(true);
        setShowPassword(false);
        setShowRepeatPassword(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-slate-200">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Nuevo Usuario</h2>
                        <p className="mt-1 text-sm text-slate-600">Complete los datos del nuevo usuario del sistema</p>
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
                    {/* Nombre y Apellido */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Nombre <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Juan"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Apellido <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                placeholder="Pérez"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Correo */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Correo Electrónico <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="usuario@ejemplo.com"
                            required
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                        />
                    </div>

                    {/* Contraseña y Repetir Contraseña */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Contraseña <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-2.5 pr-10 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute p-2 transform -translate-y-1/2 right-1 top-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Mínimo 6 caracteres</p>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Repetir Contraseña <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showRepeatPassword ? "text" : "password"}
                                    value={repetirContrasena}
                                    onChange={(e) => setRepetirContrasena(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-2.5 pr-10 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                    className="absolute p-2 transform -translate-y-1/2 right-1 top-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showRepeatPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Rol */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Rol <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                        >
                            <option value="">Seleccionar rol</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Vendedor">Vendedor</option>
                            <option value="Técnico">Técnico</option>
                        </select>
                    </div>

                    {/* Estado Activo */}
                    <div className="flex items-center p-4 border rounded-lg bg-slate-50 border-slate-200">
                        <input
                            type="checkbox"
                            id="activo"
                            checked={activo}
                            onChange={(e) => setActivo(e.target.checked)}
                            className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                        />
                        <label htmlFor="activo" className="ml-3 text-sm font-medium text-slate-700">
                            Usuario activo
                        </label>
                        <p className="ml-auto text-xs text-slate-500">El usuario podrá acceder al sistema</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 text-sm font-medium text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700"
                        >
                            Crear Usuario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
