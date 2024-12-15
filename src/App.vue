<script setup>
import { RouterLink, RouterView } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar.vue';
import { reactive, provide, onMounted, watch } from 'vue';

const shoppingBasket = reactive([]); // Central state for the basket
provide('shoppingBasket', shoppingBasket); // Make it available to child components
onMounted(() => {
  const savedBasket = JSON.parse(localStorage.getItem('shoppingBasket') || '[]');
  shoppingBasket.push(...savedBasket);
});

watch(
  () => shoppingBasket,
  (newBasket) => {
    localStorage.setItem('shoppingBasket', JSON.stringify(newBasket));
  },
  { deep: true }
);
</script>

<template>
  <NavBar/>
  <RouterView />
</template>
