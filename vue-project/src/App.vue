<template>
  <div class="container">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <button @click="currentView = 'Inventory'">Inventory</button>
      <button @click="currentView = 'Orders'">Orders</button>
      <button @click="currentView = 'Products'">Products</button>
      <button @click="currentView = 'Suppliers'">Suppliers</button>
    </nav>

    <!-- Main Content (Tables) -->
    <div class="content">
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
import Products from "./components/Product.vue";
import Suppliers from "./components/Supplier.vue";
import './main.css';

export default {
  components: { Inventory, Orders, Products, Suppliers },
  data() {
    return {
      currentView: "Inventory", // Default view
    };
  },
};
</script>

<style scoped>

/* Navigation Bar */
.navbar {
  background: #272727;
  padding: 15px 30px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}


</style>
