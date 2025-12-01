"use client";

import { useCallback, useEffect, useState } from "react";
import { CustomButton } from "../../ui/CustomButton";
import { TextField } from "../../blocks/TextField";
import { FormMessageAlert } from "../../ui/FormMessageAlert";
import { MailIcon, CalendarIcon } from "../../icons";
import { studentManagementOps } from "../../../lib/BE-library/student-management-api";
import { AcademicRecord } from "../../../lib/BE-library/student-interfaces";
import { UserProfileResponse } from "../../../lib/BE-library/interfaces";

type StudentProfileData = Partial<UserProfileResponse> & {
  email?: string;
  avatar?: string;
  name?: string;
};

type EditableField =
  | "fullName"
  | "email"
  | "phone"
  | "dateOfBirth"
  | "address"
  | "className"
  | "academicYear"
  | "enrollmentDate"
  | "avatarUrl"
  | "emergencyContact"
  | "bloodType"
  | "medicalNotes"
  | "parentName"
  | "parentPhone"
  | "parentEmail";

export interface StudentProfileProps {
  student?: StudentProfileData;
  onUpdate?: (updatedStudent: StudentProfileData) => void;
}

export const StudentProfile = ({ student, onUpdate }: StudentProfileProps = {}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"info" | "academic" | "parent">("info");
  const [studentData, setStudentData] = useState<StudentProfileData>({});
  const [formData, setFormData] = useState<StudentProfileData>({});
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([]);

  const fetchAcademicHistory = useCallback(async (studentId: string) => {
    try {
      const historyRes = await studentManagementOps.getAcademicHistory(studentId);
      if (historyRes?.success && Array.isArray(historyRes.data)) {
        setAcademicRecords(historyRes.data);
      } else if (historyRes?.message) {
        setError(historyRes.message);
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to load academic history.");
    }
  }, []);

  const loadProfile = useCallback(async () => {
    setLoadingProfile(true);
    setError("");
    try {
      const profileRes = await studentManagementOps.getMyProfile();
      if (!profileRes?.success || !profileRes.data) {
        setError(profileRes?.message || "Could not load profile.");
        return;
      }

      const profile = profileRes.data as StudentProfileData;
      setStudentData(profile);
      setFormData(profile);

      if (profile.userId) {
        await fetchAcademicHistory(profile.userId);
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to load profile.");
    } finally {
      setLoadingProfile(false);
    }
  }, [fetchAcademicHistory]);

  useEffect(() => {
    if (student) {
      setStudentData(student);
      setFormData(student);
      if (student.userId) {
        fetchAcademicHistory(student.userId);
      }
    } else {
      loadProfile();
    }
  }, [student, loadProfile, fetchAcademicHistory]);

  const handleInputChange = (field: EditableField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload: StudentProfileData = {
        fullName: formData.fullName ?? formData.name,
        studentId: formData.studentId,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        classId: formData.classId,
        className: formData.className,
        academicYear: formData.academicYear,
        enrollmentDate: formData.enrollmentDate,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        parentEmail: formData.parentEmail,
        emergencyContact: formData.emergencyContact,
        bloodType: formData.bloodType,
        medicalNotes: formData.medicalNotes,
        avatarUrl: formData.avatarUrl ?? formData.avatar,
        timezone: formData.timezone,
        learningStyle: formData.learningStyle,
        bio: formData.bio,
        email: formData.email,
      };

      const response = await studentManagementOps.updateMyProfile(payload);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to update profile.");
      }

      const updatedProfile = (response.data as StudentProfileData) ?? payload;
      setStudentData(updatedProfile);
      setFormData(updatedProfile);

      if (updatedProfile.userId) {
        await fetchAcademicHistory(updatedProfile.userId);
      }

      if (onUpdate) {
        onUpdate(updatedProfile);
      }

      setIsEditing(false);
      setSuccess("Cap nhat ho so thanh cong.");
    } catch (err: any) {
      setError(err?.message ?? "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(studentData);
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const getGradeColor = (grade?: string) => {
    switch (grade) {
      case "A":
        return "bg-green-100 text-green-800";
      case "A-":
        return "bg-green-100 text-green-700";
      case "B+":
        return "bg-blue-100 text-blue-800";
      case "B":
        return "bg-blue-100 text-blue-700";
      case "B-":
        return "bg-yellow-100 text-yellow-800";
      case "C+":
        return "bg-orange-100 text-orange-800";
      case "C":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const calculateOverallGPA = () => {
    if (academicRecords.length === 0) return 0;
    const totalGPA = academicRecords.reduce((sum, record) => sum + (record.gpa ?? 0), 0);
    return totalGPA / academicRecords.length;
  };

  const getPerformanceStatus = (gpa: number) => {
    if (gpa >= 9.0) return { text: "Xuat sac", color: "text-green-600", bgColor: "bg-green-50" };
    if (gpa >= 8.0) return { text: "Gioi", color: "text-blue-600", bgColor: "bg-blue-50" };
    if (gpa >= 6.5) return { text: "Kha", color: "text-yellow-600", bgColor: "bg-yellow-50" };
    if (gpa >= 5.0) return { text: "Trung binh", color: "text-orange-600", bgColor: "bg-orange-50" };
    return { text: "Yeu", color: "text-red-600", bgColor: "bg-red-50" };
  };

  const overallGPA = calculateOverallGPA();
  const performanceStatus = getPerformanceStatus(overallGPA);
  const enrollmentDateLabel = studentData.enrollmentDate
    ? new Date(studentData.enrollmentDate).toLocaleDateString("vi-VN")
    : "--";
  const avatarSrc = studentData.avatarUrl || studentData.avatar || "/user.jpg";
  const displayName = studentData.fullName || studentData.name || "Student";
  const displayClassName = studentData.className || "--";
  const displayStudentId = studentData.studentId || "--";
  const displayAcademicYear = studentData.academicYear || "--";

  if (loadingProfile) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-gray-600">Dang tai ho so...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Student Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#1e1e2f] to-[#2a2a40] px-6 py-8 text-white">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={avatarSrc}
                alt="Student Avatar"
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Hoat dong
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{displayName}</h1>
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300">ID:</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                    {displayStudentId}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300">Lop:</span>
                  <span className="bg-blue-500 bg-opacity-80 px-3 py-1 rounded-full text-sm font-medium">
                    {displayClassName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300">Nam hoc:</span>
                  <span className="text-yellow-200 font-medium">{displayAcademicYear}</span>
                </div>
              </div>
              <div className="mt-2 text-gray-200">Nhap hoc: {enrollmentDateLabel}</div>
            </div>

            {/* Academic Overview */}
            <div className="text-right">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-3xl font-bold text-yellow-300">{overallGPA.toFixed(2)}</div>
                <div className="text-sm text-gray-200">GPA tong</div>
                <div className={`text-sm font-medium mt-1 ${performanceStatus.color}`}>{performanceStatus.text}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {!isEditing ? (
                <CustomButton
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-[#1e1e2f] hover:bg-gray-100 transition-colors"
                >
                  Chinh sua thong tin
                </CustomButton>
              ) : (
                <div className="space-x-2">
                  <CustomButton
                    onClick={handleSave}
                    disabled={loading}
                    spinnerIcon={loading}
                    className="bg-green-500 hover:bg-green-600 text-white transition-colors"
                  >
                    {loading ? "Dang luu..." : "Luu"}
                  </CustomButton>
                  <CustomButton
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white transition-colors"
                  >
                    Huy
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
            onClick={() => setActiveTab("info")}
            className={`px-6 py-4 text-sm font-medium focus:outline-none ${activeTab === "info" ? "border-b-2 border-[#1e1e2f] text-[#1e1e2f]" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Thong tin ca nhan
          </button>
          <button
            onClick={() => setActiveTab("academic")}
            className={`px-6 py-4 text-sm font-medium focus:outline-none ${activeTab === "academic"
                ? "border-b-2 border-[#1e1e2f] text-[#1e1e2f]"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Bang diem hoc tap
          </button>
          <button
            onClick={() => setActiveTab("parent")}
            className={`px-6 py-4 text-sm font-medium focus:outline-none ${activeTab === "parent"
                ? "border-b-2 border-[#1e1e2f] text-[#1e1e2f]"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Thong tin phu huynh
          </button>
        </div>

        <div className="p-6">
          {/* Personal Information Tab */}
          {activeTab === "info" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Thong tin ca nhan</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TextField
                  label="Ho va ten"
                  type="text"
                  value={
                    isEditing ? formData.fullName ?? formData.name ?? "" : studentData.fullName ?? studentData.name ?? ""
                  }
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  disabled={!isEditing}
                  validRules={[{ rule: /.+/, message: "Ho ten la bat buoc" }]}
                />

                <TextField label="Ma hoc sinh" type="text" value={studentData.studentId ?? ""} disabled={true} />

                <TextField
                  label="Email"
                  type="email"
                  icon={<MailIcon />}
                  value={isEditing ? formData.email ?? "" : studentData.email ?? ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                />

                <TextField
                  label="So dien thoai"
                  type="tel"
                  value={isEditing ? formData.phone ?? "" : studentData.phone ?? ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                />

                <TextField
                  label="Ngay sinh"
                  type="date"
                  icon={<CalendarIcon />}
                  value={isEditing ? formData.dateOfBirth ?? "" : studentData.dateOfBirth ?? ""}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  disabled={!isEditing}
                />

                <TextField
                  label="Lop hoc"
                  type="text"
                  value={isEditing ? formData.className ?? "" : studentData.className ?? ""}
                  onChange={(e) => handleInputChange("className", e.target.value)}
                  disabled={!isEditing}
                />

                <TextField
                  label="Nhom mau"
                  type="text"
                  value={isEditing ? formData.bloodType ?? "" : studentData.bloodType ?? ""}
                  onChange={(e) => handleInputChange("bloodType", e.target.value)}
                  disabled={!isEditing}
                />

                <TextField
                  label="Lien he khan cap"
                  type="tel"
                  value={isEditing ? formData.emergencyContact ?? "" : studentData.emergencyContact ?? ""}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <TextField
                label="Dia chi"
                type="text"
                value={isEditing ? formData.address ?? "" : studentData.address ?? ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                disabled={!isEditing}
              />

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Ghi chu y te</label>
                <textarea
                  rows={3}
                  value={isEditing ? formData.medicalNotes ?? "" : studentData.medicalNotes ?? ""}
                  onChange={(e) => handleInputChange("medicalNotes", e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1e1e2f] focus:border-transparent resize-none text-gray-800 ${!isEditing ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                    }`}
                  placeholder="Ghi chu ve tinh trang suc khoe, di ung, thuoc men..."
                />
              </div>
            </div>
          )}

          {/* Academic Records Tab */}
          {activeTab === "academic" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Bang diem hoc tap</h2>
                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-2 rounded-lg ${performanceStatus.bgColor}`}>
                    <span className={`font-semibold ${performanceStatus.color}`}>
                      GPA: {overallGPA.toFixed(2)} - {performanceStatus.text}
                    </span>
                  </div>
                </div>
              </div>

              {academicRecords.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-600">
                  Chua co du lieu hoc tap
                </div>
              ) : (
                academicRecords.map((record, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">{record.semester ?? "--"}</h3>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span>
                            GPA: <span className="font-semibold text-[#1e1e2f]">{record.gpa ?? "--"}</span>
                          </span>
                          <span>
                            Tin chi: <span className="font-semibold">{record.totalCredits ?? "--"}</span>
                          </span>
                          <span>
                            Xep hang:{" "}
                            <span className="font-semibold">
                              {record.rank != null && record.totalStudents != null
                                ? `${record.rank}/${record.totalStudents}`
                                : "--"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mon hoc
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ma mon
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tin chi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Diem
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Xep loai
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Giao vien
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(record.subjects ?? []).map((subject, subjectIndex) => (
                            <tr key={subjectIndex} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{subject.name ?? "--"}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{subject.code ?? "--"}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{subject.credits ?? "--"}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-[#1e1e2f]">{subject.score ?? "--"}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(
                                    subject.grade
                                  )}`}
                                >
                                  {subject.grade ?? "--"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{subject.teacher ?? "--"}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Parent Information Tab */}
          {activeTab === "parent" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Thong tin phu huynh</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Ten phu huynh"
                  type="text"
                  value={isEditing ? formData.parentName ?? "" : studentData.parentName ?? ""}
                  onChange={(e) => handleInputChange("parentName", e.target.value)}
                  disabled={!isEditing}
                />

                <TextField
                  label="So dien thoai phu huynh"
                  type="tel"
                  value={isEditing ? formData.parentPhone ?? "" : studentData.parentPhone ?? ""}
                  onChange={(e) => handleInputChange("parentPhone", e.target.value)}
                  disabled={!isEditing}
                />

                <TextField
                  label="Email phu huynh"
                  type="email"
                  icon={<MailIcon />}
                  value={isEditing ? formData.parentEmail ?? "" : studentData.parentEmail ?? ""}
                  onChange={(e) => handleInputChange("parentEmail", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Luu y quan trong</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>- Thong tin phu huynh duoc su dung de lien lac trong truong hop khan cap</li>
                  <li>- Phu huynh se nhan duoc thong bao ve ket qua hoc tap va hoat dong cua hoc sinh</li>
                  <li>- Vui long cap nhat thong tin khi co thay doi</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
