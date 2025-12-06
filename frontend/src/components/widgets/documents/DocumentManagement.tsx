"use client";

import { useState, useEffect } from "react";
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
import { assessmentServiceApi } from "@/lib/BE-library/assessment-service-api";
import {
  DocumentResponse,
  DocumentCategory,
  DocumentStatisticsResponse
} from "@/lib/BE-library/assessment-service-interfaces";

// Helper to map category to label
const getCategoryLabel = (category?: DocumentCategory) => {
  switch (category) {
    case 'NOTE': return '📝 Ghi chú';
    case 'ASSIGNMENT': return '📋 Bài tập';
    case 'REFERENCE': return '📚 Tài liệu';
    case 'PROJECT': return '🎯 Dự án';
    default: return '📄 Tài liệu';
  }
};

const getCategoryColor = (category?: DocumentCategory) => {
  switch (category) {
    case 'NOTE': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'ASSIGNMENT': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'REFERENCE': return 'bg-green-100 text-green-800 border-green-200';
    case 'PROJECT': return 'bg-purple-100 text-purple-800 border-purple-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const DocumentManagement = () => {
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [stats, setStats] = useState<DocumentStatisticsResponse | null>(null);
  const [filter, setFilter] = useState<DocumentCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentResponse | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newDocument, setNewDocument] = useState({
    title: '',
    content: '',
    category: 'NOTE' as DocumentCategory,
    course: '',
    tags: [] as string[],
    tagInput: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [docsRes, statsRes] = await Promise.all([
        assessmentServiceApi.listDocuments({
          category: filter !== 'ALL' ? filter : undefined,
          isFavorite: showFavorites ? true : undefined,
          q: searchTerm || undefined
        }),
        assessmentServiceApi.getDocumentStats()
      ]);

      if (docsRes.success && docsRes.data) {
        setDocuments(docsRes.data);
      }
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, showFavorites, searchTerm]); // Debounce search in real app

  const handleCreateDocument = async () => {
    if (!newDocument.title.trim() || !newDocument.content.trim()) return;

    try {
      const res = await assessmentServiceApi.createDocument({
        title: newDocument.title,
        content: newDocument.content,
        category: newDocument.category,
        course: newDocument.course || undefined,
        tags: newDocument.tags
      });

      if (res.success) {
        setShowCreateModal(false);
        setNewDocument({
          title: '',
          content: '',
          category: 'NOTE',
          course: '',
          tags: [],
          tagInput: ''
        });
        fetchData(); // Refresh list
      }
    } catch (error) {
      console.error("Failed to create document", error);
    }
  };

  const toggleFavorite = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc
      )
    );

    if (selectedDocument?.id === id) {
      setSelectedDocument(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }

    try {
      await assessmentServiceApi.toggleFavorite(id, { isFavorite: !currentStatus });
      fetchData(); // Sync with server
    } catch (error) {
      console.error("Failed to toggle favorite", error);
      fetchData(); // Revert on error
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) return;

    try {
      const res = await assessmentServiceApi.deleteDocument(id);
      if (res.success) {
        if (selectedDocument?.id === id) setSelectedDocument(null);
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete document", error);
    }
  };

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
                  {stats?.totalDocuments || 0}
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
                  {stats?.notesCount || 0}
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
                  {stats?.assignmentsCount || 0}
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
                  {stats?.favoritesCount || 0}
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
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${showFavorites
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
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${filter === 'ALL'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilter('NOTE')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${filter === 'NOTE'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <FileText className="w-4 h-4" />
                Ghi chú
              </button>
              <button
                onClick={() => setFilter('ASSIGNMENT')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${filter === 'ASSIGNMENT'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <FileCheck className="w-4 h-4" />
                Bài tập
              </button>
              <button
                onClick={() => setFilter('REFERENCE')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${filter === 'REFERENCE'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <BookOpen className="w-4 h-4" />
                Tài liệu
              </button>
              <button
                onClick={() => setFilter('PROJECT')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${filter === 'PROJECT'
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
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-200">
              {/* Document Header */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(doc.category)}`}>
                    {getCategoryLabel(doc.category)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(doc.id!, !!doc.isFavorite);
                    }}
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
                  {doc.tags?.map((tag, index) => (
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
                    <span>Tạo: {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Cập nhật: {doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (doc.id) handleDeleteDocument(doc.id);
                    }}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {documents.length === 0 && !isLoading && (
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
                        onClick={() => toggleFavorite(selectedDocument.id!, !!selectedDocument.isFavorite)}
                        className={`hover:scale-110 transition-transform ${selectedDocument.isFavorite ? 'text-rose-500' : 'text-gray-400'
                          }`}
                      >
                        <Star className={`w-5 h-5 ${selectedDocument.isFavorite ? 'fill-rose-500' : ''
                          }`} />
                      </button>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedDocument.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Tạo: {selectedDocument.createdAt ? new Date(selectedDocument.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Cập nhật: {selectedDocument.updatedAt ? new Date(selectedDocument.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
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
                  {selectedDocument.tags?.map((tag, index) => (
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
            {selectedDocument.category === 'ASSIGNMENT' && (
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

            {selectedDocument.category === 'PROJECT' && (
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
                    category: 'NOTE',
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
                    onClick={() => setNewDocument({ ...newDocument, category: 'NOTE' })}
                    className={`p-3 rounded-lg border-2 transition-all ${newDocument.category === 'NOTE'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <FileText className="w-5 h-5 mx-auto mb-1 text-gray-700" />
                    <span className="text-sm font-medium text-gray-900">Ghi chú</span>
                  </button>
                  <button
                    onClick={() => setNewDocument({ ...newDocument, category: 'ASSIGNMENT' })}
                    className={`p-3 rounded-lg border-2 transition-all ${newDocument.category === 'ASSIGNMENT'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <FileCheck className="w-5 h-5 mx-auto mb-1 text-gray-700" />
                    <span className="text-sm font-medium text-gray-900">Bài tập</span>
                  </button>
                  <button
                    onClick={() => setNewDocument({ ...newDocument, category: 'REFERENCE' })}
                    className={`p-3 rounded-lg border-2 transition-all ${newDocument.category === 'REFERENCE'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <BookOpen className="w-5 h-5 mx-auto mb-1 text-gray-700" />
                    <span className="text-sm font-medium text-gray-900">Tài liệu</span>
                  </button>
                  <button
                    onClick={() => setNewDocument({ ...newDocument, category: 'PROJECT' })}
                    className={`p-3 rounded-lg border-2 transition-all ${newDocument.category === 'PROJECT'
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
                    category: 'NOTE',
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
                onClick={handleCreateDocument}
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