<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const inventory = ref([]);
const editingItem = ref(null);
const updatedItem = ref({});
const newItem = ref({ reorder_level: 0, stock_quantity: 0, restock_date: "", restock_quantity: 0, location: "" });

const fetchInventory = async () => {
  let { data, error } = await supabase
    .from("inventory")
    .select("id, reorder_level, stock_quantity, restock_date, restock_quantity, location, time_update");

  if (error) console.error(error);
  else inventory.value = data;
};

const startEditing = (item) => {
  editingItem.value = item.id;
  updatedItem.value = { ...item };
};

const cancelEditing = () => {
  editingItem.value = null;
  updatedItem.value = {};
};

const saveUpdate = async () => {
  if (updatedItem.value.reorder_level < 0 || updatedItem.value.stock_quantity < 0 || updatedItem.value.restock_quantity < 0) {
    alert("Values cannot be negative.");
    return;
  }
  
  const { id, reorder_level, stock_quantity, restock_date, restock_quantity, location } = updatedItem.value;
  const { error } = await supabase
    .from("inventory")
    .update({ reorder_level, stock_quantity, restock_date, restock_quantity, location })
    .eq("id", id);

  if (error) console.error("Error updating record:", error);
  else {
    fetchInventory();
    cancelEditing();
  }
};

const addInventory = async () => {
  if (newItem.value.reorder_level < 0 || newItem.value.stock_quantity < 0 || newItem.value.restock_quantity < 0) {
    alert("Values cannot be negative.");
    return;
  }

  const { error } = await supabase.from("inventory").insert([newItem.value]);

  if (error) console.error("Error adding record:", error);
  else {
    fetchInventory();
    newItem.value = { reorder_level: 0, stock_quantity: 0, restock_date: "", restock_quantity: 0, location: "" };
  }
};

const deleteInventory = async (id) => {
  const { error } = await supabase.from("inventory").delete().eq("id", id);

  if (error) console.error("Error deleting record:", error);
  else fetchInventory();
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
          <td v-if="editingItem === item.id">
            <input v-model.number="updatedItem.reorder_level" type="number" />
          </td>
          <td v-else>{{ item.reorder_level }}</td>

          <td v-if="editingItem === item.id">
            <input v-model.number="updatedItem.stock_quantity" type="number" />
          </td>
          <td v-else>{{ item.stock_quantity }}</td>

          <td v-if="editingItem === item.id">
            <input v-model="updatedItem.restock_date" type="datetime-local" />
          </td>
          <td v-else>{{ item.restock_date ? new Date(item.restock_date).toLocaleString() : "N/A" }}</td>

          <td v-if="editingItem === item.id">
            <input v-model.number="updatedItem.restock_quantity" type="number" />
          </td>
          <td v-else>{{ item.restock_quantity }}</td>

          <td v-if="editingItem === item.id">
            <input v-model="updatedItem.location" type="text" />
          </td>
          <td v-else>{{ item.location || "N/A" }}</td>

          <td>{{ new Date(item.time_update).toLocaleString() }}</td>
          <td>
            <button v-if="editingItem === item.id" @click="saveUpdate">Save</button>
            <button v-if="editingItem === item.id" @click="cancelEditing">Cancel</button>
            <button v-else @click="startEditing(item)">Edit</button>
            <button @click="deleteInventory(item.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h3>Add New Inventory Item</h3>
    <form @submit.prevent="addInventory">
      <input v-model.number="newItem.reorder_level" type="number" placeholder="Reorder Level" required />
      <input v-model.number="newItem.stock_quantity" type="number" placeholder="Stock Quantity" required />
      <input v-model="newItem.restock_date" type="datetime-local" />
      <input v-model.number="newItem.restock_quantity" type="number" placeholder="Restock Quantity" required />
      <input v-model="newItem.location" type="text" placeholder="Location" />
      <button type="submit">Add</button>
    </form>
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
