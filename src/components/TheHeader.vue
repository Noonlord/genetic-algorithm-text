<script setup lang="ts">
import { useWalletStore } from '@/stores/wallet';
import { PeraWalletConnect } from '@perawallet/connect';
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';

const peraWallet = new PeraWalletConnect();
const walletStore = useWalletStore();
const connectWithPera = async () => {
  try {
    const accounts = await peraWallet.connect();
    const data = accounts[0];
    walletStore.wallet = data;
    localStorage.setItem('wallet', data);
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  const wallet = localStorage.getItem('wallet');
  if (wallet) {
    walletStore.wallet = wallet;
  }
});
</script>

<template>
  <header class="flex px-12 justify-between bg-blue-100 rounded-b-md">
    <img alt="Vue logo" class="w-16 h-16" src="@/assets/logo.svg" />
    <div class="flex gap-2 w-fit my-auto">
      <RouterLink to="/" class="my-auto">Home</RouterLink>
      <RouterLink to="/about" class="my-auto">About</RouterLink>
      <button class="bg-blue-400 shadow-md text-slate-50 rounded-md p-2" @click="connectWithPera">
        {{ walletStore.wallet ? walletStore.shortenedWallet : 'Connect' }}
      </button>
    </div>
  </header>
</template>
