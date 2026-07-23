"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
    email: z.string().trim().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();
    const { status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
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
        formState: { errors, isValid },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        if (isLoading) return;
        setIsLoading(true);
        setServerError(null);

        try {
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            });

            if (result?.error) {
                // Determine user-facing error message
                if (result.error === "CredentialsSignin" || result.error.includes("credential")) {
                    setServerError("Invalid email or password. Please try again.");
                } else {
                    setServerError(result.error);
                }
                setIsLoading(false);
            } else {
                // Success - trigger a router refresh to force middleware check/cookie updates
                router.refresh();
                // Redirection is handled by the useEffect watching status === "authenticated"
            }
        } catch (err: any) {
            setServerError(err?.message || "An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    // Prevent interactive forms when already authenticated
    const isAuthenticating = isLoading || status === "loading" || status === "authenticated";

    return (
        <div className="w-full max-w-md px-8 py-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300">
            <div className="flex flex-col space-y-2 text-center mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-300 dark:to-white bg-clip-text text-transparent">
                    Welcome back
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Enter your credentials to access your LOOP workspace
                </p>
            </div>

            {serverError && (
                <div className="flex items-start space-x-2.5 p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{serverError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                            disabled={isAuthenticating}
                            {...register("email")}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all duration-200 ${
                                errors.email
                                    ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                    : "border-zinc-200 dark:border-zinc-800 focus:ring-zinc-950/10 focus:border-zinc-950 dark:focus:ring-white/10 dark:focus:border-white"
                            }`}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs text-red-500 font-medium animate-in fade-in duration-150">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="password"
                            className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                        >
                            Password
                        </label>
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400 dark:text-zinc-500">
                            <Lock className="w-4 h-4" />
                        </span>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            disabled={isAuthenticating}
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
                            disabled={isAuthenticating}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-red-500 font-medium animate-in fade-in duration-150">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!isValid || isAuthenticating}
                    className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold shadow-md dark:shadow-zinc-900/20 hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 active:scale-[0.98]"
                >
                    {isAuthenticating ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>
                                {status === "authenticated"
                                    ? "Redirecting..."
                                    : "Signing in..."}
                            </span>
                        </>
                    ) : (
                        <span>Sign In</span>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">New to LOOP? </span>
                <Link
                    href="/register"
                    className="font-semibold text-zinc-900 dark:text-white hover:underline transition-all"
                >
                    Create an account
                </Link>
            </div>
        </div>
    );
}