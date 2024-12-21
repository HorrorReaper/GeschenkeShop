<script setup>
import Orders from './Orders.vue';
import Stock from './Stock.vue';



</script>
<template>
    <h1>Admin Panel</h1>
    <hr>
    <h2>Lager</h2>
    <Stock/>
    <h2>Bestellungen</h2>
    <Orders/>
    <h2>Benutzer</h2>
    
</template>

<style>
    h1,h2{
        text-align: center;
    }
</style>