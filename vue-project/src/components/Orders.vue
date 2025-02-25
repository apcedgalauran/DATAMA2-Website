<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase";

const orders = ref([]);

const fetchOrders = async () => {
  let { data, error } = await supabase.from("orders").select("*");
  if (error) console.error(error);
  else orders.value = data;
};

onMounted(fetchOrders);
</script>

<template>
  <div>
    <h2>Orders</h2>
    <ul>
      <li v-for="order in orders" :key="order.id">
        Order #{{ order.id }} - {{ order.status }} - ${{ order.total_amount }}
      </li>
    </ul>
  </div>
</template>
