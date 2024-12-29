<script setup>
import { ref, onMounted } from 'vue';

const orders = ref([]);
const errorMessage = ref('');

const fetchOrders = async () => {
  try {
    const response = await fetch('http://localhost:3000/orders');
    if (!response.ok) {
      throw new Error('Error fetching books');
    }
    orders.value = await response.json();
  } catch (error) {
    console.error('Error:', error);
    errorMessage.value = 'Failed to fetch orders.';
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<template>
    <div class="admin-panel">
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>BestellNr</th>
            <th>Username</th>
            <th>Email</th>
            <th>Produktcode</th>
            <th>Produkttitel</th>
            <th>Preisbrutto</th>
            <th>Menge</th>
            <th>Status</th>
            <th>Gesamtpreis </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.BestellNr">
            <td>{{ order.BestellNr }}</td>
            <td>{{ order.Username }}</td>
            <td>{{ order.Email }}</td>
            <td>{{ order.Produktcode }}</td>
            <td>{{ order.Produkttitel }}</td>
            <td>{{ order.Preisbrutto }}</td>
            <td>{{ order.Menge }}</td>
            <td>{{ order.Status }}</td>
            <td>{{ order.Gesamtpreis  }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>