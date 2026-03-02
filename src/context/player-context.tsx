import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
// Типы
interface PlayerData {
  avatar: number;
  nickname: string;
}

interface PlayerContextType {
  playerData: PlayerData;
  updatePlayer: (data: Partial<PlayerData>) => void;
  isLoaded: boolean;
}

// Начальные значения
const DEFAULT_PLAYER: PlayerData = {
  avatar: 0,
  nickname: 'player',
};

// Создаём контекст
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Провайдер
export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playerData, setPlayerData] = useState<PlayerData>(DEFAULT_PLAYER);
  const [isLoaded, setIsLoaded] = useState(false);

  // Загрузка из localStorage при старте
  useEffect(() => {
    const saved = localStorage.getItem('playerData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPlayerData({
          avatar: parsed.avatar ?? DEFAULT_PLAYER.avatar,
          nickname: parsed.nickname ?? DEFAULT_PLAYER.nickname,
        });
      } catch (e) {
        console.error('Ошибка загрузки playerData:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Сохранение в localStorage при изменении
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('playerData', JSON.stringify(playerData));
    }
  }, [playerData, isLoaded]);

  const updatePlayer = (data: Partial<PlayerData>) => {
    setPlayerData(prev => ({ ...prev, ...data }));
  };

  return (
    <PlayerContext.Provider value={{ playerData, updatePlayer, isLoaded }}>
      {children}
    </PlayerContext.Provider>
  );
};

// Хук для использования
export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};