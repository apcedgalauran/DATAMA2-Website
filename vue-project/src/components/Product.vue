<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const products = ref([]);
const editingProduct = ref(null);
const updatedProduct = ref({});
const newProduct = ref({
  name: "",
  price: "",
  stock_quantity: "",
  category: "",
});

// Fetch products from Supabase
const fetchProducts = async () => {
  let { data, error } = await supabase
    .from("product")
    .select("id, name, price, stock_quantity, category");

  if (error) console.error(error);
  else products.value = data;
};

// Enable editing mode
const startEditing = (product) => {
  editingProduct.value = product.id;
  updatedProduct.value = { ...product };
};

// Cancel editing mode
const cancelEditing = () => {
  editingProduct.value = null;
  updatedProduct.value = {};
};

// Save updated data
const saveUpdate = async () => {
  const { id, ...fields } = updatedProduct.value;
  const { error } = await supabase.from("product").update(fields).eq("id", id);

  if (error) console.error(error);
  else {
    fetchProducts();
    cancelEditing();
  }
};

// Add a new product
const addProduct = async () => {
  const { error } = await supabase.from("product").insert([newProduct.value]);
  if (error) console.error(error);
  else {
    fetchProducts();
    newProduct.value = { name: "", price: "", stock_quantity: "", category: "" };
  }
};

// Delete a product
const deleteProduct = async (id) => {
  const { error } = await supabase.from("product").delete().eq("id", id);
  if (error) console.error(error);
  else fetchProducts();
};

onMounted(fetchProducts);
</script>

<template>
  <div class="container">
    <h2>📦 Product Management</h2>

    <!-- Products Table -->
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Stock Quantity</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>

          <!-- Editable Fields -->
          <td v-if="editingProduct === product.id">
            <input v-model="updatedProduct.name" type="text" />
          </td>
          <td v-else>{{ product.name }}</td>

          <td v-if="editingProduct === product.id">
            <input v-model="updatedProduct.price" type="number" />
          </td>
          <td v-else>${{ product.price }}</td>

          <td v-if="editingProduct === product.id">
            <input v-model="updatedProduct.stock_quantity" type="number" />
          </td>
          <td v-else>{{ product.stock_quantity }}</td>

          <td v-if="editingProduct === product.id">
            <input v-model="updatedProduct.category" type="text" />
          </td>
          <td v-else>{{ product.category }}</td>

          <!-- Action Buttons -->
          <td>
            <button v-if="editingProduct === product.id" class="save-btn" @click="saveUpdate">Save</button>
            <button v-if="editingProduct === product.id" class="cancel-btn" @click="cancelEditing">Cancel</button>
            <button v-else class="edit-btn" @click="startEditing(product)">Edit</button>
            <button class="delete-btn" @click="deleteProduct(product.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add New Product -->
    <h3>Add New Product</h3>
    <div class="add-form">
      <input v-model="newProduct.name" type="text" placeholder="Product Name" />
      <input v-model="newProduct.price" type="number" placeholder="Price" />
      <input v-model="newProduct.stock_quantity" type="number" placeholder="Stock Quantity" />
      <input v-model="newProduct.category" type="text" placeholder="Category" />
      <button class="add-btn" @click="addProduct">Add</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

h2 {
  margin-bottom: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

th {
  background-color: #007bff;
  color: white;
}

input {
  padding: 5px;
  width: 120px;
  border: 1px solid #ccc;
}

button {
  padding: 7px 12px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin: 3px;
}

.edit-btn {
  background-color: #f0ad4e;
  color: white;
}

.save-btn {
  background-color: #5cb85c;
  color: white;
}

.cancel-btn {
  background-color: #d9534f;
  color: white;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.add-btn {
  background-color: #3498db;
  color: white;
}

.add-form {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.add-form input {
  padding: 5px;
  border: 1px solid #ddd;
}
</style>
