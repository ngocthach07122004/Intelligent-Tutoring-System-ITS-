// Course Service Interfaces (Java course-service on port 8084)

export type CourseVisibility = "PUBLIC" | "PRIVATE";
export type LessonType = "VIDEO" | "TEXT" | "QUIZ";
export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "DROPPED";
export type PrerequisiteType = "HARD" | "SOFT";
export type TagType = "TOPIC" | "SKILL" | "DIFFICULTY";

export interface HealthStatus {
    status?: string;
    service?: string;
    timestamp?: string;
}

export interface PaginationQuery {
    page?: number;
    size?: number;
    sort?: string;
}

export interface CourseListQuery extends PaginationQuery {
    semester?: string;
    enrollmentStatus?: EnrollmentStatus | string;
}

export interface PublishedCourseQuery extends PaginationQuery {
    semester?: string;
}

export interface CourseSearchQuery extends PaginationQuery {
    keyword: string;
}

export interface EnrollmentListQuery {
    status?: EnrollmentStatus | string;
}

export interface MyEnrollmentQuery {
    status?: EnrollmentStatus | string;
    q?: string;
}

export interface ReorderChaptersRequest {
    chapterIds: number[];
}

export interface CreateChapterRequest {
    title: string;
    description?: string;
}

export interface CreateCourseRequest {
    title: string;
    visibility: CourseVisibility;
    description?: string;
    code?: string;
    credits?: number;
    semester?: string;
    schedule?: string;
    maxStudents?: number;
    startDate?: string;
    endDate?: string;
    thumbnailUrl?: string;
    objectives?: string;
    tagIds?: number[];
    prerequisiteCourseIds?: number[];
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> { }

export interface CreateLessonRequest {
    title: string;
    description?: string;
    type: LessonType;
    masteryThreshold?: number;
    content?: string;
    estimatedDuration?: number;
}

export interface EnrollmentProgressRequest {
    progress: number;
}

export interface CourseProgressResponse {
    courseId?: number;
    progressPercent?: number;
}

export interface InstructorSummaryResponse {
    id?: string;
    fullName?: string;
    avatarUrl?: string;
}

export interface TagResponse {
    id?: number;
    name?: string;
    type?: TagType;
    description?: string;
}

export interface PrerequisiteResponse {
    id?: number;
    requiredCourseId?: number;
    requiredCourseTitle?: string;
    type?: PrerequisiteType;
    description?: string;
}

export interface LessonResponse {
    id?: number;
    title?: string;
    description?: string;
    type?: LessonType;
    sequence?: number;
    masteryThreshold?: number;
    content?: string;
    estimatedDuration?: number;
    isCompleted?: boolean;
    nextLessonId?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ChapterResponse {
    id?: number;
    title?: string;
    description?: string;
    sequence?: number;
    lessons?: LessonResponse[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CourseResponse {
    id?: number;
    title?: string;
    description?: string;
    status?: CourseStatus;
    visibility?: CourseVisibility;
    instructorId?: string;
    instructorName?: string;
    instructorAvatarUrl?: string;
    thumbnailUrl?: string;
    objectives?: string;
    code?: string;
    credits?: number;
    semester?: string;
    schedule?: string;
    maxStudents?: number;
    startDate?: string;
    endDate?: string;
    currentStudents?: number;
    enrolled?: boolean;
    progress?: number;
    instructor?: InstructorSummaryResponse;
    tags?: TagResponse[];
    prerequisites?: PrerequisiteResponse[];
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    syllabus?: Record<string, unknown>[];
    assignments?: Record<string, unknown>[];
    resources?: Record<string, unknown>[];
}

export interface CourseStatistics {
    totalCourses?: number;
    activeCourses?: number;
    totalCredits?: number;
    averageProgress?: number;
}

export interface CourseStatsResponse {
    courseId?: number;
    totalEnrollments?: number;
    activeEnrollments?: number;
    completedEnrollments?: number;
    averageProgress?: number;
}

export interface EnrollmentResponse {
    id?: number;
    courseId?: number;
    courseTitle?: string;
    courseCode?: string;
    courseSemester?: string;
    courseSchedule?: string;
    courseCredits?: number;
    courseMaxStudents?: number;
    courseThumbnailUrl?: string;
    instructorName?: string;
    instructorAvatarUrl?: string;
    studentId?: string;
    status?: EnrollmentStatus;
    progress?: number;
    enrolledAt?: string;
    completedAt?: string;
    lastAccessAt?: string;
    updatedAt?: string;
}

export interface EnrollmentStatusResponse {
    enrolled: boolean;
}
