import {
    FeedbackChannel,
    FeedbackStatus,
    Sentiment,
} from "@prisma/client";

// Replicate the Prisma client models locally or import them
export interface FeedbackTheme {
    feedbackId: string;
    themeId: string;
    theme: {
        id: string;
        name: string;
        color: string;
        description: string | null;
        workspaceId: string;
        createdAt: Date | string;
        updatedAt: Date | string;
    };
}

export interface Feedback {
    id: string;
    content: string;
    channel: FeedbackChannel;
    customerLabel: string | null;
    status: FeedbackStatus;
    sentiment: Sentiment | null;
    sentimentScore: number | null;
    workspaceId: string;
    themes?: FeedbackTheme[];
    createdAt: string;
    updatedAt: string;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface FeedbackListResponse {
    items: Feedback[];
    pagination: PaginationInfo;
}

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

export interface FeedbackFilters {
    search?: string;
    channel?: FeedbackChannel;
    status?: FeedbackStatus;
    sentiment?: Sentiment;
    page?: number;
    limit?: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.error || 
            errorData.message || 
            `Request failed with status ${response.status}`
        );
    }
    
    // For 204 No Content, we can return null as T
    if (response.status === 204) {
        return null as unknown as T;
    }

    return response.json();
}

export const feedbackApi = {
    async getFeedbacks(filters: FeedbackFilters = {}): Promise<FeedbackListResponse> {
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        if (filters.channel) params.append("channel", filters.channel);
        if (filters.status) params.append("status", filters.status);
        if (filters.sentiment) params.append("sentiment", filters.sentiment);
        if (filters.page) params.append("page", filters.page.toString());
        if (filters.limit) params.append("limit", filters.limit.toString());

        const query = params.toString();
        const url = `/api/feedback${query ? `?${query}` : ""}`;
        const response = await fetch(url);
        return handleResponse<FeedbackListResponse>(response);
    },

    async getFeedbackById(id: string): Promise<Feedback> {
        const response = await fetch(`/api/feedback/${id}`);
        return handleResponse<Feedback>(response);
    },

    async createFeedback(dto: CreateFeedbackDto): Promise<Feedback> {
        const response = await fetch("/api/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dto),
        });
        return handleResponse<Feedback>(response);
    },

    async updateFeedback(id: string, dto: UpdateFeedbackDto): Promise<Feedback> {
        const response = await fetch(`/api/feedback/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dto),
        });
        return handleResponse<Feedback>(response);
    },

    async updateFeedbackStatus(id: string, status: FeedbackStatus): Promise<Feedback> {
        const response = await fetch(`/api/feedback/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });
        return handleResponse<Feedback>(response);
    },

    async deleteFeedback(id: string): Promise<void> {
        const response = await fetch(`/api/feedback/${id}`, {
            method: "DELETE",
        });
        return handleResponse<void>(response);
    },
};