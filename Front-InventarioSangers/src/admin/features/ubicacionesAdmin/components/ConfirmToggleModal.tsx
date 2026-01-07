import { AlertTriangle, X } from 'lucide-react';

interface ConfirmToggleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    isActive: boolean;
    isToggling?: boolean;
}

export const ConfirmToggleModal = ({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    isActive,
    isToggling = false
}: ConfirmToggleModalProps) => {
    if (!isOpen) return null;

    const action = isActive ? 'desactivar' : 'activar';
    const actionCapitalized = isActive ? 'Desactivar' : 'Activar';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md p-6 bg-white rounded-xl shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isActive ? 'bg-red-100' : 'bg-green-100'}`}>
                            <AlertTriangle className={`w-6 h-6 ${isActive ? 'text-red-600' : 'text-green-600'}`} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Confirmar {actionCapitalized}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        disabled={isToggling}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <p className="text-slate-600">
                        ¿Estás seguro de que deseas {action} el tipo{' '}
                        <span className="font-semibold text-slate-900">"{itemName}"</span>?
                    </p>
                    {isActive ? (
                        <p className="mt-2 text-sm text-slate-500">
                            El tipo quedará inactivo y no aparecerá en las opciones disponibles.
                        </p>
                    ) : (
                        <p className="mt-2 text-sm text-slate-500">
                            El tipo quedará activo y estará disponible para su uso.
                        </p>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isToggling}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isToggling}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isActive
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {isToggling ? 'Procesando...' : actionCapitalized}
                    </button>
                </div>
            </div>
        </div>
    );
};
