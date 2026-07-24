import { AnalyticsResponse, AnalyticsRange } from "@/server/modules/analytics/analytics.types";

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to fetch analytics data";
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

export const analyticsApi = {
    async getAnalytics(range: AnalyticsRange = "30d"): Promise<AnalyticsResponse> {
        const response = await fetch(`/api/analytics?range=${range}`);
        return handleResponse<AnalyticsResponse>(response);
    },
};