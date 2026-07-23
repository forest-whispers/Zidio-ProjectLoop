import {
    FeedbackChannel,
    FeedbackStatus,
    Sentiment,
} from "@prisma/client";

export interface CreateFeedbackDto {
    content: string;
    channel: FeedbackChannel;
    customerLabel?: string;
}

export interface UpdateFeedbackDto {
    content?: string;
    channel?: FeedbackChannel;
    customerLabel?: string;
}

export interface UpdateFeedbackStatusDto {
    status: FeedbackStatus;
}

export interface FeedbackFilters {
    search?: string;

    channel?: FeedbackChannel;

    status?: FeedbackStatus;

    sentiment?: Sentiment;

    page?: number;

    limit?: number;
}