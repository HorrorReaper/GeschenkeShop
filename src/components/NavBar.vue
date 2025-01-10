<script setup lang="ts">
import { getCookie } from './ShopSite.vue';

</script>



<template>
  <header class="p-3 text-bg-dark" style="position: sticky;">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
          <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlink:href="#bootstrap"/></svg>
        </a>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><a href="/" class="nav-link px-2 text-secondary">Home</a></li>
          <li><a href="/shop" class="nav-link px-2 text-white">Shop</a></li>
          <li v-if="getCookie('email') === 'admin@admin.com'"><a href="/admin" class="nav-link px-2 text-white">AdminPanel</a></li>
        </ul>


        <div class="text-end">
          <button type="button" class="btn btn-outline-light me-2" onclick="window.location.href='/login'">Login</button>
          <button type="button" class="btn btn-warning" onclick="window.location.href='/signup'">Sign-up</button>
        </div>
        <img src="/shopping-cart.svg" alt="" onclick="document.location.href='/basket'" class="warenkorb">
      </div>
    </div>
  </header>

</template>
<style>
  .warenkorb{
    width: 30px; 
    height: 30px;
  }
  .warenkorb:hover{
    cursor: pointer;
  }
</style>

