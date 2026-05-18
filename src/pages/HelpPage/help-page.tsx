import React from 'react';
import { usePlayer } from '../../context/player-context';
import './help-page.css';

const HelpPage: React.FC = () => {
  const { playerData } = usePlayer();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="help-page">
      <div className="help-container">
        <h1 className="help-title">Справка</h1>
        
        <nav className="help-nav">
          <h2 className="help-nav-title">Содержание</h2>
          <ul className="help-nav-list">
            <li><button className="help-link" onClick={() => scrollToSection('about')}>Общая информация</button></li>
            <li><button className="help-link" onClick={() => scrollToSection('main')}>Главная страница</button></li>
            <li>
              <button className="help-link" onClick={() => scrollToSection('create-game')}>Создание игры</button>
              <ul className="help-subnav">
                <li><button className="help-link sub" onClick={() => scrollToSection('game-modes')}>Режимы игры</button></li>
                <li><button className="help-link sub" onClick={() => scrollToSection('difficulty')}>Сложность бота</button></li>
                <li><button className="help-link sub" onClick={() => scrollToSection('placement')}>Расстановка кораблей</button></li>
              </ul>
            </li>
            <li><button className="help-link" onClick={() => scrollToSection('profile')}>Профиль</button></li>
            <li><button className="help-link" onClick={() => scrollToSection('ui')}>Интерфейс</button></li>
          </ul>
        </nav>

        <section id="about" className="help-section">
          <h2>Общая информация</h2>
          <p>Добро пожаловать в <strong className="brand">WarshipBattle</strong> — онлайн версию классической игры «Морской бой». 
          Здесь вы можете сражаться с ботом, играть с друзьями или присоединяться к чужим играм по коду комнаты.</p>
        </section>

        <section id="main" className="help-section">
          <h2>Главная страница</h2>
          <p>На вкладке <strong>«Главная»</strong> вы найдете видео, демонстрирующее процесс игры. 
          Это отличный способ ознакомиться с правилами и механикой перед началом партии.</p>
        </section>

        <section id="create-game" className="help-section">
          <h2>Создание игры</h2>
          <p>Вкладка <strong>«Создание игры»</strong> — центральная часть приложения. Здесь вы можете начать новую партию одним из трех способов:</p>
          
          <div id="game-modes" className="help-subsection">
            <h3>Режимы игры</h3>
            <ul>
              <li><span className="mode-tag bot">Игра с ботом</span> — сражайтесь с компьютером. Доступен выбор сложности.</li>
              <li><span className="mode-tag pvp">Игра с игроком</span> — создайте комнату и ожидайте подключения второго игрока.</li>
              <li><span className="mode-tag join">Подключение по коду</span> — введите код комнаты, чтобы присоединиться к существующей игре.</li>
            </ul>
          </div>

          <div id="difficulty" className="help-subsection">
            <h3>Сложность бота</h3>
            <p>При выборе режима <strong>«Игра с ботом»</strong> появляется панель выбора сложности:</p>
            <ul>
              <li><span className="difficulty easy">Легкая</span> — бот стреляет практически случайно.</li>
              <li><span className="difficulty medium">Средняя</span> — бот использует базовую логику добивания подбитых кораблей.</li>
              <li><span className="difficulty hard">Сложная</span> — бот применяет продвинутые стратегии поиска и уничтожения.</li>
            </ul>
          </div>

          <div id="placement" className="help-subsection">
            <h3>Расстановка кораблей</h3>
            <p>Ниже поля боя отображаются доступные корабли для расстановки:</p>
            <ul>
              <li>Нажмите <strong>ЛКМ</strong> на корабль и перетащите его на игровое поле 10×10.</li>
              <li>Для поворота корабля нажмите на него <strong>ПКМ (правой кнопкой мыши)</strong> перед или во время перетаскивания.</li>
              <li>Корабли нельзя ставить вплотную друг к другу — между ними должна быть минимум одна свободная клетка.</li>
              <li>Используйте кнопку <strong className="btn-ref auto">«Авто (стратегия)»</strong> для автоматической расстановки.</li>
              <li>Кнопка <strong className="btn-ref reset">«Сброс»</strong> очищает поле.</li>
              <li>После расстановки всех кораблей нажмите <strong className="btn-ref create">«Создать»</strong> для начала боя.</li>
            </ul>
            <div className="ships-info">
              <div className="ship-group"><span className="ship-count">×1</span> <span className="ship-block four" /></div>
              <div className="ship-group"><span className="ship-count">×2</span> <span className="ship-block three" /><span className="ship-block three" /></div>
              <div className="ship-group"><span className="ship-count">×3</span> <span className="ship-block two" /><span className="ship-block two" /></div>
              <div className="ship-group"><span className="ship-count">×4</span> <span className="ship-block one" /></div>
            </div>
          </div>
        </section>

        <section id="profile" className="help-section">
          <h2>Профиль</h2>
          <p>Во вкладке <strong>«Профиль»</strong> вы можете настроить свою игровую личность:</p>
          <ul>
            <li><strong>Выбор аватарки</strong> — доступно 20 уникальных изображений. Нажмите на понравившуюся, чтобы выбрать.</li>
            <li><strong>Никнейм</strong> — введите имя в поле ввода (до 10 символов).</li>
            <li>Нажмите зеленую кнопку <strong className="btn-ref confirm">«Подтвердить»</strong>, чтобы сохранить изменения.</li>
          </ul>
          <p>Ваш никнейм и аватарка будут отображаться в правом верхнем углу на всех страницах сайта.</p>
        </section>

        <section id="ui" className="help-section">
          <h2>Интерфейс</h2>
          <p>В правом верхнем углу экрана находится панель пользователя:</p>
          <ul>
            <li><strong>Аватарка</strong> — выбранное в профиле изображение в круглой рамке.</li>
            <li><strong>Никнейм</strong> — ваше игровое имя (по умолчанию «Гость»).</li>
            <li><strong>Кнопка информации</strong> — открывает окно со сведениями о разработчиках проекта.</li>
          </ul>
        </section>

        <div className="help-footer">
          <p>Удачных боевых операций, капитан {playerData.nickname || 'Гость'}! ⚓</p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;