"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, Home, MessageSquare, Loader2, BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/features/feedback/components/toast";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    if (status === "loading") {
        return (
            <div className="flex-1 flex flex-col justify-center items-center min-h-screen bg-[#fafaf6] dark:bg-[#0a0a09] text-zinc-600 dark:text-zinc-400">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-900 dark:text-white mb-2" />
                <span className="text-sm font-medium">Loading session...</span>
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="flex-1 flex flex-col justify-center items-center min-h-screen bg-[#fafaf6] dark:bg-[#0a0a09] text-zinc-600 dark:text-zinc-400">
                <span className="text-sm font-semibold text-red-500">Access Denied: No active session.</span>
            </div>
        );
    }

    const { user } = session;
    const isFeedbackActive = pathname.startsWith("/dashboard/feedback");
    const isAnalyticsActive = pathname.startsWith("/dashboard/analytics");

    return (
        <ToastProvider>
            <div className="flex-1 flex flex-col min-h-screen bg-[#fafaf6] dark:bg-[#0a0a09]">
                {/* Header */}
                <header className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#121210]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-8">
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 font-bold shadow-sm">
                                L
                            </div>
                            <span className="font-extrabold text-zinc-900 dark:text-white tracking-wider uppercase text-sm">LOOP</span>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden sm:flex items-center space-x-1">
                            <Link
                                href="/dashboard"
                                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                    pathname === "/dashboard"
                                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                            >
                                <Home className="w-3.5 h-3.5" />
                                <span>Home</span>
                            </Link>
                            <Link
                                href="/dashboard/feedback"
                                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                    isFeedbackActive
                                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                            >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Feedback Inbox</span>
                            </Link>
                            <Link
                                href="/dashboard/analytics"
                                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                    isAnalyticsActive
                                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                            >
                                <BarChart3 className="w-3.5 h-3.5" />
                                <span>Analytics</span>
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-end text-right">
                            <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                                Welcome, <span className="font-semibold text-zinc-900 dark:text-white">{user.name}</span>
                            </span>
                            {user.workspace && (
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-medium">
                                    Workspace: {user.workspace.name}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-red-600 hover:border-red-200 dark:hover:text-red-400 dark:hover:border-red-900/30 text-xs font-semibold transition-all duration-200 cursor-pointer"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Log Out</span>
                        </button>
                    </div>
                </header>

                {/* Mobile Navigation Bar */}
                <div className="sm:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121210] px-4 py-2 flex space-x-2">
                    <Link
                        href="/dashboard"
                        className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            pathname === "/dashboard"
                                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
                        }`}
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span>Home</span>
                    </Link>
                    <Link
                        href="/dashboard/feedback"
                        className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            isFeedbackActive
                                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
                        }`}
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Feedback</span>
                    </Link>
                    <Link
                        href="/dashboard/analytics"
                        className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            isAnalyticsActive
                                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
                        }`}
                    >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Analytics</span>
                    </Link>
                </div>

                {/* Content area */}
                <div className="flex-1 flex flex-col">
                    {children}
                </div>
            </div>
        </ToastProvider>
    );
}