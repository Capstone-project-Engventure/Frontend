import { Exercise } from "./exercise";
import { Sound } from "./sound";

export interface PronunciationPracticeType{
    name: string;
    question: string;
    description: string;
    audio_file: string;
    skill:string;
    lesson:string;
    symbol:string;
    word:string;
    note:string;
}