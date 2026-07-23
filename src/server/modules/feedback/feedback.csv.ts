import { parse } from "csv-parse/sync";

import { FeedbackChannel, Prisma } from "@prisma/client";

import { csvFeedbackRowSchema } from "./feedback.validation";
import { CsvImportError } from "./feedback.types";

interface ParseResult {
    rows: Prisma.FeedbackCreateManyInput[];
    errors: CsvImportError[];
}

export async function parseFeedbackCsv(
    file: File,
    workspaceId: string
): Promise<ParseResult> {
    const text = await file.text();

    const parsedRows = parse(text, {
        columns: true,
        trim: true,
        skip_empty_lines: true,
    });

    const rows: Prisma.FeedbackCreateManyInput[] = [];

    const errors: CsvImportError[] = [];

    parsedRows.forEach((row: unknown, index: number) => {
        const result = csvFeedbackRowSchema.safeParse(row);

        if (!result.success) {
            errors.push({
                row: index + 2,
                message: result.error.issues
                    .map(issue => issue.message)
                    .join(", "),
            });

            return;
        }

        rows.push({
            content: result.data.content,
            channel: result.data.channel as FeedbackChannel,
            customerLabel: result.data.customerLabel,
            workspaceId,
        });
    });

    return {
        rows,
        errors,
    };
}