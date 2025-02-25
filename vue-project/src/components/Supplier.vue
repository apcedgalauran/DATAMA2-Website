<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase";

const suppliers = ref([]);

const fetchSuppliers = async () => {
  let { data, error } = await supabase.from("supplier").select("*");
  if (error) console.error(error);
  else suppliers.value = data;
};

onMounted(fetchSuppliers);
</script>

<template>
  <div>
    <h2>Suppliers</h2>
    <ul>
      <li v-for="supplier in suppliers" :key="supplier.id">
        {{ supplier.name }} - {{ supplier.phone_number }} - {{ supplier.country }}
      </li>
    </ul>
  </div>
</template>
