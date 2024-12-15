<script setup>

defineProps({
  book: {
    type: Object,
    required: true,
  },

})
import { inject } from 'vue';

const shoppingBasket = inject('shoppingBasket'); // Access shared basket
const addToBasket = (book) => {
  const existingBook = shoppingBasket.find((item) => item.ProduktID === book.ProduktID);
  if (existingBook) {
    existingBook.quantity += 1; // Increment quantity if the book is already in the basket
  } else {
    shoppingBasket.push({ ...book, quantity: 1 }); // Add new book with quantity 1
  }
};
</script>

<template>
  <div class="card">
    <img :src="book.LinkGrafikdatei" alt="Book Image" />
    <div class="card-body">
        <h4 class="card-title">{{ book.Produkttitel }}</h4>
        <p class="card-text">
        {{ book.Autorname }}
        </p>
        <p class="card-text">{{ book.Verlagsname}}</p>
    </div>
    <div class="buttons flex ">
      <button class="btn btn-success btn-kaufen flex" @click="addToBasket(book)"> <img src="../../public/shopping-cart.svg" alt="">   In den Warenkorb</button>
    </div>
  </div>
</template>
<style>
    img{
        width:170px;
        height:170px;
        margin-left: 30px;
    }
    .btn-kaufen{
      text-align: left;
      gap:5px;
    }
    .btn-kaufen img{
      width:30px;
      height: 30px;
      margin-left: 0px;
      color: white;
    }
    
</style>