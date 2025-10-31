'use client';

import React, { useState } from 'react';
import { Home, Plus } from 'lucide-react';
import { ServerIcon } from './ui/ServerIcon';
// import { Server } from '../mock/servers';

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

interface ServerSidebarProps {
  servers: Server[];
  selectedServerId: string;
  onSelectServer: (id: string) => void;
}

export const ServerSidebar: React.FC<ServerSidebarProps> = ({
  servers,
  selectedServerId,
  onSelectServer,
}) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleCreateGroup = () => {
    setShowPopup(false);
    console.log('Tạo nhóm mới');
  };

  const handleJoinGroup = () => {
    setShowPopup(false);
    console.log('Tham gia nhóm có sẵn');
  };

  return (
    <>
      <div className="w-24 bg-gray-900 h-full flex flex-col items-center py-6 space-y-4 flex-shrink-0">
        <ServerIcon
          item={{ id: 'home', name: 'Tin nhắn trực tiếp' }}
          isSelected={selectedServerId === 'home'}
          onClick={() => onSelectServer('home')}
        >
          <Home size={24} />
        </ServerIcon>

        <div className="w-10 h-0.5 bg-gray-700 rounded-full" />

        {servers.map((server) => (
          <ServerIcon
            key={server.id}
            item={server}
            isSelected={selectedServerId === server.id}
            onClick={() => onSelectServer(server.id)}
          >
            <img
              src={server.imgUrl}
              alt={server.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://placehold.co/100x100/3b82f6/white?text=${server.name.charAt(0)}`;
              }}
            />
          </ServerIcon>
        ))}

        <button
          onClick={() => setShowPopup(true)}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 hover:bg-green-600 transition-colors duration-200 text-white text-2xl font-bold"
          title="Tạo nhóm chat mới"
        >
          <Plus size={26} />
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-96 text-center space-y-6">
            <h2 className="text-xl font-semibold text-white">Chào mừng bạn!</h2>
            <p className="text-gray-300">Bạn muốn làm gì tiếp theo?</p>

            <div className="flex flex-col space-y-4">
              <button
                onClick={handleCreateGroup}
                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium transition"
              >
                🆕 Tạo nhóm mới
              </button>
              <button
                onClick={handleJoinGroup}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
              >
                🔗 Tham gia nhóm có sẵn
              </button>
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="text-gray-400 hover:text-white text-sm mt-4"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </>
  );
};
