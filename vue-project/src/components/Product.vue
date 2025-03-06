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
/* General Styling */
.container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
  font-family: "Inter", sans-serif;
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

/* Headings */
h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

/* Table */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #272727;
  color: white;
  font-weight: 600;
}

td {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

/* Input Fields */
input {
  padding: 8px;
  width: 150px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

/* Buttons */
button {
  padding: 10px 14px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.edit-btn {
  background-color: #346153;
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
  background-color: #75180e;
  color: white;
}

.add-btn {
  background-color:#272727;
  color: white;
}

/* Button Hover Effects */
button:hover {
  opacity: 0.85;
}

/* Add Form */
.add-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.add-form input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .add-form {
    flex-direction: column;
    align-items: center;
  }

  input {
    width: 100%;
  }

  table {
    font-size: 14px;
  }
}
</style>
