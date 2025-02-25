<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase";

const products = ref([]);

const fetchProducts = async () => {
  let { data, error } = await supabase.from("product").select("*");
  if (error) console.error(error);
  else products.value = data;
};

onMounted(fetchProducts);
</script>

<template>
  <div>
    <h2>Products</h2>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.name }} - ${{ product.price }} - {{ product.stock_quantity }} in stock
      </li>
    </ul>
  </div>
</template>
