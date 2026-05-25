import React from 'react';
import { usePlayer } from '../../context/player-context';
import '../../reset.css';
import GameBoard from '../GameBoard/game-board';
// import '../App.css';

const MainPage: React.FC = () => {
  const {playerData} = usePlayer();
  return (
  <div className="main-page">
    <video
      className="bg-video"
      autoPlay
      loop
      muted
      playsInline
      src="/2026-05-18 21-54-39.mp4"   // файл в public/bg-video.mp4
    />
    {/* <div className="bg-overlay" /> */}
    
    
  </div>
);
};

export default MainPage;
