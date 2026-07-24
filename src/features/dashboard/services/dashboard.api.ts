import { DashboardResponse } from "@/server/modules/dashboard/dashboard.types";

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to fetch dashboard data";
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

export const dashboardApi = {
    async getDashboard(): Promise<DashboardResponse> {
        const response = await fetch("/api/dashboard");
        return handleResponse<DashboardResponse>(response);
    },
};