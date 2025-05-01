'use client'

import { FiX } from 'react-icons/fi';

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    details,
    isWarningAdded,
    warningText,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    details: React.ReactNode;
    isWarningAdded: boolean;
    warningText: string;
    confirmText?: string;
    cancelText?: string;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                            aria-label="Close"
                        >
                            <FiX className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="mb-4">
                        <p className="text-gray-700 mb-4">{message}</p>
                        {
                            isWarningAdded &&
                            (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                    <p className="text-yellow-700 font-medium">{warningText}</p>
                                </div>
                            )
                        }
                        <div className="space-y-3">
                            {details}
                        </div>
                    </div>


                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}