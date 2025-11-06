'use client';

import React, { useState } from 'react';
import { ServerSidebar } from './components/ServerSidebar';
import DirectMessagesList from './components/DirectMessagesList';
import ChatWindow from './components/ChatWindow';
import ServerChannelSidebar from './components/ServerChannelSidebar';
import { Home, Send, Plus, X } from 'lucide-react';

interface Server {
  id: string;
  name: string;
  imgUrl: string;
}

const mockServers: Server[] = [
  { id: 's1', name: 'Trường XYZ', imgUrl: 'https://placehold.co/100x100/7c3aed/white?text=T&font=inter' },
  { id: 's2', name: 'Trường XYZ', imgUrl: 'https://placehold.co/100x100/7c3aed/white?text=T&font=inter' },
  { id: 's3', name: 'Trường XYZ', imgUrl: 'https://placehold.co/100x100/7c3aed/white?text=T&font=inter' },
  { id: 's4', name: 'CLB Lập Trình', imgUrl: 'https://placehold.co/100x100/f59e0b/white?text=C&font=inter' },
];

const mockChannels: Record<string, { id: string; name: string }[]> = {
  s1: [
    { id: 'c1', name: 'general' },
    { id: 'c2', name: 'code-review' },
    { id: 'c3', name: 'random' },
  ],
  s2: [
    { id: 'c1', name: 'chat-chung' },
    { id: 'c2', name: 'chia-se-tai-lieu' },
  ],
};

export default function App() {
  const [selectedServerId, setSelectedServerId] = useState<string>('home');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const handleSelectServer = (serverId: string) => {
    setSelectedServerId(serverId);
    setSelectedChatId(null);
    setSelectedChannelId(null);
    setIsMobileChatOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsMobileChatOpen(true); // ✅ ẩn sidebar, chỉ hiện chat window
  };

  const handleSelectChannel = (channelId: string) => {
    setSelectedChannelId(channelId);
    setIsMobileChatOpen(true); // ✅ ẩn sidebar, chỉ hiện chat window
  };

  const handleBack = () => {
    // ✅ Quay lại sidebar khi nhấn nút Back trong ChatWindow (mobile)
    setIsMobileChatOpen(false);
    setSelectedChatId(null);
    setSelectedChannelId(null);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full bg-gray-900 text-gray-100 font-sans overflow-hidden mt-16">
      <div className={`${isMobileChatOpen ? 'hidden' : 'block'} md:block`}>
        <ServerSidebar
          servers={mockServers}
          selectedServerId={selectedServerId}
          onSelectServer={handleSelectServer}
        />
      </div>

      {/* Khi chọn Home */}
      {/* Khi chọn Home */}
      {selectedServerId === 'home' ? (
        <div className="flex flex-1">
          <div className={`${isMobileChatOpen ? 'hidden' : 'block'} md:block w-full md:w-72`}>
            <DirectMessagesList
              selectedChatId={selectedChatId}
              onSelectChat={handleSelectChat}
            />
          </div>
          <div className={`${isMobileChatOpen ? 'flex' : 'hidden'} md:flex flex-1`}>
            {selectedChatId ? (
              <ChatWindow
                chatId={selectedChatId}
                chatType="direct"
                onBack={handleBack}
              />
            ) : (
              <div className="flex-1 bg-gray-700 flex items-center justify-center text-gray-400">
                Chọn một người để bắt đầu trò chuyện 💬
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-1">
          <div className={`${isMobileChatOpen ? 'hidden' : 'block'} md:block w-full md:w-72`}>
            <ServerChannelSidebar
              serverName={mockServers.find(s => s.id === selectedServerId)?.name || ''}
              channels={mockChannels[selectedServerId] || []}
              selectedChannelId={selectedChannelId}
              onSelectChannel={handleSelectChannel}
            />
          </div>
          <div className={`${isMobileChatOpen ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
            {selectedChannelId ? (
              <ChatWindow
                chatId={selectedChannelId}
                chatType="channel"
                chatName={mockChannels[selectedServerId].find(c => c.id === selectedChannelId)?.name}
                onBack={handleBack}
              />
            ) : (
              <div className="flex-1 bg-gray-700 flex items-center justify-center text-gray-400">
                Chọn một kênh để bắt đầu 💬
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
