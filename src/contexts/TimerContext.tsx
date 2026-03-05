import React, { createContext, useState, useEffect, useContext } from 'react';

interface TimerContextData {
  seconds: number;
  isActive: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  formattedTime: string;
}

const TimerContext = createContext<TimerContextData>({} as TimerContextData);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((sec) => {
          if (sec >= 900) { // 15 minutos = 900 segundos
            handleFinish();
            return 900;
          }
          return sec + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleFinish = () => {
    setIsActive(false);
    alert("🙏 Missionária, completou os seus 15 minutos de intercessão! Geração de Déboras de pé!");
    // Aqui podemos disparar a atualização de "minutosIntercedidos" no Firebase depois
  };

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  const resetTimer = () => { setIsActive(false); setSeconds(0); };

  const formattedTime = `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  return (
    <TimerContext.Provider value={{ seconds, isActive, startTimer, pauseTimer, resetTimer, formattedTime }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);