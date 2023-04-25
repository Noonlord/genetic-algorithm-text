<script setup lang="ts">
import { useHelloStore } from '@/stores/hello';

const hello = useHelloStore().hello;
</script>

<template>
  <main>
    <h class="text-2xl text-blue-500"> {{ hello }} </h>
  </main>
</template>
