<script setup>
    function getDetails(produktID){
  console.log("Hallo" + produktID);
  document.location.href=`/books/${produktID}`;
    }
</script>
<template>
    <div>
      <h1 style="text-align: center;">Search Books</h1>
      <input
        type="text"
        v-model="query"
        placeholder="Search books by title, author, or code"
        class="form-control"
      />
      <div v-if="filteredBooks.length > 0 && query.length > 0" class="mt-4">
        <h2>Search Results:</h2>
        <ul class="list-group">
          <li v-for="book in filteredBooks" :key="book.ProduktID" class="list-group-item BookResult" v-on:click="getDetails(book.ProduktID)" >
            {{ book.Produkttitel }} by {{ book.Autorname }}
          </li>
        </ul>
      </div>
      <div v-else-if="query && filteredBooks.length === 0" class="mt-4">
        <p>No books found matching "{{ query }}".</p>
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    data() {
      return {
        query: '', // Search query input
        books: [], // List of all books
      };
    },
    computed: {
      filteredBooks() {
        const lowerCaseQuery = this.query.toLowerCase();
        return this.books.filter(
          (book) =>
            book.Produkttitel.toLowerCase().includes(lowerCaseQuery) ||
            book.Autorname.toLowerCase().includes(lowerCaseQuery) ||
            book.Produktcode.toLowerCase().includes(lowerCaseQuery)
        );
      },
    },
    methods: {
      async fetchBooks() {
        try {
          const response = await fetch('http://localhost:3000/books');
          if (!response.ok) {
            throw new Error('Failed to fetch books');
          }
          this.books = await response.json(); // Load books from backend
        } catch (error) {
          console.error('Error fetching books:', error);
        }
      },
    },
    mounted() {
      this.fetchBooks(); // Fetch books when component is mounted
    },
  };
  </script>
  <style>
    .BookResult:hover{
        cursor: pointer;
        background-color: aqua;
    }
</style>
  