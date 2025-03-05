<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const inventory = ref([]);
const editingItem = ref(null);
const updatedItem = ref({});
const newItem = ref({
  reorder_level: "",
  stock_quantity: "",
  restock_date: "",
  restock_quantity: "",
  location: "",
});

// Fetch inventory data
const fetchInventory = async () => {
  let { data, error } = await supabase
    .from("inventory")
    .select("id, reorder_level, stock_quantity, restock_date, restock_quantity, location, time_update");
  
  if (error) console.error(error);
  else inventory.value = data;
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

// Save updated data
const saveUpdate = async () => {
  const { id, ...fields } = updatedItem.value;
  const { error } = await supabase
    .from("inventory")
    .update(fields)
    .eq("id", id);

  if (error) console.error(error);
  else {
    fetchInventory();
    cancelEditing();
  }
};

// Add a new inventory item
const addItem = async () => {
  const { error } = await supabase.from("inventory").insert([newItem.value]);
  if (error) console.error(error);
  else {
    fetchInventory();
    newItem.value = {
      reorder_level: "",
      stock_quantity: "",
      restock_date: "",
      restock_quantity: "",
      location: "",
    };
  }
};

// Delete an inventory item
const deleteItem = async (id) => {
  const { error } = await supabase.from("inventory").delete().eq("id", id);
  if (error) console.error(error);
  else fetchInventory();
};

onMounted(fetchInventory);
</script>

<template>
  <div class="container">
    <h2>📦 Inventory Management</h2>
    
    <!-- Inventory Table -->
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Reorder Level</th>
          <th>Stock Quantity</th>
          <th>Restock Date</th>
          <th>Restock Quantity</th>
          <th>Location</th>
          <th>Last Updated</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in inventory" :key="item.id">
          <td>{{ item.id }}</td>

          <!-- Editable Fields -->
          <td v-if="editingItem === item.id">
            <input v-model="updatedItem.reorder_level" type="number" />
          </td>
          <td v-else>{{ item.reorder_level }}</td>

          <td v-if="editingItem === item.id">
            <input v-model="updatedItem.stock_quantity" type="number" />
          </td>
          <td v-else>{{ item.stock_quantity }}</td>

          <td v-if="editingItem === item.id">
            <input v-model="updatedItem.restock_date" type="datetime-local" />
          </td>
          <td v-else>{{ new Date(item.restock_date).toLocaleString() }}</td>

          <td v-if="editingItem === item.id">
            <input v-model="updatedItem.restock_quantity" type="number" />
          </td>
          <td v-else>{{ item.restock_quantity }}</td>

          <td v-if="editingItem === item.id">
            <input v-model="updatedItem.location" type="text" />
          </td>
          <td v-else>{{ item.location }}</td>

          <td>{{ new Date(item.time_update).toLocaleString() }}</td>

          <!-- Action Buttons -->
          <td>
            <button v-if="editingItem === item.id" class="save-btn" @click="saveUpdate">Save</button>
            <button v-if="editingItem === item.id" class="cancel-btn" @click="cancelEditing">Cancel</button>
            <button v-else class="edit-btn" @click="startEditing(item)">Edit</button>
            <button class="delete-btn" @click="deleteItem(item.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add New Inventory -->
    <h3>Add New Inventory</h3>
    <div class="add-form">
      <input v-model="newItem.reorder_level" type="number" placeholder="Reorder Level" />
      <input v-model="newItem.stock_quantity" type="number" placeholder="Stock Quantity" />
      <input v-model="newItem.restock_date" type="datetime-local" />
      <input v-model="newItem.restock_quantity" type="number" placeholder="Restock Quantity" />
      <input v-model="newItem.location" type="text" placeholder="Location" />
      <button class="add-btn" @click="addItem">Add</button>
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
  background-color: #4CAF50;
  color: white;
}

input {
  padding: 5px;
  width: 100px;
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
