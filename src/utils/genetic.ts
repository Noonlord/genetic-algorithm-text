import { dataset_1 } from '@/data/datasets';
import type { Dataset } from '@/data/types';
import { useGeneticStore, type Run } from '@/stores/geneticStore';

export type Individual = Record<string, Array<string>>;

export const generateIndividual = (wordCount: number, dataset: Dataset): Individual => {
  const individual: Individual = {
    [dataset['classNames'][0]]: [],
    [dataset['classNames'][1]]: []
  };
  // pick random  words from vocab
  const randomWords = dataset.vocab.sort(() => 0.5 - Math.random()).slice(0, wordCount);
  // assign random words to individual
  randomWords.forEach((word, _index) => {
    if (_index < wordCount / 2) {
      individual[dataset['classNames'][0]].push(word);
    } else {
      individual[dataset['classNames'][1]].push(word);
    }
  });
  return individual;
};

export const generatePopulation = (
  populationSize: number,
  wordCount: number,
  dataset: Dataset
): Array<Individual> => {
  const population: Array<Individual> = [];
  for (let i = 0; i < populationSize; i++) {
    // if same individual is generated, generate again
    let individual = generateIndividual(wordCount, dataset);
    while (population.includes(individual)) {
      individual = generateIndividual(wordCount, dataset);
    }
    population.push(generateIndividual(wordCount, dataset));
  }
  return population;
};

export const findFitness = (individual: Individual, dataset: Dataset): number => {
  let fitness = 0;
  const wordCounts = dataset.wordCounts;
  // fitness works like this:
  // if word is in correct class, add its count to fitness
  // if word is in wrong class, subtract its count from fitness
  individual[dataset['classNames'][0]].forEach((word) => {
    if (word in wordCounts[dataset['classNames'][0]]) {
      fitness += wordCounts[dataset['classNames'][0]][word];
    }
    if (word in wordCounts[dataset['classNames'][1]]) {
      fitness -= wordCounts[dataset['classNames'][1]][word];
    }
  });
  individual[dataset['classNames'][1]].forEach((word) => {
    if (word in wordCounts[dataset['classNames'][1]]) {
      fitness += wordCounts[dataset['classNames'][1]][word];
    }
    if (word in wordCounts[dataset['classNames'][0]]) {
      fitness -= wordCounts[dataset['classNames'][0]][word];
    }
  });
  return fitness;
};

export const populationFitness = (population: Array<Individual>, dataset: Dataset): number[] => {
  const fitness: number[] = [];
  population.forEach((individual) => {
    fitness.push(findFitness(individual, dataset));
  });
  return fitness;
};

export const findFittest = (population: Array<Individual>, dataset: Dataset): Individual => {
  const fitness = populationFitness(population, dataset);
  const maxFitness = Math.max(...fitness);
  return population[fitness.indexOf(maxFitness)];
};

export const findElites = (
  population: Array<Individual>,
  eliteCount: number,
  dataset: Dataset
): Array<Individual> => {
  const fitness = populationFitness(population, dataset);
  const elites: Array<Individual> = [];
  for (let i = 0; i < eliteCount; i++) {
    const maxFitness = Math.max(...fitness);
    elites.push(population[fitness.indexOf(maxFitness)]);
    fitness[fitness.indexOf(maxFitness)] = -Infinity;
  }
  return elites;
};

export const crossover = (
  parent1: Individual,
  parent2: Individual,
  crossoverRate: number,
  dataset: Dataset
): Individual => {
  const child: Individual = {
    [dataset['classNames'][0]]: [],
    [dataset['classNames'][1]]: []
  };
  const wordCount = parent1[dataset['classNames'][0]].length;
  // crossover words between parents
  for (let i = 0; i < wordCount; i++) {
    if (Math.random() < crossoverRate) {
      child[dataset['classNames'][0]].push(parent1[dataset['classNames'][0]][i]);
      child[dataset['classNames'][1]].push(parent2[dataset['classNames'][1]][i]);
    } else {
      child[dataset['classNames'][0]].push(parent2[dataset['classNames'][0]][i]);
      child[dataset['classNames'][1]].push(parent1[dataset['classNames'][1]][i]);
    }
  }
  return child;
};

export const mutate = (
  individual: Individual,
  mutationRate: number,
  dataset: Dataset
): Individual => {
  const wordCount = individual[dataset['classNames'][0]].length;
  const vocab = dataset.vocab;
  for (let i = 0; i < wordCount; i++) {
    if (Math.random() < mutationRate) {
      individual[dataset['classNames'][0]][i] = vocab[Math.floor(Math.random() * vocab.length)];
    }
    if (Math.random() < mutationRate) {
      individual[dataset['classNames'][1]][i] = vocab[Math.floor(Math.random() * vocab.length)];
    }
  }
  return individual;
};

export const evolve = (
  population: Array<Individual>,
  eliteCount: number,
  crossoverRate: number,
  mutationRate: number,
  dataset: Dataset
): Array<Individual> => {
  const elites = findElites(population, eliteCount, dataset);
  const newPopulation: Array<Individual> = [];
  while (newPopulation.length < population.length) {
    // pick random two parents
    const parent1 = elites[Math.floor(Math.random() * elites.length)];
    const parent2 = elites[Math.floor(Math.random() * elites.length)];
    // crossover
    let child: Individual;
    do {
      child = crossover(parent1, parent2, crossoverRate, dataset);
      // mutate
      child = mutate(child, mutationRate, dataset);
    } while (
      child[dataset['classNames'][0]].length !== new Set(child[dataset['classNames'][0]]).size ||
      child[dataset['classNames'][1]].length !== new Set(child[dataset['classNames'][1]]).size
    );
    // add to new population
    newPopulation.push(child);
  }
  return newPopulation;
};

export const geneticAlgorithm = (
  populationSize: number,
  wordCount: number,
  eliteCount: number,
  crossoverRate: number,
  mutationRate: number,
  generations: number,
  dataset: Dataset
): Run => {
  // generate initial population
  let population = generatePopulation(populationSize, wordCount, dataset);
  const bestIndiviuals: Array<Individual> = [];
  const bestFitnesses: Array<number> = [];
  const averageFitnesses: Array<number> = [];
  // evolve for n generations
  for (let i = 0; i < generations; i++) {
    population = evolve(population, eliteCount, crossoverRate, mutationRate, dataset);
    const fittest = findFittest(population, dataset);
    bestIndiviuals.push(fittest);
    const fitness = findFitness(fittest, dataset);
    bestFitnesses.push(fitness);
    const averageFitness =
      populationFitness(population, dataset).reduce((a, b) => a + b, 0) / populationSize;
    averageFitnesses.push(averageFitness);
    console.log(`Generation ${i + 1}: ${fitness}`);
  }
  const runs = useGeneticStore().runs;
  const run: Run = {
    id: Date.now(),
    populationSize,
    dataset: `${dataset.classNames[0]} : ${dataset.classNames[1]}`,
    wordCount,
    generation: generations,
    mutationRate,
    crossoverRate,
    eliteCount,
    averageFitnesses,
    bestIndiviuals: bestIndiviuals,
    bestFitnesses: bestFitnesses
  };
  runs.push(run);
  return run;
};
