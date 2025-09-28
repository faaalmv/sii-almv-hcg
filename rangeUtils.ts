/**
 * Valida si un valor numérico cumple con una regla de rango expresada como string.
 * Esta función es robusta y puede interpretar diferentes formatos de la NOM.
 * 
 * @param value El valor numérico a validar (ej. 3.5).
 * @param rangeString La regla de rango (ej. "< 4°C", "3°C - 5°C", "> -18").
 * @returns `true` si el valor cumple con el rango, `false` en caso contrario.
 */
export function isCompliant(value: number, rangeString: string): boolean {
  // Limpiar el string de unidades como °C, %, etc. para quedarnos solo con los números y operadores.
  const cleanRange = rangeString.replace(/[a-zA-Z°%]/g, '').trim();

  // Caso 1: Rango con guion (ej. "3 - 5")
  const rangeMatch = cleanRange.match(/^(-?\d+\.?\d*)\s*-\s*(-?\d+\.?\d*)$/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    return value >= min && value <= max;
  }

  // Caso 2: Operador "menor que" (ej. "< 4")
  const lessThanMatch = cleanRange.match(/^<\s*(-?\d+\.?\d*)$/);
  if (lessThanMatch) {
    const max = parseFloat(lessThanMatch[1]);
    return value < max;
  }

  // Caso 3: Operador "mayor que" (ej. "> -18")
  const greaterThanMatch = cleanRange.match(/^>\s*(-?\d+\.?\d*)$/);
  if (greaterThanMatch) {
    const min = parseFloat(greaterThanMatch[1]);
    return value > min;
  }

  // Caso 4: Valor exacto (ej. "4")
  const exactMatch = cleanRange.match(/^(-?\d+\.?\d*)$/);
  if (exactMatch) {
    const expected = parseFloat(exactMatch[1]);
    return value === expected;
  }

  // Si no se reconoce el formato del rango, se considera no cumplido por seguridad.
  console.warn(`Formato de rango no reconocido: "${rangeString}"`);
  return false;
}