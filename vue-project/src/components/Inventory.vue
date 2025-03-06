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
  const { data, error } = await supabase
    .from("inventory")
    .select("id, reorder_level, stock_quantity, restock_date, restock_quantity, location, time_update")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching inventory:", error);
  } else {
    inventory.value = data;
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

// Save updated data
const saveUpdate = async () => {
  const { id, ...fields } = updatedItem.value;
  const { error } = await supabase.from("inventory").update(fields).eq("id", id);

  if (error) {
    console.error("Error updating item:", error);
  } else {
    await fetchInventory(); // Ensure latest data is fetched
    cancelEditing();
  }
};

// Add a new inventory item
const addItem = async () => {
  const itemToAdd = { ...newItem.value }; // Copy new item for reactivity
  const { error } = await supabase.from("inventory").insert([itemToAdd]);

  if (error) {
    console.error("Error adding item:", error);
  } else {
    await fetchInventory(); // Refresh inventory to show new item
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

  if (error) {
    console.error("Error deleting item:", error);
  } else {
    await fetchInventory(); // Refresh after deleting
  }
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