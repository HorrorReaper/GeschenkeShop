
  <script setup>
import { ref, onMounted } from 'vue'; // Use Composition API
import { useRoute } from 'vue-router'; // To access route parameters

// Reactive variables
const book = ref(null); // To store the fetched book details
const error = ref(null); // To store any error messages
const route = useRoute(); // Access route parameters

// Fetch book details
const fetchBookDetails = async () => {
  const bookId = route.params.bookId; // Get bookId from route params
  try {
    const response = await fetch(`http://localhost:3000/books/${bookId}`); // API call
    if (!response.ok) {
      throw new Error('Book not found');
    }
    book.value = await response.json(); // Set the book data
  } catch (err) {
    console.error('Error fetching book details:', err);
    error.value = err.message; // Set the error message
  }
};

// Fetch details when the component is mounted
onMounted(fetchBookDetails);

import { inject } from 'vue';

const shoppingBasket = inject('shoppingBasket'); // Access shared basket
const addToBasket = (book) => {
  alert("Du hast gerade gedrückt, herzlichen Glückwunsch");
  const existingBook = shoppingBasket.find((item) => item.ProduktID === book.ProduktID);
  if (existingBook) {
    alert("Buch bereits im Warenkorb, füge eins hinzu");
    existingBook.quantity += 1; // Increment quantity if the book is already in the basket
  } else {
    alert("Buch neu hinzugefügt: " + book);
    shoppingBasket.push({ ...book, quantity: 1 }); // Add new book with quantity 1
  }
  alert(shoppingBasket);
};
</script>

<template>
  <div class="conatiner flex book-container">
    <!-- Display errors, if any -->
    <p v-if="error" class="text-danger">{{ error }}</p>

    <!-- Display book details -->
    <div v-else-if="book" class=" card-book">
        <div class="flex book-header-section" style="display: flex;">
            <img :src="book.LinkGrafikdatei" alt="Book Image" />
            <div class="details">
                <h1>{{ book.Produkttitel }}</h1>
                <h3>{{ book.Kurzinhalt }}</h3>
            </div>
        </div>
        
      <!--<p><strong>Book ID:</strong> {{ book.ProduktID }}</p>-->
      <hr>
        <div class="flex book-details-section" style="display:flex; margin-left: 50px;">
            <div class="author-section" style="display: flex;">
                <img src="/user.svg" alt="">
                <div class="details">
                    <p><strong>Author:</strong><br> {{ book.Autorname }}</p>
                </div>
            </div>
            <div class="author-section" style="display: flex;">
                <img src="/verlag.svg" alt="">
                <div class="details">
                    <p><strong>Publisher:</strong><br> {{ book.Verlagsname }}</p>
                </div>
            </div>
            <div class="author-section" style="display: flex;">
                <img src="/weight.svg" alt="">
                <div class="details">
                    <p><strong>Weight:</strong><br> {{ book.Gewicht }} kg</p>
                </div>
            </div>
            
            
            
        </div>
      <hr>
      
      <p><strong>Kaufpreis:</strong><br> {{ parseFloat(book.PreisBrutto).toFixed(2) }}€ inkl. 7% MwSt</p>
      <p v-if="book.Lagerbestand >= 10"><strong style="color: chartreuse;">Produkt ist verfügbar</strong></p>
      <p v-else-if="book.Lagerbestand < 10" style="color: red;"><strong>Beeil dich, nur noch {{ book.Lagerbestand }} verfügbar!</strong></p>
      <p v-else-if="book.Lagerbestand == 0" style="color: red; font-weight: bold;">Produkt ist ausverkauft!</p>
      
      

      
      <button class="btn btn-success btn-kaufen flex" @click="addToBasket(book)"> <img src="/shopping-cart.svg" alt="">   In den Warenkorb</button>
    </div>

    <!-- Loading indicator -->
    <p v-else>Loading book details...</p>
  </div>
</template>
<style>
.book-container{
    place-content: center;
    padding-left: 20vw;
}
.book-header-section img{
    width: 300px;
    height: 300px;
}
.book-details-section{
    margin-top: 20px;
}
.book-details-section img{
    width: 50px;
    height: 50px;
    margin-right: 5px;
}
.book-details-section p{
    margin-right: 50px;
}
.book-container h3{
    font-size: x-large;
}
.book-container .card-book{
    padding: 20px;
    border:1px solid black;
    width: 1000px;
    margin-top: 50px;
}

</style>
