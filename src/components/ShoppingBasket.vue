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
      <button class="btn btn-success" @click="checkout">Checkout</button>
      </div>
      
    </div>
    <div v-else>
      <p>Your shopping basket is empty.</p>
    </div>
  </div>
</template>
<script>
import { loadStripe } from '@stripe/stripe-js';

export default {
  data() {
    return {
      basket: [], // Warenkorb-Items
    };
  },
  async created() {
    // Warenkorb aus LocalStorage laden
    this.basket = JSON.parse(localStorage.getItem('shoppingBasket') || '[]');
  },
  methods: {
    async checkout() {
      try {
        const stripe = await loadStripe('pk_test_51OrGepF0DjJyfXppEbByuJp2utauNprM12oQoptWD7zhv5IxBfcIOtgI1iDXhEp7NFbHaORfqotMeZRXox5UZeid008RFjBZZH'); // Ersetze mit deinem Public Key

        // Sende den Warenkorb an das Backend
        const response = await fetch('http://localhost:3000/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: this.basket }),
        });

        const { id } = await response.json();

        // Stripe Checkout starten
        await stripe.redirectToCheckout({ sessionId: id });
      } catch (error) {
        console.error('Error during checkout:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
      }
    },
  },
};
</script>
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
