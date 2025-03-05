<template>
  <div class="container">
    <nav class="navbar">
      <button @click="currentView = 'Inventory'">Inventory</button>
      <button @click="currentView = 'Orders'">Orders</button>
      <button @click="currentView = 'Products'">Products</button>
      <button @click="currentView = 'Suppliers'">Suppliers</button>
    </nav>

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
/* Centering the entire content */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f4f4; /* Light gray background */
  padding: 20px;
}

/* Styling the navigation bar */
.navbar {
  background: #007bff; /* Blue background */
  padding: 15px 30px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

/* Styling the buttons */
button {
  padding: 10px 20px;
  border: none;
  background-color: white;
  color: #007bff;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
  color: white;
}

/* Content styling */
.content {
  width: 80%;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
