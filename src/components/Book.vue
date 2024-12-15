<script setup>

defineProps({
  book: {
    type: Object,
    required: true,
  },

})
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
      <button class="btn btn-success btn-kaufen flex"> <img src="../../public/shopping-cart.svg" alt="">   In den Warenkorb</button>
    </div>
  </div>
</template>
<style>
    img{
        width:200px;
        height:200px;
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