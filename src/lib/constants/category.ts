export enum CategoryEnum {
  GRAMMAR = "grammar",
  VOCABULARY = "vocabulary",
  PRONUNCIATION = "pronunciation",
  LISTENING = "listening",
  READING = "reading",
  WRITING = "writing",
  SPEAKING = "speaking",
  FUNCTIONAL = "functional", // như "Making Requests", "Asking for Help"
  TEST = "test", // TOEIC, IELTS...
  OTHER = "other",
}

export const CategoryOptions = [
  { label: "Grammar", value: CategoryEnum.GRAMMAR },
  { label: "Vocabulary", value: CategoryEnum.VOCABULARY },
  { label: "Pronunciation", value: CategoryEnum.PRONUNCIATION },
  { label: "Listening", value: CategoryEnum.LISTENING },
  { label: "Reading", value: CategoryEnum.READING },
  { label: "Writing", value: CategoryEnum.WRITING },
  { label: "Speaking", value: CategoryEnum.SPEAKING },
  { label: "Functional", value: CategoryEnum.FUNCTIONAL },
  { label: "Test", value: CategoryEnum.TEST },
  { label: "Other", value: CategoryEnum.OTHER },
];
