export type Exercise = {
    id: string;
    name: string;
    question: string;
    description: string;
    options: Record<string, string> | string[] | null;
};
  