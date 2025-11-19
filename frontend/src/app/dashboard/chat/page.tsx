'use client';

import React, { useState } from 'react';
import { ServerSidebar } from '@/components/widgets/chat/ServerSidebar';
import DirectMessagesList from '@/components/widgets/chat/DirectMessagesList';
import ChatWindow from '@/components/widgets/chat/ChatWindow';
import ServerChannelSidebar from '@/components/widgets/chat/ServerChannelSidebar';

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

  const handleSelectServer = (serverId: string) => {
    setSelectedServerId(serverId);
    setSelectedChatId(null);
    setSelectedChannelId(null);
  };

  return (
    <div className="flex min-h-screen w-full bg-white text-black font-sans overflow-hidden">
      <ServerSidebar
        servers={mockServers}
        selectedServerId={selectedServerId}
        onSelectServer={handleSelectServer}
      />

      {/* Khi chọn Home */}
      {selectedServerId === 'home' ? (
        <div className="flex flex-1">
          <DirectMessagesList
            selectedChatId={selectedChatId}
            onSelectChat={setSelectedChatId}
          />
          {selectedChatId ? (
            <ChatWindow chatId={selectedChatId} chatType="direct" onBack={() => setSelectedChatId(null)} />
          ) : (
            <div className="flex-1 bg-white flex items-center justify-center text-gray-400">
              Chọn một người để bắt đầu trò chuyện 💬
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1">
          {/* Sidebar kênh */}
          <ServerChannelSidebar
            serverName={mockServers.find(s => s.id === selectedServerId)?.name || ''}
            channels={mockChannels[selectedServerId] || []}
            selectedChannelId={selectedChannelId}
            onSelectChannel={setSelectedChannelId}
          />

          {/* Nội dung kênh */}
          <div className="flex-1 flex flex-col">
            {selectedChannelId ? (
              <ChatWindow
                chatId={selectedChannelId}
                chatType="channel"
                chatName={mockChannels[selectedServerId].find(c => c.id === selectedChannelId)?.name}
                onBack={() => setSelectedChannelId(null)}
              />
            ) : (
              <div className="flex-1 bg-white flex items-center justify-center text-gray-400">
                Chọn một kênh để bắt đầu 💬
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
