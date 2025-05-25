"use client";

import Breadcrumb from "@/app/[locale]/components/breadcumb";
import { useApi } from "@/lib/Api";
import ExerciseTypeService from "@/lib/services/exercise-types.service";
import TopicService from "@/lib/services/topic.service";
import { useEffect, useState } from "react";
// import OrbitProgress from "react-loading-indicator"; // Đảm bảo bạn đã cài đặt thư viện này

const levels = ["A1", "A2", "B1", "B2"];
const skills = ["grammar", "vocabulary", "reading", "listening"];

const breadcrumbs = [
  {
    label: "Trang chủ",
    href: "/admin/home",
  },
  {
    label: "Tạo sinh bài tập",
    href: "/admin/generate",
  },
];

const defaultPrompt = ({
  skill = "",
  level = "",
  topic = "",
  type = "",
}: any) => `You are an educational content generator.

Please generate one English learning exercise in JSON format for a language learning app. Follow exactly the structure and field names in the example below.

---

Constraints:
- Skill: ${skill}
- Level: ${level}
- Topic: ${topic}
- Type: ${type} (e.g. multiple choice, fill-in-the-blank, etc.)

Make sure:
- The exercise is natural and pedagogically appropriate.
- The "question" is clear.
- Provide 4 options in the "options" field labeled "A" to "D".
- Return only the JSON. No extra explanation.

Example JSON output format:
{
  "name": "Title of the exercise – based on topic and type",
  "question": "What is the correct form of the verb in this sentence: 'She _____ to school every day.'?",
  "system_answer": "B",
  "skill": "${skill}",
  "image": null,
  "generated_by": "mistral_llm",
  "description": "Choose the best answer.",
  "options": {
    "A": "go",
    "B": "goes",
    "C": "going",
    "D": "gone"
  },
  "audio_url": null
}`;

export default function ExerciseGenerate() {
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("");
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("");
  const [topics, setTopics] = useState([]);
  const [types, setTypes] = useState([]);
  const [results, setResults] = useState<any[]>([]);
  const [prompt, setPrompt] = useState(defaultPrompt({}));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const api = useApi();
  const topicService = new TopicService();
  const exerciseTypeService = new ExerciseTypeService();

  useEffect(() => {
    topicService.getAll({}).then((res) => setTopics(res?.data || []));
    exerciseTypeService.getAll({}).then((res) => setTypes(res?.data || []));
  }, []);

  useEffect(() => {
    setPrompt(
      defaultPrompt({
        skill,
        level,
        topic: topics.find((t) => t.id === topic)?.title || "",
        type: types.find((t) => t.id === type)?.name || "",
      })
    );
  }, [skill, level, topic, type, topics, types]);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await api.post("exercises/generate", {
        skill,
        level,
        topic,
        type_id: type,
        prompt: prompt,
      });
      setResults((prev) => [...prev, res.data]);
    } catch (error) {
      alert("Failed to generate exercise.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const json = JSON.stringify(results, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "exercises.json";
    link.click();
  };

  const presetPrompts = [
    "Default prompt for generating a custom exercise.",
    "Generate a multiple choice question about present simple tense.",
    "Create a vocabulary exercise for travel topic.",
    "Generate a reading comprehension question for level B1.",
  ];

  return (
    <div className="p-6 space-y-4">
      <Breadcrumb items={breadcrumbs} />
      <h2 className="text-xl font-semibold">Tạo sinh bài tập tiếng Anh</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Skill</option>
          {skills.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Level</option>
          {levels &&
            levels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
        </select>

        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Topic</option>
          {topics &&
            topics.map((t: any) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Type</option>
          {types &&
            types.map((t: any) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">Prompt</label>
        <textarea
          rows={10}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border rounded font-mono text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {presetPrompts.map((p, idx) => (
          <button
            key={idx}
            className="text-sm bg-gray-200 rounded-sm hover:bg-gray-300 px-3 py-1"
            onClick={() => setPrompt(p)}
          >
            Use: {p.slice(0, 30)}...
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Đang tạo..." : "Tạo bài tập"}
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Xuất file JSON
        </button>
      </div>

      <div className="mt-6">
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Question</th>
              <th className="border p-2">Level</th>
              <th className="border p-2">Skill</th>
            </tr>
          </thead>
          <tbody>
            {results &&
              results.map((r, idx) => (
                <tr key={r.id} className="border-t">
                  <td className="border p-2">{idx + 1}</td>
                  <td className="border p-2">{r.question}</td>
                  <td className="border p-2">{r.level}</td>
                  <td className="border p-2">{r.skill}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
