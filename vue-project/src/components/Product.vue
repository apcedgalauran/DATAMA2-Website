<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const products = ref([]);
const editingItem = ref(null);
const updatedItem = ref({});
const newItem = ref({
  name: "",
  description: "",
  price: 0,
  stock_quantity: 0,
  reorder_level: 0,
  rating: 0,
});

// Fetch products
const fetchProducts = async () => {
  let { data, error } = await supabase.from("product").select("*");
  if (error) console.error(error);
  else products.value = data;
};

// Validate numbers (prevent negative values)
const validateNumber = (event, field) => {
  if (event.target.value < 0) {
    updatedItem.value[field] = 0;
  }
};

// Validate numbers for new products
const validateNewNumber = (event, field) => {
  if (event.target.value < 0) {
    newItem.value[field] = 0;
  }
};

// Enable editing mode
const startEditing = (item) => {
  editingItem.value = item.id;
  updatedItem.value = { ...item };
};

// Cancel editing mode
const cancelEditing = () => {
  editingItem.value = null;
  updatedItem.value = {};
};

// Save updated product
const saveUpdate = async () => {
  const { id, ...fields } = updatedItem.value;
  const { error } = await supabase.from("product").update(fields).eq("id", id);

  if (error) console.error(error);
  else {
    fetchProducts();
    cancelEditing();
  }
};

// Add a new product
const addItem = async () => {
  const { error } = await supabase.from("product").insert([newItem.value]);
  if (error) console.error(error);
  else {
    fetchProducts();
    newItem.value = {
      name: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      reorder_level: 0,
      rating: 0,
    };
  }
};

// Delete a product
const deleteItem = async (id) => {
  const { error } = await supabase.from("product").delete().eq("id", id);
  if (error) console.error(error);
  else fetchProducts();
};

onMounted(fetchProducts);
</script>

<template>
  <div class="container">
    <h2>📦 Product Management</h2>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Stock Quantity</th>
          <th>Reorder Level</th>
          <th>Rating</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.id }}</td>

          <td v-if="editingItem === item.id">
            <input v-model="updatedItem.name" type="text" />
          </td>
          <td v-else>{{ item.name }}</td>

          <td v-if="editingItem === item.id">
            <input v-model="updatedItem.description" type="text" />
          </td>
          <td v-else>{{ item.description || "N/A" }}</td>

          <td v-if="editingItem === item.id">
            <input v-model="updatedItem.price" type="number" min="0" />
          </td>
          <td v-else>${{ item.price }}</td>

          <td v-if="editingItem === item.id">
            <input v-model="updatedItem.stock_quantity" type="number" @input="validateNumber($event, 'stock_quantity')" />
          </td>
          <td v-else>{{ item.stock_quantity }}</td>

          <td v-if="editingItem === item.id">
            <input v-model="updatedItem.reorder_level" type="number" @input="validateNumber($event, 'reorder_level')" />
          </td>
          <td v-else>{{ item.reorder_level }}</td>

          <td v-if="editingItem === item.id">
            <input v-model="updatedItem.rating" type="number" min="0" max="5" @input="validateNumber($event, 'rating')" />
          </td>
          <td v-else>{{ item.rating }}/5</td>

          <td>
            <button v-if="editingItem === item.id" class="save-btn" @click="saveUpdate">Save</button>
            <button v-if="editingItem === item.id" class="cancel-btn" @click="cancelEditing">Cancel</button>
            <button v-else class="edit-btn" @click="startEditing(item)">Edit</button>
            <button class="delete-btn" @click="deleteItem(item.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h3>Add New Product</h3>
    <div class="add-form">
      <input v-model="newItem.name" type="text" placeholder="Product Name" />
      <input v-model="newItem.description" type="text" placeholder="Description" />
      <input v-model="newItem.price" type="number" min="0" placeholder="Price" />
      <input v-model="newItem.stock_quantity" type="number" placeholder="Stock Quantity" @input="validateNewNumber($event, 'stock_quantity')" />
      <input v-model="newItem.reorder_level" type="number" placeholder="Reorder Level" @input="validateNewNumber($event, 'reorder_level')" />
      <input v-model="newItem.rating" type="number" min="0" max="5" placeholder="Rating (0-5)" @input="validateNewNumber($event, 'rating')" />
      <button class="add-btn" @click="addItem">Add</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  text-align: center;
  font-famil