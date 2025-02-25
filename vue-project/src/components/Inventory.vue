<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase";

const inventory = ref([]);

const fetchInventory = async () => {
  let { data, error } = await supabase.from("INVENTORY").select("*");
  if (error) console.error(error);
  else inventory.value = data;
};

onMounted(fetchInventory);
</script>

<template>
  <div>
    <h2>Inventory List</h2>
    <ul>
      <li v-for="item in inventory" :key="item.id">
        {{ item.location }} - {{ item.stock_quantity }} units
      </li>
    </ul>
  </div>
</template>
