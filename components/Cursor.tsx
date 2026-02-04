
import React from 'react';
import { CursorPosition, User } from '../types';

interface CursorProps {
  cursor: CursorPosition;
  user: User;
}

const Cursor: React.FC<CursorProps> = ({ cursor, user }) => {
  return (
    <div 
      className="absolute pointer-events-none z-50 transition-all duration-75 ease-out"
      style={{ left: cursor.x, top: cursor.y }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={user.color}
          stroke="white"
          strokeWidth="1.5"
        />
      </svg>
      <div 
        className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-md border border-white/20 whitespace-nowrap"
        style={{ backgroundColor: user.color }}
      >
        {user.username}
      </div>
    </div>
  );
};

export default Cursor;
