"use client";

import { useEffect, useMemo, useState } from "react";
import { StudentProfile } from "./StudentProfile";
import { LearningAnalytics } from "./LearningAnalytics";
import { SubjectCard } from "./SubjectCard";
import { SubjectDetailModal } from "./SubjectDetailModal";
import { AchievementGrid, AchievementBadge } from "./AchievementBadge";
import { BookOpen, BarChart3, CheckCircle2, FileText, Trophy, Zap, Target } from "lucide-react";
import { studentManagementOps } from "../../../lib/BE-library/student-management-api";
import { Achievement, CurrentSubject } from "../../../lib/BE-library/student-interfaces";
import { StudentAnalyticsResponse } from "../../../lib/BE-library/interfaces";
import { FormMessageAlert } from "../../ui/FormMessageAlert";

type TabKey = "profile" | "analytics" | "subjects" | "achievements";

const normalizeSubject = (subject: CurrentSubject): CurrentSubject => ({
  ...subject,
  attendance: subject.attendance ?? 0,
  currentScore: subject.currentScore ?? 0,
  currentGrade: subject.currentGrade ?? "--",
  credits: subject.credits ?? 0,
  assignments: {
    total: subject.assignments?.total ?? 0,
    completed: subject.assignments?.completed ?? 0,
    avgScore: subject.assignments?.avgScore ?? 0,
  },
  exams: {
    midterm: subject.exams?.midterm,
    finalExam: subject.exams?.finalExam ?? subject.exams?.final,
    final: subject.exams?.final ?? subject.exams?.finalExam,
    quizzes: subject.exams?.quizzes ?? [],
  },
  progress: {
    completed: subject.progress?.completed ?? 0,
    total: subject.progress?.total ?? 1,
  },
  nextAssignment: subject.nextAssignment
    ? {
      title: subject.nextAssignment.title ?? "Next assignment",
      dueDate: subject.nextAssignment.dueDate ?? "",
      type: subject.nextAssignment.type ?? "assignment",
    }
    : undefined,
  recentActivities: subject.recentActivities ?? [],
});

