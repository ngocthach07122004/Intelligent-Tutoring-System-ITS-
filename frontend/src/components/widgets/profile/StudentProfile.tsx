"use client";

import { useState } from "react";
import { CustomButton } from "../../ui/CustomButton";
import { TextField } from "../../blocks/TextField";
import { FormMessageAlert } from "../../ui/FormMessageAlert";
import { MailIcon, CalendarIcon, InfoIcon } from "../../icons";

interface StudentData {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  class: string;
  academicYear: string;
  enrollmentDate: string;
  avatar: string;
  emergencyContact: string;
  bloodType: string;
  medicalNotes: string;
}

interface AcademicRecord {
  semester: string;
  gpa: number;
  totalCredits: number;
  rank: number;
  totalStudents: number;
  subjects: {
    name: string;
    code: string;
    credits: number;
    grade: string;
    score: number;
    teacher: string;
  }[];
}

export const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'info' | 'academic' | 'parent'>('info');

  // Mock student data
  const [studentData, setStudentData] = useState<StudentData>({
    id: "ST001",
    studentId: "2024001234",
    name: "Nguyễn Thị Minh Anh",
    email: "minhanh.nguyen@student.edu.vn",
    phone: "0987654321",
    dateOfBirth: "2006-03-15",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    parentName: "Nguyễn Văn Nam",
    parentPhone: "0901234567",
    parentEmail: "nam.nguyen@gmail.com",
    class: "12A1",
    academicYear: "2023-2024",
    enrollmentDate: "2021-08-15",
    avatar: "/user.jpg",
    emergencyContact: "0901234567",
    bloodType: "A+",
    medicalNotes: "Không có vấn đề sức khỏe đặc biệt"
  });

  // Mock academic records
  const [academicRecords] = useState<AcademicRecord[]>([
    {
      semester: "Học kỳ 1 - 2023-2024",
      gpa: 8.75,
      totalCredits: 24,
      rank: 3,
      totalStudents: 45,
      subjects: [
        { name: "Toán học", code: "MATH12", credits: 4, grade: "A", score: 9.0, teacher: "Trần Văn A" },
        { name: "Vật lý", code: "PHYS12", credits: 3, grade: "B+", score: 8.5, teacher: "Lê Thị B" },
        { name: "Hóa học", code: "CHEM12", credits: 3, grade: "A", score: 9.2, teacher: "Phạm Văn C" },
        { name: "Văn học", code: "LIT12", credits: 3, grade: "B+", score: 8.8, teacher: "Nguyễn Thị D" },
        { name: "Tiếng Anh", code: "ENG12", credits: 3, grade: "A-", score: 8.7, teacher: "Smith John" },
        { name: "Lịch sử", code: "HIST12", credits: 2, grade: "B", score: 8.2, teacher: "Hoàng Văn E" }
      ]
    },
    {
      semester: "Học kỳ 2 - 2022-2023",
      gpa: 8.45,
      totalCredits: 24,
      rank: 5,
      totalStudents: 45,
      subjects: [
        { name: "Toán học", code: "MATH11", credits: 4, grade: "B+", score: 8.5, teacher: "Trần Văn A" },
        { name: "Vật lý", code: "PHYS11", credits: 3, grade: "A-", score: 8.8, teacher: "Lê Thị B" },
        { name: "Hóa học", code: "CHEM11", credits: 3, grade: "B+", score: 8.6, teacher: "Phạm Văn C" },
        { name: "Văn học", code: "LIT11", credits: 3, grade: "A-", score: 8.9, teacher: "Nguyễn Thị D" },
        { name: "Tiếng Anh", code: "ENG11", credits: 3, grade: "B+", score: 8.4, teacher: "Smith John" },
        { name: "Địa lý", code: "GEO11", credits: 2, grade: "B", score: 8.0, teacher: "Đặng Thị F" }
      ]
    }
  ]);

  const [formData, setFormData] = useState(studentData);

  const handleInputChange = (field: keyof StudentData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStudentData(formData);
      setIsEditing(false);
      setSuccess("Cập nhật thông tin học sinh thành công!");
    } catch (err: any) {
      setError("Có lỗi xảy ra khi cập nhật thông tin.");
    }
    
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData(studentData);
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'A-': return 'bg-green-100 text-green-700';
      case 'B+': return 'bg-blue-100 text-blue-800';
      case 'B': return 'bg-blue-100 text-blue-700';
      case 'B-': return 'bg-yellow-100 text-yellow-800';
      case 'C+': return 'bg-orange-100 text-orange-800';
      case 'C': return 'bg-orange-100 text-orange-700';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const calculateOverallGPA = () => {
    if (academicRecords.length === 0) return 0;
    const totalGPA = academicRecords.reduce((sum, record) => sum + record.gpa, 0);
    return (totalGPA / academicRecords.length).toFixed(2);
  };

  const getPerformanceStatus = (gpa: number) => {
    if (gpa >= 9.0) return { text: "Xuất sắc", color: "text-green-600", bgColor: "bg-green-50" };
    if (gpa >= 8.0) return { text: "Giỏi", color: "text-blue-600", bgColor: "bg-blue-50" };
    if (gpa >= 6.5) return { text: "Khá", color: "text-yellow-600", bgColor: "bg-yellow-50" };
    if (gpa >= 5.0) return { text: "Trung bình", color: "text-orange-600", bgColor: "bg-orange-50" };
    return { text: "Yếu", color: "text-red-600", bgColor: "bg-red-50" };
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Student Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#1e1e2f] to-[#2a2a40] px-6 py-8 text-white">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={studentData.avatar}
                alt="Student Avatar"
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Hoạt động
              </div>
            </div>
            
            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{studentData.name}</h1>
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300">ID:</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                    {studentData.studentId}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300">Lớp:</span>
                  <span className="bg-blue-500 bg-opacity-80 px-3 py-1 rounded-full text-sm font-medium">
                    {studentData.class}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300">Năm học:</span>
                  <span className="text-yellow-200 font-medium">{studentData.academicYear}</span>
                </div>
              </div>
              <div className="mt-2 text-gray-200">
                Nhập học: {new Date(studentData.enrollmentDate).toLocaleDateString('vi-VN')}
              </div>
            </div>

            {/* Academic Overview */}
            <div className="text-right">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-3xl font-bold text-yellow-300">{calculateOverallGPA()}</div>
                <div className="text-sm text-gray-200">GPA Tổng</div>
                <div className={`text-sm font-medium mt-1 ${getPerformanceStatus(Number(calculateOverallGPA())).color}`}>
                  {getPerformanceStatus(Number(calculateOverallGPA())).text}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {!isEditing ? (
                <CustomButton
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-[#1e1e2f] hover:bg-gray-100 transition-colors"
                >
                  Chỉnh sửa thông tin
                </CustomButton>
              ) : (
                <div className="space-x-2">
                  <CustomButton
                    onClick={handleSave}
                    disabled={loading}
                    spinnerIcon={loading}
                    className="bg-green-500 hover:bg-green-600 text-white transition-colors"
                  >
                    {loading ? "Đang lưu..." : "Lưu"}
                  </CustomButton>
                  <CustomButton
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white transition-colors"
                  >
                    Hủy
                  </CustomButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {success && <FormMessageAlert message={success} success={true} />}
      {error && <FormMessageAlert message={error} />}

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-4 text-sm font-medium focus:outline-none ${
              activeTab === 'info'
                ? 'border-b-2 border-[#1e1e2f] text-[#1e1e2f]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`px-6 py-4 text-sm font-medium focus:outline-none ${
              activeTab === 'academic'
                ? 'border-b-2 border-[#1e1e2f] text-[#1e1e2f]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Bảng điểm học tập
          </button>
          <button
            onClick={() => setActiveTab('parent')}
            className={`px-6 py-4 text-sm font-medium focus:outline-none ${
              activeTab === 'parent'
                ? 'border-b-2 border-[#1e1e2f] text-[#1e1e2f]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Thông tin phụ huynh
          </button>
        </div>

        <div className="p-6">
          {/* Personal Information Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Thông tin cá nhân</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TextField
                  label="Họ và tên"
                  type="text"
                  value={isEditing ? formData.name : studentData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  validRules={[{ rule: /.+/, message: "Họ tên là bắt buộc" }]}
                />

                <TextField
                  label="Mã học sinh"
                  type="text"
                  value={studentData.studentId}
                  disabled={true}
                />

                <TextField
                  label="Email"
                  type="email"
                  icon={<MailIcon />}
                  value={isEditing ? formData.email : studentData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                />

                <TextField
                  label="Số điện thoại"
                  type="tel"
                  value={isEditing ? formData.phone : studentData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                />

                <TextField
                  label="Ngày sinh"
                  type="date"
                  icon={<CalendarIcon />}
                  value={isEditing ? formData.dateOfBirth : studentData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                />

                <TextField
                  label="Lớp học"
                  type="text"
                  value={isEditing ? formData.class : studentData.class}
                  onChange={(e) => handleInputChange('class', e.target.value)}
                  disabled={!isEditing}
                />

                <TextField
                  label="Nhóm máu"
                  type="text"
                  value={isEditing ? formData.bloodType : studentData.bloodType}
                  onChange={(e) => handleInputChange('bloodType', e.target.value)}
                  disabled={!isEditing}
                />

                <TextField
                  label="Liên hệ khẩn cấp"
                  type="tel"
                  value={isEditing ? formData.emergencyContact : studentData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <TextField
                label="Địa chỉ"
                type="text"
                value={isEditing ? formData.address : studentData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
              />

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Ghi chú y tế
                </label>
                <textarea
                  rows={3}
                  value={isEditing ? formData.medicalNotes : studentData.medicalNotes}
                  onChange={(e) => handleInputChange('medicalNotes', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1e1e2f] focus:border-transparent resize-none text-gray-800 ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                  }`}
                  placeholder="Ghi chú về tình trạng sức khỏe, dị ứng, thuốc men..."
                />
              </div>
            </div>
          )}

          {/* Academic Records Tab */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Bảng điểm học tập</h2>
                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-2 rounded-lg ${getPerformanceStatus(Number(calculateOverallGPA())).bgColor}`}>
                    <span className={`font-semibold ${getPerformanceStatus(Number(calculateOverallGPA())).color}`}>
                      GPA: {calculateOverallGPA()} - {getPerformanceStatus(Number(calculateOverallGPA())).text}
                    </span>
                  </div>
                </div>
              </div>

              {academicRecords.map((record, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">{record.semester}</h3>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span>GPA: <span className="font-semibold text-[#1e1e2f]">{record.gpa}</span></span>
                        <span>Tín chỉ: <span className="font-semibold">{record.totalCredits}</span></span>
                        <span>Xếp hạng: <span className="font-semibold">{record.rank}/{record.totalStudents}</span></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Môn học
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mã môn
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tín chỉ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Điểm
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Xếp loại
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Giáo viên
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {record.subjects.map((subject, subjectIndex) => (
                          <tr key={subjectIndex} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{subject.code}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{subject.credits}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-[#1e1e2f]">{subject.score}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(subject.grade)}`}>
                                {subject.grade}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{subject.teacher}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Parent Information Tab */}
          {activeTab === 'parent' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Thông tin phụ huynh</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Tên phụ huynh"
                  type="text"
                  value={isEditing ? formData.parentName : studentData.parentName}
                  onChange={(e) => handleInputChange('parentName', e.target.value)}
                  disabled={!isEditing}
                />

                <TextField
                  label="Số điện thoại phụ huynh"
                  type="tel"
                  value={isEditing ? formData.parentPhone : studentData.parentPhone}
                  onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                  disabled={!isEditing}
                />

                <TextField
                  label="Email phụ huynh"
                  type="email"
                  icon={<MailIcon />}
                  value={isEditing ? formData.parentEmail : studentData.parentEmail}
                  onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Lưu ý quan trọng</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Thông tin phụ huynh được sử dụng để liên lạc trong trường hợp khẩn cấp</li>
                  <li>• Phụ huynh sẽ nhận được thông báo về kết quả học tập và hoạt động của học sinh</li>
                  <li>• Vui lòng cập nhật thông tin khi có thay đổi</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};