"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Award,
  Users,
  Calendar,
  CheckCircle2,
  PlayCircle,
  FileText,
  Download,
} from "lucide-react";
import { courseServiceApi } from "@/lib/BE-library/course-service-api";
import {
  ChapterResponse,
  CourseResponse,
  EnrollmentResponse,
  LessonResponse,
  LessonType,
} from "@/lib/BE-library/course-service-interfaces";
// fallback chapters
const fallbackChapters: ChapterResponse[] = [
  {
    id: 1,
    title: "Chương 1: Giới thiệu",
    lessons: [
      {
        id: 1,
        title: "Làm quen khoá học",
        type: "VIDEO",
        content: "https://www.youtube.com/watch?v=Mkif3AqLBCQ",
        isCompleted: false,
      },
      {
        id: 2,
        title: "Tài liệu hướng dẫn",
        type: "TEXT",
        isCompleted: false,
      },
    ],
  },
  {
    id: 2,
    title: "Chương 2: Nội dung chính",
    lessons: [
      {
        id: 3,
        title: "Bài học nền tảng",
        type: "QUIZ",
        isCompleted: false,
      },
    ],
  },
];

interface CourseDetailModalProps {
  course: EnrollmentResponse;
  onClose: () => void;
}

const lessonTypeIcon = (type?: LessonType) => {
  switch (type) {
    case "VIDEO":
      return <PlayCircle className="w-4 h-4" />;
    case "TEXT":
      return <FileText className="w-4 h-4" />;
    case "QUIZ":
      return <CheckCircle2 className="w-4 h-4" />;
    default:
      return <Download className="w-4 h-4" />;
  }
};

const formatDuration = (minutes?: number) => {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes} phut`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours}g ${mins}p` : `${hours}g`;
};

