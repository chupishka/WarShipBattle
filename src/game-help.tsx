import React, { useState } from 'react';

const GameHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (isCreditsOpen) setIsCreditsOpen(false); // Закрываем вложенную модалку при закрытии основной
  };

  const toggleCredits = () => setIsCreditsOpen(!isCreditsOpen);

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: '#1a1d2e',
      width: '90%',
      maxWidth: '650px',
      borderRadius: '12px',
      padding: '30px',
      color: '#ffffff',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      position: 'relative' as const,
      border: '1px solid #394066',
    },
    // Стили для второй модалки (чуть меньше и выше z-index)
    creditsModal: {
      backgroundColor: '#1e2235',
      width: '80%',
      maxWidth: '400px',
      borderRadius: '12px',
      padding: '25px',
      color: '#ffffff',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      border: '1px solid #4ade80', // Выделим рамку зеленым
      zIndex: 1100,
    },
    closeBtn: {
      position: 'absolute' as const,
      top: '15px',
      right: '15px',
      background: 'none',
      border: 'none',
      color: '#888',
      fontSize: '24px',
      cursor: 'pointer',
    },
    title: {
      color: '#4ade80',
      marginTop: '0',
      marginBottom: '20px',
      fontSize: '22px',
    },
    sectionTitle: {
      color: '#4ade80',
      fontSize: '18px',
      marginTop: '25px',
      marginBottom: '10px',
    },
    text: {
      lineHeight: '1.6',
      color: '#cbd5e1',
      fontSize: '15px',
    },
    code: {
      backgroundColor: 'rgba(74, 222, 128, 0.15)',
      color: '#4ade80',
      padding: '2px 6px',
      borderRadius: '4px',
      fontFamily: 'monospace',
    },
    button: {
      marginTop: '20px',
      backgroundColor: '#4ade80',
      color: '#1a1d2e',
      border: 'none',
      padding: '10px 25px',
      borderRadius: '8px',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      width: '100%',
    },
    secondaryButton: {
      marginTop: '15px',
      backgroundColor: 'transparent',
      color: '#4ade80',
      border: '1px solid #4ade80',
      padding: '8px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      width: '100%',
    },
    iconHelp: {
      cursor: 'pointer',
      fontSize: '20px',
      color: '#fff',
      marginLeft: '15px',
      display: 'flex',
      alignItems: 'center',
      opacity: 0.8,
    }
  };

  return (
    <>
      <div style={styles.iconHelp} onClick={toggleModal} title="Справка">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>

      {isOpen && (
        <div style={styles.overlay} onClick={toggleModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={toggleModal}>&times;</button>
            
            <h2 style={styles.title}>Сведения о разработчиках</h2>

            <div style={styles.text}>
              <p>Самарский университет. Институт информатики и кибернетики.</p>
              <p>Курсовой проект по дисциплине "Программная инженерия" по теме "Морской бой".</p>
              <p>Разработчики (обучающиеся группы 6302-020302D).</p>
                  <ul style={{ paddingLeft: '20px', color: '#4ade80' }}>
                    <li>Кирилл Хаперский</li>
                    <li>Егор Мартынов</li>
                    <li>Иван Цвилий</li>
                  </ul>
                  <p style={{ fontSize: '12px', marginTop: '15px' }}>WarShipBattle v1.0.0 — 2026</p>
            </div>


            <button style={styles.button} onClick={toggleModal}>Принять</button>

            {/* Второе модальное окно поверх первого */}
            
          </div>
        </div>
      )}
    </>
  );
};

export default GameHelp;