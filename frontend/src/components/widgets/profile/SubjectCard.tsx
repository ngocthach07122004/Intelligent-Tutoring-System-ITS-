"use client";

import { Calendar, FileCheck, ClipboardList, Presentation } from "lucide-react";

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

interface SubjectCardProps {
  subject: SubjectData;
  onViewDetails?: (subjectId: string) => void;
}

export const SubjectCard = ({ subject, onViewDetails }: SubjectCardProps) => {
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

  const getAttendanceStatus = (rate: number) => {
    if (rate >= 95) return { color: 'text-green-600', bg: 'bg-green-50', status: 'Rất tốt' };
    if (rate >= 90) return { color: 'text-blue-600', bg: 'bg-blue-50', status: 'Tốt' };
    if (rate >= 85) return { color: 'text-yellow-600', bg: 'bg-yellow-50', status: 'Khá' };
    return { color: 'text-red-600', bg: 'bg-red-50', status: 'Cần cải thiện' };
  };

  const getProgressPercentage = () => {
    return (subject.progress.completed / subject.progress.total) * 100;
  };

  const getDueDateUrgency = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return { color: 'text-red-600', bg: 'bg-red-50', text: 'Quá hạn' };
    if (diffDays <= 3) return { color: 'text-orange-600', bg: 'bg-orange-50', text: `${diffDays} ngày nữa` };
    if (diffDays <= 7) return { color: 'text-yellow-600', bg: 'bg-yellow-50', text: `${diffDays} ngày nữa` };
    return { color: 'text-green-600', bg: 'bg-green-50', text: `${diffDays} ngày nữa` };
  };

  const attendanceStatus = getAttendanceStatus(subject.attendance);
  const urgency = subject.nextAssignment ? getDueDateUrgency(subject.nextAssignment.dueDate) : null;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{subject.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {subject.code} • {subject.teacher} • {subject.credits} tín chỉ
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(subject.currentGrade)}`}>
              {subject.currentGrade}
            </span>
            <div className={`text-xl font-bold ${getScoreColor(subject.currentScore)}`}>
              {subject.currentScore.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Tiến độ học tập</span>
          <span className="text-sm text-gray-600">
            {subject.progress.completed}/{subject.progress.total} bài học
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#1e1e2f] to-[#2a2a40] h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {getProgressPercentage().toFixed(1)}% hoàn thành
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-4 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          {/* Attendance */}
          <div className={`p-3 rounded-lg ${attendanceStatus.bg}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Điểm danh</span>
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <div className={`text-lg font-bold ${attendanceStatus.color}`}>
              {subject.attendance}%
            </div>
            <div className={`text-xs ${attendanceStatus.color}`}>
              {attendanceStatus.status}
            </div>
          </div>

          {/* Assignments */}
          <div className="p-3 rounded-lg bg-blue-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Bài tập</span>
              <FileCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-blue-600">
              {subject.assignments.completed}/{subject.assignments.total}
            </div>
            <div className="text-xs text-blue-600">
              TB: {subject.assignments.avgScore.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Next Assignment */}
      {subject.nextAssignment && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Nhiệm vụ tiếp theo</h4>
              <p className="text-sm text-gray-600 mt-1">{subject.nextAssignment.title}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-gray-500">Hạn nộp:</span>
                <span className={`text-xs px-2 py-1 rounded-full ${urgency?.bg} ${urgency?.color}`}>
                  {urgency?.text}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center">
              {subject.nextAssignment.type === 'exam' && <ClipboardList className="w-7 h-7 text-gray-700" />}
              {subject.nextAssignment.type === 'assignment' && <FileCheck className="w-7 h-7 text-gray-700" />}
              {subject.nextAssignment.type === 'project' && <Presentation className="w-7 h-7 text-gray-700" />}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-800 mb-3">Hoạt động gần đây</h4>
        <div className="space-y-2">
          {subject.recentActivities.slice(0, 3).map((activity, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#1e1e2f] rounded-full"></div>
                <span className="text-gray-700">{activity.activity}</span>
              </div>
              <div className="flex items-center space-x-2">
                {activity.score && (
                  <span className={`font-medium ${getScoreColor(activity.score)}`}>
                    {activity.score}
                  </span>
                )}
                <span className="text-gray-500 text-xs">
                  {new Date(activity.date).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 bg-gray-50 rounded-b-lg">
        <button
          onClick={() => onViewDetails?.(subject.id)}
          className="w-full bg-white hover:bg-gray-100 text-gray-800 border border-[#1e1e2f] py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Xem chi tiết môn học
        </button>
      </div>
    </div>
  );
};