'use client';

import { useState } from 'react';
import { ArrowLeft, Send, Hash } from 'lucide-react';
// import { mockDirectChats } from '../mock/directChats';

interface Message {
  sender: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  time: string;
}

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

interface ChatWindowProps {
  chatId: string | null;
  chatType?: 'direct' | 'channel';
  chatName?: string;
  onBack: () => void;
}

export default function ChatWindow({ chatId, chatType, chatName, onBack }: ChatWindowProps) {
  if (!chatId) return null;

  const chat =
    chatType === 'direct'
      ? mockDirectChats.find((c) => c.id === chatId)
      : null;

  const now = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      senderName: chatType === 'channel' ? 'System' : chat?.name || 'Bot',
      senderAvatar:
        chatType === 'channel'
          ? 'https://placehold.co/40x40/4b5563/ffffff?text=S'
          : chat?.avatar,
      text:
        chatType === 'channel'
          ? `👋 Chào mừng bạn đến kênh #${chatName}!`
          : `Xin chào, tôi là ${chat?.name}!`,
      time: now(),
    },
    {
      sender: 'me',
      senderName: 'Bạn',
      senderAvatar:
        'https://placehold.co/40x40/3b82f6/ffffff?text=U', // avatar tạm
      text: 'Cảm ơn! Rất vui được tham gia.',
      time: now(),
    }
  ]);

  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([
      ...messages,
      {
        sender: 'me',
        senderName: 'Bạn',
        senderAvatar:
          'https://placehold.co/40x40/3b82f6/ffffff?text=U', // avatar tạm
        text: message,
        time: now(),
      },
    ]);
    setMessage('');
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-300 bg-white ">
        <button
          onClick={onBack}
          className="md:hidden mr-3 text-gray-300 hover:text-white transition"
        >
          <ArrowLeft size={22} />
        </button>
        {chatType === 'direct' ? (
          // 🧍 Chat cá nhân
          <div className="flex items-center space-x-2 py-1 transform translate-y-[3px]">
            <img
              src={chat?.avatar}
              alt={chat?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <h2 className="text-lg font-semibold">{chat?.name}</h2>
          </div>
        ) : (
          // 💬 Chat nhóm (kênh)
          <div className="flex items-center space-x-2 py-1 transform translate-y-[3px]">
            <Hash size={20} className="text-black" />
            <h2 className="text-lg font-semibold text-black">{chatName}</h2>
          </div>
        )}
      </div>

      {/* Nội dung chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="flex items-start space-x-3">
            <img
              src={msg.senderAvatar}
              alt={msg.senderName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col max-w-[75%]">
              <div className="flex items-baseline space-x-2">
                <span className="font-semibold text-black">{msg.senderName}</span>
                <span className="text-xs text-black">{msg.time}</span>
              </div>
              <p className="text-black leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Nhập tin nhắn */}
      <div className="p-3 border-t border-gray-300 flex items-center space-x-2 bg-white">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập tin nhắn..."
          className="flex-1 bg-white p-2 rounded-md outline-none text-black"
        />
        <button
          onClick={handleSend}
          className="p-2 rounded-md bg-blue-600 hover:bg-blue-500 transition"
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  );
}
