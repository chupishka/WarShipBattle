import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useGameSocket from '../hooks/use-game-socket';
import { usePlayer } from '../../context/player-context';
// Компонент модалки с кодом комнаты
const RoomCodeModal: React.FC<{
  field: object;
  onClose: () => void;
  isBot?: boolean;
  botDifficulty?: string;
}> = ({ field, onClose, isBot, botDifficulty }) => {
  const { playerData, getAvatarUrl } = usePlayer();
  const [copied, setCopied] = useState(false);
  const { isConnected, lastMessage, sendMessage, closeConnection } = useGameSocket('game');
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  // Отправка только 1 раз
  useEffect(() => {
    if (!isConnected) return;
    console.log('Пытаемся отправить, isConnected:', isConnected);
    console.log('Отправляем field:', field);
    console.log('Отправляем playerData.nickname:', playerData.nickname);
    console.log('Отправляем playerData.photoIndex:', playerData.photoIndex);
    const data = {
      field: field,
      nickname: playerData.nickname,
      photo_index: playerData.photoIndex,
      ...(isBot ? { botDifficulty: botDifficulty } : {}),
    };
    sendMessage(data);
    sendMessage(data);
  }, [isConnected]); // ← пустой массив, игнорируем warning или используем ref

  useEffect(() => {
    if (lastMessage?.code) {
      setCode(lastMessage.code);
      closeConnection();
    }
  }, [lastMessage]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  // sendMessage(field);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{isBot ? 'Комната успешно создана!' : 'Игра создана!'}</h3>
        {!isBot && <p>Код комнаты:</p>}
        {!isBot ? (
          <div className="code-container">
            <span className="room-code">{code}</span>
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? '✓' : '📋'}
            </button>
          </div>
        ) : (
          <p style={{ color: '#8b9dc3', margin: '15px 0' }}>
            Игра с ботом ({botDifficulty}) готова к началу
          </p>
        )}
        <button className="ready-btn" onClick={() => navigate(`/${isBot ? 'bot' : 'game'}/${code}`)}>
          Готово
        </button>
      </div>
    </div>
  );
};

export default RoomCodeModal;
