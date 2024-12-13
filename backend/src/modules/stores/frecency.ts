import { Store } from "electron-datastore";

interface FrecencyData {
  lastAccessed: number;
  accessCount: number;
}

type FrecencyStore = Record<string, FrecencyData>;

const store = new Store<FrecencyStore>({
  name: "commands-frecency",
  template: {},
  accessPropertiesByDotNotation: false
});

const FRECENCY_HALF_LIFE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export function calculateFrecencyScore(data: FrecencyData): number {
  const timeDiff = Date.now() - data.lastAccessed;
  const recencyScore = Math.pow(0.5, timeDiff / FRECENCY_HALF_LIFE);
  return data.accessCount * recencyScore;
}

export async function recordCommandAccess(commandId: string) {
  const commandFrecencyData = store.get(commandId) || { lastAccessed: 0, accessCount: 0 };

  const updatedCommandFrecencyData = {
    lastAccessed: Date.now(),
    accessCount: commandFrecencyData.accessCount + 1
  };

  store.set(commandId, updatedCommandFrecencyData);
}

export async function resetCommandScore(commandId: string) {
  store.delete(commandId);
}

export async function getFrecencyScores(): Promise<Record<string, number>> {
  const allData = store.store;
  const scores: Record<string, number> = {};

  for (const [commandId, frecencyData] of Object.entries(allData)) {
    scores[commandId] = calculateFrecencyScore(frecencyData);
  }

  return scores;
}
