import { Route, Routes } from "react-router";
import NoMatchPage from "../pages/no-match-page";
import MainPage from "../pages/main-page";
import CreateGame from "../pages/create-game";


const AppRoutes = () => {
    const navigationRoutes = [
        {path: "/", element: <MainPage/>},
        {path: "/create-game", element: <CreateGame/>},
        {path: "*", element: <NoMatchPage/>}
    ]


    return <Routes>
        {navigationRoutes.map((route)=> (<Route key = {route.path} path = {route.path} element = {route.element}/>
    ))}

    </Routes>
};

export default AppRoutes;