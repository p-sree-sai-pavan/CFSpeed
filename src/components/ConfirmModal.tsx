'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'default';
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel
}: ConfirmModalProps) {
    const [isConfirming, setIsConfirming] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !isConfirming) {
                onCancel();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, isConfirming, onCancel]);

    // Trap focus in modal
    useEffect(() => {
        if (isOpen && modalRef.current) {
            const firstFocusable = modalRef.current.querySelector('button');
            firstFocusable?.focus();
        }
    }, [isOpen]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleConfirm = useCallback(async () => {
        setIsConfirming(true);
        try {
            await onConfirm();
        } finally {
            setIsConfirming(false);
        }
    }, [onConfirm]);

    if (!isOpen) return null;

    const variantStyles = {
        danger: 'bg-red-600 hover:bg-red-500',
        warning: 'bg-orange-600 hover:bg-orange-500',
        default: 'bg-indigo-600 hover:bg-indigo-500'
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={isConfirming ? undefined : onCancel}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative w-full max-w-sm rounded-2xl bg-[#0d0d0f] border border-white/10 p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200"
            >
                {/* Close button */}
                <button
                    onClick={onCancel}
                    disabled={isConfirming}
                    className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-white transition-colors disabled:opacity-50"
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${variant === 'danger' ? 'bg-red-500/10' :
                        variant === 'warning' ? 'bg-orange-500/10' : 'bg-indigo-500/10'
                    }`}>
                    <AlertTriangle className={`h-6 w-6 ${variant === 'danger' ? 'text-red-400' :
                            variant === 'warning' ? 'text-orange-400' : 'text-indigo-400'
                        }`} />
                </div>

                {/* Content */}
                <h2 id="modal-title" className="text-lg font-semibold text-white mb-2">
                    {title}
                </h2>
                <p className="text-sm text-zinc-400 mb-6">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isConfirming}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-300 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 transition-all disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isConfirming}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 ${variantStyles[variant]}`}
                    >
                        {isConfirming ? 'Loading...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
