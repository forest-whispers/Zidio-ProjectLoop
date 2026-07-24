export interface AskLoopRequest {
    question: string;
}

export interface Citation {
    feedbackId: string;
    similarity: number;

    content: string;
    summary: string;

    sentiment: string;
    featureArea: string;

    channel: string;

    themes: string[];
}

export interface AskLoopResponse {
    answer: string;

    citations: Citation[];
}