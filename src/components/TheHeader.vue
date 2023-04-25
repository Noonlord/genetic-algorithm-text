<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <header class="flex px-12 justify-between bg-blue-100 rounded-b-md">
    <img alt="Vue logo" class="w-16 h-16" src="@/assets/logo.svg" />
    <div class="flex gap-2 w-fit my-auto">
      <RouterLink to="/" class="my-auto">Home</RouterLink>
      <RouterLink to="/about" class="my-auto">About</RouterLink>
    </div>
  </header>
</template>
