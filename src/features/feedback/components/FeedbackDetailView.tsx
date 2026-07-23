"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
    ArrowLeft, 
    Edit2, 
    Trash2, 
    Loader2, 
    AlertCircle, 
    Calendar, 
    Check, 
    X, 
    Sparkles, 
    Layers, 
    Info 
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useToast } from "./toast";
import { feedbackApi } from "../services/feedback.api";
import { updateFeedbackSchema } from "@/server/modules/feedback/feedback.validation";
import { getStatusBadgeStyles, formatStatus, formatChannel } from "./FeedbackList";
import { FeedbackStatus, FeedbackChannel } from "@prisma/client";

type UpdateFeedbackFormValues = z.infer<typeof updateFeedbackSchema>;

export function FeedbackDetailView({ id }: { id: string }) {
    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    // TanStack Query to fetch single feedback
    const { data: feedback, isLoading, error, refetch } = useQuery({
        queryKey: ["feedback", id],
        queryFn: () => feedbackApi.getFeedbackById(id),
    });

    // Form setup for Editing
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<UpdateFeedbackFormValues>({
        resolver: zodResolver(updateFeedbackSchema),
        mode: "onChange",
    });

    // Toggle Editing Mode with Form Pre-population
    const handleToggleEdit = () => {
        if (!feedback) return;
        if (!isEditing) {
            reset({
                content: feedback.content,
                channel: feedback.channel,
                customerLabel: feedback.customerLabel || "",
            });
        }
        setIsEditing(!isEditing);
        setServerError(null);
    };

    // Update Details Mutation
    const updateMutation = useMutation({
        mutationFn: (dto: UpdateFeedbackFormValues) => feedbackApi.updateFeedback(id, dto),
        onSuccess: (updatedFeedback) => {
            toast({
                title: "Feedback Updated",
                description: "Feedback details have been successfully saved.",
                variant: "success",
            });
            // Update cache and invalidate list queries
            queryClient.setQueryData(["feedback", id], updatedFeedback);
            queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
            setIsEditing(false);
        },
        onError: (err: any) => {
            setServerError(err.message || "Failed to update feedback details.");
            toast({
                title: "Failed to save changes",
                description: err.message || "Please check validation errors.",
                variant: "destructive",
            });
        },
    });

    // Update Status Mutation
    const statusMutation = useMutation({
        mutationFn: (status: FeedbackStatus) => feedbackApi.updateFeedbackStatus(id, status),
        onSuccess: (updatedFeedback) => {
            toast({
                title: "Status Updated",
                description: `Feedback status set to ${formatStatus(updatedFeedback.status)}.`,
                variant: "success",
            });
            queryClient.setQueryData(["feedback", id], updatedFeedback);
            queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
        },
        onError: (err: any) => {
            toast({
                title: "Failed to update status",
                description: err.message || "Please try again.",
                variant: "destructive",
            });
        },
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: () => feedbackApi.deleteFeedback(id),
        onSuccess: () => {
            toast({
                title: "Feedback Deleted",
                description: "Feedback entry has been permanently deleted.",
                variant: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
            setIsDeleteModalOpen(false);
            router.push("/dashboard/feedback");
        },
        onError: (err: any) => {
            toast({
                title: "Failed to delete feedback",
                description: err.message || "Please try again.",
                variant: "destructive",
            });
            setIsDeleteModalOpen(false);
        },
    });

    const onSave = (values: UpdateFeedbackFormValues) => {
        setServerError(null);
        updateMutation.mutate(values);
    };

    if (isLoading) {
        return (
            <div className="grow max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24 animate-pulse" />
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl space-y-6 animate-pulse">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2.5 grow">
                            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
                        </div>
                        <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-32" />
                    </div>
                    <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                </div>
            </div>
        );
    }

    if (error || !feedback) {
        return (
            <div className="grow max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
                <Link href="/dashboard/feedback" className="inline-flex items-center space-x-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-semibold">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Inbox</span>
                </Link>
                <div className="flex items-center space-x-3 p-5 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div className="grow">
                        <h4 className="text-sm font-semibold">Error loading feedback entry</h4>
                        <p className="text-xs text-red-700 dark:text-red-400">{(error as Error)?.message || "Feedback not found or access denied."}</p>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="px-3 py-1.5 rounded border border-red-200 bg-white dark:bg-red-900/30 text-xs font-semibold text-red-800 dark:text-red-300 hover:bg-red-100 transition-all cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const isPending = updateMutation.isPending || statusMutation.isPending;

    return (
        <div className="grow max-w-4xl w-full mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
            {/* Top Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link
                    href="/dashboard/feedback"
                    className="inline-flex items-center space-x-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors font-semibold group cursor-pointer"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back to Feedback Inbox</span>
                </Link>

                <div className="flex items-center space-x-3">
                    {/* Status Update Dropdown Select */}
                    <div className="relative flex items-center space-x-2">
                        <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Status:</span>
                        <div className="relative">
                            <select
                                value={feedback.status}
                                disabled={isPending || isEditing}
                                onChange={(e) => statusMutation.mutate(e.target.value as FeedbackStatus)}
                                className={`pl-3 pr-8 py-1.5 rounded-lg border text-xs font-bold focus:outline-none appearance-none cursor-pointer border-zinc-200 dark:border-zinc-800 ${
                                    isEditing 
                                        ? "opacity-50 cursor-not-allowed bg-zinc-100 dark:bg-zinc-800 text-zinc-500" 
                                        : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
                                }`}
                            >
                                <option value="SUBMITTED">Submitted</option>
                                <option value="UNDER_REVIEW">Under Review</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                            <span className="absolute inset-y-0 right-0.5 flex items-center pr-2.5 pointer-events-none text-zinc-400 text-[10px]">
                                ▼
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error alerts */}
            {serverError && (
                <div className="flex items-start space-x-2.5 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs animate-in fade-in duration-200">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <span className="font-semibold block">Error updating feedback</span>
                        <p>{serverError}</p>
                    </div>
                </div>
            )}

            {/* Main Detail Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                {/* Detail Card Header */}
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-850 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-zinc-50/20 dark:bg-zinc-900/20">
                    <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
                                {formatChannel(feedback.channel)}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeStyles(feedback.status)}`}>
                                {formatStatus(feedback.status)}
                            </span>
                        </div>
                        <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">
                            Feedback Detail
                        </h2>
                    </div>

                    <div className="flex items-center space-x-2">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={handleToggleEdit}
                                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-all cursor-pointer"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold transition-all cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>

                {/* Detail Card Body */}
                <div className="p-6">
                    {!isEditing ? (
                        /* READ-ONLY VIEW */
                        <div className="space-y-6">
                            {/* Feedback Content */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                                    Content
                                </h3>
                                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal whitespace-pre-wrap">
                                    {feedback.content}
                                </div>
                            </div>

                            {/* Meta Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                                        Customer Label
                                    </h4>
                                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                        {feedback.customerLabel ? (
                                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                                {feedback.customerLabel}
                                            </span>
                                        ) : (
                                            <span className="text-zinc-400 dark:text-zinc-600 italic font-normal">None provided</span>
                                        )}
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                                        Created At
                                    </h4>
                                    <div className="flex items-center space-x-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                        <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                                        <span className="font-mono">
                                            {format(new Date(feedback.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* EDIT MODE FORM */
                        <form onSubmit={handleSubmit(onSave)} className="space-y-5">
                            {/* Content */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="content"
                                    className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                                >
                                    Feedback Content <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="content"
                                    disabled={updateMutation.isPending}
                                    rows={5}
                                    {...register("content")}
                                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                                        errors.content
                                            ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                            : "border-zinc-200 dark:border-zinc-800 focus:ring-zinc-950/10 focus:border-zinc-950 dark:focus:ring-white/10 dark:focus:border-white"
                                    }`}
                                />
                                {errors.content && (
                                    <p className="text-xs text-red-500 font-medium animate-in fade-in duration-150">
                                        {errors.content.message}
                                    </p>
                                )}
                            </div>

                            {/* Grid for Channel and Label */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Channel */}
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="channel"
                                        className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                                    >
                                        Feedback Channel <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="channel"
                                            disabled={updateMutation.isPending}
                                            {...register("channel")}
                                            className="w-full pl-3 pr-8 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm bg-zinc-50 dark:bg-zinc-950/30 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 dark:focus:ring-white/10 dark:focus:border-white appearance-none cursor-pointer"
                                        >
                                            <option value="MANUAL">Manual Entry</option>
                                            <option value="SUPPORT_TICKET">Support Ticket</option>
                                            <option value="APP_STORE">App Store</option>
                                            <option value="PLAY_STORE">Play Store</option>
                                            <option value="TWITTER">Twitter / X</option>
                                            <option value="SALES_CALL">Sales Call</option>
                                            <option value="SURVEY">Survey</option>
                                            <option value="COMMUNITY">Community Forum</option>
                                            <option value="CSV_IMPORT">CSV Import</option>
                                        </select>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400">
                                            ▼
                                        </span>
                                    </div>
                                </div>

                                {/* Customer Label */}
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="customerLabel"
                                        className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                                    >
                                        Customer Label <span className="text-zinc-400 font-normal">(Optional)</span>
                                    </label>
                                    <input
                                        id="customerLabel"
                                        type="text"
                                        disabled={updateMutation.isPending}
                                        placeholder="e.g. Enterprise Client"
                                        {...register("customerLabel")}
                                        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                                            errors.customerLabel
                                                ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                                : "border-zinc-200 dark:border-zinc-800 focus:ring-zinc-950/10 focus:border-zinc-950 dark:focus:ring-white/10 dark:focus:border-white"
                                        }`}
                                    />
                                    {errors.customerLabel && (
                                        <p className="text-xs text-red-500 font-medium animate-in fade-in duration-150">
                                            {errors.customerLabel.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-100 dark:border-zinc-850">
                                <button
                                    type="button"
                                    onClick={handleToggleEdit}
                                    className="px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!isValid || updateMutation.isPending}
                                    className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold shadow-md hover:bg-zinc-850 dark:hover:bg-zinc-100 disabled:opacity-50 disabled:pointer-events-none transition-all active:scale-[0.98] cursor-pointer"
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Placeholders Card - AI and Themes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Sentiment Analysis Placeholder */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2.5 border-b border-zinc-150 dark:border-zinc-800">
                        <div className="flex items-center space-x-2 text-zinc-900 dark:text-white">
                            <Sparkles className="w-4.5 h-4.5 text-indigo-500 animate-pulse" />
                            <h3 className="font-bold text-sm">AI Sentiment & Score</h3>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                            Coming in AI Phase
                        </span>
                    </div>
                    <div className="flex items-center space-x-4 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200/40 dark:border-zinc-800/40 opacity-70">
                        <Info className="w-5 h-5 text-zinc-400 shrink-0" />
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Natural language processing will auto-classify sentiment score and positive/negative tone for this item when AI phase initiates.
                        </p>
                    </div>
                </div>

                {/* Theme Management Placeholder */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2.5 border-b border-zinc-150 dark:border-zinc-800">
                        <div className="flex items-center space-x-2 text-zinc-900 dark:text-white">
                            <Layers className="w-4.5 h-4.5 text-indigo-500" />
                            <h3 className="font-bold text-sm">Theme Assignments</h3>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                            Coming in Themes Phase
                        </span>
                    </div>
                    <div className="flex items-center space-x-4 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200/40 dark:border-zinc-800/40 opacity-70">
                        <Info className="w-5 h-5 text-zinc-400 shrink-0" />
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            This feedback item will automatically link with multiple custom project themes (e.g. UX, Performance, Billing) during the Theme phase.
                        </p>
                    </div>
                </div>
            </div>

            {/* Custom Delete Confirmation Modal (Shadcn/ui AlertDialog design) */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
                    {/* Modal Box */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
                        <div className="flex items-start space-x-3.5 text-zinc-900 dark:text-white">
                            <div className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-650 shrink-0">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="font-extrabold text-base tracking-tight">
                                    Are you absolutely sure?
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                                    This action cannot be undone. This feedback entry will be permanently deleted from the active workspace database.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-2.5 pt-2">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={deleteMutation.isPending}
                                className="px-4 py-2 rounded-lg border border-zinc-250 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteMutation.mutate()}
                                disabled={deleteMutation.isPending}
                                className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 text-white text-xs font-semibold shadow-md transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {deleteMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Confirm Delete</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}