import React from 'react';
import {  Layout, Menu, theme } from 'antd';
import './reset.css';
import './App.css';
import { useNavigate } from 'react-router';
import AppRoutes from './routes/routes';

const { Header, Content } = Layout;




const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  return (
    <Layout style={{ height: '100%', width: '100%', background: '#394066' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}>
        <div
          className="main_name"
          style={{
            background: '#394066',
            borderRadius: 15,
            height: '68%',
          }}>
          WarShipBattle
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: "1",
              
              label: 'Главная',
              onClick: ()=> navigate("/")
            },
            {
              key: "2",
              
              label: 'Cоздание игры',
              onClick: ()=> navigate("/create-game")
            },
            {
              key: "3",
              
              label: 'Подключение по коду',
              onClick: ()=> navigate("/")
            }
          ]}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: 30 }}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 1000,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}>
            <AppRoutes />
          </div>
      
      </Content>
      
    </Layout>
  );
};

export default App;
