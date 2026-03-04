import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/player-context';

// Цвета для placeholder аватаров (оставил для совместимости, хотя не используются)
const AVATAR_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#d946ef', '#6b7280',
];

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

const PlayerSetup: React.FC = () => {
  const { playerData, updatePlayer } = usePlayer();
  const [selectedAvatar, setSelectedAvatar] = useState<number>(playerData.photoIndex);
  const [nickname, setNickname] = useState<string>(playerData.nickname);
  const [error, setError] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);

  // Синхронизируем локальный стейт с контекстом при монтировании
  useEffect(() => {
    setSelectedAvatar(playerData.photoIndex);
    setNickname(playerData.nickname);
  }, [playerData.photoIndex, playerData.nickname]);

  const validateNickname = (value: string): boolean => {
    if (value.trim().length === 0) {
      setError('Введите никнейм');
      return false;
    }
    if (value.length > 10) {
      setError('Максимум 10 символов');
      return false;
    }
    setError('');
    return true;
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    validateNickname(value);
    setSaved(false);
  };

  const handleAvatarSelect = (index: number) => {
    setSelectedAvatar(index);
    setSaved(false);
  };

  const handleSave = () => {
    if (!validateNickname(nickname)) return;
    
    // Обновляем глобальный контекст
    updatePlayer({
      nickname: nickname,
      photoIndex: selectedAvatar,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="player-setup">
      <h2>Настройка профиля</h2>
      
      <div className="avatar-section">
        <h3>Выберите аватар</h3>
        <div className="avatars-grid">
          {AVATAR_COLORS.map((color, index) => (
            <button
              key={index}
              className={`avatar-btn ${selectedAvatar === index ? 'selected' : ''}`}
              onClick={() => handleAvatarSelect(index)}
            >
              <div className="avatar-circle">
                <img src={`/img/avatars/${AVATARS_URL[index]}`} alt={`Аватар ${index + 1}`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="nickname-section">
        <h3>Введите никнейм</h3>
        <div className="input-wrapper">
          <input
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            maxLength={10}
            placeholder="Ваш никнейм"
            className={error ? 'error' : ''}
          />
          <span className="char-count">{nickname.length}/10</span>
        </div>
        {error && <div className="error-text">{error}</div>}
      </div>

      <button 
        className={`confirm-btn ${saved ? 'saved' : ''}`}
        onClick={handleSave}
        disabled={!!error || nickname.trim().length === 0}
      >
        {saved ? '✓ Сохранено!' : 'Подтвердить'}
      </button>

      <style>{`
        .player-setup {
          padding: 30px;
          background: #0f1419;
          min-height: 100vh;
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }

        .loading {
          color: #4ade80;
          font-size: 18px;
          text-align: center;
          padding: 50px;
        }

        .player-setup h2 {
          margin: 0;
          color: #4ade80;
          font-size: 24px;
        }

        .avatar-section, .nickname-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .avatar-section h3, .nickname-section h3 {
          margin: 0;
          color: #8b9dc3;
          font-size: 16px;
          font-weight: normal;
        }

        .avatars-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 15px;
        }

        .avatar-btn {
          width: 70px;
          height: 70px;
          padding: 5px;
          border: 3px solid transparent;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .avatar-btn:hover {
          transform: scale(1.1);
        }

        .avatar-btn.selected {
          border-color: #4ade80;
          box-shadow: 0 0 20px rgba(74, 222, 128, 0.4);
        }

        .avatar-circle {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
        }

        .avatar-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .nickname-section input {
          width: 250px;
          padding: 12px 45px 12px 15px;
          font-size: 18px;
          background: #1a1f2e;
          border: 2px solid #3a4150;
          border-radius: 8px;
          color: white;
          text-align: center;
          transition: all 0.2s;
        }

        .nickname-section input:focus {
          outline: none;
          border-color: #4ade80;
        }

        .nickname-section input.error {
          border-color: #ef4444;
        }

        .char-count {
          position: absolute;
          right: 12px;
          font-size: 12px;
          color: #6b7280;
        }

        .error-text {
          color: #ef4444;
          font-size: 13px;
          min-height: 20px;
        }

        .confirm-btn {
          padding: 15px 40px;
          font-size: 16px;
          font-weight: 600;
          background: #4ade80;
          color: #0f1419;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 10px;
        }

        .confirm-btn:hover:not(:disabled) {
          background: #22c55e;
          transform: translateY(-2px);
        }

        .confirm-btn:disabled {
          background: #3a4150;
          color: #6b7280;
          cursor: not-allowed;
        }

        .confirm-btn.saved {
          background: #22c55e;
        }
      `}</style>
    </div>
  );
};

export default PlayerSetup;