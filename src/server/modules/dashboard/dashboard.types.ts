import type { UserRole } from "@prisma/client";

export interface DashboardOverview {
    totalFeedback: number;
    analyzedFeedback: number;
    pendingAnalysis: number;
    activeThemes: number;
    workspaceMembers: number;
}

export interface DashboardMember {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface RecentFeedback {
    id: string;
    content: string;
    channel: string;
    createdAt: Date;
}

export interface RecentAnalysis {
    id: string;
    feedbackId: string;
    summary: string;
    sentiment: string;
    featureArea: string;
    analyzedAt: Date;
}

export interface DashboardResponse {
    overview: DashboardOverview;

    members: DashboardMember[];

    recentFeedback: RecentFeedback[];

    recentAnalyses: RecentAnalysis[];
}