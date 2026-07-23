"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export type ToastVariant = "default" | "success" | "destructive";

export interface Toast {
    id: string;
    title: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
}

interface ToastContextType {
    toast: (props: Omit<Toast, "id">) => void;
    toasts: Toast[];
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback(
        ({ title, description, variant = "default", duration = 4000 }: Omit<Toast, "id">) => {
            const id = Math.random().toString(36).substring(2, 9);
            const newToast: Toast = { id, title, description, variant, duration };

            setToasts((prev) => [...prev, newToast]);

            if (duration > 0) {
                setTimeout(() => {
                    dismiss(id);
                }, duration);
            }
        },
        [dismiss]
    );

    return (
        <ToastContext.Provider value={{ toast, toasts, dismiss }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-md w-full sm:w-95 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
                            t.variant === "success"
                                ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                                : t.variant === "destructive"
                                ? "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-900/30 text-red-800 dark:text-red-300"
                                : "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                        }`}
                    >
                        {t.variant === "success" && (
                            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
                        )}
                        {t.variant === "destructive" && (
                            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                        )}
                        <div className="grow space-y-1">
                            <h4 className="text-sm font-semibold tracking-tight">{t.title}</h4>
                            {t.description && (
                                <p className={`text-xs ${
                                    t.variant === "success"
                                        ? "text-emerald-700 dark:text-emerald-400"
                                        : t.variant === "destructive"
                                        ? "text-red-700 dark:text-red-400"
                                        : "text-zinc-500 dark:text-zinc-400"
                                }`}>
                                    {t.description}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => dismiss(t.id)}
                            className="shrink-0 p-0.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}