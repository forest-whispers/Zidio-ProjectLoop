import { prisma } from "@/server/config/db";

export interface SaveEmbeddingInput {
    feedbackId: string;

    provider: string;

    model: string;

    embedding: number[];
}

export async function saveEmbedding({
    feedbackId,
    provider,
    model,
    embedding,
}: SaveEmbeddingInput) {
    // return prisma.feedbackEmbedding.upsert({
    //     where: {
    //         feedbackId,
    //     },

    //     create: {
    //         feedbackId,
    //         provider,
    //         model,
    //         embedding: embedding as unknown as Prisma.InputJsonValue,
    //     },

    //     update: {
    //         provider,
    //         model,
    //         embedding: embedding as unknown as Prisma.InputJsonValue,
    //     },
    // });

    await prisma.$executeRaw`
    INSERT INTO "FeedbackEmbedding"
    (
        "id",
        "feedbackId",
        "provider",
        "model",
        "embedding",
        "createdAt",
        "updatedAt"
    )
    VALUES
    (
        gen_random_uuid(),
        ${feedbackId},
        ${provider},
        ${model},
        ${JSON.stringify(embedding)}::vector,
        NOW(),
        NOW()
    )
    ON CONFLICT ("feedbackId")
    DO UPDATE SET
        "provider" = EXCLUDED."provider",
        "model" = EXCLUDED."model",
        "embedding" = EXCLUDED."embedding",
        "updatedAt" = NOW();
`;
}

export async function deleteEmbedding(
    feedbackId: string
) {
    await prisma.feedbackEmbedding.delete({
        where: {
            feedbackId,
        },
    });
}