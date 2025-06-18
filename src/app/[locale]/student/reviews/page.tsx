"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useTranslations } from "next-intl";

interface Option {
  value: string;
  labelKey: string;
  imgSrc?: string;
  percent?: number;
}

interface SelectOption {
  value: string;
  label: string;
}

type AnswerState = {
  level: string;
  goals: string;
  reasons: string[];
  frequency: string;
  strengths: string;
  weaknesses: string;
};

const levelOptions: Option[] = [
  {
    value: "beginner",
    labelKey: "level.beginner",
    imgSrc: "/images/level-beginner.png",
    percent: 25,
  },
  {
    value: "limited",
    labelKey: "level.limited",
    imgSrc: "/images/level-limited.png",
    percent: 50,
  },
  {
    value: "intermediate",
    labelKey: "level.intermediate",
    imgSrc: "/images/level-intermediate.png",
    percent: 75,
  },
  {
    value: "advanced",
    labelKey: "level.advanced",
    imgSrc: "/images/level-advanced.png",
    percent: 100,
  },
];

const skillsOptions: Option[] = [
  { value: "listening", labelKey: "skills.listening" },
  { value: "speaking", labelKey: "skills.speaking" },
  { value: "reading", labelKey: "skills.reading" },
  { value: "writing", labelKey: "skills.writing" },
];

const reasonOptions: Option[] = [
  {
    value: "entertainment",
    labelKey: "reason.entertainment",
    imgSrc: "/images/reason-entertainment.png",
  },
  {
    value: "travel",
    labelKey: "reason.travel",
    imgSrc: "/images/reason-travel.png",
  },
  {
    value: "career_support",
    labelKey: "reason.career_support",
    imgSrc: "/images/reason-career.png",
  },
  {
    value: "study_support",
    labelKey: "reason.study_support",
    imgSrc: "/images/reason-study.png",
  },
  {
    value: "certification",
    labelKey: "reason.certification",
    imgSrc: "/images/reason-certification.png",
  },
  {
    value: "social",
    labelKey: "reason.social",
    imgSrc: "/images/reason-social.png",
  },
  {
    value: "migration",
    labelKey: "reason.migration",
    imgSrc: "/images/reason-migration.png",
  },
  {
    value: "networking",
    labelKey: "reason.networking",
    imgSrc: "/images/reason-networking.png",
  },
];

const frequencyOptions: Option[] = [
  { value: "once", labelKey: "frequency.once" },
  { value: "twice_thrice", labelKey: "frequency.twice_thrice" },
  { value: "four_five", labelKey: "frequency.four_five" },
  { value: "daily", labelKey: "frequency.daily" },
];

interface Question {
  key: keyof AnswerState;
  label: string;
  type: "radio" | "select" | "checkbox";
  options: (Option & { label?: string })[] | SelectOption[];
}

