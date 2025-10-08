"use client";

import { useState } from "react";
import { CustomButton } from "../../ui/CustomButton";
import { TextField } from "../../blocks/TextField";
import { FormMessageAlert } from "../../ui/FormMessageAlert";
import { MailIcon, InfoIcon, CalendarIcon } from "../../icons";

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  phone: string;
  dateOfBirth: string;
  address: string;
  bio: string;
  avatar: string;
  department?: string;
  studentId?: string;
  teacherId?: string;
  joinDate: string;
}

export const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Mock data - thay thế bằng data thực từ API
  const [userData, setUserData] = useState<UserProfileData>({
    id: "U001",
    name: "Nguyễn Văn An",
    email: "nguyenvanan@example.com",
    role: "student",
    phone: "0123456789",
    dateOfBirth: "1995-05-15",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    bio: "Sinh viên năm 3 chuyên ngành Công nghệ thông tin. Yêu thích lập trình và học hỏi các công nghệ mới.",
    avatar: "/user.jpg",
    department: "Công nghệ thông tin",
    studentId: "SV2021001",
    joinDate: "2021-09-01"
  });

  const [formData, setFormData] = useState(userData);

  const handleInputChange = (field: keyof UserProfileData, value: string) => {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUserData(formData);
      setIsEditing(false);
      setSuccess("Cập nhật thông tin thành công!");
    } catch (err: any) {
      setError("Có lỗi xảy ra khi cập nhật thông tin.");
    }
    
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'student': return 'Học sinh/Sinh viên';
      case 'teacher': return 'Giáo viên/Giảng viên'; 
      case 'admin': return 'Quản trị viên';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'teacher': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#1e1e2f] to-[#2a2a40] px-6 py-8 text-white">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={formData.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {isEditing && (
                <CustomButton
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm"
                  onClick={() => console.log("Upload avatar")}
                >
                  ✏️
                </CustomButton>
              )}
            </div>
            
            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(userData.role)}`}>
                  {getRoleText(userData.role)}
                </span>
                {userData.studentId && (
                  <span className="text-blue-200">Mã SV: {userData.studentId}</span>
                )}
                {userData.teacherId && (
                  <span className="text-green-200">Mã GV: {userData.teacherId}</span>
                )}
              </div>
              <p className="text-gray-200 mt-1">{userData.department}</p>
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

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Thông tin cá nhân</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Họ và tên */}
          <TextField
            label="Họ và tên"
            type="text"
            value={isEditing ? formData.name : userData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={!isEditing}
            validRules={[
              { rule: /.+/, message: "Họ tên là bắt buộc" },
            ]}
          />

          {/* Email */}
          <TextField
            label="Email"
            type="email"
            icon={<MailIcon />}
            value={isEditing ? formData.email : userData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={!isEditing}
            validRules={[
              { rule: /.+/, message: "Email là bắt buộc" },
              { rule: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email không hợp lệ" },
            ]}
          />

          {/* Số điện thoại */}
          <TextField
            label="Số điện thoại"
            type="tel"
            value={isEditing ? formData.phone : userData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={!isEditing}
            validRules={[
              { rule: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" },
            ]}
          />

          {/* Ngày sinh */}
          <TextField
            label="Ngày sinh"
            type="date"
            icon={<CalendarIcon />}
            value={isEditing ? formData.dateOfBirth : userData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        {/* Địa chỉ */}
        <div className="mt-6">
          <TextField
            label="Địa chỉ"
            type="text"
            value={isEditing ? formData.address : userData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        {/* Giới thiệu bản thân */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giới thiệu bản thân
          </label>
          <textarea
            rows={4}
            value={isEditing ? formData.bio : userData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1e1e2f] focus:border-transparent resize-none ${
              !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
            }`}
            placeholder="Viết một vài dòng giới thiệu về bản thân..."
          />
        </div>

        {/* Thông tin khóa học và lớp học */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin học tập</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800">Khóa học đã tham gia</h4>
              <p className="text-2xl font-bold text-blue-600 mt-1">12</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800">Khóa học hoàn thành</h4>
              <p className="text-2xl font-bold text-green-600 mt-1">8</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800">Điểm trung bình</h4>
              <p className="text-2xl font-bold text-purple-600 mt-1">8.5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};