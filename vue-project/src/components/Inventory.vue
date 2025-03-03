<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const inventory = ref([]);
const editingItem = ref(null); // Tracks which item is being edited
const updatedItem = ref({}); // Holds the updated values

// Fetch inventory data
const fetchInventory = async () => {
  let { data, error } = await supabase
    .from("inventory")
    .select("id, reorder_level, stock_quantity, restock_date, restock_quantity, location, time_update");

  if (error) console.error(error);
  else inventory.value = data;
};

// Enable editing for a specific item
const startEditing = (item) => {
  editingItem.value = item.id;
  updatedItem.value = { ...item }; // Copy existing values for modification
};

// Cancel editing mode
const cancelEditing = () => {
  editingItem.value = null;
  updatedItem.value = {};
};

// Save the updated data to Supabase
const saveUpdate = async () => {
  const { id, reorder_level, stock_quantity, restock_date, restock_quantity, location } = updatedItem.value;
  
  const { error } = await supabase
    .from("inventory")
    .update({ reorder_level, stock_quantity, restock_date, restock_quantity, location })
    .eq("id", id);

  if (error) {
    console.error("Error updating record:", error);
  } else {
    fetchInventory(); // Refresh data
    cancelEditing();
  }
};

onMounted(fetchInventory);
</script>

<template>
  <div>
    <h2>Inventory List</h2>
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
          
          <!-- Editable fields -->
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
          <td v-else>{{ item.restock_date ? new Date(item.restock_date).toLocaleString() : "N/A" }}</td>

          <td v-if="editingItem === item.id">
            <input v-model="updatedItem.restock_quantity" type="number" />
          </td>
          <td v-else>{{ item.restock_quantity }}</td>

          <td v-if="editingItem === item.id">
            <input v-model="updatedItem.location" type="text" />
          </td>
          <td v-else>{{ item.location || "N/A" }}</td>

          <td>{{ new Date(item.time_update).toLocaleString() }}</td>

          <!-- Edit & Save Actions -->
          <td>
            <button v-if="editingItem === item.id" @click="saveUpdate">Save</button>
            <button v-if="editingItem === item.id" @click="cancelEditing">Cancel</button>
            <button v-else @click="startEditing(item)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

button {
  margin: 5px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
