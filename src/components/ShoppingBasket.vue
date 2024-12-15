<script setup>
import { inject } from 'vue';

const shoppingBasket = inject('shoppingBasket'); // Access shared basket

const removeFromBasket = (bookId) => {
  const index = shoppingBasket.findIndex((item) => item.ProduktID === bookId);
  if (index !== -1) {
    shoppingBasket.splice(index, 1); // Remove item from the basket
  }
};

const updateQuantity = (bookId, quantity) => {
  const book = shoppingBasket.find((item) => item.ProduktID === bookId);
  if (book) {
    book.quantity = Math.max(1, quantity); // Ensure quantity is at least 1
  }
};
const calculateTotal = () => {
  return shoppingBasket.reduce((total, item) => {
    return total + item.PreisBrutto * item.quantity;
  }, 0).toFixed(2); // Format to 2 decimal places
};
</script>

<template>
  <div style="display: flex; align-content: center; justify-content: center; background-color: gray; height: 80vh;">
    <div v-if="shoppingBasket.length" class="basket-container">
      <div v-for="item in shoppingBasket" :key="item.ProduktID"  class="basketItem">
        <img :src="item.LinkGrafikdatei" alt="">
        <div class="details">
            <p><strong>{{ item.Produkttitel }}</strong></p>
        <p>Price: {{ parseFloat(item.PreisBrutto).toFixed(2) }}€</p>
        <p>Quantity: 
          <input type="number" v-model.number="item.quantity" @input="updateQuantity(item.ProduktID, item.quantity)" />
        </p>
        <button @click="removeFromBasket(item.ProduktID)"><img src="/trash.svg" class="deleteIMG"/></button>
        </div>
        
        
        <hr />
      </div>
      <hr>
      <div class="flex">
        <p><strong>Total:</strong> {{ calculateTotal() }}€</p>
      <button class="btn btn-success">Checkout</button>
      </div>
      
    </div>
    <div v-else>
      <p>Your shopping basket is empty.</p>
    </div>
  </div>
</template>
<style>
.basket-container{
    width:30vw;
    background-color: white;
    margin-top: 10vh;
    height: max-content;
    padding: 20px;
}
.basketItem{
    display: flex;
    margin-bottom: 30px;
}
.basketItem img{
    margin-right: 20px;
    width: 130px;
    height: 130px;
}
.flex{
    display:flex;
}
.basketItem .deleteIMG{
    width: 20px;
    height: 20px;
    margin: 5px;
    padding: 0;
}
.basketItem button{
    border:none;
    border-radius: 100%;
    background-color: rgb(247, 72, 72);
    color: white;
}
.basketItem button:hover{
    background-color: rgb(255, 119, 119);
}
</style>
