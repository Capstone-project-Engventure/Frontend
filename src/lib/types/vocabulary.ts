export interface Vocabulary {
    id: number;
    word: string;
    meaning: string;
    example_sentence?: string;
    part_of_speech?: string;
    topic_id?: number;
    created_at?: string;
    updated_at?: string;
    image?: string;
    audio?: string;
}

