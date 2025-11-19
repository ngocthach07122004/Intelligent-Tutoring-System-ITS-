import React from 'react';

interface ServerIconProps {
  item: { id: string; name: string };
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const ServerIcon: React.FC<ServerIconProps> = ({ item, isSelected, onClick, children }) => (
  <button
    onClick={onClick}
    title={item.name}
    className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-blue-500 text-black hover:text-white transition-all duration-200 ease-in-out group"
  >
    <span
      className={`absolute left-0 -ml-2 h-0 w-1 bg-black rounded-r-full transition-all duration-200 ${
        isSelected ? 'h-10' : 'h-0 group-hover:h-5'
      }`}
    ></span>

    <div
      className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center transition-all duration-200 ${
        isSelected ? 'rounded-2xl' : 'group-hover:rounded-2xl'
      }`}
    >
      {children}
    </div>
  </button>
);
