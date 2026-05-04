import { createMemorySeed } from "../../sampleData.js";

let state = createMemorySeed();

export function getMemoryState() {
  return state;
}

export function resetMemoryState(seed = createMemorySeed()) {
  state = seed;
}
