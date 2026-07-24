import { ExecutiveReportResponse, ReportRange } from "@/server/modules/report/report.types";

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to generate report";
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

export const reportApi = {
    async generateReport(range: ReportRange): Promise<ExecutiveReportResponse> {
        const response = await fetch("/api/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ range }),
        });
        return handleResponse<ExecutiveReportResponse>(response);
    },
};