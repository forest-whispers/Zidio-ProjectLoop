"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "./toast";
import { CustomSelect } from "@/features/shared/ui/CustomSelect";
import { feedbackApi } from "../services/feedback.api";
import { createFeedbackSchema } from "@/server/modules/feedback/feedback.validation";
import { FeedbackChannel } from "@prisma/client";

type CreateFeedbackFormValues = z.infer<typeof createFeedbackSchema>;

const CHANNEL_OPTIONS = [
    { value: "MANUAL", label: "Manual Entry" },
    { value: "SUPPORT_TICKET", label: "Support Ticket" },
    { value: "APP_STORE", label: "App Store" },
    { value: "PLAY_STORE", label: "Play Store" },
    { value: "TWITTER", label: "Twitter / X" },
    { value: "SALES_CALL", label: "Sales Call" },
    { value: "SURVEY", label: "Survey" },
    { value: "COMMUNITY", label: "Community Forum" },
    { value: "CSV_IMPORT", label: "CSV Import" },
];

export function CreateFeedbackForm() {
    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<CreateFeedbackFormValues>({
        resolver: zodResolver(createFeedbackSchema),
        mode: "onChange",
        defaultValues: {
            content: "",
            channel: "MANUAL" as FeedbackChannel,
            customerLabel: "",
        },
    });

    const channelValue = watch("channel");

    // TanStack Query Mutation
    const mutation = useMutation({
        mutationFn: feedbackApi.createFeedback,
        onSuccess: () => {
            toast({
                title: "Feedback Created",
                description: "Feedback entry has been added to the inbox.",
                variant: "success",
            });
            // Invalidate feedback queries to refresh the list
            queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
            router.push("/dashboard/feedback");
        },
        onError: (err: any) => {
            setServerError(err.message || "An unexpected error occurred. Please try again.");
            toast({
                title: "Failed to create feedback",
                description: err.message || "Please check the form and try again.",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (values: CreateFeedbackFormValues) => {
        setServerError(null);
        mutation.mutate(values);
    };

    const isPending = mutation.isPending;

    return (
        <div className="grow max-w-2xl w-full mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
            {/* Back Button and Title */}
            <div className="space-y-2">
                <Link
                    href="/dashboard/feedback"
                    className="inline-flex items-center space-x-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors font-semibold group cursor-pointer"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back to Feedback Inbox</span>
                </Link>
                <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                    Add New Feedback
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Log new customer feedback request manually into the workspace database
                </p>
            </div>

            {/* Error Alert Box */}
            {serverError && (
                <div className="flex items-start space-x-2.5 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs animate-in fade-in duration-200">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <span className="font-semibold block">Failed to submit feedback</span>
                        <p>{serverError}</p>
                    </div>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5">
                {/* Content Textarea */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="content"
                        className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                    >
                        Feedback Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="content"
                        disabled={isPending}
                        placeholder="Please write the customer request or feedback here... (Minimum 5 characters)"
                        rows={6}
                        {...register("content")}
                        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-900 dark:text-white placeholder-zinc-405 focus:outline-none focus:ring-2 transition-all ${
                            errors.content
                                ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                : "border-zinc-200 dark:border-zinc-800 focus:ring-indigo-500/20 focus:border-indigo-500"
                        }`}
                    />
                    {errors.content && (
                        <p className="text-xs text-red-500 font-medium animate-in fade-in duration-150">
                            {errors.content.message}
                        </p>
                    )}
                </div>

                {/* Grid for Channel and Customer Label */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Channel Selector */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="channel"
                            className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                        >
                            Feedback Source Channel <span className="text-red-500">*</span>
                        </label>
                        <div>
                            <CustomSelect
                                value={channelValue}
                                onChange={(val) => setValue("channel", val as FeedbackChannel, { shouldValidate: true })}
                                options={CHANNEL_OPTIONS}
                                placeholder="Select Channel"
                            />
                        </div>
                        {errors.channel && (
                            <p className="text-xs text-red-500 font-medium animate-in fade-in duration-150">
                                {errors.channel.message}
                            </p>
                        )}
                    </div>

                    {/* Customer Label */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="customerLabel"
                            className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                        >
                            Customer Label <span className="text-zinc-400 font-normal">(Optional)</span>
                        </label>
                        <input
                            id="customerLabel"
                            type="text"
                            disabled={isPending}
                            placeholder="e.g. Enterprise Client, User #145"
                            {...register("customerLabel")}
                            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-900 dark:text-white placeholder-zinc-405 focus:outline-none focus:ring-2 transition-all ${
                                errors.customerLabel
                                    ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                    : "border-zinc-200 dark:border-zinc-800 focus:ring-indigo-500/20 focus:border-indigo-500"
                            }`}
                        />
                        {errors.customerLabel && (
                            <p className="text-xs text-red-500 font-medium animate-in fade-in duration-150">
                                {errors.customerLabel.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-100 dark:border-zinc-850">
                    <Link
                        href="/dashboard/feedback"
                        className="px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={!isValid || isPending}
                        className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold shadow-md hover:bg-zinc-850 dark:hover:bg-zinc-100 disabled:opacity-50 disabled:pointer-events-none transition-all active:scale-[0.98] cursor-pointer"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <span>Create Feedback</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}