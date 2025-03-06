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
  description: "",
  reorder_level: "",
  rating: "",
});

// Fetch products from Supabase
const fetchProducts = async () => {
  let { data, error } = await supabase
    .from("product")
    .select("id, name, price, stock_quantity, category, description, reorder_level, rating");

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

// Validate input
const isValidInput = (product) => {
  return (
    Number.isInteger(product.price) && product.price >= 0 &&
    Number.isInteger(product.stock_quantity) && product.stock_quantity >= 0 &&
    Number.isInteger(product.reorder_level) && product.reorder_level >= 0 &&
    Number.isInteger(product.rating) && product.rating >= 1 && product.rating <= 5
  );
};

// Save updated data
const saveUpdate = async () => {
  if (!isValidInput(updatedProduct.value)) {
    alert("Invalid input. Ensure values are integers and rating is between 1 and 5.");
    return;
  }

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
  if (!isValidInput(newProduct.value)) {
    alert("Invalid input. Ensure values are integers and rating is between 1 and 5.");
    return;
  }

  const { error } = await supabase.from("product").insert([newProduct.value]);
  if (error) console.error(error);
  else {
    fetchProducts();
    newProduct.value = { name: "", price: "", stock_quantity: "", category: "", description: "", reorder_level: "", rating: "" };
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
          <th>Description</th>
          <th>Reorder Level</th>
          <th>Rating</th>
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
            <input v-model.number="updatedProduct.price" type="number" min="0" step="1" />
          </td>
          <td v-else>${{ product.price }}</td>

          <td v-if="editingProduct === product.id">
            <input v-model.number="updatedProduct.stock_quantity" type="number" min="0" step="1" />
          </td>
          <td v-else>{{ product.stock_quantity }}</td>

          <td v-if="editingProduct === product.id">
            <input v-model="updatedProduct.category" type="text" />
          </td>
          <td v-else>{{ product.category }}</td>

          <td v-if="editingProduct === product.id">
            <input v-model="updatedProduct.description" type="text" />
          </td>
          <td v-else>{{ product.description }}</td>

          <td v-if="editingProduct === product.id">
            <input v-model.number="updatedProduct.reorder_level" type="number" min="0" step="1" />
          </td>
          <td v-else>{{ product.reorder_level }}</td>

          <td v-if="editingProduct === product.id">
            <input v-model.number="updatedProduct.rating" type="number" min="1" max="5" step="1" />
          </td>
          <td v-else>{{ product.rating }}</td>

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
      <input v-model.number="newProduct.price" type="number" min="0" step="1" placeholder="Price" />
      <input v-model.number="newProduct.stock_quantity" type="number" min="0" step="1" placeholder="Stock Quantity" />
      <input v-model="newProduct.category" type="text" placeholder="Category" />
      <input v-model="newProduct.description" type="text" placeholder="Description" />
      <input v-model.number="newProduct.reorder_level" type="number" min="0" step="1" placeholder="Reorder Level" />
      <input v-model.number="newProduct.rating" type="number" min="1" max="5" step="1" placeholder="Rating (1-5)" />
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
