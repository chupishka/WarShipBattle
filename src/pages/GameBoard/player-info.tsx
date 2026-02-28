import * as React from 'react';


interface PlayerInfoProps {
  nickname: string;
  avatarUrl?: string;
  isEnemy?: boolean;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ nickname, avatarUrl, isEnemy = false }) => {
  return (
    <div className={`player-info ${isEnemy ? 'player-info-enemy' : 'player-info-me'}`}>
      {!isEnemy && (
        <>
          <div className="player-avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt={nickname} />
            ) : (
              <div className="avatar-placeholder" />
            )}
          </div>
          <span className="player-nickname">{nickname}</span>
        </>
      )}
      {isEnemy && (
        <>
          
          <span className="player-nickname">{nickname}</span>
          <div className="player-avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt={nickname} />
            ) : (
              <div className="avatar-placeholder avatar-placeholder-enemy" />
              
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerInfo
