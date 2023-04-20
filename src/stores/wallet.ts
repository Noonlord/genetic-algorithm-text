import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useWalletStore = defineStore('wallet', () => {
  const wallet = ref('');
  const shortenedWallet = computed(() => wallet.value.slice(0, 5) + '...' + wallet.value.slice(-5));
  return { wallet, shortenedWallet };
});
