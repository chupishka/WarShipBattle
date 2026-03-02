import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useGameSocket from '../hooks/use-game-socket';

// Компонент модалки с кодом комнаты
const RoomCodeModal: React.FC<{ field: object; onClose: () => void }> = ({ field, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { isConnected, lastMessage, sendMessage, closeConnection } = useGameSocket('game');
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  // Отправка только 1 раз
  useEffect(() => {
    if (!isConnected) return;
    console.log('Пытаемся отправить, isConnected:', isConnected);
    console.log('Отправляем field:', field);
    sendMessage(field);
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
        <h3>Игра создана!</h3>
        <p>Код комнаты:</p>
        <div className="code-container">
          <span className="room-code">{code}</span>
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? '✓' : '📋'}
          </button>
        </div>
        <button className="ready-btn" onClick={() => {navigate(`/game/${code}`)}}>
          Готово
        </button>
      </div>
    </div>
  );
};

export default RoomCodeModal;
