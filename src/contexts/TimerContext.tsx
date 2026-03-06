import React, { createContext, useState, useEffect, useContext } from 'react';

interface TimerContextData {
  seconds: number;
  isRunning: boolean; // Padronizado para bater com GlobalTimer e Timer.tsx
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void; // Adicionada a função que faltava
  resetTimer: () => void;
  formattedTime: string;
}

const TimerContext = createContext<TimerContextData>({} as TimerContextData);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((sec) => {
          // Alerta opcional ao chegar em 15min, mas sem travar o cronômetro
          if (sec === 900) {
            console.log("Marco de 15 minutos atingido!");
          }
          return sec + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const stopTimer = () => setIsRunning(false); // Função para garantir a parada
  
  const resetTimer = () => { 
    setIsRunning(false); 
    setSeconds(0); 
  };

  // Formatação robusta para horas, minutos e segundos
  const formattedTime = `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  return (
    <TimerContext.Provider value={{ 
      seconds, 
      isRunning, 
      startTimer, 
      pauseTimer, 
      stopTimer, 
      resetTimer, 
      formattedTime 
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);