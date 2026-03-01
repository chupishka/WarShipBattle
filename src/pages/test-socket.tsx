import { useEffect, useRef } from 'react';

const TestSocket = () => {
  //   console.log('✅ awdawdaw');
  const ws = useRef<WebSocket | null>(null);
  const ws1 = useRef<WebSocket | null>(null);
  //   console.log('✅ 111111');
  useEffect(() => {
    ws.current = new WebSocket('ws://192.168.31.169:8000/game'); // твой бэкенд URL

    ws.current.onopen = () => {
      console.log('✅ Подключено');
      ws.current?.send(JSON.stringify({ type: 'ping' }));
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data).code;
      console.log('📩 Ответ:', data);
      ws1.current = new WebSocket('ws://192.168.31.169:8000/game/' + data);
      ws1.current.onopen = () => {
        console.log('✅ Подключено ws1');
      };
      ws1.current.onclose = () => console.log('🔌 Отключено ws1');
    };

    ws.current.onerror = (e) => console.log('❌ Ошибка:', e);
    ws.current.onclose = () => console.log('🔌 Отключено');

    return () => ws.current?.close();
  }, []);

  return <div>Смотри консоль (F12)</div>;
};

export default TestSocket;