export const StudentManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [selectedSubject, setSelectedSubject] = useState<CurrentSubject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [studentId, setStudentId] = useState<string | undefined>();
  const [subjects, setSubjects] = useState<CurrentSubject[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [analytics, setAnalytics] = useState<StudentAnalyticsResponse | null>(null);

  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingAchievements, setLoadingAchievements] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAll = async () => {
      setError("");
      setLoadingSubjects(true);
      setLoadingAchievements(true);
      setLoadingAnalytics(true);

      try {
        const profileRes = await studentManagementOps.getMyProfile();
        if (!profileRes?.success || !profileRes.data?.userId) {
          setError(profileRes?.message || "Could not load profile.");
          setLoadingSubjects(false);
          setLoadingAchievements(false);
          setLoadingAnalytics(false);
          return;
        }

        const id = profileRes.data.userId;
        setStudentId(id);

        const [subjectsRes, achievementsRes, analyticsRes] = await Promise.all([
          studentManagementOps.getSubjects(id),
          studentManagementOps.getAchievements(id),
          studentManagementOps.getAnalytics(id),
        ]);

        if (subjectsRes?.success && Array.isArray(subjectsRes.data)) {
          setSubjects(subjectsRes.data.map(normalizeSubject));
        } else if (subjectsRes?.message) {
          setError((prev) => prev || subjectsRes.message);
        }
        if (achievementsRes?.success && Array.isArray(achievementsRes.data)) {
          setAchievements(achievementsRes.data);
        } else if (achievementsRes?.message) {
          setError((prev) => prev || achievementsRes.message);
        }
        if (analyticsRes?.success && analyticsRes.data) {
          setAnalytics(analyticsRes.data as StudentAnalyticsResponse);
        } else if (analyticsRes?.message) {
          setError((prev) => prev || analyticsRes.message);
        }
      } catch (err: any) {
        setError(err?.message ?? "Failed to load dashboard data.");
      } finally {
        setLoadingSubjects(false);
        setLoadingAchievements(false);
        setLoadingAnalytics(false);
      }
    };

    loadAll();
  }, []);

  const handleSubjectDetails = async (subjectId: string) => {
    if (!studentId) return;
    const subject = subjects.find((s) => s.id === subjectId);
    if (subject) {
      setSelectedSubject(subject);
      setIsModalOpen(true);
    }

    try {
      const detailRes = await studentManagementOps.getSubjectDetail(studentId, subjectId);
      if (detailRes?.success && detailRes.data) {
        const updated = normalizeSubject(detailRes.data);
        setSelectedSubject(updated);
        setSubjects((prev) => prev.map((s) => (s.id === subjectId ? updated : s)));
      }
    } catch (err) {
      // best effort; ignore detail errors
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubject(null);
  };

  const handleTabClick = (tab: TabKey) => {
    setActiveTab(tab);
  };

  const stats = useMemo(() => {
    const totalSubjects = subjects.length;
    const avgScore =
      totalSubjects === 0
        ? 0
        : subjects.reduce((sum, s) => sum + (s.currentScore ?? 0), 0) / totalSubjects;
    const avgAttendance =
      totalSubjects === 0
        ? 0
        : subjects.reduce((sum, s) => sum + (s.attendance ?? 0), 0) / totalSubjects;
    const avgAssignmentCompletion =
      totalSubjects === 0
        ? 0
        : subjects.reduce((sum, s) => {
          const total = s.assignments?.total ?? 0;
          const completed = s.assignments?.completed ?? 0;
          return sum + (total === 0 ? 0 : completed / total);
        }, 0) / totalSubjects;

    return { totalSubjects, avgScore, avgAttendance, avgAssignmentCompletion };
  }, [subjects]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {error && <FormMessageAlert message={error} />}

      {/* Navigation Header - Fixed */}
      <div className="bg-white shadow-md border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => handleTabClick("profile")}
              className={`py-4 px-2 border-b-2 font-semibold text-sm transition-all duration-200 ${activeTab === "profile"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
            >
              Ho so hoc sinh
            </button>
            <button
              onClick={() => handleTabClick("analytics")}
              className={`py-4 px-2 border-b-2 font-semibold text-sm transition-all duration-200 ${activeTab === "analytics"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
            >
              Phan tich hoc tap
            </button>
            <button
              onClick={() => handleTabClick("subjects")}
              className={`py-4 px-2 border-b-2 font-semibold text-sm transition-all duration-200 ${activeTab === "subjects"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
            >
              Mon hoc ({stats.totalSubjects})
            </button>
            <button
              onClick={() => handleTabClick("achievements")}
              className={`py-4 px-2 border-b-2 font-semibold text-sm transition-all duration-200 ${activeTab === "achievements"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
            >
              Thanh tich ({achievements.filter((a) => a.isEarned).length}/{achievements.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-6">
          {activeTab === "profile" && (
            <div className="max-w-7xl mx-auto px-6">
              <StudentProfile />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="max-w-7xl mx-auto px-6">
              <LearningAnalytics data={analytics} loading={loadingAnalytics} />
            </div>
          )}

          {activeTab === "subjects" && (
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon hoc</h1>
                <p className="text-gray-600">Theo doi tien do va ket qua hoc tap tung mon</p>
              </div>

              {/* Subject Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tong mon hoc</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalSubjects}</p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <BookOpen className="w-8 h-8 text-gray-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">GPA trung binh</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.avgScore.toFixed(1)}</p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-gray-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Diem danh TB</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.avgAttendance.toFixed(1)}%</p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <CheckCircle2 className="w-8 h-8 text-gray-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Bai tap hoan thanh</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {Math.round(stats.avgAssignmentCompletion * 100)}%
                      </p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <FileText className="w-8 h-8 text-gray-700" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Cards */}
              {loadingSubjects ? (
                <div className="bg-white rounded-lg p-6 text-gray-600 border border-gray-200">Dang tai mon hoc...</div>
              ) : subjects.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-gray-600 border border-dashed border-gray-300">
                  Chua co du lieu mon hoc
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {subjects.map((subject) => (
                    <SubjectCard key={subject.id || subject.code} subject={subject} onViewDetails={handleSubjectDetails} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">He thong thanh tich</h1>
                <p className="text-gray-600">Theo doi cac huy hieu va thanh tich da dat duoc</p>

                {/* Achievement Overview */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90 font-medium">Da dat duoc</p>
                        <p className="text-3xl font-bold">{achievements.filter((a) => a.isEarned).length}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-lg">
                        <Trophy className="w-8 h-8" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90 font-medium">Dang tien bo</p>
                        <p className="text-3xl font-bold">
                          {achievements.filter((a) => !a.isEarned && a.progress).length}
                        </p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-lg">
                        <Zap className="w-8 h-8" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90 font-medium">Tong cong</p>
                        <p className="text-3xl font-bold">{achievements.length}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-lg">
                        <Target className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Achievement Badges */}
              {achievements.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Noi bat</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(achievements
                      .filter((a) => a.isEarned && (a.rarity === "rare" || a.rarity === "legendary"))
                      .concat(achievements.filter((a) => a.isEarned))
                      .slice(0, 3) as Achievement[]
                    ).map((achievement) => (
                      <AchievementBadge key={achievement.id} achievement={achievement} size="large" showProgress={false} />
                    ))}
                  </div>
                </div>
              )}

              {loadingAchievements ? (
                <div className="bg-white rounded-lg p-6 text-gray-600 border border-gray-200">Dang tai thanh tich...</div>
              ) : achievements.length > 0 ? (
                <AchievementGrid achievements={achievements} />
              ) : (
                <div className="bg-white rounded-lg p-8 text-center border border-dashed border-gray-300">
                  <p className="text-gray-500">Chua co du lieu thanh tich</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Subject Detail Modal */}
      {selectedSubject && (
        <SubjectDetailModal subject={selectedSubject} isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </div>
  );
};
