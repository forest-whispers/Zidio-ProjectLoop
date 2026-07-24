-- Enable pgvector extension if not enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "FeedbackEmbedding" (
    "id" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "embedding" vector(768) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedbackEmbedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackEmbedding_feedbackId_key" ON "FeedbackEmbedding"("feedbackId");

-- CreateIndex
CREATE INDEX "FeedbackEmbedding_feedbackId_idx" ON "FeedbackEmbedding"("feedbackId");

-- AddForeignKey
ALTER TABLE "FeedbackEmbedding" ADD CONSTRAINT "FeedbackEmbedding_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create HNSW Index
CREATE INDEX IF NOT EXISTS feedback_embedding_hnsw_idx 
ON "FeedbackEmbedding" 
USING hnsw (embedding vector_cosine_ops);