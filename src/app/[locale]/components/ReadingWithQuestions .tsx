import React from 'react';

type Question = {
    question: string;
    options: string[];
};

type Props = {
    title: string;
    passage: string;
    questions: Question[];
};

const ReadingWithQuestions: React.FC<Props> = ({ title, passage, questions }) => {
    return (
        <div className="max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10 space-y-8">
            <h1 className="text-2xl font-bold text-center text-gray-800">Lesson: {title}</h1>
            <div className="text-gray-700 text-justify leading-relaxed whitespace-pre-line border-l-4 border-blue-500 pl-4">
                {passage}
            </div>
            <div className="space-y-6">
                {questions.map((q, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                        <p className="font-semibold text-gray-800 mb-2">
                            Question {index + 1}: {q.question}
                        </p>
                        <ul className="space-y-2">
                            {q.options.map((option, i) => (
                                <li key={i} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name={`question-${index}`}
                                        id={`q${index}-opt${i}`}
                                    />
                                    <label htmlFor={`q${index}-opt${i}`} className="text-gray-700">
                                        {option}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="flex justify-end">
                <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    Default
                </button>
            </div>
        </div>
    );
};

export default ReadingWithQuestions;
