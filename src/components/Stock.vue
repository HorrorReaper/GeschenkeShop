<script setup>
import { ref, onMounted } from 'vue';

const books = ref([]);
const errorMessage = ref('');

const fetchAvailableBooks = async () => {
  try {
    const response = await fetch('http://localhost:3000/available-books');
    if (!response.ok) {
      throw new Error('Error fetching books');
    }
    books.value = await response.json();
  } catch (error) {
    console.error('Error:', error);
    errorMessage.value = 'Failed to fetch available books.';
  }
};

onMounted(() => {
  fetchAvailableBooks();
});
</script>

<template>
    <div class="admin-panel">
      <h1>Admin Panel: Verfügbare Bücher</h1>
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ProduktID</th>
            <th>Produkttitel</th>
            <th>Autorname</th>
            <th>Lagerbestand</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.ProduktID">
            <td>{{ book.ProduktID }}</td>
            <td>{{ book.Produkttitel }}</td>
            <td>{{ book.Autorname }}</td>
            <td>{{ book.Lagerbestand }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>