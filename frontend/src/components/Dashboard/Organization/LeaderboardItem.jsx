import React from 'react';
import { Avatar, AvatarFallback } from '../../ui/avatar';

const LeaderboardItem = ({ rank, name, score }) => {
  const getRankColor = () => {
    switch (rank) {
      case 1:
        return 'bg-leaderboard-rank1 text-black';
      case 2:
        return 'bg-leaderboard-rank4 text-white';
      case 3:
        return 'bg-leaderboard-rank3 text-white';
      default:
        return 'bg-gray-300 text-black';
    }
  };

  // Use the first letter of the name as the avatar fallback
  const nameInitial = name.charAt(0).toUpperCase();;

  return (
    <div className="relative">
      <div className="flex items-center bg-leaderboard-item rounded-full p-3 shadow-md group overflow-hidden">
        {/* Rank circle with pulse effect for rank 1 */}
        <div className={`${getRankColor()} w-16 h-16 rounded-full flex items-center justify-center text-4xl font-bold mr-4 transform transition-all duration-300 ${rank === 1 ? 'animate-pulse-subtle' : ''}`}>
          {rank}
        </div>
        
        {/* Avatar */}
        <Avatar className="bg-orange-200 w-12 h-12 mr-4">
          <AvatarFallback className="bg-orange-300 text-white text-xl font-bold">
            {nameInitial}
          </AvatarFallback>
        </Avatar>
        
        {/* Name */}
        <div className="text-white text-3xl font-game tracking-wide uppercase flex-grow">
          {name}
        </div>
        
        {/* Score with shine effect */}
        <div className="bg-leaderboard-score px-5 py-3 rounded-full flex items-center group-hover:bg-yellow-500/40 transition-all duration-300">
          <div className="bg-yellow-300 w-6 h-6 rounded-full mr-3 animate-shine"></div>
          <span className="text-white text-2xl font-bold">${score.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardItem;
