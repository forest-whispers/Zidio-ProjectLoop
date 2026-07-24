import { AskLoop } from "@/features/askLoop/components/AskLoop";

export const metadata = {
    title: "Ask AI Assistant - LOOP",
    description: "Query RAG grounded insights using workspace context.",
};

export default function AskPage() {
    return <AskLoop />;
}