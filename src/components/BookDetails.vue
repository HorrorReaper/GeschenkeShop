<script setup>
</script>
<template>
    <h1>Hallo {{ email }}</h1>
      <div class="books">
          <p v-if="loading == true">Lade Bücher...</p>
          <Book v-for="book in books" :key="book.ProduktID" :book="book" class="Book" v-on:click="getDetails(book.ProduktID)"/>
      </div>
    
  </template>