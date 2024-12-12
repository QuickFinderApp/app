import { getStore } from "../../dependencies/electron-storage";

interface FrecencyData {
  lastAccessed: number;
  accessCount: number;
}

interface FrecencyStore {
  commands: Record<string, FrecencyData>;
}

const store = getStore<FrecencyStore>("frecency", {
  commands: {}
});

const FRECENCY_HALF_LIFE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export function calculateFrecencyScore(data: FrecencyData): number {
  const timeDiff = Date.now() - data.lastAccessed;
  const recencyScore = Math.pow(0.5, timeDiff / FRECENCY_HALF_LIFE);
  return data.accessCount * recencyScore;
}

export async function recordCommandAccess(commandId: string) {
  const data = await store.get();
  const command = data.commands[commandId] || { lastAccessed: 0, accessCount: 0 };
  
  data.commands[commandId] = {
    lastAccessed: Date.now(),
    accessCount: command.accessCount + 1
  };
  
  await store.set(data);
}

export async function getFrecencyScores(): Promise<Record<string, number>> {
  const data = await store.get();
  const scores: Record<string, number> = {};
  
  for (const [commandId, frecencyData] of Object.entries(data.commands)) {
    scores[commandId] = calculateFrecencyScore(frecencyData);
  }
  
  return scores;
}