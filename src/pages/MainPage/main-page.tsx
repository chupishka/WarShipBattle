import React from 'react';
import { usePlayer } from '../../context/player-context';
import '../../reset.css';
import GameBoard from '../GameBoard/game-board';
// import '../App.css';

const MainPage: React.FC = () => {
  const {playerData} = usePlayer();
  return (
    <div>
      <span className="player-name">{playerData.nickname}</span>
    </div>
  );
};

export default MainPage;
