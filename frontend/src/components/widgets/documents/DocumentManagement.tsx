"use client";

import { useState } from "react";
import { CustomButton } from "../../ui/CustomButton";
import { 
  FileText, 
  BookOpen, 
  FileCheck, 
  FolderOpen, 
  Star, 
  Search, 
  Tag, 
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  Plus
} from "lucide-react";

interface Document {
  id: string;
  title: string;
  content: string;
  category: 'note' | 'assignment' | 'reference' | 'project';
  course?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isFavorite: boolean;
}

// Mock data
const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Ghi chú Lập trình Python - Buổi 1",
    content: "Các khái niệm cơ bản về biến, kiểu dữ liệu...",
    category: 'note',
    course: "CS101",
    createdAt: "2024-09-01",
    updatedAt: "2024-09-15",
    tags: ["python", "programming", "basics"],
    isFavorite: true
  },
  {
    id: "2",
    title: "Bài tập Toán cao cấp - Chapter 1",
    content: "Giải các bài tập về ma trận và định thức...",
    category: 'assignment',
    course: "MATH201",
    createdAt: "2024-09-05",
    updatedAt: "2024-09-10",
    tags: ["math", "homework", "matrices"],
    isFavorite: false
  },
  {
    id: "3",
    title: "Tài liệu tham khảo - Data Structures",
    content: "Sách và tài liệu về cấu trúc dữ liệu...",
    category: 'reference',
    course: "CS101",
    createdAt: "2024-08-20",
    updatedAt: "2024-08-20",
    tags: ["reference", "data-structures"],
    isFavorite: true
  }
];

export const DocumentManagement = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [filter, setFilter] = useState<'all' | 'note' | 'assignment' | 'reference' | 'project'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'note': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assignment': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'reference': return 'bg-green-100 text-green-800 border-green-200';
      case 'project': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'note': return '📝 Ghi chú';
      case 'assignment': return '📋 Bài tập';
      case 'reference': return '📚 Tài liệu';
      case 'project': return '🎯 Dự án';
      default: return '';
    }
  };

  const toggleFavorite = (id: string) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc
      )
    );
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = filter === 'all' || doc.category === filter;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFavorite = !showFavorites || doc.isFavorite;
    return matchesFilter && matchesSearch && matchesFavorite;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý Tài liệu
            </h1>
            <p className="text-gray-600">Tổ chức và quản lý tài liệu học tập của bạn</p>
          </div>
          <CustomButton className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 shadow-md">
            <Plus className="w-4 h-4" />
            Tạo tài liệu mới
          </CustomButton>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Tổng tài liệu</p>
                <p className="text-3xl font-bold text-gray-900">
                  {documents.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">Ghi chú</p>
                <p className="text-3xl font-bold text-gray-900">
                  {documents.filter(d => d.category === 'note').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">Bài tập</p>
                <p className="text-3xl font-bold text-gray-900">
                  {documents.filter(d => d.category === 'assignment').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">Yêu thích</p>
                <p className="text-3xl font-bold text-gray-900">
                  {documents.filter(d => d.isFavorite).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tài liệu, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-800 bg-white"
                />
              </div>
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  showFavorites
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Star className="w-4 h-4" />
                Yêu thích
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilter('note')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  filter === 'note'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                Ghi chú
              </button>
              <button
                onClick={() => setFilter('assignment')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  filter === 'assignment'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                Bài tập
              </button>
              <button
                onClick={() => setFilter('reference')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  filter === 'reference'
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Tài liệu
              </button>
              <button
                onClick={() => setFilter('project')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  filter === 'project'
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                Dự án
              </button>
            </div>
          </div>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border border-slate-200">
              {/* Document Header */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(doc.category)}`}>
                    {getCategoryLabel(doc.category)}
                  </span>
                  <button
                    onClick={() => toggleFavorite(doc.id)}
                    className={`hover:scale-110 transition-transform ${doc.isFavorite ? 'text-rose-500' : 'text-slate-400'}`}
                  >
                    <Star className={`w-5 h-5 ${doc.isFavorite ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 line-clamp-2">
                  {doc.title}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-3">
                  {doc.content}
                </p>
              </div>

              {/* Document Info */}
              <div className="p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {doc.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="text-xs text-gray-500 mb-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Tạo: {new Date(doc.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Cập nhật: {new Date(doc.updatedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  {doc.course && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3 h-3" />
                      <span className="font-medium text-[#1e1e2f]">Khóa học: {doc.course}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <CustomButton
                    className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white text-sm flex items-center justify-center gap-2 shadow-md"
                  >
                    <Eye className="w-4 h-4" />
                    Mở
                  </CustomButton>
                  <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-2 bg-rose-100 hover:bg-rose-200 rounded-lg text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-violet-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">
              Không tìm thấy tài liệu nào
            </h3>
            <p className="text-slate-500 mb-4">
              Thử thay đổi bộ lọc hoặc tạo tài liệu mới
            </p>
            <CustomButton className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white flex items-center gap-2 mx-auto shadow-md">
              <Plus className="w-4 h-4" />
              Tạo tài liệu mới
            </CustomButton>
          </div>
        )}
      </div>
    </div>
  );
};