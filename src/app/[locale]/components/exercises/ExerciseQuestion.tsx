import { FaCheckCircle, FaTimes, FaLightbulb } from "react-icons/fa";
import { Exercise } from "@/lib/types/exercise";

interface ExerciseQuestionProps {
    exercise: Exercise;
    userAnswer?: string;
    showResults: boolean;
    onSelect: (exerciseId: number, answer: string) => void;
}

export default function ExerciseQuestion({
    exercise,
    userAnswer,
    showResults,
    onSelect,
}: ExerciseQuestionProps) {
    return (
        <div>
            <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {/* Chỉ là chỉ số tạm thời; parent sẽ kiểm soát số câu hỏi */}
                    #
                </div>
                <div className="flex-1">
                    <p className="text-gray-800 font-medium mb-2">{exercise.question}</p>
                    {exercise.description && (
                        <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                    )}
                </div>
            </div>

            <div className="space-y-3 ml-11">
                {exercise.options.map((option, index) => {
                    const isSelected = userAnswer === option.key;
                    const isCorrect = showResults && option.key === exercise.system_answer;
                    const isWrong = showResults && isSelected && option.key !== exercise.system_answer;

                    return (
                        <div key={index} className="relative">
                            <button
                                onClick={() => !showResults && onSelect(exercise.id, option.key)}
                                disabled={showResults}
                                className={`w-full p-3 text-left border-2 rounded-lg transition-all ${isCorrect
                                    ? "border-green-500 bg-green-50 text-green-800"
                                    : isWrong
                                        ? "border-red-500 bg-red-50 text-red-800"
                                        : isSelected
                                            ? "border-green-500 bg-green-50 text-green-800"
                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <span className="text-sm font-medium text-gray-500">
                                            {String.fromCharCode(65 + index)}.
                                        </span>
                                    </div>
                                    <span className="flex-1">{option.option}</span>
                                    {showResults && isCorrect && <FaCheckCircle className="text-green-500" />}
                                    {showResults && isWrong && <FaTimes className="text-red-500" />}
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>

            {showResults && exercise.explanation && (
                <div className="mt-4 ml-11 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <div className="flex items-start space-x-2">
                        <FaLightbulb className="text-blue-500 mt-1" />
                        <div>
                            <h4 className="font-semibold text-blue-800 mb-2">Giải thích</h4>
                            <p className="text-blue-700">{exercise.explanation}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
