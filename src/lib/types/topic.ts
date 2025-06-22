export type Topic = {
    id: number,
    title: string,
    description: string,
    category?: string, // Category/skill type (reading, grammar, etc.)
    level?: string,
    order?: number
};