// src/app/[locale]/student/my-course/[id]/lesson/[lessonId]/page.tsx
"use client";

import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { Lesson } from "@/lib/types/lesson";
import { useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaBook, FaCheckCircle, FaFileImage, FaPlay } from "react-icons/fa";
import { OrbitProgress } from "react-loading-indicators";


// Mock data cho lesson chi tiết
const mockLessons: {
    [key: string]: Lesson & {
        videoUrl?: string;
        imageUrls?: string[];
        content?: string;
        courseName?: string;
        sectionName?: string;
    }
} = {
    "1": {
        id: 1,
        title: "Giới thiệu về khóa học",
        level: "A1",
        description: "Tổng quan về khóa học và cách thức học tập",
        type: "lesson",
        readings: [],
        exercises: [],
        image: 'lesson1-thumb.jpg',
        video: 'intro-video.mp4',
        videoUrl: "https://www.youtube.com/embed/CKgCahkAkQ8?si=58P__4oiB3pjDXHj",
        imageUrls: [
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800"
        ],
        content: `
      <h2>Chào mừng bạn đến với khóa học Tiếng Anh Cơ Bản</h2>
      <p>Trong bài học này, chúng ta sẽ tìm hiểu về:</p>
      <ul>
        <li>Mục tiêu của khóa học</li>
        <li>Phương pháp học tập hiệu quả</li>
        <li>Cách sử dụng tài liệu học tập</li>
        <li>Lộ trình học tập chi tiết</li>
      </ul>
      <p>Hãy xem video hướng dẫn bên dưới để hiểu rõ hơn về khóa học này.</p>
    `,
        courseName: "Khóa học Tiếng Anh Cơ Bản",
        sectionName: "Bài giới thiệu"
    },
    "3": {
        id: 3,
        title: "Section 1: Các loại danh từ",
        level: "Beginner",
        description: "Phân loại và cách sử dụng danh từ",
        type: "lesson",
        readings: [],
        exercises: [],
        image: 'noun-types.jpg',
        video: 'noun-lesson.mp4',
        videoUrl: "https://www.youtube.com/embed/oZeiWAdEofM?si=yMfpaykmnuPxmG3b", // Mock educational video
        imageUrls: [
            "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
            "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
            "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800"
        ],
        content: `
      <h2>Các loại danh từ trong tiếng Anh</h2>
      <p>Danh từ (Noun) là một trong những thành phần quan trọng nhất trong ngữ pháp tiếng Anh. Hãy cùng tìm hiểu về các loại danh từ:</p>
      
      <h3>1. Danh từ cụ thể (Concrete Nouns)</h3>
      <p>Là những danh từ chỉ những vật thể có thể nhìn thấy, sờ được.</p>
      <p><strong>Ví dụ:</strong> book (sách), table (bàn), cat (mèo)</p>
      
      <h3>2. Danh từ trừu tượng (Abstract Nouns)</h3>
      <p>Là những danh từ chỉ những khái niệm, cảm xúc không thể sờ được.</p>
      <p><strong>Ví dụ:</strong> love (tình yêu), happiness (hạnh phúc), freedom (tự do)</p>
      
      <h3>3. Danh từ riêng (Proper Nouns)</h3>
      <p>Là những danh từ chỉ tên riêng của người, địa danh, tổ chức.</p>
      <p><strong>Ví dụ:</strong> John, Vietnam, Microsoft</p>
    `,
        courseName: "Khóa học Tiếng Anh Cơ Bản",
        sectionName: "Danh từ"
    },
    "6": {
        id: 6,
        title: "Section 4: Hạn định từ",
        level: "Beginner",
        description: "Sử dụng các hạn định từ với danh từ",
        type: "lesson",
        readings: [],
        exercises: [],
        image: 'determiners.jpg',
        video: 'determiners-lesson.mp4',
        videoUrl: "https://www.youtube.com/embed/5G7GrDxmYOc?si=vNPDDtCn_85cpfXI",
        imageUrls: [
            "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
            "https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=800"
        ],
        content: `
      <h2>Hạn định từ (Determiners)</h2>
      <p>Hạn định từ là những từ đứng trước danh từ để xác định, làm rõ ý nghĩa của danh từ đó.</p>
      
      <h3>Các loại hạn định từ chính:</h3>
      
      <h4>1. Mạo từ (Articles)</h4>
      <ul>
        <li><strong>a/an:</strong> mạo từ không xác định</li>
        <li><strong>the:</strong> mạo từ xác định</li>
      </ul>
      
      <h4>2. Tính từ chỉ định (Demonstrative Adjectives)</h4>
      <ul>
        <li><strong>this/that:</strong> cho danh từ số ít</li>
        <li><strong>these/those:</strong> cho danh từ số nhiều</li>
      </ul>
      
      <h4>3. Tính từ sở hữu (Possessive Adjectives)</h4>
      <ul>
        <li><strong>my, your, his, her, its, our, their</strong></li>
      </ul>
    `,
        courseName: "Khóa học Tiếng Anh Cơ Bản",
        sectionName: "Danh từ"
    },
    "7": {
        id: 7,
        title: "DANH TỪ 1",
        level: "Beginner",
        description: "Bản đồ tư duy về danh từ phần 1",
        type: "lesson",
        readings: [],
        exercises: [],
        image: 'mindmap1.jpg',
        video: 'mindmap1-video.mp4',
        videoUrl: "https://www.youtube.com/embed/Y09wrGAGTbg?si=0xhULpSDqkNW67eD",
        imageUrls: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800"
        ],
        content: `
      <h2>Bản đồ tư duy: Danh từ - Phần 1</h2>
      <p>Bản đồ tư duy giúp bạn hệ thống hóa kiến thức về danh từ một cách trực quan và dễ nhớ.</p>
      
      <h3>Cấu trúc bản đồ tư duy:</h3>
      <h4>📍 Trung tâm: DANH TỪ (NOUN)</h4>
      
      <h4>🌿 Nhánh 1: Phân loại theo tính chất</h4>
      <ul>
        <li>Danh từ cụ thể (Concrete)</li>
        <li>Danh từ trừu tượng (Abstract)</li>
      </ul>
      
      <h4>🌿 Nhánh 2: Phân loại theo số lượng</h4>
      <ul>
        <li>Danh từ đếm được (Countable)</li>
        <li>Danh từ không đếm được (Uncountable)</li>
      </ul>
      
      <h4>🌿 Nhánh 3: Phân loại theo tên gọi</h4>
      <ul>
        <li>Danh từ riêng (Proper)</li>
        <li>Danh từ chung (Common)</li>
      </ul>
      
      <p>Hãy xem video để hiểu rõ hơn về cách xây dựng và sử dụng bản đồ tư duy này!</p>
    `,
        courseName: "Khóa học Tiếng Anh Cơ Bản",
        sectionName: "Mind map 1"
    },
    "8": {
        id: 8,
        title: "DANH TỪ 2",
        level: "Beginner",
        description: "Bản đồ tư duy về danh từ phần 2",
        type: "lesson",
        readings: [],
        exercises: [],
        image: 'mindmap2.jpg',
        video: 'mindmap2-video.mp4',
        videoUrl: "https://www.youtube.com/embed/5El-SNgw8Ts?si=j37OwWrLU3GYyuW6",
        imageUrls: [
            "https://images.unsplash.com/photo-1553484771-371a605b060b?w=800",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
        ],
        content: `
      <h2>Bản đồ tư duy: Danh từ - Phần 2</h2>
      <p>Tiếp tục với phần 2 của bản đồ tư duy về danh từ, chúng ta sẽ đi sâu vào các quy tắc và cách sử dụng.</p>
      
      <h3>Nội dung chính:</h3>
      
      <h4>🌿 Nhánh 4: Quy tắc số nhiều</h4>
      <ul>
        <li>Thêm -s: book → books</li>
        <li>Thêm -es: box → boxes</li>
        <li>Đổi -y thành -ies: baby → babies</li>
        <li>Danh từ bất quy tắc: child → children</li>
      </ul>
      
      <h4>🌿 Nhánh 5: Sở hữu cách</h4>
      <ul>
        <li>Danh từ số ít: 's (John's book)</li>
        <li>Danh từ số nhiều: s' (students' books)</li>
        <li>Danh từ bất quy tắc: 's (children's toys)</li>
      </ul>
      
      <h4>🌿 Nhánh 6: Vị trí trong câu</h4>
      <ul>
        <li>Chủ ngữ (Subject)</li>
        <li>Tân ngữ (Object)</li>
        <li>Bổ ngữ (Complement)</li>
      </ul>
      
      <p>Bản đồ tư duy này sẽ giúp bạn nắm vững tất cả các khía cạnh của danh từ trong tiếng Anh!</p>
    `,
        courseName: "Khóa học Tiếng Anh Cơ Bản",
        sectionName: "Mind map 1"
    }
};

