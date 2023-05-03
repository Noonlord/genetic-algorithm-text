<script setup lang="ts">
import { datasets } from '@/data/datasets';
import { useGeneticStore, type Run } from '@/stores/geneticStore';
import { geneticAlgorithm } from '@/utils/genetic';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  registerables,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ref } from 'vue';
import { Line } from 'vue-chartjs';

ChartJS.register(...registerables);

const populationSize = ref<number>(100);
const wordCount = ref<number>(10);
const eliteCount = ref<number>(10);
const crossoverRate = ref<number>(0.5);
const mutationRate = ref<number>(0.1);
const generations = ref<number>(100);
const dataset = ref<number>(0);

const runs = useGeneticStore().runs;
const currentRun = ref<number>(0);

const run = () => {
  console.log(
    geneticAlgorithm(
      populationSize.value,
      wordCount.value,
      eliteCount.value,
      crossoverRate.value,
      mutationRate.value,
      generations.value,
      datasets[dataset.value]
    )
  );
  currentRun.value = runs.length - 1;
};

const convertRunToChart = (run: Run) => {
  const labels = run.bestFitnesses.map((_, index) => index);
  const data = run.bestFitnesses.map((fitness) => fitness);
  const chart = {
    labels: labels,
    datasets: [
      {
        label: 'Best Fitness',
        data: run.bestFitnesses.map((fitness) => fitness)
      },
      {
        label: 'Average Fitness',
        data: run.averageFitnesses.map((fitness) => fitness)
      }
    ]
  };
  console.log(chart);
  return chart;
};
</script>

<template>
  <main>
    <div class="flex gap-2 flex-col w-fit mx-auto text-right mt-2">
      <div>
        <label class="text-slate-900">Population Size: </label>
        <input
          v-model="populationSize"
          type="number"
          class="bg-blue-200 rounded-md text-slate-900 p-1"
        />
      </div>
      <div>
        <label class="text-slate-900">Word Count: </label>
        <input
          v-model="wordCount"
          type="number"
          class="bg-blue-200 rounded-md text-slate-900 p-1"
        />
      </div>
      <div>
        <label class="text-slate-900">Elite Count: </label>
        <input
          v-model="eliteCount"
          type="number"
          class="bg-blue-200 rounded-md text-slate-900 p-1"
        />
      </div>
      <div>
        <label class="text-slate-900">Crossover Rate: </label>
        <input
          v-model="crossoverRate"
          type="number"
          class="bg-blue-200 rounded-md text-slate-900 p-1"
        />
      </div>
      <div>
        <label class="text-slate-900">Mutation Rate: </label>
        <input
          v-model="mutationRate"
          type="number"
          class="bg-blue-200 rounded-md text-slate-900 p-1"
        />
      </div>
      <div>
        <label class="text-slate-900">Generations: </label>
        <input
          v-model="generations"
          type="number"
          class="bg-blue-200 rounded-md text-slate-900 p-1"
        />
      </div>
      <div>
        <label class="text-slate-900">Dataset: </label>
        <select v-model="dataset" class="bg-blue-200 rounded-md text-slate-900 p-1">
          <option v-for="(dataset, index) in datasets" :key="index" :value="index">
            {{ `${dataset.classNames[0]} : ${dataset.classNames[1]}` }}
          </option>
        </select>
      </div>
    </div>
    <div class="flex flex-col justify-center">
      <button
        class="mx-auto bg-blue-200 text-slate-900 px-2 py-1 text-lg shadow-sm hover:shadow-none rounded-md my-2"
        @click="run"
      >
        Run
      </button>
      <div class="mx-auto bg-blue-200 text-slate-900 p-4 rounded-md">
        Runs:
        <select v-model="currentRun">
          <option v-for="(run, index) in runs" :key="index" :value="index">
            {{ index + 1 }}
          </option>
        </select>
        <br />
        Best Fitness: {{ runs[currentRun]?.bestFitnesses.slice(-1)[0] }} <br />
        Best Individual:
        {{ runs[currentRun]?.bestIndiviuals.slice(-1)[0] }}
        <br />
        Dataset: {{ runs[currentRun]?.dataset }}
      </div>
      <div v-if="runs.length > 0" class="w-[55rem] h-[55rem] mx-auto">
        <Line :data="convertRunToChart(runs[currentRun])" />
      </div>
    </div>
  </main>
</template>
