import { prisma } from "@/server/config/db";

import type {
    DashboardResponse,
} from "./dashboard.types";

export async function getDashboard(
    workspaceId: string
): Promise<DashboardResponse> {

    const [
        totalFeedback,
        analyzedFeedback,
        activeThemes,
        workspaceMembers,
        members,
        recentFeedback,
        recentAnalyses,
    ] = await Promise.all([

        prisma.feedback.count({
            where: {
                workspaceId,
            },
        }),

        prisma.feedbackAnalysis.count({
            where: {
                feedback: {
                    workspaceId,
                },
            },
        }),

        prisma.theme.count({
            where: {
                workspaceId,
            },
        }),

        prisma.user.count({
            where: {
                workspaceId,
            },
        }),

        prisma.user.findMany({

            where: {
                workspaceId,
            },

            select: {

                id: true,

                role: true,

                name: true,

                email: true
            },

            orderBy: {
                role: "asc",
            },
        }),

        prisma.feedback.findMany({

            where: {
                workspaceId,
            },

            orderBy: {
                createdAt: "desc",
            },

            take: 5,

            select: {

                id: true,

                content: true,

                channel: true,

                createdAt: true,
            },
        }),

        prisma.feedbackAnalysis.findMany({

            orderBy: {
                analyzedAt: "desc",
            },

            take: 5,

            where: {
                feedback: {
                    workspaceId,
                },
            },

            select: {

                id: true,

                analyzedAt: true,

                summary: true,

                sentiment: true,

                featureArea: true,

                feedbackId: true,
            },
        }),
    ]);

    const mappedMembers = members
        .map(member => ({
            id: member.id,
            name: member.name,
            email: member.email,
            role: member.role,
        }))
        .sort((a, b) => {
            if (a.role === "ADMIN") return -1;
            if (b.role === "ADMIN") return 1;
            return a.name.localeCompare(b.name);
    });

    return {

        overview: {

            totalFeedback,

            analyzedFeedback,

            pendingAnalysis: totalFeedback - analyzedFeedback,

            activeThemes,

            workspaceMembers,
        },

        members: mappedMembers,

        recentFeedback,

        recentAnalyses,
    };
}