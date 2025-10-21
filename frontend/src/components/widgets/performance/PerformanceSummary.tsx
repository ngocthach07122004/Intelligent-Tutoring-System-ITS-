"use client";

import { useState } from "react";
import { 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  Star, 
  TrendingUp, 
  Calendar,
  Award,
  BarChart3,
  Target,
  Zap
} from "lucide-react";

interface PerformanceData {
  semester: string;
  gpa: number;
  totalCredits: number;
  rank: number;
  totalStudents: number;
  achievements: number;
  attendance: number;
}

interface SkillData {
  name: string;
  level: number;
  category: 'technical' | 'soft' | 'language';
}

// Mock data
const mockPerformance: PerformanceData[] = [
  {
    semester: "HK1 2024-2025",
    gpa: 8.75,
    totalCredits: 18,
    rank: 3,
    totalStudents: 120,
    achievements: 5,
    attendance: 96.5
  },
  {
    semester: "HK2 2023-2024",
    gpa: 8.45,
    totalCredits: 20,
    rank: 5,
    totalStudents: 120,
    achievements: 3,
    attendance: 94.2
  },
  {
    semester: "HK1 2023-2024",
    gpa: 8.20,
    totalCredits: 18,
    rank: 8,
    totalStudents: 115,
    achievements: 2,
    attendance: 92.0
  }
];

const mockSkills: SkillData[] = [
  { name: "Python", level: 85, category: 'technical' },
  { name: "Java", level: 70, category: 'technical' },
  { name: "JavaScript", level: 75, category: 'technical' },
  { name: "SQL", level: 65, category: 'technical' },
  { name: "Làm việc nhóm", level: 90, category: 'soft' },
  { name: "Thuyết trình", level: 80, category: 'soft' },
  { name: "Giải quyết vấn đề", level: 85, category: 'soft' },
  { name: "Tiếng Anh", level: 78, category: 'language' },
];

export const PerformanceSummary = () => {
  const [selectedSemester, setSelectedSemester] = useState(mockPerformance[0].semester);

  const currentPerformance = mockPerformance.find(p => p.semester === selectedSemester) || mockPerformance[0];
  
  const calculateOverallGPA = () => {
    return (mockPerformance.reduce((sum, p) => sum + p.gpa, 0) / mockPerformance.length).toFixed(2);
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 9.0) return 'text-green-600';
    if (gpa >= 8.0) return 'text-blue-600';
    if (gpa >= 7.0) return 'text-yellow-600';
    if (gpa >= 5.0) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSkillColor = (level: number) => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 60) return 'bg-blue-500';
    if (level >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return '💻';
      case 'soft': return '🤝';
      case 'language': return '🌐';
      default: return '📚';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Tổng hợp Thành tích
          </h1>
          <p className="text-slate-600">Theo dõi điểm số, xếp hạng và năng lực học tập</p>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-6 text-white border border-blue-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-medium">GPA Tổng</p>
                <p className="text-4xl font-bold">{calculateOverallGPA()}</p>
                <p className="text-xs mt-1 opacity-75">Trung bình tích lũy</p>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-xl p-6 text-white border border-emerald-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-medium">Tổng tín chỉ</p>
                <p className="text-4xl font-bold">
                  {mockPerformance.reduce((sum, p) => sum + p.totalCredits, 0)}
                </p>
                <p className="text-xs mt-1 opacity-75">Credits đã tích lũy</p>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl shadow-xl p-6 text-white border border-purple-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-medium">Thành tích</p>
                <p className="text-4xl font-bold">
                  {mockPerformance.reduce((sum, p) => sum + p.achievements, 0)}
                </p>
                <p className="text-xs mt-1 opacity-75">Huy hiệu đạt được</p>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-xl p-6 text-white border border-orange-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-medium">Xếp hạng</p>
                <p className="text-4xl font-bold">#{currentPerformance.rank}</p>
                <p className="text-xs mt-1 opacity-75">Trong {currentPerformance.totalStudents} sinh viên</p>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Star className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Semester Performance */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg mb-6 border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Kết quả theo học kỳ
              </h2>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              >
                {mockPerformance.map((perf) => (
                  <option key={perf.semester} value={perf.semester}>
                    {perf.semester}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <p className="text-sm text-slate-600 mb-2 font-medium">GPA học kỳ</p>
                <p className={`text-4xl font-bold ${getGPAColor(currentPerformance.gpa)}`}>
                  {currentPerformance.gpa}
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                <p className="text-sm text-slate-600 mb-2 font-medium">Điểm danh</p>
                <p className="text-4xl font-bold text-emerald-600">
                  {currentPerformance.attendance}%
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl border border-purple-200">
                <p className="text-sm text-slate-600 mb-2 font-medium">Tín chỉ</p>
                <p className="text-4xl font-bold text-purple-600">
                  {currentPerformance.totalCredits}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* GPA Trend Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Xu hướng GPA
            </h2>
          </div>
          <div className="relative h-64">
            {/* Simple line chart visualization */}
            <div className="flex items-end justify-between h-full">
              {mockPerformance.slice().reverse().map((perf, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end px-2">
                  <div className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                    {perf.gpa}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-cyan-500 rounded-t-xl transition-all duration-300 hover:opacity-80"
                    style={{ height: `${(perf.gpa / 10) * 100}%` }}
                  ></div>
                  <div className="text-xs text-slate-600 mt-2 text-center">
                    {perf.semester.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills & Competencies */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Năng lực & Kỹ năng
            </h2>
          </div>
          
          {/* Technical Skills */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Kỹ năng kỹ thuật
            </h3>
            <div className="space-y-4">
              {mockSkills.filter(s => s.category === 'technical').map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">{skill.name}</span>
                    <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${getSkillColor(skill.level)}`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Kỹ năng mềm
            </h3>
            <div className="space-y-4">
              {mockSkills.filter(s => s.category === 'soft').map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">{skill.name}</span>
                    <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${getSkillColor(skill.level)}`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Language Skills */}
          <div>
            <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Ngoại ngữ
            </h3>
            <div className="space-y-4">
              {mockSkills.filter(s => s.category === 'language').map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">{skill.name}</span>
                    <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${getSkillColor(skill.level)}`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};