"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import {
    User,
    Mail,
    Lock,
    Building2,
    Briefcase,
    Loader2,
    AlertCircle,
    Eye,
    EyeOff,
    Link as LinkIcon,
} from "lucide-react";

// Client-side schema mirroring backend SignUpDto discriminated union
const registerSchema = z.discriminatedUnion("mode", [
    z.object({
        mode: z.literal("create"),
        name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
        email: z.string().trim().email("Please enter a valid email address"),
        password: z.string().min(8, "Password must be at least 8 characters").max(100),
        workspaceName: z.string().trim().min(2, "Workspace name must be at least 2 characters").max(100),
    }),
    z.object({
        mode: z.literal("join"),
        name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
        email: z.string().trim().email("Please enter a valid email address"),
        password: z.string().min(8, "Password must be at least 8 characters").max(100),
        workspaceSlug: z.string().trim().min(2, "Workspace URL slug must be at least 2 characters").max(100),
        role: z.enum(["ANALYST", "VIEWER"]),
    }),
]);

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormInput {
    mode: "create" | "join";
    name: string;
    email: string;
    password: string;
    workspaceName?: string;
    workspaceSlug?: string;
    role?: "ANALYST" | "VIEWER";
}

export function RegisterForm() {
    const router = useRouter();
    const { status } = useSession();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    // Redirect when session is confirmed authenticated
    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: { errors, isValid },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: {
            mode: "create",
            name: "",
            email: "",
            password: "",
            workspaceName: "",
            workspaceSlug: "",
            role: "ANALYST",
        } as any,
    });

    const formErrors = errors as any;

    const mode = watch("mode");

    const handleModeChange = (newMode: "create" | "join") => {
        setValue("mode", newMode);
        setServerError(null);
        // Retrigger validation for the new mode fields
        trigger();
    };

    // TanStack Query mutation for registration
    const signupMutation = useMutation({
        mutationFn: async (data: RegisterFormValues) => {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || "Failed to create account.");
            }

            return response.json();
        },
        onSuccess: async (_, variables) => {
            // Immediately authenticate user after successful sign up
            try {
                const result = await signIn("credentials", {
                    email: variables.email,
                    password: variables.password,
                    redirect: false,
                });

                if (result?.error) {
                    setServerError("Account created, but automatic sign-in failed: " + result.error);
                } else {
                    router.refresh();
                }
            } catch (err: any) {
                setServerError("Account created, but automatic sign-in failed: " + err.message);
            }
        },
        onError: (error: any) => {
            setServerError(error.message || "An unexpected error occurred.");
        },
    });

    const onSubmit = (values: RegisterFormValues) => {
        if (signupMutation.isPending) return;
        setServerError(null);
        signupMutation.mutate(values);
    };

    const isSubmitting = signupMutation.isPending || status === "loading" || status === "authenticated";

    return (
        <div className="w-full max-w-md px-8 py-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300">
            <div className="flex flex-col space-y-2 text-center mb-6">
                <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-300 dark:to-white bg-clip-text text-transparent">
                    Create your account
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Get started with Project LOOP today
                </p>
            </div>

            {/* Segmented Toggle Control */}
            <div className="p-1 mb-6 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg flex relative border border-zinc-200/20">
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleModeChange("create")}
                    className={`flex-1 text-xs py-2 font-semibold rounded-md transition-all duration-200 ${
                        mode === "create"
                            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm"
                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                >
                    Create Workspace
                </button>
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleModeChange("join")}
                    className={`flex-1 text-xs py-2 font-semibold rounded-md transition-all duration-200 ${
                        mode === "join"
                            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm"
                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                >
                    Join Workspace
                </button>
            </div>

            {serverError && (
                <div className="flex items-start space-x-2.5 p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{serverError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="name"
                        className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                    >
                        Full Name
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400 dark:text-zinc-500">
                            <User className="w-4 h-4" />
                        </span>
                        <input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            disabled={isSubmitting}
                            {...register("name")}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all duration-200 ${
                                errors.name
                                    ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                    : "border-zinc-200 dark:border-zinc-800 focus:ring-zinc-950/10 focus:border-zinc-950 dark:focus:ring-white/10 dark:focus:border-white"
                            }`}
                        />
                    </div>
                    {formErrors.name && (
                        <p className="text-xs text-red-500 font-medium animate-in fade-in duration-150">
                            {formErrors.name.message}
                        </p>
                    )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="email"
                        className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                    >
                        Email Address
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400 dark:text-zinc-500">
                            <Mail className="w-4 h-4" />
                        </span>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@company.com"
                            disabled={isSubmitting}
                            {...register("email")}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all duration-200 ${
                                errors.email
                                    ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                    : "border-zinc-200 dark:border-zinc-800 focus:ring-zinc-950/10 focus:border-zinc-950 dark:focus:ring-white/10 dark:focus:border-white"
                            }`}
                        />
                    </div>
                    {formErrors.email && (
                        <p className="text-xs text-red-500 font-medium animate-in fade-in duration-150">
                            {formErrors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="password"
                        className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400 dark:text-zinc-500">
                            <Lock className="w-4 h-4" />
                        </span>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Minimum 8 characters"
                            disabled={isSubmitting}
                            {...register("password")}
                            className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all duration-200 ${
                                errors.password
                                    ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                    : "border-zinc-200 dark:border-zinc-800 focus:ring-zinc-950/10 focus:border-zinc-950 dark:focus:ring-white/10 dark:focus:border-white"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isSubmitting}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {formErrors.password && (
                        <p className="text-xs text-red-500 font-medium animate-in fade-in duration-150">
                            {formErrors.password.message}
                        </p>
                    )}
                </div>

                {/* DYNAMIC FIELDS: Mode: Create Workspace */}
                {mode === "create" && (
                    <div className="space-y-1.5 animate-in fade-in duration-200">
                        <label
                            htmlFor="workspaceName"
                            className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                        >
                            Workspace Name
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400 dark:text-zinc-500">
                                <Building2 className="w-4 h-4" />
                            </span>
                            <input
                                id="workspaceName"
                                type="text"
                                placeholder="Acme Corporation"
                                disabled={isSubmitting}
                                {...register("workspaceName")}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all duration-200 ${
                                    formErrors.workspaceName
                                        ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                        : "border-zinc-200 dark:border-zinc-800 focus:ring-zinc-950/10 focus:border-zinc-950 dark:focus:ring-white/10 dark:focus:border-white"
                                }`}
                            />
                        </div>
                        {formErrors.workspaceName && (
                            <p className="text-xs text-red-500 font-medium animate-in fade-in duration-150">
                                {formErrors.workspaceName.message}
                            </p>
                        )}
                    </div>
                )}

                {/* DYNAMIC FIELDS: Mode: Join Workspace */}
                {mode === "join" && (
                    <>
                        <div className="space-y-1.5 animate-in fade-in duration-200">
                            <label
                                htmlFor="workspaceSlug"
                                className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                            >
                                Workspace URL Slug
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400 dark:text-zinc-500">
                                    <LinkIcon className="w-4 h-4" />
                                </span>
                                <input
                                    id="workspaceSlug"
                                    type="text"
                                    placeholder="acme-corp"
                                    disabled={isSubmitting}
                                    {...register("workspaceSlug")}
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all duration-200 ${
                                        formErrors.workspaceSlug
                                            ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                            : "border-zinc-200 dark:border-zinc-800 focus:ring-zinc-950/10 focus:border-zinc-950 dark:focus:ring-white/10 dark:focus:border-white"
                                    }`}
                                />
                            </div>
                            {formErrors.workspaceSlug && (
                                <p className="text-xs text-red-500 font-medium animate-in fade-in duration-150">
                                    {formErrors.workspaceSlug.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5 animate-in fade-in duration-200">
                            <label
                                htmlFor="role"
                                className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                            >
                                Target Role
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400 dark:text-zinc-500">
                                    <Briefcase className="w-4 h-4" />
                                </span>
                                <select
                                    id="role"
                                    disabled={isSubmitting}
                                    {...register("role")}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm bg-zinc-50 dark:bg-zinc-955 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 dark:focus:ring-white/10 dark:focus:border-white appearance-none cursor-pointer"
                                >
                                    <option value="ANALYST">Analyst (Write/Edit permissions)</option>
                                    <option value="VIEWER">Viewer (Read-only permissions)</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400">
                                    ▼
                                </span>
                            </div>
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="w-full mt-4 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold shadow-md dark:shadow-zinc-900/20 hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 active:scale-[0.98]"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>
                                {status === "authenticated"
                                    ? "Redirecting..."
                                    : "Creating account..."}
                            </span>
                        </>
                    ) : (
                        <span>Register & Sign In</span>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Already have an account? </span>
                <Link
                    href="/login"
                    className="font-semibold text-zinc-900 dark:text-white hover:underline transition-all"
                >
                    Sign in instead
                </Link>
            </div>
        </div>
    );
}