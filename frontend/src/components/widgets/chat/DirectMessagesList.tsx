'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
// import { mockDirectChats } from '../mock/directChats';

interface DirectChat {
  id: string;
  name: string;
  avatar: string;
  role: 'Giáo viên' | 'Học sinh';
}

const mockDirectChats: DirectChat[] = [
  { id: 'dm1', name: 'Cô Lan', avatar: 'https://placehold.co/50x50/f43f5e/white?text=L', role: 'Giáo viên' },
  { id: 'dm2', name: 'Thầy Minh', avatar: 'https://placehold.co/50x50/3b82f6/white?text=M', role: 'Giáo viên' },
  { id: 'dm3', name: 'Bạn Huy', avatar: 'https://placehold.co/50x50/22c55e/white?text=H', role: 'Học sinh' },
];

interface DirectMessagesListProps {
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
}

export default function DirectMessagesList({
  selectedChatId,
  onSelectChat,
}: DirectMessagesListProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [friendName, setFriendName] = useState('');

  return (
    <div className="w-72 bg-gray-100 border-r border-gray-700 p-4 py-6 overflow-y-auto relative">
      {/* Header + Nút cộng */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-gray-500 font-semibold">💬 Trò chuyện trực tiếp</h2>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="p-1.5 rounded-full bg-white transition"
          title="Thêm bạn mới"
        >
          <Plus size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Danh sách chat */}
      <div className="space-y-2">
        {mockDirectChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full text-left p-2 rounded-lg transition ${selectedChatId === chat.id
                ? 'bg-gray-300 text-black'
                : 'hover:bg-gray-200 text-gray-500'
              }`}
          >
            <div className="flex items-center space-x-2">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{chat.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Popup kết bạn */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-gray-800 rounded-2xl shadow-xl w-[380px] p-6 text-white relative">
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-semibold mb-3 text-center">
              Kết bạn để chat 💬
            </h3>
            <p className="text-sm text-gray-400 text-center mb-4">
              Nhập tên người dùng hoặc email để gửi lời mời trò chuyện.
            </p>

            <input
              type="text"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              placeholder="Ví dụ: nguyenvinh#1234 hoặc email@example.com"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />

            <button
              onClick={() => {
                if (friendName.trim()) {
                  alert(`Đã gửi lời mời chat đến ${friendName}!`);
                  setFriendName('');
                  setIsPopupOpen(false);
                }
              }}
              //   disabled={!friendName.trim()}

              className={`w-full mt-5 py-2 rounded-lg font-medium transition-colors ${friendName.trim()
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
            >
              Gửi lời mời
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
