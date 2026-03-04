import adress from "../../../adress.json"



export interface PlayerData {
  nickname: string;
  photo_index: number;
}

// Отправка данных (POST)
export const sendPlayerData = async (data: PlayerData): Promise<void> => {
  try {
    const response = await fetch(`${adress.http}user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Данные отправлены успешно');
  } catch (error) {
    console.error('Ошибка при отправке:', error);
  }
};

// Получение данных (GET)
export const getPlayerData = async (): Promise<PlayerData | null> => {
  try {
    const response = await fetch(`${adress.http}user`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PlayerData = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при получении:', error);
    return null;
  }
};