"use client";

import { useState, useRef } from "react";
import { CustomButton } from "../../ui/CustomButton";
import { FormMessageAlert } from "../../ui/FormMessageAlert";

interface AvatarUploadProps {
  currentAvatar: string;
  onAvatarChange: (newAvatarUrl: string) => void;
  maxSize?: number; // in MB
}

export const AvatarUpload = ({ 
  currentAvatar, 
  onAvatarChange, 
  maxSize = 2 
}: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string>(currentAvatar);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError("Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WebP");
      return;
    }

    // Validate file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      setError(`Kích thước file không được vượt quá ${maxSize}MB`);
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
      };
      reader.readAsDataURL(file);

      // Simulate upload to server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, upload to server and get URL
      const mockUploadUrl = URL.createObjectURL(file);
      
      onAvatarChange(mockUploadUrl);
      setSuccess("Cập nhật ảnh đại diện thành công!");
      
    } catch (err: any) {
      setError("Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.");
      setPreview(currentAvatar); // Revert to original
    }

    setUploading(false);
  };

  const handleRemoveAvatar = () => {
    const defaultAvatar = "/user.jpg"; // Default avatar path
    setPreview(defaultAvatar);
    onAvatarChange(defaultAvatar);
    setSuccess("Đã xóa ảnh đại diện");
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative">
        <img
          src={preview}
          alt="Avatar"
          className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-lg object-cover"
        />
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Upload Controls */}
      <div className="flex space-x-2">
        <CustomButton
          onClick={handleFileSelect}
          disabled={uploading}
          className="bg-[#1e1e2f] hover:bg-[#2a2a40] text-white transition-colors"
        >
          {uploading ? "Đang tải lên..." : "Chọn ảnh"}
        </CustomButton>
        
        {preview !== "/user.jpg" && (
          <CustomButton
            onClick={handleRemoveAvatar}
            disabled={uploading}
            className="bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Xóa ảnh
          </CustomButton>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* File Requirements */}
      <div className="text-xs text-gray-500 text-center max-w-xs">
        <p>Chấp nhận file JPG, PNG, WebP</p>
        <p>Kích thước tối đa: {maxSize}MB</p>
        <p>Kích thước đề xuất: 400x400px</p>
      </div>

      {/* Messages */}
      {error && <FormMessageAlert message={error} />}
      {success && <FormMessageAlert message={success} success={true} />}
    </div>
  );
};