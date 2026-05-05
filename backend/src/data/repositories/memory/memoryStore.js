import { createMemorySeed } from "../../sampleData.js";

// Mantem um estado unico em memoria que simula um banco simples durante a execucao.
let state = createMemorySeed();

export function getMemoryState() {
  return state;
}

export function resetMemoryState(seed = createMemorySeed()) {
  // Facilita reset deterministico entre testes.
  state = seed;
}
