<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const orders = ref([]);

const fetchOrders = async () => {
  let { data, error } = await supabase
    .from("orders")
    .select("id, date, total_amount, status, notes, customer_id, shipping_id");

  if (error) console.error(error);
  else orders.value = data;
};

onMounted(fetchOrders);
</script>

<template>
  <div>
    <h2>Orders</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Total Amount</th>
          <th>Status</th>
          <th>Notes</th>
          <th>Customer ID</th>
          <th>Shipping ID</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ new Date(order.date).toLocaleString() }}</td>
          <td>${{ order.total_amount }}</td>
          <td>{{ order.status }}</td>
          <td>{{ order.notes || "N/A" }}</td>
          <td>{{ order.customer_id || "N/A" }}</td>
          <td>{{ order.shipping_id || "N/A" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