const LessonVideoView = ({ lesson, onClose }: { lesson: LessonResponse; onClose: () => void }) => {
  const [embedError, setEmbedError] = useState(false);

  const extractYoutubeId = (input?: string): string | null => {
    if (!input) return null;
    const s = input.trim();

    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;

    const patterns = [
      /(?:v=)([A-Za-z0-9_-]{11})/,            
      /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,    
      /(?:embed\/)([A-Za-z0-9_-]{11})/,       
      /([A-Za-z0-9_-]{11})/                  
    ];

    for (const p of patterns) {
      const m = s.match(p);
      if (m && m[1]) return m[1];
    }
    return null;
  };

  const rawUrl = lesson.content;
  const videoId = extractYoutubeId(rawUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold text-lg">{lesson.title}</h2>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-gray-600 hover:text-black">✕</button>
          </div>
        </div>

        {embedUrl && !embedError ? (
          <div className="aspect-video w-full bg-black">
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onError={() => {
                console.warn("Iframe error for", embedUrl);
                setEmbedError(true);
              }}
            />
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-4 text-gray-700">
              Không thể nhúng video — có thể link không hợp lệ hoặc video không cho phép nhúng.
            </div>
            <div className="flex gap-3">
              <a href={rawUrl || "#"} target="_blank" rel="noreferrer" className="px-4 py-2 bg-gray-900 text-white rounded-md">
                Mở video trên YouTube
              </a>
              <button onClick={() => setEmbedError(false)} className="px-4 py-2 border rounded-md">
                Thử lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CourseDetailModal = ({ course, onClose }: CourseDetailModalProps) => {
  const [selectedLesson, setSelectedLesson] = useState<LessonResponse | null>(null);
  const [detail, setDetail] = useState<CourseResponse | null>(null);
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const courseId = course.courseId ?? course.id;

  useEffect(() => {
    let cancelled = false;
    const loadDetail = async () => {
      if (!courseId) {
        setError("Khong tim thay courseId");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const [detailRes, chaptersRes] = await Promise.all([
          courseServiceApi.getCourse(courseId),
          courseServiceApi.getCourseChapters(courseId),
        ]);

        if (cancelled) return;

        if (detailRes.success) {
          setDetail(detailRes.data as CourseResponse);
        } else {
          setError(detailRes.message || "Khong the tai chi tiet khoa hoc");
        }

        if (chaptersRes.success && Array.isArray(chaptersRes.data)) {
          setChapters(chaptersRes.data as ChapterResponse[]);
        }
        else {
          setChapters(fallbackChapters);
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message || "Da xay ra loi khi tai chi tiet");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDetail();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const title = detail?.title ?? course.courseTitle ?? "Khoa hoc";
  const code = detail?.code ?? course.courseCode ?? "";
  const semester = detail?.semester ?? course.courseSemester ?? "";
  const credits = detail?.credits ?? course.courseCredits ?? 0;
  const schedule = detail?.schedule ?? course.courseSchedule ?? "";
  const maxStudents = detail?.maxStudents ?? course.courseMaxStudents;
  const description = detail?.description ?? "Chua co mo ta";
  const instructorName =
    detail?.instructorName ?? detail?.instructor?.fullName ?? course.instructorName ?? "Giang vien";
  const progress = course.progress ?? detail?.progress ?? 0;

  const objectives = useMemo(() => {
    const raw = detail?.objectives ?? "";
    return raw
      .split(/\r?\n|;|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }, [detail]);

  const totalLessons = useMemo(
    () => chapters.reduce((sum, ch) => sum + (ch.lessons?.length ?? 0), 0),
    [chapters],
  );
  const completedLessons = useMemo(
    () => chapters.reduce((sum, ch) => sum + (ch.lessons?.filter((l) => l.isCompleted)?.length ?? 0), 0),
    [chapters],
  );

  const lessonTypeLabel = (lesson: LessonResponse) => {
    switch (lesson.type) {
      case "VIDEO":
        return "Video";
      case "TEXT":
        return "Tai lieu";
      case "QUIZ":
        return "Quiz";
      default:
        return "Noi dung";
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lai
        </button>

        <div className="bg-gray-900 text-white rounded-2xl p-8 mb-6">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              {code && <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold">{code}</span>}
              {semester && (
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold">{semester}</span>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-lg text-white/90 mb-6">{description}</p>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{maxStudents ? `${maxStudents} sinh vien` : "Khoa hoc"}</span>
              </div>
              {schedule && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{schedule}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>{credits} tin chi</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow">
            Dang tai chi tiet khoa hoc...
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Muc tieu khoa hoc</h2>
                {objectives.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-3">
                    {objectives.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Chua co noi dung muc tieu.</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Noi dung khoa hoc</h2>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{chapters.length}</span> chuong -
                    <span className="font-semibold ml-1">{totalLessons}</span> bai hoc -
                    <span className="font-semibold ml-1">{completedLessons}/{totalLessons}</span> hoan thanh
                  </div>
                </div>

                <div className="space-y-3">
                  {chapters.length === 0 && (
                    <div className="rounded-lg border border-dashed border-gray-300 p-4 text-gray-600 bg-white">
                      Chua co danh sach chuong/lesson.
                    </div>
                  )}
                  {chapters.map((module) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-100 p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-800">{module.title}</h3>
                          {module.sequence && (
                            <span className="text-sm text-gray-600">Thu tu #{module.sequence}</span>
                          )}
                        </div>
                        {module.description && (
                          <div className="mt-2 text-sm text-gray-600">{module.description}</div>
                        )}
                      </div>

                      <div className="divide-y divide-gray-100">
                        {(module.lessons ?? []).map((lesson) => (
                          <div
                            key={lesson.id}
                            onClick={() => {
                              if (lesson.type === "VIDEO") setSelectedLesson(lesson);
                            }}
                            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors 
                              ${lesson.isCompleted ? 'bg-green-50/60' : ''}"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div
                                className={`p-2 rounded-lg ${lesson.isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                                  }`}
                              >
                                {lessonTypeIcon(lesson.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={`font-medium ${lesson.isCompleted ? "text-gray-700" : "text-gray-800"}`}>
                                    {lesson.title}
                                  </span>
                                  {lesson.isCompleted && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                </div>
                                <div className="text-sm text-gray-500 capitalize">
                                  {lessonTypeLabel(lesson)}
                                  {lesson.estimatedDuration && ` - ${formatDuration(lesson.estimatedDuration)}`}
                                </div>
                              </div>
                            </div>
                            <span className="text-sm text-gray-600">#{lesson.sequence ?? ""}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedLesson?.content && (
                <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    {selectedLesson.title}
                  </h2>

                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedLesson.content.split("v=")[1]}`}
                      className="w-full h-full"
                      title="YouTube video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Yeu cau / Prerequisites</h2>
                {detail?.prerequisites?.length ? (
                  <ul className="space-y-2">
                    {detail.prerequisites.map((req) => (
                      <li key={req.id} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                        <span className="text-gray-700">
                          {req.requiredCourseTitle || req.description || "Chua co thong tin"}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Khong co yeu cau truoc.</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4">Tien do hoc tap</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Hoan thanh</span>
                        <span className="font-bold text-gray-900">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gray-800 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bai hoc hoan thanh</span>
                        <span className="font-semibold">{completedLessons}/{totalLessons}</span>
                      </div>
                      {detail?.startDate && detail?.endDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Thoi gian</span>
                          <span className="font-semibold">
                            {new Date(detail.startDate).toLocaleDateString()} - {new Date(detail.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4">Giang vien</h3>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {(instructorName || " ").charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{instructorName}</div>
                      <div className="text-sm text-gray-600">Giang vien phu trach</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    {schedule && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{schedule}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>{credits} tin chi</span>
                    </div>
                    {semester && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{semester}</span>
                      </div>
                    )}
                  </div>
                </div>
                {selectedLesson && (
                  <LessonVideoView
                    lesson={selectedLesson}
                    onClose={() => setSelectedLesson(null)}
                  />
                )}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4">Thong tin khac</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-600" />
                      <span>Ma khoa hoc: {code || "Dang cap nhat"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span>Si so toi da: {maxStudents || "Chua ro"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


