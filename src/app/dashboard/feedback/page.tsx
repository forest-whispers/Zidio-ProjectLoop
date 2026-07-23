import { FeedbackList } from "@/features/feedback/components/FeedbackList";

export const metadata = {
    title: "Feedback Inbox - LOOP",
    description: "Manage and organize customer feedback entries.",
};

export default function FeedbackInboxPage() {
    return <FeedbackList />;
}