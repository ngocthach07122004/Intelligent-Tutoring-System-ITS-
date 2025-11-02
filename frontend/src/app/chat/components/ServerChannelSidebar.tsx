import { Hash, Plus } from 'lucide-react';

interface ServerChannelSidebarProps {
  serverName: string;
  channels: { id: string; name: string }[];
  selectedChannelId: string | null;
  onSelectChannel: (id: string) => void;
}

export default function ServerChannelSidebar({
  serverName,
  channels,
  selectedChannelId,
  onSelectChannel,
}: ServerChannelSidebarProps) {
  return (
    <div className="w-72 bg-gray-800 border-r border-gray-700 px-4 py-6 flex flex-col">
      {/* Tiêu đề server */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4 -mx-4 px-4">
        <h2 className="text-lg font-semibold text-white truncate px-1">{serverName}</h2>
        <button
          onClick={() => console.log('Thêm kênh mới')}
          className="text-gray-400 hover:text-white transition"
          title="Thêm kênh mới"
        >
          <Plus size={18} />
        </button>
      </div>



      {/* Danh sách kênh */}
      <div className="space-y-1 flex-1 overflow-y-auto">
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => onSelectChannel(ch.id)}
            className={`w-full flex items-center gap-2 px-1 py-2 rounded-md text-sm font-medium transition ${selectedChannelId === ch.id
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
          >
            <Hash size={16} /> {ch.name}
          </button>
        ))}
      </div>
    </div>
  );
}
