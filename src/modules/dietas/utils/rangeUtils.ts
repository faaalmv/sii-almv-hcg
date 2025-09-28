
export const isCompliant = (value: number, range: string): boolean => {
  // 1. Manejar rangos de 'menor que' (e.j., < 4)
  if (range.startsWith('<')) {
    const limit = parseFloat(range.slice(1).trim());
    return value < limit;
  }

  // 2. Manejar rangos de 'mayor que' (e.j., > 60)
  if (range.startsWith('>')) {
    const limit = parseFloat(range.slice(1).trim());
    return value > limit;
  }

  // 3. Manejar rangos de 'entre' (e.j., 2 - 4, o 2.0°C - 4.0°C)
  // Se usa una regex más flexible para capturar dos números
  const match = range.match(/(\d+\.?\d*)\s*[a-zA-Z°]*\s*-\s*(\d+\.?\d*)/);
  if (match && match.length === 3) {
    const min = parseFloat(match[1]);
    const max = parseFloat(match[2]);
    return value >= min && value <= max;
  }

  // Si no se reconoce el formato, por defecto se considera no aplicable (o se genera un error de log)
  return false; 
};
