// 1. Certifique-se de importar o hook no topo do arquivo
import { usePrayers } from '../hooks/usePrayers';

// 2. Dentro do componente GlobalTimer:
const { saveTime } = usePrayers();

const stopTimer = async () => {
  // Calcula os minutos (se tiver pelo menos 1 minuto)
  const minutosParaSalvar = Math.floor(seconds / 60);
  
  if (minutosParaSalvar > 0) {
    await saveTime(minutosParaSalvar); // Chama a função que criamos no hook
  }
  
  setIsRunning(false);
  setSeconds(0); // Reseta o cronômetro local
};