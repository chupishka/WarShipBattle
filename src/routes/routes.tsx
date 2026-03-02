import { Route, Routes } from 'react-router';
import NoMatchPage from '../pages/no-match-page';
import MainPage from '../pages/MainPage/main-page';
import CreateGame from '../pages/create-game';
import PlayerSetup from '../pages/PlayerSetup/player-setup';
import GameBoard from '../pages/GameBoard/game-board';
const AppRoutes = () => {
  const navigationRoutes = [
    { path: '/', element: <MainPage /> },
    { path: '/create-game', element: <CreateGame /> },
    { path: '/profile', element: <PlayerSetup /> },
    { path: "/game/:roomCode", element : <GameBoard />},
    { path: '*', element: <NoMatchPage /> }
    
  ];

  return (
    <Routes>
      {navigationRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default AppRoutes;
