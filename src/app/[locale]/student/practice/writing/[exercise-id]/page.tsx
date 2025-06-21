"use client";
import ExerciseService from "@/lib/services/exercise.service";
import { Exercise } from "@/lib/types/exercise";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useTranslations } from "next-intl";
import { use, useCallback, useEffect, useState } from "react";
import {
  LuBold,
  LuItalic,
  LuStrikethrough,
  LuHeading1,
  LuHeading2,
  LuList,
  LuListOrdered,
  LuSend,
  LuBookOpen,
  LuClock,
  LuCheck,
  LuGraduationCap,
  LuFileText,
  LuSave,
  LuEye,
} from "react-icons/lu";
import SubmissionService from "@/lib/services/submission.service";
import { correctText } from "@/lib/services/writingCheck.service";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import "./style.css";
import { GrammarHighlight } from "@/app/[locale]/components/tiptapExtensions/GrammarHighlight";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const exerciseService = new ExerciseService();
  const submissionService = new SubmissionService();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder:
          t("placeholder_content") ||
          "Bắt đầu viết câu trả lời của bạn tại đây...",
      }),
      GrammarHighlight.configure({
        errors: [],
      }),
    ],
    content: "\n\n\n",
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

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  const handleCheckGrammar = useCallback(async (content: string) => {
    return await correctText(content)
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!editor || isSubmitting) return;

    setIsSubmitting(true);
    const content = editor.getText();
    debugger
    try {
      const response = await submissionService.submitWritingExercise(
        exerciseId as string,
        content
      );
      const resultCheck: any = await handleCheckGrammar(content);

      // Update grammar highlight in editor
      editor.commands.updateGrammarErrors(resultCheck.errors);

      if (response.success) {
        toast.success(t("submissionSuccessful") || "Nộp bài thành công!");
        setLastSaved(new Date());
      } else {
        toast.error(t("submissionFailed") || "Nộp bài thất bại!");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error(t("submissionFailed") || "Nộp bài thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    editor,
    isSubmitting,
    handleCheckGrammar,
    // submissionService,
    // exercise.id,
    // user.id,
    t,
  ]);

  const handleSaveDraft = () => {
    // Implement save draft functionality
    setLastSaved(new Date());
    toast.info("Đã lưu bản nháp");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 font-medium">Đang tải bài tập...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <LuBookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Luyện tập viết
                </h1>
                <p className="text-sm text-gray-500">
                  Hoàn thành bài tập của bạn
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {lastSaved && (
                <div className="flex items-center text-sm text-gray-500">
                  <LuCheck className="h-4 w-4 mr-1 text-green-500" />
                  Đã lưu lúc {formatTime(lastSaved)}
                </div>
              )}
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-blue-700">
                  {wordCount} từ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Exercise Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white mb-1">
                  {exercise.name}
                </h2>
                <div className="flex items-center text-blue-100">
                  <LuGraduationCap className="h-4 w-4 mr-2" />
                  <span className="text-sm">Bài tập luyện viết</span>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <LuFileText className="h-4 w-4 mr-2" />
                    Đề bài:
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {exercise.question}
                  </p>
                </div>
              </div>
            </div>

            {/* Editor Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              {/* Toolbar */}
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                <div className="flex flex-wrap gap-1 items-center">
                  <div className="flex items-center space-x-1 border-r border-gray-300 pr-3 mr-3">
                    <button
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      disabled={
                        !editor?.can().chain().focus().toggleBold().run()
                      }
                      className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${
                        editor?.isActive("bold")
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600"
                      }`}
                      title="Đậm"
                    >
                      <LuBold size={16} />
                    </button>

                    <button
                      onClick={() =>
                        editor?.chain().focus().toggleItalic().run()
                      }
                      disabled={
                        !editor?.can().chain().focus().toggleItalic().run()
                      }
                      className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${
                        editor?.isActive("italic")
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600"
                      }`}
                      title="Nghiêng"
                    >
                      <LuItalic size={16} />
                    </button>

                    <button
                      onClick={() =>
                        editor?.chain().focus().toggleStrike().run()
                      }
                      disabled={
                        !editor?.can().chain().focus().toggleStrike().run()
                      }
                      className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${
                        editor?.isActive("strike")
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600"
                      }`}
                      title="Gạch ngang"
                    >
                      <LuStrikethrough size={16} />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1 border-r border-gray-300 pr-3 mr-3">
                    <button
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({ level: 1 })
                          .run()
                      }
                      className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${
                        editor?.isActive("heading", { level: 1 })
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600"
                      }`}
                      title="Tiêu đề 1"
                    >
                      <LuHeading1 size={16} />
                    </button>

                    <button
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({ level: 2 })
                          .run()
                      }
                      className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${
                        editor?.isActive("heading", { level: 2 })
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600"
                      }`}
                      title="Tiêu đề 2"
                    >
                      <LuHeading2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() =>
                        editor?.chain().focus().toggleBulletList().run()
                      }
                      className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${
                        editor?.isActive("bulletList")
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600"
                      }`}
                      title="Danh sách có dấu đầu dòng"
                    >
                      <LuList size={16} />
                    </button>

                    <button
                      onClick={() =>
                        editor?.chain().focus().toggleOrderedList().run()
                      }
                      className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${
                        editor?.isActive("orderedList")
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600"
                      }`}
                      title="Danh sách có số thứ tự"
                    >
                      <LuListOrdered size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Editor */}
              <div className="p-6">
                <div
                  className={`min-h-96 rounded-lg border-2 transition-all duration-200 ${
                    isFocused
                      ? "border-blue-500 shadow-md ring-4 ring-blue-500/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="p-4 text-black outline-none border-0 h-[384px]">
                    <EditorContent
                      editor={editor}
                      className="prose prose-sm max-w-none outline-none h-[384px]"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <LuFileText className="h-4 w-4 mr-1" />
                      {wordCount} từ
                    </span>
                    {lastSaved && (
                      <span className="flex items-center text-green-600">
                        <LuCheck className="h-4 w-4 mr-1" />
                        Đã lưu
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSaveDraft}
                      className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <LuSave className="h-4 w-4 mr-2" />
                      Lưu nháp
                    </button>

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || wordCount === 0}
                      className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg  cursor-pointer"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <LuSend className="h-4 w-4 mr-2" />
                      )}
                      {isSubmitting ? "Đang nộp..." : "Nộp bài"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <LuClock className="h-5 w-5 mr-2 text-blue-600" />
                Tiến độ
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số từ đã viết</span>
                  <span className="font-medium">{wordCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((wordCount / 500) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">Mục tiêu: 500 từ</p>
              </div>
            </div>

            {/* Grammar Check Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <LuCheck className="h-5 w-5 mr-2 text-green-600" />
                Kiểm tra ngữ pháp
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <LuEye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-3">
                  Tính năng kiểm tra ngữ pháp tự động
                </p>
                <button className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full cursor-not-allowed">
                  Sắp ra mắt
                </button>
              </div>
            </div>

            {/* Last Submission Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <LuFileText className="h-5 w-5 mr-2 text-purple-600" />
                Bài nộp trước đó
              </h3>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Chưa có bài nộp nào
                </p>
                <p className="text-xs text-gray-500">
                  Bài nộp của bạn sẽ hiển thị ở đây
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
