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
  Plus,
  ArrowLeft,
  Download,
  Share2,
  X
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
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    content: '',
    category: 'note' as 'note' | 'assignment' | 'reference' | 'project',
    course: '',
    tags: [] as string[],
    tagInput: ''
  });

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
          <CustomButton 
            onClick={() => setShowCreateModal(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 shadow-md"
          >
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
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilter('note')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  filter === 'note'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                Ghi chú
              </button>
              <button
                onClick={() => setFilter('assignment')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  filter === 'assignment'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                Bài tập
              </button>
              <button
                onClick={() => setFilter('reference')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  filter === 'reference'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Tài liệu
              </button>
              <button
                onClick={() => setFilter('project')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  filter === 'project'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            <div key={doc.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-200">
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {doc.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
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
                    onClick={() => setSelectedDocument(doc)}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm flex items-center justify-center gap-2 shadow-md"
                  >
                    <Eye className="w-4 h-4" />
                    Mở
                  </CustomButton>
                  <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy tài liệu nào
            </h3>
            <p className="text-gray-600 mb-4">
              Thử thay đổi bộ lọc hoặc tạo tài liệu mới
            </p>
            <CustomButton 
              onClick={() => setShowCreateModal(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 mx-auto shadow-md"
            >
              <Plus className="w-4 h-4" />
              Tạo tài liệu mới
            </CustomButton>
          </div>
        )}
      </div>

      {/* Document Detail View - Full Page */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6">
            {/* Header with Back Button */}
            <div className="mb-6">
              <button
                onClick={() => setSelectedDocument(null)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium mb-4 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Quay lại
              </button>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(selectedDocument.category)}`}>
                        {getCategoryLabel(selectedDocument.category)}
                      </span>
                      <button
                        onClick={() => toggleFavorite(selectedDocument.id)}
                        className={`hover:scale-110 transition-transform ${
                          selectedDocument.isFavorite ? 'text-rose-500' : 'text-gray-400'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${
                          selectedDocument.isFavorite ? 'fill-rose-500' : ''
                        }`} />
                      </button>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedDocument.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Tạo: {new Date(selectedDocument.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Cập nhật: {new Date(selectedDocument.updatedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      {selectedDocument.course && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span className="font-medium text-gray-900">Khóa học: {selectedDocument.course}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium flex items-center gap-2 transition-colors">
                      <Download className="w-4 h-4" />
                      Tải xuống
                    </button>
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium flex items-center gap-2 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Chia sẻ
                    </button>
                    <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg text-white font-medium flex items-center gap-2 transition-colors">
                      <Edit className="w-4 h-4" />
                      Chỉnh sửa
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedDocument.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full flex items-center gap-1 font-medium"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Nội dung</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedDocument.content}
                </p>
              </div>
            </div>

            {/* Additional Sections based on Category */}
            {selectedDocument.category === 'assignment' && (
              <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin bài tập</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Hạn nộp</p>
                    <p className="text-lg font-semibold text-gray-900">15/11/2024</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                    <p className="text-lg font-semibold text-gray-900">Đã nộp</p>
                  </div>
                </div>
              </div>
            )}

            {selectedDocument.category === 'project' && (
              <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Chi tiết dự án</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Thời gian</p>
                    <p className="text-lg font-semibold text-gray-900">4 tuần</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Thành viên</p>
                    <p className="text-lg font-semibold text-gray-900">5 người</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Document Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">Tạo tài liệu mới</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewDocument({
                    title: '',
                    content: '',
                    category: 'note',
                    course: '',
                    tags: [],
                    tagInput: ''
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newDocument.title}
                  onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                  placeholder="Nhập tiêu đề tài liệu..."
                  className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Loại tài liệu <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => setNewDocument({ ...newDocument, category: 'note' })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      newDocument.category === 'note'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FileText className="w-5 h-5 mx-auto mb-1 text-gray-700" />
                    <span className="text-sm font-medium text-gray-900">Ghi chú</span>
                  </button>
                  <button
                    onClick={() => setNewDocument({ ...newDocument, category: 'assignment' })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      newDocument.category === 'assignment'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FileCheck className="w-5 h-5 mx-auto mb-1 text-gray-700" />
                    <span className="text-sm font-medium text-gray-900">Bài tập</span>
                  </button>
                  <button
                    onClick={() => setNewDocument({ ...newDocument, category: 'reference' })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      newDocument.category === 'reference'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <BookOpen className="w-5 h-5 mx-auto mb-1 text-gray-700" />
                    <span className="text-sm font-medium text-gray-900">Tài liệu</span>
                  </button>
                  <button
                    onClick={() => setNewDocument({ ...newDocument, category: 'project' })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      newDocument.category === 'project'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FolderOpen className="w-5 h-5 mx-auto mb-1 text-gray-700" />
                    <span className="text-sm font-medium text-gray-900">Dự án</span>
                  </button>
                </div>
              </div>

              {/* Course */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Khóa học (tùy chọn)
                </label>
                <input
                  type="text"
                  value={newDocument.course}
                  onChange={(e) => setNewDocument({ ...newDocument, course: e.target.value })}
                  placeholder="Ví dụ: CS101, MATH201..."
                  className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newDocument.content}
                  onChange={(e) => setNewDocument({ ...newDocument, content: e.target.value })}
                  placeholder="Nhập nội dung tài liệu..."
                  rows={8}
                  className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newDocument.tagInput}
                    onChange={(e) => setNewDocument({ ...newDocument, tagInput: e.target.value })}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newDocument.tagInput.trim()) {
                        e.preventDefault();
                        if (!newDocument.tags.includes(newDocument.tagInput.trim())) {
                          setNewDocument({
                            ...newDocument,
                            tags: [...newDocument.tags, newDocument.tagInput.trim()],
                            tagInput: ''
                          });
                        }
                      }
                    }}
                    placeholder="Nhập tag và nhấn Enter..."
                    className="flex-1 px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <button
                    onClick={() => {
                      if (newDocument.tagInput.trim() && !newDocument.tags.includes(newDocument.tagInput.trim())) {
                        setNewDocument({
                          ...newDocument,
                          tags: [...newDocument.tags, newDocument.tagInput.trim()],
                          tagInput: ''
                        });
                      }
                    }}
                    className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 rounded-lg font-medium text-white transition-colors"
                  >
                    Thêm
                  </button>
                </div>
                {newDocument.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newDocument.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full flex items-center gap-2"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          onClick={() => {
                            setNewDocument({
                              ...newDocument,
                              tags: newDocument.tags.filter((_, i) => i !== index)
                            });
                          }}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewDocument({
                    title: '',
                    content: '',
                    category: 'note',
                    course: '',
                    tags: [],
                    tagInput: ''
                  });
                }}
                className="flex-1 px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (newDocument.title.trim() && newDocument.content.trim()) {
                    const newDoc: Document = {
                      id: Date.now().toString(),
                      title: newDocument.title,
                      content: newDocument.content,
                      category: newDocument.category,
                      course: newDocument.course || undefined,
                      createdAt: new Date().toISOString().split('T')[0],
                      updatedAt: new Date().toISOString().split('T')[0],
                      tags: newDocument.tags,
                      isFavorite: false
                    };
                    setDocuments([newDoc, ...documents]);
                    setShowCreateModal(false);
                    setNewDocument({
                      title: '',
                      content: '',
                      category: 'note',
                      course: '',
                      tags: [],
                      tagInput: ''
                    });
                  }
                }}
                disabled={!newDocument.title.trim() || !newDocument.content.trim()}
                className="flex-1 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-colors"
              >
                Tạo tài liệu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};