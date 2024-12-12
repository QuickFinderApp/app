declare const spotter: {
  frecency: {
    recordAccess: (commandId: string) => Promise<void>;
    getScores: () => Promise<Record<string, number>>;
  };
};

export async function recordCommandAccess(commandId: string) {
  await spotter.frecency.recordAccess(commandId);
}

export async function getFrecencyScores(): Promise<Record<string, number>> {
  return spotter.frecency.getScores();
}

export function createFrecencyFilter(scores: Record<string, number>) {
  return (value: string, search: string, keywords?: string[]): number => {
    // First check if it matches the search
    const searchLower = search.toLowerCase();
    const valueLower = value.toLowerCase();
    const keywordMatches = keywords?.some(k => k.toLowerCase().includes(searchLower)) ?? false;
    
    if (!search || valueLower.includes(searchLower) || keywordMatches) {
      // If it matches, use frecency score as the ranking
      // Add 1 to ensure even items with 0 score are shown if they match
      return (scores[value] || 0) + 1;
    }
    
    // If no match, return 0 to filter it out
    return 0;
  };
}