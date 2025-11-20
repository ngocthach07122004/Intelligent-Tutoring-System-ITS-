"use client";

import { X, BookOpen, User, Award, Calendar, TrendingUp, Clock, CheckCircle2, AlertCircle, BarChart3, FileText, Trophy, Target, ClipboardList, FileCheck, Presentation } from "lucide-react";

interface SubjectData {
  id: string;
  name: string;
  code: string;
  teacher: string;
  currentGrade: string;
  currentScore: number;
  credits: number;
  attendance: number;
  assignments: {
    total: number;
    completed: number;
    avgScore: number;
  };
  exams: {
    midterm?: number;
    final?: number;
    quizzes: number[];
  };
  progress: {
    completed: number;
    total: number;
  };
  nextAssignment?: {
    title: string;
    dueDate: string;
    type: 'assignment' | 'exam' | 'project';
  };
  recentActivities: {
    date: string;
    activity: string;
    score?: number;
  }[];
}

interface SubjectDetailModalProps {
  subject: SubjectData;
  isOpen: boolean;
  onClose: () => void;
}

export const SubjectDetailModal = ({ subject, isOpen, onClose }: SubjectDetailModalProps) => {
  if (!isOpen) return null;

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'A-': return 'bg-green-100 text-green-700 border-green-200';
      case 'B+': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'B': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'B-': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'C+': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'C': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9.0) return 'text-green-600';
    if (score >= 8.0) return 'text-blue-600';
    if (score >= 7.0) return 'text-yellow-600';
    if (score >= 5.0) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressPercentage = () => {
    return (subject.progress.completed / subject.progress.total) * 100;
  };

  const calculateAverageQuiz = () => {
    if (subject.exams.quizzes.length === 0) return 0;
    return subject.exams.quizzes.reduce((sum, score) => sum + score, 0) / subject.exams.quizzes.length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6 sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{subject.name}</h2>
                <p className="text-gray-200 text-sm flex items-center gap-2">
                  <span>{subject.code}</span>
                  <span>•</span>
                  <span>{subject.credits} tín chỉ</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-xs text-gray-200 mb-1">Điểm hiện tại</div>
              <div className="text-2xl font-bold">{subject.currentScore.toFixed(1)}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-xs text-gray-200 mb-1">Xếp loại</div>
              <div className="text-2xl font-bold">{subject.currentGrade}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-xs text-gray-200 mb-1">Điểm danh</div>
              <div className="text-2xl font-bold">{subject.attendance}%</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Teacher Info */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Giảng viên</div>
                <div className="font-semibold text-gray-900">{subject.teacher}</div>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Tiến độ học tập</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {subject.progress.completed}/{subject.progress.total} bài học
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {getProgressPercentage().toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gray-800 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Assignments & Exams */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignments */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Bài tập</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Đã hoàn thành</span>
                  <span className="font-semibold text-gray-900">
                    {subject.assignments.completed}/{subject.assignments.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Điểm trung bình</span>
                  <span className={`font-bold ${getScoreColor(subject.assignments.avgScore)}`}>
                    {subject.assignments.avgScore.toFixed(1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(subject.assignments.completed / subject.assignments.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Exams */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Điểm kiểm tra</h3>
              </div>
              <div className="space-y-3">
                {subject.exams.midterm && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Giữa kỳ</span>
                    <span className={`font-bold ${getScoreColor(subject.exams.midterm)}`}>
                      {subject.exams.midterm.toFixed(1)}
                    </span>
                  </div>
                )}
                {subject.exams.final && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cuối kỳ</span>
                    <span className={`font-bold ${getScoreColor(subject.exams.final)}`}>
                      {subject.exams.final.toFixed(1)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quiz TB ({subject.exams.quizzes.length} bài)</span>
                  <span className={`font-bold ${getScoreColor(calculateAverageQuiz())}`}>
                    {calculateAverageQuiz().toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Assignment */}
          {subject.nextAssignment && (
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-5 border border-orange-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Nhiệm vụ tiếp theo</h3>
                  </div>
                  <p className="text-gray-800 font-medium mb-2">{subject.nextAssignment.title}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">Hạn nộp:</span>
                    <span className="font-semibold text-orange-600">
                      {new Date(subject.nextAssignment.dueDate).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/50 rounded-lg flex items-center justify-center">
                  {subject.nextAssignment.type === 'exam' && <ClipboardList className="w-7 h-7 text-orange-600" />}
                  {subject.nextAssignment.type === 'assignment' && <FileCheck className="w-7 h-7 text-orange-600" />}
                  {subject.nextAssignment.type === 'project' && <Presentation className="w-7 h-7 text-orange-600" />}
                </div>
              </div>
            </div>
          )}

          {/* Recent Activities */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
            </div>
            <div className="space-y-3">
              {subject.recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">{activity.activity}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  {activity.score && (
                    <div className={`text-lg font-bold ${getScoreColor(activity.score)}`}>
                      {activity.score.toFixed(1)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Scores Detail */}
          {subject.exams.quizzes.length > 0 && (
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Điểm Quiz chi tiết</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {subject.exams.quizzes.map((score, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center"
                  >
                    <div className="text-xs text-gray-600 mb-1">Quiz {index + 1}</div>
                    <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                      {score.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 sticky bottom-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
