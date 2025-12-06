// Mock data for Documents page

export interface Document {
  id: number;
  title: string;
  description?: string;
  type: "PDF" | "DOC" | "PPT" | "VIDEO" | "LINK" | "ZIP";
  category: "LECTURE" | "ASSIGNMENT" | "REFERENCE" | "SOLUTION" | "OTHER";
  course?: string;
  uploadedBy: {
    id: string;
    name: string;
    role: "INSTRUCTOR" | "TA" | "STUDENT";
  };
  fileSize?: string;
  downloadCount: number;
  uploadedAt: string;
  url?: string;
  thumbnail?: string;
}

export interface DocumentFolder {
  id: number;
  name: string;
  description?: string;
  course?: string;
  documentCount: number;
  updatedAt: string;
  icon: string;
  color: string;
}

export const mockDocuments: Document[] = [
  {
    id: 1,
    title: "Lecture 1 - Introduction to Data Structures",
    description: "Overview of fundamental data structures and their applications",
    type: "PDF",
    category: "LECTURE",
    course: "CS201",
    uploadedBy: {
      id: "i1",
      name: "Dr. John Smith",
      role: "INSTRUCTOR",
    },
    fileSize: "2.4 MB",
    downloadCount: 145,
    uploadedAt: "2024-09-01T10:00:00Z",
  },
  {
    id: 2,
    title: "Assignment 1 - Array Operations",
    description: "Implement basic array operations including insertion, deletion, and searching",
    type: "PDF",
    category: "ASSIGNMENT",
    course: "CS201",
    uploadedBy: {
      id: "i1",
      name: "Dr. John Smith",
      role: "INSTRUCTOR",
    },
    fileSize: "156 KB",
    downloadCount: 132,
    uploadedAt: "2024-09-05T14:30:00Z",
  },
  {
    id: 3,
    title: "Binary Search Tree Tutorial",
    description: "Comprehensive guide to BST implementation and operations",
    type: "VIDEO",
    category: "REFERENCE",
    course: "CS201",
    uploadedBy: {
      id: "ta1",
      name: "Michael Chen",
      role: "TA",
    },
    fileSize: "45 MB",
    downloadCount: 98,
    uploadedAt: "2024-09-20T16:00:00Z",
    url: "https://example.com/videos/bst-tutorial",
  },
  {
    id: 4,
    title: "Database Normalization Slides",
    description: "PowerPoint presentation on 1NF, 2NF, 3NF, and BCNF",
    type: "PPT",
    category: "LECTURE",
    course: "CS301",
    uploadedBy: {
      id: "i2",
      name: "Prof. Sarah Johnson",
      role: "INSTRUCTOR",
    },
    fileSize: "3.8 MB",
    downloadCount: 167,
    uploadedAt: "2024-10-01T09:00:00Z",
  },
  {
    id: 5,
    title: "SQL Practice Problems",
    description: "50+ SQL queries for practice with solutions",
    type: "DOC",
    category: "REFERENCE",
    course: "CS301",
    uploadedBy: {
      id: "i2",
      name: "Prof. Sarah Johnson",
      role: "INSTRUCTOR",
    },
    fileSize: "890 KB",
    downloadCount: 203,
    uploadedAt: "2024-10-10T11:30:00Z",
  },
  {
    id: 6,
    title: "Midterm Exam Solutions",
    description: "Detailed solutions for midterm exam questions",
    type: "PDF",
    category: "SOLUTION",
    course: "CS201",
    uploadedBy: {
      id: "ta1",
      name: "Michael Chen",
      role: "TA",
    },
    fileSize: "1.2 MB",
    downloadCount: 178,
    uploadedAt: "2024-11-05T15:00:00Z",
  },
  {
    id: 7,
    title: "React Hooks Cheat Sheet",
    description: "Quick reference for useState, useEffect, and custom hooks",
    type: "PDF",
    category: "REFERENCE",
    course: "CS202",
    uploadedBy: {
      id: "u1",
      name: "Student Contributor",
      role: "STUDENT",
    },
    fileSize: "245 KB",
    downloadCount: 89,
    uploadedAt: "2024-11-15T13:20:00Z",
  },
  {
    id: 8,
    title: "Project Source Code - E-commerce App",
    description: "Complete source code for final project demo",
    type: "ZIP",
    category: "OTHER",
    course: "CS202",
    uploadedBy: {
      id: "i3",
      name: "Dr. Michael Chen",
      role: "INSTRUCTOR",
    },
    fileSize: "12.5 MB",
    downloadCount: 67,
    uploadedAt: "2024-11-20T10:00:00Z",
  },
];

export const mockDocumentFolders: DocumentFolder[] = [
  {
    id: 1,
    name: "Lectures",
    description: "All lecture slides and notes",
    course: "CS201",
    documentCount: 24,
    updatedAt: "2024-12-01T10:00:00Z",
    icon: "Presentation",
    color: "blue",
  },
  {
    id: 2,
    name: "Assignments",
    description: "Homework and project assignments",
    course: "CS201",
    documentCount: 12,
    updatedAt: "2024-11-28T14:30:00Z",
    icon: "FileText",
    color: "green",
  },
  {
    id: 3,
    name: "Reference Materials",
    description: "Additional reading and resources",
    course: "CS201",
    documentCount: 18,
    updatedAt: "2024-11-25T09:15:00Z",
    icon: "BookOpen",
    color: "purple",
  },
  {
    id: 4,
    name: "Exam Solutions",
    description: "Past exam papers with solutions",
    course: "CS201",
    documentCount: 8,
    updatedAt: "2024-11-20T16:00:00Z",
    icon: "CheckSquare",
    color: "orange",
  },
  {
    id: 5,
    name: "Video Tutorials",
    description: "Recorded lectures and tutorials",
    documentCount: 15,
    updatedAt: "2024-12-03T11:00:00Z",
    icon: "Video",
    color: "red",
  },
];

export interface RecentDocument {
  id: number;
  title: string;
  type: string;
  viewedAt: string;
}

export const mockRecentDocuments: RecentDocument[] = [
  {
    id: 1,
    title: "Lecture 1 - Introduction to Data Structures",
    type: "PDF",
    viewedAt: "2024-12-06T09:30:00Z",
  },
  {
    id: 4,
    title: "Database Normalization Slides",
    type: "PPT",
    viewedAt: "2024-12-05T14:15:00Z",
  },
  {
    id: 6,
    title: "Midterm Exam Solutions",
    type: "PDF",
    viewedAt: "2024-12-04T16:20:00Z",
  },
];
