<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const inventory = ref([]);

const fetchInventory = async () => {
  let { data, error } = await supabase
    .from("inventory")
    .select("id, reorder_level, stock_quantity, restock_date, restock_quantity, location, time_update");

  if (error) console.error(error);
  else inventory.value = data;
};

onMounted(fetchInventory);
</script>

<template>
  <div>
    <h2>Inventory List</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Reorder Level</th>
          <th>Stock Quantity</th>
          <th>Restock Date</th>
          <th>Restock Quantity</th>
          <th>Location</th>
          <th>Last Updated</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in inventory" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.reorder_level }}</td>
          <td>{{ item.stock_quantity }}</td>
          <td>{{ item.restock_date ? new Date(item.restock_date).toLocaleString() : "N/A" }}</td>
          <td>{{ item.restock_quantity }}</td>
          <td>{{ item.location || "N/A" }}</td>
          <td>{{ new Date(item.time_update).toLocaleString() }}</td>
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
