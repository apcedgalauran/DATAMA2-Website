<template>
  <div>
    <nav>
      <button @click="currentView = 'Inventory'">Inventory</button>
      <button @click="currentView = 'Orders'">Orders</button>
      <button @click="currentView = 'Products'">Products</button>
      <button @click="currentView = 'Suppliers'">Suppliers</button>
    </nav>

    <div>
      <Inventory v-if="currentView === 'Inventory'" />
      <Orders v-if="currentView === 'Orders'" />
      <Products v-if="currentView === 'Products'" />
      <Suppliers v-if="currentView === 'Suppliers'" />
    </div>
  </div>
</template>

<script>
import Inventory from "./components/Inventory.vue";
import Orders from "./components/Orders.vue";
import Products from "./components/Products.vue";
import Suppliers from "./components/Suppliers.vue";

export default {
  components: { Inventory, Orders, Products, Suppliers },
  data() {
    return {
      currentView: "Inventory", // Default view
    };
  },
};
</script>

<style>
nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

button {
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}
</style>