const ReviewInterface: React.FC = () => {
  const t = useTranslations("Review");
  const [answers, setAnswers] = useState<AnswerState>({
    level: "",
    goals: "",
    reasons: [],
    frequency: "",
    strengths: "",
    weaknesses: "",
  });
  const [review, setReview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);

  const questions: Question[] = [
    {
      key: "level",
      label: t("review.level"),
      type: "radio",
      options: levelOptions.map((opt) => ({ ...opt, label: t(opt.labelKey) })),
    },
    {
      key: "reasons",
      label: t("review.reasons"),
      type: "checkbox",
      options: reasonOptions.map((opt) => ({ ...opt, label: t(opt.labelKey) })),
    },
    {
      key: "frequency",
      label: t("review.frequency"),
      type: "select",
      options: frequencyOptions.map((opt) => ({
        value: opt.value,
        label: t(opt.labelKey),
      })),
    },
    {
      key: "strengths",
      label: t("review.strengths"),
      type: "select",
      options: skillsOptions.map((opt) => ({
        value: opt.value,
        label: t(opt.labelKey),
      })),
    },
    {
      key: "weaknesses",
      label: t("review.weaknesses"),
      type: "select",
      options: skillsOptions.map((opt) => ({
        value: opt.value,
        label: t(opt.labelKey),
      })),
    },
  ];

  const totalSteps = questions.length;
  const currentQ = questions[step];

  const isValid = (): boolean => {
    const val = answers[currentQ.key];
    return currentQ.type === "checkbox"
      ? Array.isArray(val) && val.length > 0
      : Boolean(val);
  };

  const handleChange = (key: keyof AnswerState, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckbox = (value: string) => {
    setAnswers((prev) => {
      const set = new Set(prev.reasons);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...prev, reasons: Array.from(set) };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const generated = t("review.resultTemplate", {
        level: t(`level.${answers.level}`),
        goals: t(`goals.${answers.goals}`),
        reasons: answers.reasons.map((r) => t(`reason.${r}`)).join(", "),
        frequency: t(`frequency.${answers.frequency}`),
        strengths: t(`skills.${answers.strengths}`),
        weaknesses: t(`skills.${answers.weaknesses}`),
      });
      setReview(generated);
    } catch {
      setReview(t("review.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-4">{t("review.title")}</h1>
      {!review ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
          <div>
            <h2 className="font-medium mb-2">{currentQ.label}</h2>
            {currentQ.type === "radio" && (
              <div className="grid grid-cols-2 gap-4">
                {(currentQ.options as (Option & { label: string })[]).map(
                  (opt) => (
                    <div
                      key={opt.value}
                      onClick={() => handleChange(currentQ.key, opt.value)}
                      className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition ease-in-out hover:shadow-lg ${
                        answers[currentQ.key] === opt.value
                          ? "bg-blue-100 border-blue-500"
                          : ""
                      }`}
                    >
                      {opt.imgSrc && (
                        <img
                          src={opt.imgSrc}
                          alt={opt.label}
                          className="w-16 h-16 mb-2"
                        />
                      )}
                      <span className="font-medium">{opt.label}</span>
                      {typeof opt.percent === "number" && (
                        <div className="w-full bg-gray-200 h-2 rounded mt-2">
                          <div
                            className="bg-blue-600 h-2 rounded"
                            style={{ width: `${opt.percent}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
            {currentQ.type === "select" && (
              <select
                value={answers[currentQ.key]}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  handleChange(currentQ.key, e.target.value)
                }
                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  {t("review.selectPlaceholder")}
                </option>
                {(currentQ.options as SelectOption[]).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
            {currentQ.type === "checkbox" && (
              <div className="grid grid-cols-2 gap-4">
                {(currentQ.options as (Option & { label: string })[]).map(
                  (opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center p-2 border rounded-lg hover:shadow-md cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={opt.value}
                        checked={answers.reasons.includes(opt.value)}
                        onChange={() => handleCheckbox(opt.value)}
                        className="mr-2"
                      />
                      {opt.imgSrc && (
                        <img
                          src={opt.imgSrc}
                          alt={opt.label}
                          className="w-6 h-6 mr-2"
                        />
                      )}
                      <span>{opt.label}</span>
                    </label>
                  )
                )}
              </div>
            )}
          </div>
          <div className="flex justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="py-2 px-4 rounded-xl bg-gray-200 hover:bg-gray-300"
              >
                {t("review.back")}
              </button>
            ) : (
              <div />
            )}
            {step < totalSteps - 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev + 1)}
                disabled={!isValid()}
                className="py-2 px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("review.next")}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="py-2 px-4 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("review.loading") : t("review.finish")}
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t("review.result")}</h2>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {review}
          </pre>
          <button
            onClick={() => {
              setReview("");
              setStep(0);
            }}
            className="mt-2 py-2 px-4 rounded-xl bg-gray-200 hover:bg-gray-300"
          >
            {t("review.edit")}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewInterface;
