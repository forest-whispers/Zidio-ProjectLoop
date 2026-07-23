"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User, Building, Shield, Mail, Key, Hash } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex-1 flex flex-col justify-center items-center min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-white mb-2" />
                <span className="text-sm font-medium">Loading session...</span>
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="flex-1 flex flex-col justify-center items-center min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400">
                <span className="text-sm font-semibold text-red-500">Access Denied: No active session.</span>
            </div>
        );
    }

    const { user } = session;

    return (
        <main className="grow max-w-4xl w-full mx-auto px-6 py-12 space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Dashboard</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Viewing active workspace and user session information
                    </p>
                </div>
                <Link
                    href="/dashboard/feedback"
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold shadow-md dark:shadow-zinc-900/20 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all active:scale-[0.98]"
                >
                    View Feedback Inbox
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Card */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                    <div className="flex items-center space-x-2.5 text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
                        <User className="w-5 h-5 text-indigo-500" />
                        <h2 className="font-bold text-base">User Profile</h2>
                    </div>
                    <div className="space-y-3.5 text-sm">
                        <div className="flex items-start space-x-3">
                            <Hash className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                            <div>
                                <div className="text-xs text-zinc-400 font-semibold uppercase">User ID</div>
                                <div className="text-zinc-900 dark:text-zinc-200 font-mono break-all mt-0.5">{user.id}</div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Mail className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                            <div>
                                <div className="text-xs text-zinc-400 font-semibold uppercase">Email</div>
                                <div className="text-zinc-900 dark:text-zinc-200 mt-0.5">{user.email}</div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Shield className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                            <div>
                                <div className="text-xs text-zinc-400 font-semibold uppercase">Role</div>
                                <div className="text-zinc-900 dark:text-zinc-200 mt-0.5">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Workspace Card */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                    <div className="flex items-center space-x-2.5 text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
                        <Building className="w-5 h-5 text-indigo-500" />
                        <h2 className="font-bold text-base">Workspace</h2>
                    </div>
                    <div className="space-y-3.5 text-sm">
                        <div className="flex items-start space-x-3">
                            <Hash className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                            <div>
                                <div className="text-xs text-zinc-400 font-semibold uppercase">Workspace ID</div>
                                <div className="text-zinc-900 dark:text-zinc-200 font-mono break-all mt-0.5">{user.workspace?.id || "N/A"}</div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Building className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                            <div>
                                <div className="text-xs text-zinc-400 font-semibold uppercase">Name</div>
                                <div className="text-zinc-900 dark:text-zinc-200 font-semibold mt-0.5">{user.workspace?.name || "N/A"}</div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Key className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                            <div>
                                <div className="text-xs text-zinc-400 font-semibold uppercase">Slug / Access URL</div>
                                <div className="text-zinc-900 dark:text-zinc-200 font-mono mt-0.5">
                                    /workspace/{user.workspace?.slug || "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}