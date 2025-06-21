// src/lib/mockData.ts
import type { Course } from "@/lib/types/course";
import type { Lesson } from "@/lib/types/lesson";

// export const mockCourses: Course[] = [
//   {
//     id: "1",
//     name: "General English – Beginner",
//     scope: "Beginner",
//     description: "Khóa học tiếng Anh cơ bản dành cho người mới bắt đầu, tập trung vào phát âm, từ vựng và ngữ pháp cơ bản.",
//     begin: "2025-07-01",
//     end: "2025-08-15",
//     teacher: "Nguyễn Thị A",
//     lessons: [
//       {
//         id: 101,
//         title: "Alphabet & Pronunciation",
//         level: "Beginner",
//         description: "Giới thiệu bảng chữ cái tiếng Anh và cách phát âm chuẩn.",
//         topic: null
//       },
//       {
//         id: 102,
//         title: "Basic Greetings",
//         level: "Beginner",
//         description: "Cách chào hỏi, giới thiệu bản thân và các mẫu câu cơ bản.",
//         topic: null
//       },
//       {
//         id: 103,
//         title: "Numbers & Dates",
//         level: "Beginner",
//         description: "Học số đếm, cách đọc ngày tháng và thời gian đơn giản.",
//         topic: null
//       }
//     ]
//   },
//   {
//     id: "2",
//     name: "General English – Intermediate",
//     scope: "Intermediate",
//     description: "Nâng cao kỹ năng giao tiếp hàng ngày với ngữ pháp và từ vựng trung cấp.",
//     begin: "2025-07-15",
//     end: "2025-09-01",
//     teacher: "Trần Văn B",
//     lessons: [
//       {
//         id: 201,
//         title: "Daily Conversations",
//         level: "Intermediate",
//         description: "Các mẫu hội thoại thông dụng trong cuộc sống hàng ngày.",
//         topic: null
//       },
//       {
//         id: 202,
//         title: "Intermediate Grammar",
//         level: "Intermediate",
//         description: "Học cách dùng thì hiện tại hoàn thành, tương lai và mệnh đề quan hệ.",
//         topic: null
//       },
//       {
//         id: 203,
//         title: "Reading Comprehension",
//         level: "Intermediate",
//         description: "Luyện đọc hiểu văn bản ngắn, đoạn hội thoại và bài báo đơn giản.",
//         topic: null
//       }
//     ]
//   },
//   {
//     id: "3",
//     name: "Business English",
//     scope: "Advanced",
//     description: "Tiếng Anh thương mại nâng cao: email, đàm phán, thuyết trình và từ vựng chuyên ngành.",
//     begin: "2025-08-01",
//     end: "2025-09-15",
//     teacher: "Lê Thị C",
//     lessons: [
//       {
//         id: 301,
//         title: "Writing Professional Emails",
//         level: "Advanced",
//         description: "Cấu trúc và cách viết email công việc đúng chuẩn.",
//         topic: null
//       },
//       {
//         id: 302,
//         title: "Negotiation Skills",
//         level: "Advanced",
//         description: "Từ vựng và chiến thuật đàm phán trong môi trường doanh nghiệp.",
//         topic: null
//       },
//       {
//         id: 303,
//         title: "Presentation Techniques",
//         level: "Advanced",
//         description: "Phương pháp chuẩn bị và thuyết trình hiệu quả trước đám đông.",
//         topic: null
//       }
//     ]
//   },
//   {
//     id: "4",
//     name: "IELTS Preparation",
//     scope: "Exam Prep",
//     description: "Luyện thi IELTS: 4 kỹ năng Nghe – Nói – Đọc – Viết, kèm chiến thuật làm bài.",
//     begin: "2025-07-20",
//     end: "2025-09-30",
//     teacher: "Phạm Văn D",
//     lessons: [
//       {
//         id: 401,
//         title: "Listening Strategies",
//         level: "Exam Prep",
//         description: "Các mẹo và chiến thuật nghe trong đề IELTS.",
//         topic: null
//       },
//       {
//         id: 402,
//         title: "Speaking Practice",
//         level: "Exam Prep",
//         description: "Luyện tập trả lời các dạng câu hỏi trong phần Speaking.",
//         topic: null
//       },
//       {
//         id: 403,
//         title: "Reading Techniques",
//         level: "Exam Prep",
//         description: "Cách xử lý passage dài, từ vựng học thuật và skimming/scanning.",
//         topic: null
//       },
//       {
//         id: 404,
//         title: "Writing Task 1 & 2",
//         level: "Exam Prep",
//         description: "Cấu trúc bài viết biểu đồ và bài luận học thuật.",
//         topic: null
//       }
//     ]
//   }
// ];


const mockCourses = [
  {
    id: "1",
    name: "TOEIC Từ Vựng Cơ Bản",
    scope: "Nền tảng TOEIC",
    description: "Khóa học từ vựng cơ bản cho người mới bắt đầu",
    lessons: Array(24).fill({}),
    teacher: "Cô Mai",
    begin: new Date("2024-01-15"),
    end: new Date("2024-06-15"),
    completedLessons: 21,
    totalLessons: 48,
    category: "Nền tảng TOEIC",
    status: "Đã học",
    image: "https://via.placeholder.com/80x80/1e40af/ffffff?text=TC"
  },
  {
    id: "2",
    name: "TOEIC Ngữ Pháp Cơ Bản",
    scope: "Nền tảng TOEIC",
    description: "Khóa học ngữ pháp cơ bản cho TOEIC",
    lessons: Array(34).fill({}),
    teacher: "Thầy Nam",
    begin: new Date("2024-02-01"),
    end: new Date("2024-07-01"),
    completedLessons: 49,
    totalLessons: 34,
    category: "Nền tảng TOEIC",
    status: "Đã hoàn thành",
    image: "https://via.placeholder.com/80x80/1e40af/ffffff?text=GP"
  },
  {
    id: "3",
    name: "TOEIC Listening & Reading",
    scope: "TOEIC Trung cấp",
    description: "Khóa học luyện thi TOEIC trung cấp",
    lessons: Array(45).fill({}),
    teacher: "Cô Linh",
    begin: new Date("2024-03-01"),
    end: new Date("2024-08-01"),
    completedLessons: 2,
    totalLessons: 168,
    category: "TOEIC Trung cấp",
    status: "Đang học",
    image: "https://via.placeholder.com/80x80/1e40af/ffffff?text=LR"
  },
  {
    id: "4",
    name: "Từ Vựng Chuyên Ngành",
    scope: "TOEIC Trung cấp",
    description: "Từ vựng chuyên ngành cho TOEIC cao cấp",
    lessons: Array(60).fill({}),
    teacher: "Thầy Đức",
    begin: new Date("2024-04-01"),
    end: new Date("2024-09-01"),
    completedLessons: 0,
    totalLessons: 120,
    category: "TOEIC Trung cấp",
    status: "Chưa bắt đầu",
    image: "https://via.placeholder.com/80x80/1e40af/ffffff?text=TV"
  }
];