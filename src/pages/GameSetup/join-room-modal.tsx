import React, { useState, useEffect } from 'react';
import useGameSocket from '../hooks/use-game-socket';
import { usePlayer } from '../../context/player-context';
interface JoinRoomModalProps {
  onClose: () => void;
  onSuccess?: (code:string) => void;
  fieldTo: object; // Колбэк при успешном подключении
}

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ onClose, onSuccess ,fieldTo}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {playerData,getAvatarUrl} = usePlayer()
  const { isConnected, lastMessage, sendMessage, closeConnection } = useGameSocket('join');

  // Обработка ответа от бэкенда
  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.success) {
      // Успешное подключение
      const data  = {
      "field": fieldTo,
      "nickname" : playerData.nickname,
      "photo_index" : playerData.photoIndex

    }
      sendMessage(data);
      closeConnection();
      onSuccess?.(code);
      onClose();
    } else if (lastMessage.error) {
      // Ошибка от бэкенда
      setError(lastMessage.error);
      setIsLoading(false);
    }
  }, [lastMessage]);

  const handleSubmit = () => {
    // Валидация
    if (!code.trim()) {
      setError('Введите код комнаты');
      return;
    }

    if (code.trim().length < 6) {
      setError('Код слишком короткий');
      return;
    }

    setError('');
    setIsLoading(true);

    // Отправка кода на бэкенд
    console.log("12312")
    if (isConnected) {
      console.log("12312")
      sendMessage({ code: code.trim().toUpperCase() });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Подключение к игре</h3>
        <p>Введите код комнаты:</p>

        <div className="input-container">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="ABC-123"
            maxLength={10}
            autoFocus
            disabled={isLoading}
            className={error ? 'error' : ''}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose} disabled={isLoading}>
            Отмена
          </button>
          <button
            className={`connect-btn ${isLoading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={isLoading || !code.trim()}>
            {isLoading ? 'Подключение...' : 'Подключиться'}
          </button>
        </div>

        {!isConnected && <div className="connection-status">Подключение к серверу...</div>}
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .modal-content {
          background: #1a1f2e;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          min-width: 320px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .modal-content h3 {
          margin: 0 0 10px 0;
          color: #4ade80;
          font-size: 20px;
        }

        .modal-content p {
          margin: 0 0 20px 0;
          color: #8b9dc3;
          font-size: 14px;
        }

        .input-container {
          margin-bottom: 10px;
        }

        .input-container input {
          width: 100%;
          padding: 15px;
          font-size: 24px;
          text-align: center;
          letter-spacing: 3px;
          background: #0f1419;
          border: 2px solid #3a4150;
          border-radius: 8px;
          color: white;
          font-weight: bold;
          text-transform: uppercase;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .input-container input:focus {
          outline: none;
          border-color: #4ade80;
        }

        .input-container input.error {
          border-color: #ef4444;
          animation: shake 0.3s;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .error-message {
          color: #ef4444;
          font-size: 13px;
          margin-bottom: 15px;
          min-height: 20px;
        }

        .modal-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .modal-buttons button {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .cancel-btn {
          background: #3a4150;
          color: #8b9dc3;
        }

        .cancel-btn:hover:not(:disabled) {
          background: #4a5560;
        }

        .connect-btn {
          background: #4ade80;
          color: #0f1419;
        }

        .connect-btn:hover:not(:disabled) {
          background: #22c55e;
          transform: translateY(-1px);
        }

        .connect-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .connect-btn.loading {
          background: #3b82f6;
          color: white;
        }

        .connection-status {
          margin-top: 15px;
          font-size: 12px;
          color: #8b9dc3;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default JoinRoomModal;
