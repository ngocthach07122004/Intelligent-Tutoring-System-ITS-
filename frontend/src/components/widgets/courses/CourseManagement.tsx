"use client";

import { useEffect, useMemo, useState } from "react";
import { CustomButton } from "@/components/ui/CustomButton";
import { CourseDetailModal } from "./CourseDetailModal";
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Search,
  CheckCircle2,
  Calendar,
  Users,
  BarChart3,
} from "lucide-react";
import { courseServiceApi } from "@/lib/BE-library/course-service-api";
import { EnrollmentResponse } from "@/lib/BE-library/course-service-interfaces";

export const CourseManagement = () => {
  const [courses, setCourses] = useState<EnrollmentResponse[]>([]);
  const [filter, setFilter] = useState<"all" | "ACTIVE" | "COMPLETED" | "DROPPED">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<EnrollmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fallbackCourses: EnrollmentResponse[] = [
    {
      id: 1,
      courseId: 101,
      courseTitle: "Nhap mon Lap trinh",
      courseCode: "IT101",
      courseSemester: "HK1 - 2024",
      courseSchedule: "Thu 2 - 7h den 9h",
      courseCredits: 3,
      courseMaxStudents: 50,
      courseThumbnailUrl: "/course-default.jpg",
      instructorName: "Nguyen Van A",
      instructorAvatarUrl: "/teacher-default.jpg",
      studentId: "2024001234",
      status: "ACTIVE",
      progress: 60,
      enrolledAt: "2024-01-20T10:00:00Z",
      lastAccessAt: "2024-02-01T09:15:00Z",
      updatedAt: "2024-02-01T09:15:00Z",
    },
    {
      id: 2,
      courseId: 102,
      courseTitle: "Co so du lieu",
      courseCode: "DB102",
      courseSemester: "HK1 - 2024",
      courseSchedule: "Thu 4 - 9h den 11h",
      courseCredits: 3,
      courseMaxStudents: 45,
      courseThumbnailUrl: "/course-default.jpg",
      instructorName: "Tran Thi B",
      instructorAvatarUrl: "/teacher-default.jpg",
      studentId: "2024001234",
      status: "COMPLETED",
      progress: 100,
      enrolledAt: "2023-09-10T10:00:00Z",
      completedAt: "2023-12-20T10:00:00Z",
      lastAccessAt: "2023-12-20T09:00:00Z",
      updatedAt: "2024-01-01T10:00:00Z",
    },
  ];

  useEffect(() => {
    let cancelled = false;
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const params = filter === "all" ? undefined : { status: filter };
        const response = await courseServiceApi.getMyEnrollments(params);

        if (!cancelled) {
          if (response.success && Array.isArray(response.data)) {
            setCourses(response.data);
          } else {
            setCourses(fallbackCourses);
            setError(response.message || "Khong the tai danh sach khoa hoc");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setCourses(fallbackCourses);
          setError((err as Error).message || "Da xay ra loi ket noi");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCourses();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DROPPED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return "Dang hoc";
      case "COMPLETED":
        return "Hoan thanh";
      case "DROPPED":
        return "Da huy";
      default:
        return "";
    }
  };

  const filteredCourses = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return courses.filter((course) => {
      const matchesFilter = filter === "all" || course.status === filter;
      const title = course.courseTitle?.toLowerCase() || "";
      const code = course.courseCode?.toLowerCase() || "";
      const instructor = course.instructorName?.toLowerCase() || "";
      const matchesSearch = title.includes(search) || code.includes(search) || instructor.includes(search);
      return matchesFilter && matchesSearch;
    });
  }, [courses, filter, searchTerm]);

  const averageProgress = courses.length === 0
    ? 0
    : Math.round(courses.reduce((sum, c) => sum + (c.progress ?? 0), 0) / courses.length);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quan ly khoa hoc</h1>
          <p className="text-gray-600">Quan ly cac khoa hoc da dang ky va theo doi tien do hoc tap</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Tong khoa hoc</p>
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">Dang hoc</p>
                <p className="text-3xl font-bold text-gray-900">{courses.filter((c) => c.status === "ACTIVE").length}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">Tong tin chi</p>
                <p className="text-3xl font-bold text-gray-900">{courses.reduce((sum, c) => sum + (c.courseCredits ?? 0), 0)}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">Tien do TB</p>
                <p className="text-3xl font-bold text-gray-900">{averageProgress}%</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tim kiem khoa hoc, giang vien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-800 bg-white"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${filter === "all" ? "bg-gray-900 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Tat ca
              </button>
              <button
                onClick={() => setFilter("ACTIVE")}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${filter === "ACTIVE" ? "bg-gray-800 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Dang hoc
              </button>
              <button
                onClick={() => setFilter("COMPLETED")}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${filter === "COMPLETED" ? "bg-gray-700 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Hoan thanh
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow">
            Dang tai danh sach khoa hoc...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{course.courseTitle}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {course.courseCode} - {course.instructorName}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(course.status)}`}>
                    {getStatusLabel(course.status)}
                  </span>
                </div>
              </div>

              <div className="p-6 border-b border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-gray-500">Hoc ky</p>
                      <p className="font-medium text-gray-800">{course.courseSemester}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-gray-500">Tin chi</p>
                      <p className="font-medium text-gray-800">{course.courseCredits}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-gray-500">Lich hoc</p>
                      <p className="font-medium text-gray-800">{course.courseSchedule}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-gray-500">Si so</p>
                      <p className="font-medium text-gray-800">{course.courseMaxStudents}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Tien do hoc tap</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gray-800 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>

                <div className="flex gap-3 mt-4">
                  <CustomButton
                    onClick={() => setSelectedCourse(course)}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white shadow-md"
                  >
                    Xem chi tiet
                  </CustomButton>
                  <CustomButton className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">
                    Tai lieu
                  </CustomButton>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">dY"s</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">Khong tim thay khoa hoc nao</h3>
            <p className="text-gray-500">Thu thay doi bo loc hoac tu khoa tim kiem</p>
          </div>
        )}
      </div>

      {selectedCourse && (
        <CourseDetailModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </div>
  );
};
