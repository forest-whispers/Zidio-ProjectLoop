import { Prisma, FeedbackStatus } from "@prisma/client";

import { prisma } from "@/server/config/db";
import {
    NotFoundError,
} from "@/server/shared/errors/errors";

import {
    CreateFeedbackDto,
    FeedbackFilters,
    UpdateFeedbackDto,
} from "./feedback.types";

export async function createFeedback(
    workspaceId: string,
    dto: CreateFeedbackDto
) {
    return prisma.feedback.create({
        data: {
            content: dto.content,
            channel: dto.channel,
            customerLabel: dto.customerLabel,
            workspaceId,
        },
    });
}

export async function getFeedbacks(
    workspaceId: string,
    filters: FeedbackFilters
) {
    const {
        search,
        channel,
        status,
        sentiment,
        page = 1,
        limit = 20,
    } = filters;

    const where: Prisma.FeedbackWhereInput = {
        workspaceId,
    };

    if (search) {
        where.content = {
            contains: search,
            mode: "insensitive",
        };
    }

    if (channel) {
        where.channel = channel;
    }

    if (status) {
        where.status = status;
    }

    if (sentiment) {
        where.analysis = {
            sentiment: sentiment,
        };
    }

    const [items, totalItems] = await prisma.$transaction([
        prisma.feedback.findMany({
            where,

            orderBy: {
                createdAt: "desc",
            },

            skip: (page - 1) * limit,

            take: limit,

            include: {
                themes: {
                    include: {
                        theme: true,
                    },
                },
                analysis: true,
            },
        }),

        prisma.feedback.count({
            where,
        }),
    ]);

    return {
        items,

        pagination: {
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
        },
    };
}

export async function getFeedbackById(
    workspaceId: string,
    feedbackId: string
) {
    const feedback = await prisma.feedback.findFirst({
        where: {
            id: feedbackId,
            workspaceId,
        },

        include: {
            themes: {
                include: {
                    theme: true,
                },
            },
            analysis: true,
        },
    });

    if (!feedback) {
        throw new NotFoundError("Feedback not found.");
    }

    return feedback;
}

export async function updateFeedback(
    workspaceId: string,
    feedbackId: string,
    dto: UpdateFeedbackDto
) {
    await getFeedbackById(workspaceId, feedbackId);

    return prisma.feedback.update({
        where: {
            id: feedbackId,
        },

        data: dto,
    });
}

export async function updateFeedbackStatus(
    workspaceId: string,
    feedbackId: string,
    status: FeedbackStatus
) {
    await getFeedbackById(workspaceId, feedbackId);

    return prisma.feedback.update({
        where: {
            id: feedbackId,
        },

        data: {
            status,
        },
    });
}

export async function deleteFeedback(
    workspaceId: string,
    feedbackId: string
) {
    await getFeedbackById(workspaceId, feedbackId);

    await prisma.feedback.delete({
        where: {
            id: feedbackId,
        },
    });
}