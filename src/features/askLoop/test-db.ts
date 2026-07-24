import { prisma } from "../../server/config/db";
import { askLoop } from "../../server/modules/askLoop/askLoop.service";
import { findNearestFeedbacks } from "../../server/shared/lib/vector-search";
import { generateQuestionEmbedding } from "../../server/modules/askLoop/askLoop.client";

async function main() {
    const question = "What are the biggest customer pain points?";
    const embedding = await generateQuestionEmbedding(question);
    
    // Check nearest feedbacks with 0 threshold
    const feedbacks = await findNearestFeedbacks({
        workspaceId: "some-workspace-id", // let's find a valid workspaceId first
        embedding,
        limit: 8,
        similarityThreshold: 0, // No threshold!
    });
    
    console.log("Nearest feedbacks (no threshold):", feedbacks.length);
    feedbacks.forEach(f => {
        console.log(`Similarity: ${f.similarity}, Content: ${f.content.slice(0, 60)}...`);
    });
    
    // Find a valid workspace id from DB
    const workspace = await prisma.workspace.findFirst();
    if (workspace) {
        console.log("Using workspace:", workspace.id, workspace.name);
        const feedbacksWithWS = await findNearestFeedbacks({
            workspaceId: workspace.id,
            embedding,
            limit: 8,
            similarityThreshold: 0,
        });
        console.log(`Nearest feedbacks for workspace ${workspace.name}:`, feedbacksWithWS.length);
        feedbacksWithWS.forEach(f => {
            console.log(`Similarity: ${f.similarity}, Content: ${f.content.slice(0, 65)}...`);
        });

        // Run askLoop
        const result = await askLoop(workspace.id, question);
        console.log("askLoop result:", result);
    }
}

main().catch(console.error);
