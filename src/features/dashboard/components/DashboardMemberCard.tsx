import React from "react";
import { Crown, User, Shield } from "lucide-react";
import { DashboardMember } from "@/server/modules/dashboard/dashboard.types";

interface DashboardMemberCardProps {
    member: DashboardMember;
    isCurrentUser: boolean;
}

export function getInitials(name: string) {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function DashboardMemberCard({ member, isCurrentUser }: DashboardMemberCardProps) {
    const initials = getInitials(member.name);
    const isAdmin = member.role === "ADMIN";

    return (
        <div 
            tabIndex={0}
            className={`p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 ${
                isAdmin
                    ? "border-indigo-100 dark:border-indigo-950/40 bg-indigo-50/10 dark:bg-indigo-950/5"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            } ${isCurrentUser ? "ring-1 ring-zinc-300 dark:ring-zinc-700" : ""}`}
        >
            <div className="flex items-center space-x-3 min-w-0">
                {/* Initials Avatar */}
                <div className={`w-8.5 h-8.5 rounded-full border flex items-center justify-center text-xs font-black shrink-0 ${
                    isAdmin
                        ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900/40 text-indigo-650 dark:text-indigo-400"
                        : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
                }`}>
                    {initials}
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-zinc-900 dark:text-white truncate">
                            {member.name}
                        </span>
                        
                        {/* Crown icon for Admin, Shield/User otherwise */}
                        {isAdmin ? (
                            <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        ) : member.role === "ANALYST" ? (
                            <Shield className="w-3 h-3 text-zinc-400 shrink-0" />
                        ) : (
                            <User className="w-3 h-3 text-zinc-400 shrink-0" />
                        )}

                        {isCurrentUser && (
                            <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[8px] font-black text-zinc-500 dark:text-zinc-400 uppercase border border-zinc-200/50 dark:border-zinc-700/50">
                                You
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-500 truncate block mt-0.5 font-bold">
                        {member.email}
                    </span>
                </div>
            </div>

            {/* Role Badge */}
            <span className={`px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-wider ${
                isAdmin
                    ? "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
                    : member.role === "ANALYST"
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30"
                    : "bg-zinc-50 text-zinc-600 border-zinc-250 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-750"
            }`}>
                {member.role.toLowerCase()}
            </span>
        </div>
    );
}