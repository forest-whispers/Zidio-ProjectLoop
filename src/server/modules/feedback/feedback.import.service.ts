import { prisma } from "@/server/config/db";

import { parseFeedbackCsv } from "./feedback.csv";
import { demoFeedback } from "./demo-feedback";
import {
    CsvImportResult,
    DemoImportResult,
} from "./feedback.types";

export async function importFeedbackCsv(
    workspaceId: string,
    file: File
): Promise<CsvImportResult> {
    const { rows, errors } =
        await parseFeedbackCsv(
            file,
            workspaceId
        );

    let result = { count: 0 }

    if (rows.length > 0) {
        result = await prisma.feedback.createMany({
            data: rows,
        });
    }

    return {
        imported: result.count,
        failed: errors.length,
        errors,
    };
}

export async function importDemoFeedback(
    workspaceId: string
): Promise<DemoImportResult> {
    if (demoFeedback.length === 0) {
        return {
            imported: 0,
        };
    }

    await prisma.feedback.createMany({
        data: demoFeedback.map(feedback => ({
            ...feedback,
            workspaceId,
        })),
    });

    return {
        imported: demoFeedback.length,
    };
}