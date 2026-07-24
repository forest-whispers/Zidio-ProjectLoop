import { ExecutiveReport } from "@/features/report/components/ExecutiveReport";

export const metadata = {
    title: "Executive Report - LOOP",
    description: "Generate executive feedback briefing reports and export to PDF.",
};

export default function ReportPage() {
    return <ExecutiveReport />;
}