export function normalizeFeedback(
    content: string
): string {
    return content
        .normalize("NFKC")
        .replace(/\r\n/g, "\n")
        .replace(/\s+/g, " ")
        .trim();
}