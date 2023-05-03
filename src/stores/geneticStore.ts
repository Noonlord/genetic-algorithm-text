import type { Individual } from '@/utils/genetic';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type Run = {
  id: number;
  dataset: string;
  populationSize: number;
  wordCount: number;
  generation: number;
  mutationRate: number;
  crossoverRate: number;
  eliteCount: number;
  averageFitnesses: Array<number>;
  bestFitnesses: Array<number>;
  bestIndiviuals: Array<Individual>;
};

export const useGeneticStore = defineStore('geneticStore', () => {
  const runs = ref<Array<Run>>([]);
  return {
    runs
  };
});