export default function LessonDetailPage() {
    const locale = useLocale();
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;
    const lessonId = params.lessonId as string;

    const [lesson, setLesson] = useState<typeof mockLessons[string] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const fetchLesson = async () => {
            setIsLoading(true);
            try {
                // Mock API call delay
                await new Promise(resolve => setTimeout(resolve, 800));

                const lessonData = mockLessons[lessonId];
                if (lessonData) {
                    setLesson(lessonData);
                    // Mock: check if lesson is completed
                    setIsCompleted([1, 3, 7, 8].includes(parseInt(lessonId)));
                }
            } catch (error) {
                console.error("Error fetching lesson:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLesson();
    }, [lessonId]);

    const handleMarkComplete = () => {
        setIsCompleted(!isCompleted);
        // Here you would typically make an API call to update completion status
    };

    const handleGoBack = () => {
        router.push(`/${locale}/student/my-course/${courseId}`);
    };

    const breadcrumbs = [
        { label: "Home", href: `/${locale}/student` },
        { label: "Classes", href: `/${locale}/student/my-course` },
        { label: lesson?.courseName || "Course", href: `/${locale}/student/my-course/${courseId}` },
        { label: lesson?.title || "Lesson", href: `/${locale}/student/my-course/${courseId}/lesson/${lessonId}` },
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col mt-4 min-h-screen bg-gray-50">
                <div className="bg-white p-4 shadow-sm">
                    <Breadcrumb items={breadcrumbs} />
                </div>
                <div className="flex justify-center items-center h-64">
                    <OrbitProgress
                        color="#3B82F6"
                        size="medium"
                        text="Loading lesson..."
                        textColor="#3B82F6"
                    />
                </div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="flex flex-col mt-4 min-h-screen bg-gray-50">
                <div className="bg-white p-4 shadow-sm">
                    <Breadcrumb items={breadcrumbs} />
                </div>
                <div className="p-6">
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Không tìm thấy bài học
                        </h3>
                        <p className="text-gray-500">
                            Bài học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                        </p>
                        <button
                            onClick={handleGoBack}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Quay lại khóa học
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col mt-4 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm">
                <Breadcrumb items={breadcrumbs} />
            </div>

            <div className="p-6">
                {/* Lesson Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <button
                            onClick={handleGoBack}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors mb-4"
                        >
                            <FaArrowLeft />
                            <span>Quay lại khóa học</span>
                        </button>
                    </div>

                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                                <FaPlay className="text-red-500 text-xl" />
                                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                    {lesson.level}
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{lesson.title}</h1>
                            <p className="text-gray-600 mb-4">{lesson.description}</p>

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center space-x-1">
                                    <FaBook />
                                    <span>{lesson.sectionName}</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end space-y-3">
                            <button
                                onClick={handleMarkComplete}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${isCompleted
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    }`}
                            >
                                <FaCheckCircle />
                                <span>{isCompleted ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Video Section */}
                {lesson.videoUrl && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                            <FaPlay className="text-red-500" />
                            <span>Video bài học</span>
                        </h2>
                        <div className="aspect-video rounded-lg overflow-hidden">
                            <iframe
                                src={lesson.videoUrl}
                                title={lesson.title}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}

                {/* Content Section */}
                {lesson.content && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                            <FaBook className="text-blue-500" />
                            <span>Nội dung bài học</span>
                        </h2>
                        <div
                            className="prose prose-lg max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: lesson.content }}
                        />
                    </div>
                )}

                {/* Images Section */}
                {lesson.imageUrls && lesson.imageUrls.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                            <FaFileImage className="text-green-500" />
                            <span>Hình ảnh minh họa</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {lesson.imageUrls.map((imageUrl, index) => (
                                <div key={index} className="aspect-video rounded-lg overflow-hidden shadow-md">
                                    <img
                                        src={imageUrl}
                                        alt={`${lesson.title} - Image ${index + 1}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}