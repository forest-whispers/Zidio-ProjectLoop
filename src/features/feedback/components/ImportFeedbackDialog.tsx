"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
    X, 
    FileSpreadsheet, 
    Download, 
    Upload, 
    AlertCircle, 
    CheckCircle2, 
    Loader2, 
    Sparkles, 
    HelpCircle, 
    RefreshCw, 
    FileText 
} from "lucide-react";
import { feedbackApi, CsvImportResult } from "../services/feedback.api";
import { useToast } from "./toast";

interface ImportFeedbackDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function ImportFeedbackDialog({ isOpen, onClose, onSuccess }: ImportFeedbackDialogProps) {
    const { toast } = useToast();
    const [activeSource, setActiveSource] = useState<"csv" | "zendesk" | "intercom" | "appstore">("csv");
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [clientError, setClientError] = useState<string | null>(null);
    const [importResult, setImportResult] = useState<CsvImportResult | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset state on open/close
    useEffect(() => {
        if (!isOpen) {
            setFile(null);
            setClientError(null);
            setImportResult(null);
            setDragActive(false);
        }
    }, [isOpen]);

    // CSV Sample Download Logic
    const handleDownloadSample = () => {
        const headers = "content,channel,customerLabel\n";
        const rows = [
            `"App crashes after login","APP_STORE","Customer A"`,
            `"Need dark mode","SUPPORT_TICKET","Customer B"`,
            `"Payment failed","TWITTER",""`,
            `"The mobile app is really intuitive. Love being able to check customer requests.","APP_STORE","iOS Reviewer"`,
            `"I am getting way too many email notifications. Please let us customize frequency.","SUPPORT_TICKET","Enterprise Account"`,
            `"Partial search queries are not returning any results. 'dash' should match 'dashboard'.","COMMUNITY","Product Team"`
        ].join("\n");

        const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "loop_feedback_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
            title: "Template Downloaded",
            description: "Sample CSV template has been downloaded to your computer.",
            variant: "success",
        });
    };

    // TanStack Query Mutation
    const mutation = useMutation({
        mutationFn: feedbackApi.importCsv,
        onSuccess: (data) => {
            setImportResult(data);
            onSuccess(); // Refresh feedback list in parent page

            if (data.imported === 0) {
                toast({
                    title: "Import Complete with Errors",
                    description: `0 rows imported, ${data.failed} rows failed validation checks.`,
                    variant: "destructive",
                });
            } else if (data.failed > 0) {
                toast({
                    title: "Import Partially Completed",
                    description: `Successfully imported ${data.imported} rows. ${data.failed} rows failed.`,
                    variant: "default",
                });
            } else {
                toast({
                    title: "Import Successful",
                    description: `All ${data.imported} rows have been successfully imported.`,
                    variant: "success",
                });
            }
        },
        onError: (err: any) => {
            setClientError(err.message || "An unexpected error occurred during CSV ingestion.");
            toast({
                title: "Import Ingestion Failed",
                description: err.message || "Please check your CSV structure and try again.",
                variant: "destructive",
            });
        },
    });

    const validateAndSetFile = (selectedFile: File) => {
        setClientError(null);
        if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
            setClientError("Invalid file type. Please select a valid .csv file.");
            setFile(null);
            return false;
        }
        setFile(selectedFile);
        return true;
    };

    // Drag-and-drop handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (mutation.isPending) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImportSubmit = () => {
        if (!file || mutation.isPending) return;
        setClientError(null);
        mutation.mutate(file);
    };

    const handleReset = () => {
        setFile(null);
        setClientError(null);
        setImportResult(null);
    };

    if (!isOpen) return null;

    const isPending = mutation.isPending;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            {/* Dialog Panel */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="p-5 border-b border-zinc-150 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                        <h2 className="font-extrabold text-base text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                            <Upload className="w-4 h-4 text-indigo-500" />
                            <span>Import Feedback Ingestion</span>
                        </h2>
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">
                            Ingest customer requests into your loop workspace repository
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="p-1 rounded-lg text-zinc-450 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Sources Ingestion Tabs */}
                <div className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-150 dark:border-zinc-850 px-4 py-1.5 flex items-center space-x-1 overflow-x-auto">
                    <button
                        onClick={() => !isPending && setActiveSource("csv")}
                        disabled={isPending}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            activeSource === "csv"
                                ? "bg-white dark:bg-zinc-850 text-indigo-600 dark:text-indigo-400 shadow-xs border border-zinc-150 dark:border-zinc-800"
                                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                        }`}
                    >
                        CSV Spreadsheet
                    </button>

                    {/* Placeholder sources */}
                    <button
                        disabled
                        className="px-3 py-1.5 text-xs font-semibold text-zinc-400 dark:text-zinc-650 flex items-center space-x-1 cursor-not-allowed opacity-60"
                    >
                        <span>Zendesk Ingestion</span>
                        <span className="text-[8px] px-1 py-0.2 rounded bg-zinc-200/60 dark:bg-zinc-800/80 font-bold uppercase tracking-wider">Soon</span>
                    </button>
                    <button
                        disabled
                        className="px-3 py-1.5 text-xs font-semibold text-zinc-400 dark:text-zinc-650 flex items-center space-x-1 cursor-not-allowed opacity-60"
                    >
                        <span>Intercom Sync</span>
                        <span className="text-[8px] px-1 py-0.2 rounded bg-zinc-200/60 dark:bg-zinc-800/80 font-bold uppercase tracking-wider">Soon</span>
                    </button>
                    <button
                        disabled
                        className="px-3 py-1.5 text-xs font-semibold text-zinc-400 dark:text-zinc-650 flex items-center space-x-1 cursor-not-allowed opacity-60"
                    >
                        <span>App/Play Store</span>
                        <span className="text-[8px] px-1 py-0.2 rounded bg-zinc-200/60 dark:bg-zinc-800/80 font-bold uppercase tracking-wider">Soon</span>
                    </button>
                </div>

                {/* Dialog Body Content */}
                <div className="p-6 overflow-y-auto grow space-y-5">
                    {activeSource === "csv" && (
                        <>
                            {/* Ingestion Step 1: Upload Selection */}
                            {!importResult ? (
                                <div className="space-y-4">
                                    {/* CSV Format Info & Template Download */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-xs text-zinc-600 dark:text-zinc-400">
                                        <div className="flex items-start space-x-2.5">
                                            <HelpCircle className="w-4 h-4 text-zinc-450 mt-0.5 shrink-0" />
                                            <div>
                                                <span className="font-bold text-zinc-850 dark:text-zinc-250 block mb-0.5">Required CSV Headers</span>
                                                <p className="leading-relaxed">
                                                    Ensure your file columns exactly match: <code className="font-mono bg-zinc-200/50 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-800 dark:text-zinc-200">content</code>, <code className="font-mono bg-zinc-200/50 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-800 dark:text-zinc-200">channel</code>, and optional <code className="font-mono bg-zinc-200/50 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-800 dark:text-zinc-200">customerLabel</code>.
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            disabled={isPending}
                                            onClick={handleDownloadSample}
                                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-zinc-250 dark:border-zinc-750 hover:bg-white dark:hover:bg-zinc-850 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 transition-colors shadow-xs shrink-0 cursor-pointer"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span>Download Sample</span>
                                        </button>
                                    </div>

                                    {/* Upload Area / Dropzone */}
                                    <div
                                        onDragEnter={handleDrag}
                                        onDragOver={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={!file && !isPending ? handleUploadClick : undefined}
                                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                                            isPending 
                                                ? "border-zinc-200 dark:border-zinc-800 opacity-60 cursor-not-allowed" 
                                                : file
                                                ? "border-emerald-500 bg-emerald-50/5 dark:bg-emerald-950/5"
                                                : dragActive
                                                ? "border-indigo-500 bg-indigo-50/5 dark:bg-indigo-950/5"
                                                : "border-zinc-250 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-650 cursor-pointer"
                                        }`}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept=".csv"
                                            className="hidden"
                                            disabled={isPending}
                                        />

                                        {file ? (
                                            // File selected state
                                            <div className="space-y-3.5 w-full max-w-sm">
                                                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-500 border border-emerald-100 dark:border-emerald-900/50 mx-auto">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-zinc-850 dark:text-zinc-200 truncate">{file.name}</p>
                                                    <p className="text-[10px] text-zinc-450 font-mono">{(file.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                                {!isPending && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setFile(null);
                                                            setClientError(null);
                                                        }}
                                                        className="px-2.5 py-1 text-[10px] text-red-500 hover:text-red-650 border border-red-200 dark:border-red-950/30 bg-white dark:bg-zinc-850 rounded-md font-bold transition-all cursor-pointer"
                                                    >
                                                        Remove File
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            // Empty state dropzone
                                            <div className="space-y-3">
                                                <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 text-zinc-400 mx-auto">
                                                    <FileSpreadsheet className="w-5 h-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-zinc-900 dark:text-white">
                                                        Drag and drop your CSV file here, or <span className="text-indigo-600 dark:text-indigo-400 hover:underline">browse</span>
                                                    </p>
                                                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                                                        Supports only .csv spreadsheets up to 10MB
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Client Ingestion Error Banner */}
                                    {clientError && (
                                        <div className="flex items-start space-x-2.5 p-3.5 rounded-xl border border-red-200 dark:border-red-950 bg-red-50 dark:bg-red-950/30 text-red-750 dark:text-red-300 text-xs animate-in fade-in duration-150">
                                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                            <span>{clientError}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Ingestion Step 2: Display Summary & Validation Errors list */
                                <div className="space-y-5">
                                    {/* Summary Banner */}
                                    {importResult.imported === 0 ? (
                                        <div className="flex items-start space-x-3 p-4 rounded-xl border border-red-250 dark:border-red-950/30 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300">
                                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                                            <div>
                                                <h4 className="text-sm font-bold tracking-tight">Zero feedbacks imported</h4>
                                                <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
                                                    All {importResult.failed} rows in the CSV failed validation checks. Please review validation errors below.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start space-x-3 p-4 rounded-xl border border-emerald-250 dark:border-emerald-950/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300">
                                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
                                            <div>
                                                <h4 className="text-sm font-bold tracking-tight">Ingestion complete!</h4>
                                                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                                                    Successfully imported {importResult.imported} feedbacks. {importResult.failed > 0 ? `${importResult.failed} rows failed validation checks.` : "All rows processed successfully."}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 text-center">
                                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Imported Rows</span>
                                            <span className="text-2xl font-black text-emerald-600 mt-1 block">{importResult.imported}</span>
                                        </div>
                                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 text-center">
                                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Failed Rows</span>
                                            <span className={`text-2xl font-black mt-1 block ${importResult.failed > 0 ? "text-red-650" : "text-zinc-450"}`}>{importResult.failed}</span>
                                        </div>
                                    </div>

                                    {/* Validation Errors Table */}
                                    {importResult.errors.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-350 tracking-tight">
                                                    Validation Mismatch Log ({importResult.errors.length})
                                                </span>
                                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Correct the CSV and re-import failed rows</span>
                                            </div>
                                            
                                            {/* Scrollable Container */}
                                            <div className="max-h-60 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-lg">
                                                <table className="w-full text-left text-xs border-collapse">
                                                    <thead>
                                                        <tr className="sticky top-0 bg-zinc-100 dark:bg-zinc-955 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                                                            <th className="py-2.5 px-3.5 w-24">Row Number</th>
                                                            <th className="py-2.5 px-3.5">Error Message Details</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900">
                                                        {importResult.errors.map((err, idx) => (
                                                            <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/30">
                                                                <td className="py-2 px-3.5 font-bold font-mono text-zinc-500">
                                                                    Row {err.row}
                                                                </td>
                                                                <td className="py-2 px-3.5 font-medium text-red-650 dark:text-red-400">
                                                                    {err.message}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-end space-x-3.5">
                    {!importResult ? (
                        /* Step 1 Actions */
                        <>
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={!file || isPending}
                                onClick={handleImportSubmit}
                                className="inline-flex items-center space-x-1.5 px-4.5 py-2 rounded-lg bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold shadow-md transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Importing Ingestions...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>Upload & Import</span>
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        /* Step 2 Actions */
                        <>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-3.5 py-2 rounded-lg border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                            >
                                Import Another File
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2 rounded-lg bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold shadow-md transition-all cursor-pointer"
                            >
                                Done
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}