import React, { createContext, useContext, useState} from 'react';
import type { ReactNode } from 'react';

const AVATARS_URL = [
  'photo_1_2026-03-02_22-06-32.jpg',
  'photo_2_2026-03-02_22-06-32.jpg',
  'photo_3_2026-03-02_22-06-32.jpg',
  'photo_4_2026-03-02_22-06-32.jpg',
  'photo_5_2026-03-02_22-06-32.jpg',
  'photo_6_2026-03-02_22-06-32.jpg',
  'photo_7_2026-03-02_22-06-32.jpg',
  'photo_8_2026-03-02_22-06-32.jpg',
  'photo_9_2026-03-02_22-06-32.jpg',
  'photo_10_2026-03-02_22-06-32.jpg'
];

interface PlayerData {
  nickname: string;
  photoIndex: number;
}

interface PlayerContextType {
  playerData: PlayerData;
  updatePlayer: (data: Partial<PlayerData>) => void;
  getAvatarUrl: (index?: number) => string;
}

const defaultPlayerData: PlayerData = {
  nickname: 'Гость',
  photoIndex: 0,
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playerData, setPlayerData] = useState<PlayerData>(defaultPlayerData);

  const updatePlayer = (data: Partial<PlayerData>) => {
    setPlayerData(prev => ({ ...prev, ...data }));
  };

  const getAvatarUrl = (index?: number) => {
    const idx = index ?? playerData.photoIndex;
    return `/img/avatars/${AVATARS_URL[idx]}`;
  };

  return (
    <PlayerContext.Provider value={{ playerData, updatePlayer, getAvatarUrl }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};