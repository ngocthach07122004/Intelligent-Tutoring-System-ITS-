// Mock data for Courses page

export interface Course {
  id: number;
  code: string;
  title: string;
  instructor: string;
  schedule: string;
  credits: number;
  progress: number;
  status: "IN_PROGRESS" | "COMPLETED" | "NOT_STARTED";
  thumbnail?: string;
  description?: string;
  enrolledStudents?: number;
  totalLessons?: number;
  completedLessons?: number;
}

export const mockCourses: Course[] = [
  {
    id: 1,
    code: "CS201",
    title: "Data Structures & Algorithms",
    instructor: "Dr. John Smith",
    schedule: "Mon, Wed 9:00-10:30",
    credits: 4,
    progress: 75,
    status: "IN_PROGRESS",
    description: "Advanced study of data structures and algorithms",
    enrolledStudents: 45,
    totalLessons: 24,
    completedLessons: 18,
  },
  {
    id: 2,
    code: "CS301",
    title: "Database Systems",
    instructor: "Prof. Sarah Johnson",
    schedule: "Tue, Thu 14:00-15:30",
    credits: 3,
    progress: 60,
    status: "IN_PROGRESS",
    description: "Introduction to relational and NoSQL databases",
    enrolledStudents: 38,
    totalLessons: 20,
    completedLessons: 12,
  },
  {
    id: 3,
    code: "CS202",
    title: "Web Development",
    instructor: "Dr. Michael Chen",
    schedule: "Mon, Wed 14:00-15:30",
    credits: 3,
    progress: 100,
    status: "COMPLETED",
    description: "Full-stack web development with React and Node.js",
    enrolledStudents: 52,
    totalLessons: 18,
    completedLessons: 18,
  },
  {
    id: 4,
    code: "CS401",
    title: "Machine Learning",
    instructor: "Dr. Emily Wang",
    schedule: "Tue, Thu 10:00-11:30",
    credits: 4,
    progress: 45,
    status: "IN_PROGRESS",
    description: "Introduction to machine learning algorithms and applications",
    enrolledStudents: 30,
    totalLessons: 22,
    completedLessons: 10,
  },
  {
    id: 5,
    code: "CS302",
    title: "Software Engineering",
    instructor: "Prof. David Brown",
    schedule: "Wed, Fri 13:00-14:30",
    credits: 3,
    progress: 0,
    status: "NOT_STARTED",
    description: "Software development lifecycle and best practices",
    enrolledStudents: 42,
    totalLessons: 16,
    completedLessons: 0,
  },
];

export interface CourseDetail extends Course {
  syllabus: {
    week: number;
    topic: string;
    completed: boolean;
  }[];
  assignments: {
    id: number;
    title: string;
    dueDate: string;
    status: "PENDING" | "SUBMITTED" | "GRADED";
    grade?: number;
  }[];
  announcements: {
    id: number;
    title: string;
    content: string;
    date: string;
  }[];
}

export const mockCourseDetail: CourseDetail = {
  ...mockCourses[0],
  syllabus: [
    { week: 1, topic: "Introduction to Data Structures", completed: true },
    { week: 2, topic: "Arrays and Linked Lists", completed: true },
    { week: 3, topic: "Stacks and Queues", completed: true },
    { week: 4, topic: "Trees and Binary Search Trees", completed: true },
    { week: 5, topic: "Graph Algorithms", completed: false },
    { week: 6, topic: "Sorting Algorithms", completed: false },
  ],
  assignments: [
    {
      id: 1,
      title: "Assignment 1 - Array Operations",
      dueDate: "2024-09-15T23:59:00Z",
      status: "GRADED",
      grade: 95,
    },
    {
      id: 2,
      title: "Assignment 2 - Linked List Implementation",
      dueDate: "2024-09-30T23:59:00Z",
      status: "GRADED",
      grade: 88,
    },
    {
      id: 3,
      title: "Assignment 3 - Tree Traversal",
      dueDate: "2024-12-15T23:59:00Z",
      status: "PENDING",
    },
  ],
  announcements: [
    {
      id: 1,
      title: "Midterm Exam Schedule",
      content: "The midterm exam will be held on November 20th at 9:00 AM",
      date: "2024-11-01T10:00:00Z",
    },
    {
      id: 2,
      title: "Office Hours Update",
      content: "Office hours moved to Thursday 2-4 PM",
      date: "2024-10-15T14:00:00Z",
    },
  ],
};
