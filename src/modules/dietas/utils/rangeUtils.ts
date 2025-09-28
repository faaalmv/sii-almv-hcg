
export const checkRange = (value: number, range: string): boolean => {
  // Handles formats like "< 4", "> 60", "3-5", "3 - 5"
  const trimmedRange = range.trim();

  // Simple comparisons
  if (trimmedRange.startsWith('<')) {
    const limit = parseFloat(trimmedRange.substring(1).trim());
    return value < limit;
  }
  if (trimmedRange.startsWith('>')) {
    const limit = parseFloat(trimmedRange.substring(1).trim());
    return value > limit;
  }

  // Range with a dash, e.g., "3-5" or "3 - 5"
  if (trimmedRange.includes('-')) {
    const parts = trimmedRange.split('-').map(p => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return value >= parts[0] && value <= parts[1];
    }
  }
  
  // Fallback for unrecognized formats
  return true; // Or false, depending on desired strictness
};