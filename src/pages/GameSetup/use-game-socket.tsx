// hooks/useGameSocket.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import adress from "../../../adress.json"
import { message } from 'antd';


const useGameSocket = (IpAdress: string) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null); // ← храним последнее

  useEffect(() => {
    ws.current = new WebSocket(`${adress.adress}${IpAdress}`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLastMessage(data); // ← сохраняем в state
    };
    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  // Функция отправки сообщений
  const sendMessage = useCallback((message: object) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }else {
    console.log('WebSocket не открыт!'); // ← есть такое?
  }
  }, []);
  const closeConnection = useCallback(() => {
  if (ws.current) {
    ws.current.close();
    ws.current = null;
  }
  }, []);


  return {
    isConnected,
    lastMessage,
    sendMessage,
    closeConnection
  };
};


export default useGameSocket