import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    isDeleting?: boolean;
}

export const ConfirmDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    isDeleting = false
}: ConfirmDeleteModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md p-6 bg-white rounded-xl shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-red-100">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Confirmar Eliminación</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        disabled={isDeleting}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <p className="text-slate-600">
                        ¿Estás seguro de que deseas eliminar la categoría{' '}
                        <span className="font-semibold text-slate-900">"{itemName}"</span>?
                    </p>
                    <p className="mt-2 text-sm text-red-600">
                        Esta acción no se puede deshacer.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
};
