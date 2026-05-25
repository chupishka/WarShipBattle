import React, { useState , useEffect} from 'react';
import BattleGrid from './battle-grid';
import PlayerInfo from './player-info';
import useGameSocket from '../hooks/use-game-socket';
import { useParams, useNavigate } from 'react-router';
import { usePlayer } from '../../context/player-context';

// Тестовые данные - мое поле (вижу свои корабли и куда стрелял враг)
const testMyField: Field = [
  [2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
  [0, 2, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 0, 3, 3, 0, 0],
  [0, 2, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 4, 4, 0],
  [0, 0, 2, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
];

// Тестовые данные - поле врага (вижу только свои выстрелы)
const testEnemyField: Field = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 4, 4, 4, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 3, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
];
type CellState = 0 | 1 | 2 | 3 | 4;
type Field = CellState[][];

interface GameBoard {
  // code: string;
   // Колбэк при успешном подключении
}

const GameBoard : React.FC<GameBoard> = ({ }) => {
  const {playerData,getAvatarUrl} = usePlayer()
  const { roomCode } = useParams<{ roomCode: string }>();
  const { opponent } = useParams<{ opponent: string }>();
  const [myField, setMyField] = useState<Field>(testMyField);
  const [enemyField, setEnemyField] = useState<Field>(testEnemyField);
  const {lastMessage,sendMessage} = useGameSocket(`${opponent}-${roomCode}`);
  // const { lastMessage: userMessage,sendMessage:sendUserMessage,isConnected:userConnected,closeConnection:userCloseConnection} = useGameSocket(`user`);
  const [myTurn,setMyTurn] = useState<Boolean>(true)
  const [enemyNickname,setEnemyNickname] = useState<string>("Противник");
  const [enemyPhoto,setEnemyPhoto] = useState<number>(0);
  const navigate = useNavigate();
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);
  
  // useEffect(() => {
  //   if (!userConnected) return;
  //   console.log("пытаюсь отправить код для никнеймы")
  //   sendUserMessage({"code":roomCode})

      
  //   }, [userConnected]);



  type shootCords = { 
    shoot : number[]
  };

  // useEffect(() => {
  //   console.log("пытаюсь получить никнеймы")
  //     if (!userMessage) return;
  //     console.log("пытаюсь получить никнеймы")
  //     console.log(userMessage)
  //     setEnemyNickname(userMessage.nickname)
  //     setEnemyPhoto(userMessage.photo_index)
  //     userCloseConnection();

      
  //   }, [userMessage]);

  const handleEnemyCellClick = (row: number, col: number): void => {

    if(!myTurn){return}
    console.log("пытаюсь отправить выстрел")
    const cords : shootCords = {shoot:[row,col]}
    sendMessage(cords);
    
    // Здесь будет логика отправки выстрола на бэкенд
  };

  useEffect(() => {
      if (!lastMessage) return;
      console.log("пытаюсь получить поле")
      console.log(lastMessage)
      if (lastMessage?.Win === true) {
        setShowWinModal(true);
      }
      if (lastMessage?.Win === false) {
        setShowLoseModal(true);
      }
      if (lastMessage?.isOwn) {
        setMyField(lastMessage.field);
        console.log("пытаюсь поставить свое поле")
        setMyTurn(lastMessage.myTurn)
        
      }
      else {
        console.log("пытаюсь поставить врага поле")
        setEnemyField(lastMessage.field)
        setMyTurn(lastMessage.myTurn)
      }
      if (lastMessage?.nickname){
        setEnemyNickname(lastMessage.nickname)
        setEnemyPhoto(lastMessage.photo_index)
      }
      if (lastMessage?.photo_index){
        
        setEnemyPhoto(lastMessage.photo_index)
      }
    }, [lastMessage]);

  return (
    
    <div className="game-board">
      <div className={`turn-indicator ${myTurn ? 'my-turn' : 'enemy-turn'}`}>
      {myTurn ? "⚔️ Ваш ход" : "⏳ Ход противника"}
      </div>
      <div className="fields-container">
        <div className="field-section">
          <h3 className="field-title">Ваше поле</h3>
          <BattleGrid field={myField} isEnemy={false} />
          <PlayerInfo nickname={playerData.nickname}  avatarUrl={getAvatarUrl()}  />
        </div>

        <div className="field-section">
          <h3 className="field-title">Поле противника</h3>
          <BattleGrid field={enemyField} isEnemy={true} onCellClick={handleEnemyCellClick} />
          <PlayerInfo nickname={enemyNickname} isEnemy={true}  avatarUrl={getAvatarUrl(enemyPhoto)}  />
        </div>
      </div>
          {showWinModal && (
      <div className="modal-overlay">
        <div className="modal-content win-modal">
          <div className="win-icon">🏆</div>
          <h2>Победа!</h2>
          <p>Все корабли противника уничтожены</p>
          <button className="ready-btn" onClick={() => navigate('/')}>
            Завершить
          </button>
        </div>
      </div>
      
    )}
    {showLoseModal && (
      <div className="modal-overlay">
        <div className="modal-content win-modal">
          <div className="win-icon">😨</div>
          <h2>Поражение!</h2>
          <p>Все ваши корабли уничтожены</p>
          <button className="ready-btn" onClick={() => navigate('/')}>
            Завершить
          </button>
        </div>
      </div>
      
    )}
    
      

      <style>{`
        .game-board {
          padding: 20px;
          background: #0f1419;
          min-height: 100vh;
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          user-select: none;
        }
        
        .fields-container {
          display: flex;
          justify-content: center;
          gap: 60px;
          flex-wrap: wrap;
        }
        
        .field-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        
        .player-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
          background: #1a1f2e;
          border-radius: 8px;
          margin-bottom: 5px;
          flex-direction: row;
        }
        
        .player-info-me {
          flex-direction: row;
        }
        
        .player-info-enemy {
          flex-direction: row-reverse; /* Враг: аватар справа, ник слева */
        }
        
        .player-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #4ade80;
          flex-shrink: 0;
        }
        
        .player-info-enemy .player-avatar {
          border-color: #ef4444;
        }
        
        .player-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: #4ade80;
        }
        
        .avatar-placeholder-enemy {
          background: #ef4444;
        }
        
        .player-nickname {
          color: #e0e0e0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .field-title {
          margin-bottom: 15px;
          font-size: 18px;
          color: #e0e0e0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .battle-grid-container {
          background: #1a1f2e;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        
        .grid-header {
          display: flex;
          margin-bottom: 5px;
        }
        
        .corner-cell {
          width: 40px;
          height: 20px;
        }
        
        .coord-label {
          width: 40px;
          text-align: center;
          font-size: 12px;
          color: #8b9dc3;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .grid-body {
          display: flex;
        }
        
        .row-labels {
          display: flex;
          flex-direction: column;
          margin-right: 5px;
        }
        
        .row-labels .coord-label {
          height: 40px;
          
        }
        
        .grid {
          display: flex;
          flex-direction: column;
          border: 1px solid #3a4150;
          user-select: none;
        }
        
        .grid-row {
          display: flex;
        }
        
        .cell {
          width: 40px;
          height: 40px;
          border: 1px solid #3a4150;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s ease;
          userSelect: 'none';
          WebkitUserSelect: 'none';
          MozUserSelect: 'none';
        }
        
        .cell-hovered {
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);
          z-index: 10;
          userSelect: 'none';
          WebkitUserSelect: 'none';
          MozUserSelect: 'none';
        }
        
        // /* Placeholder стили для разных состояний */
        // .cell-water {
        //   width: 100%;
        //   height: 100%;
          
        //   pointer-events: none;
        //   position: relative;
        // }
        
        // .cell-miss {
        //   width: 12px;
        //   height: 12px;
        //   background: #5a6b8c;
        //   border-radius: 50%;
        // }
        
        // .cell-ship {
        //   width: 32px;
        //   height: 32px;
        //   background: #4ade80;
        //   border-radius: 4px;
        //   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        // }
        
        // .cell-damaged {
        //   width: 32px;
        //   height: 32px;
        //   background: #fb923c;
        //   border-radius: 4px;
        //   position: relative;
        // }
        
        // .cell-damaged::before,
        // .cell-damaged::after {
        //   content: '';
        //   position: absolute;
        //   background: #7c2d12;
        //   width: 2px;
        //   height: 20px;
        //   top: 50%;
        //   left: 50%;
        // }
        
        // .cell-damaged::before {
        //   transform: translate(-50%, -50%) rotate(45deg);
        // }
        
        // .cell-damaged::after {
        //   transform: translate(-50%, -50%) rotate(-45deg);
        // }
        
        // .cell-destroyed {
        //   width: 32px;
        //   height: 32px;
        //   background: #ef4444;
        //   border-radius: 4px;
        //   position: relative;
        // }
        
        // .cell-destroyed::before,
        // .cell-destroyed::after {
        //   content: '';
        //   position: absolute;
        //   background: #450a0a;
        //   width: 3px;
        //   height: 28px;
        //   top: 50%;
        //   left: 50%;
        // }
        
        // .cell-destroyed::before {
        //   transform: translate(-50%, -50%) rotate(45deg);
        // }
        
        // .cell-destroyed::after {
        //   transform: translate(-50%, -50%) rotate(-45deg);
        // }
        .turn-indicator {
          text-align: center;
          margin-bottom: 30px;
          padding: 15px 40px;
          background: #1a1f2e;
          border-radius: 12px;
          border: 2px solid #3a4150;
          font-size: 24px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 2px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
        }

        .turn-indicator.my-turn {
          color: #4ade80;
          border-color: #4ade80;
          text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
        }

        .turn-indicator.enemy-turn {
          color: #ef4444;
          border-color: #ef4444;
          text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
        }

        /* Анимация пульсации для активного хода */
        @keyframes pulse-turn {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .turn-indicator.my-turn {
          animation: pulse-turn 2s infinite;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: #1a1f2e;
          padding: 40px;
          border-radius: 16px;
          text-align: center;
          border: 2px solid #4ade80;
          box-shadow: 0 0 30px rgba(74, 222, 128, 0.2);
          min-width: 320px;
        }

        .win-modal .win-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .win-modal h2 {
          margin: 0 0 10px 0;
          color: #4ade80;
          font-size: 28px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .win-modal p {
          color: #8b9dc3;
          margin: 0 0 25px 0;
          font-size: 16px;
        }

        .ready-btn {
          padding: 14px 40px;
          background: #4ade80;
          color: #0f1419;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 700;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .ready-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(74, 222, 128, 0.4);
        }
              `}</style>
    </div>
  );
};

export default GameBoard;
