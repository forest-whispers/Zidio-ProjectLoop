"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder: string;
    disabled?: boolean;
}

export function CustomSelect({ value, onChange, options, placeholder, disabled = false }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);
    const displayLabel = selectedOption ? selectedOption.label : placeholder;

    return (
        <div ref={containerRef} className="relative inline-block text-left w-full sm:w-auto">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full sm:w-auto min-w-[130px] px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800/70 dark:bg-zinc-900/80 text-zinc-100 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-700/80 dark:hover:bg-zinc-800/80 hover:border-zinc-600 dark:hover:border-zinc-600 transition-all flex items-center justify-between gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    disabled ? "opacity-50 cursor-not-allowed bg-zinc-600 dark:bg-zinc-800 text-zinc-400" : ""
                }`}
            >
                <span className="truncate">{displayLabel}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-205 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && !disabled && (
                <div className="absolute left-0 mt-1.5 w-full sm:w-56 rounded-xl border border-zinc-700 bg-zinc-800/90 dark:bg-zinc-900/90 backdrop-blur-md p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col gap-1">
                    {options.map((option) => {
                        const isSelected = option.value === value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-2.5 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer flex items-center justify-between ${
                                     isSelected
                                         ? "bg-zinc-105 dark:bg-zinc-900 text-indigo-650 dark:text-indigo-400 font-bold"
                                         : "bg-zinc-800/70 dark:bg-zinc-900/80 text-zinc-100 dark:text-zinc-200 hover:bg-zinc-700/80 dark:hover:bg-zinc-800/80"
                                 }`}
                            >
                                <span className="truncate">{option.label}</span>
                                {isSelected && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
