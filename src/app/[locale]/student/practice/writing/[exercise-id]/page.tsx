"use client";
import ExerciseService from "@/lib/services/exercise.service";
import { Exercise } from "@/lib/types/exercise";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";
import {
  LuBold,
  LuItalic,
  LuStrikethrough,
  LuHeading1,
  LuHeading2,
  LuList,
  LuListOrdered,
} from "react-icons/lu";
import SubmissionService from "@/lib/services/submission.service";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

export default function StudentWritingPracticePage() {
  const { "exercise-id": exerciseId } = useParams();
  let { user } = useAuth();

  if (!user) {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  }
  const t = useTranslations("StudentWritingPractice");
  const [exercise, setExercise] = useState<Exercise>(null);
  const [wordCount, setWordCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const exerciseService = new ExerciseService();
  const submissionService = new SubmissionService();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: t("placeholder_content") || "Start writing here...",
      }),
    ],

    content: "\n\n\n",
    // placeholder: t("placeholder_content"),
    onUpdate: ({ editor }) => {
      const text = editor?.getText();
      setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    },
  });

  useEffect(() => {
    if (!editor) return;

    const onFocus = () => setIsFocused(true);
    const onBlur = () => setIsFocused(false);

    editor.on("focus", onFocus);
    editor.on("blur", onBlur);

    // Cleanup
    return () => {
      editor.off("focus", onFocus);
      editor.off("blur", onBlur);
    };
  }, [editor]);

  useEffect(() => {
    if (!exerciseId) {
      console.error("Exercise ID is required");
      return;
    }
    console.log("Fetching exercise with ID:", exerciseId);

    exerciseService
      .getById(exerciseId)
      .then((response) => {
        if (response.success) {
          setExercise(response.data);
          editor?.commands.setContent(response.data.question);
        } else {
          console.error("Failed to fetch exercise:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching exercise:", error);
      });
  }, []);

  const handleSubmit = () => {
    if (!editor) return;
    const content = editor?.getHTML();
    // exerciseService.submitExercise("1", content).then((response) => {
    //   console.log("Submission successful:", response);
    //   // Optionally reset editor or show success message
    //   editor.commands.clearContent();
    //   setWordCount(0);
    // }).catch((error) => {
    //   console.error("Submission failed:", error);
    // });
    submissionService
      .submitWritingExercise(exercise.id, user.id, content)
      .then((response) => {
        if (response.success) {
          console.log("Submission successful:", response);
          toast.info(t("submissionSuccessful"));
        } else {
          console.error("Submission failed:", error);
          toast.error(t("submissionFailed"));
        }
      })
      .catch((error) => {
        console.error("Submission failed:", error);
        toast.error(t("submissionFailed"));
      });
  };

  if (!exercise) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-2">{exercise.name}</h1>
        <p className="text-gray-700 mb-4">{exercise.question}</p>

        <div
          className={`p-2 mb-2 min-h-[6rem] rounded-md ${
            isFocused ? "" : "border"
          }`}
        >
          <EditorContent editor={editor} />
        </div>

        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <div>Words: {wordCount}</div>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-700 flex flex-wrap gap-2 items-center">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor?.can().chain().focus().toggleBold().run()}
            className={`p-1 rounded hover:bg-gray-200 ${
              editor?.isActive("bold") ? "bg-blue-100 text-blue-600" : ""
            }`}
          >
            <LuBold size={16} />
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor?.can().chain().focus().toggleItalic().run()}
            className={`p-1 rounded hover:bg-gray-200 ${
              editor?.isActive("italic") ? "bg-blue-100 text-blue-600" : ""
            }`}
          >
            <LuItalic size={16} />
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            disabled={!editor?.can().chain().focus().toggleStrike().run()}
            className={`p-1 rounded hover:bg-gray-200 ${
              editor?.isActive("strike") ? "bg-blue-100 text-blue-600" : ""
            }`}
          >
            <LuStrikethrough size={16} />
          </button>

          <span className="text-gray-400">|</span>

          <button
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-1 rounded hover:bg-gray-200 ${
              editor?.isActive("heading", { level: 1 })
                ? "bg-blue-100 text-blue-600"
                : ""
            }`}
          >
            <LuHeading1 size={16} />
          </button>

          <button
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-1 rounded hover:bg-gray-200 ${
              editor?.isActive("heading", { level: 2 })
                ? "bg-blue-100 text-blue-600"
                : ""
            }`}
          >
            <LuHeading2 size={16} />
          </button>

          <span className="text-gray-400">|</span>

          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`p-1 rounded hover:bg-gray-200 ${
              editor?.isActive("bulletList") ? "bg-blue-100 text-blue-600" : ""
            }`}
          >
            <LuList size={16} />
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`p-1 rounded hover:bg-gray-200 ${
              editor?.isActive("orderedList") ? "bg-blue-100 text-blue-600" : ""
            }`}
          >
            <LuListOrdered size={16} />
          </button>

          <span className="ml-2 text-xs text-gray-500">
            {/* {t("instructions")} */}
          </span>
        </div>
      </main>

      {/* Sidebar */}
      <aside className="w-72 border-l p-4 bg-gray-50">
        <div className="mb-4">
          <h2 className="font-semibold">Grammar Check</h2>
          <div className="text-xs text-gray-500">
            Check grammar box (coming soon)
          </div>
        </div>
        <div>
          <h2 className="font-semibold">Last Submission</h2>
          <p className="text-sm text-gray-600">You wrote this last time...</p>
        </div>
      </aside>
    </div>
  );
}
