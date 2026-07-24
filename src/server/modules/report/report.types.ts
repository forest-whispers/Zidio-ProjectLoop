export type ReportRange =
    | "7d"
    | "30d"
    | "90d"
    | "1y"
    | "all";

export interface ExecutiveReportRequest {
    range: ReportRange;
}

export interface ExecutiveReportResponse {
    title: string;

    generatedAt: string;

    range: ReportRange;

    report: string;
}