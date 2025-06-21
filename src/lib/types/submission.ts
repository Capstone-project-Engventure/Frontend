export type Submission = {
    id: string;
    exercise_id: string;
    user_id: string;
    content: string;
};

export type GrammarError = {
    type: string;
    orig: string;
    corrected: string;
    explanation: string;
};

export type SubmissionNote = {
    original: string;
    corrected: string;
    errors: GrammarError[];
};

export type SubmissionResponse = {
    id: string;
    exercise: string;
    user: string;
    content: string;
    grade: number;
    note: SubmissionNote;
    type: string;
    status: string;
};
  