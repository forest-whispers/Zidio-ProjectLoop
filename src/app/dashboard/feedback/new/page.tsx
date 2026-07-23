import { CreateFeedbackForm } from "@/features/feedback/components/CreateFeedbackForm";

export const metadata = {
    title: "Add Feedback - LOOP",
    description: "Create new feedback entries in the workspace.",
};

export default function NewFeedbackPage() {
    return <CreateFeedbackForm />;
}