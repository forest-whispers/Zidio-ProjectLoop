import { FeedbackDetailView } from "@/features/feedback/components/FeedbackDetailView";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export const metadata = {
    title: "Feedback Details - LOOP",
    description: "View and edit details of a workspace feedback entry.",
};

export default async function FeedbackDetailPage({ params }: PageProps) {
    const { id } = await params;
    return <FeedbackDetailView id={id} />;
}