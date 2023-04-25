import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useHelloStore = defineStore('hello', () => {
  const hello = ref('Hello world!');

  return {
    hello
  };
});
