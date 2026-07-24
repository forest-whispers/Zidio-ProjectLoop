import { AskLoopResponse } from "@/server/modules/askLoop/askLoop.types";

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to query assistant";
        try {
            const parsed = JSON.parse(errorText);
            errorMessage = parsed.message || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
    }
    return response.json();
};

export const askLoopApi = {
    async askQuestion(question: string): Promise<AskLoopResponse> {
        const response = await fetch("/api/ask-loop", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question }),
        });
        return handleResponse<AskLoopResponse>(response);
    },
};