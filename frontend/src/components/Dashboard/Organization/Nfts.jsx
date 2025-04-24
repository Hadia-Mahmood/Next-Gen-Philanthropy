
import React from 'react';
import Leaderboard from './Leaderboard';
const Nfts = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-white p-4">
      <div className="w-full max-w-4xl animate-fade-in">
        <Leaderboard />
      </div>
    </div>
  );
};

export default Nfts;