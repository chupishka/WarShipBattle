import { usePlayer } from "./context/player-context";

const HeaderProfile: React.FC = () => {
  const { playerData, getAvatarUrl } = usePlayer();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginLeft: 'auto',
      padding: '0 20px',
    }}>
      <span style={{
        color: '#fff',
        fontSize: '16px',
        fontWeight: 500,
        userSelect: 'none',
      }}>
        {playerData.nickname}
      </span>
      <div style={{
        width: '57px',
        height: '57px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '3px solid #4ade80',
        boxShadow: '0 0 20px rgba(74, 222, 128, 0.4)',
        flexShrink: 0,
      }}>
        <img
          src={getAvatarUrl()}
          alt="Аватар"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>
    </div>
  );
};

export default HeaderProfile