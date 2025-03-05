<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const orders = ref([]);
const editingItem = ref(null);
const updatedItem = ref({});
const newItem = ref({ date: "", total_amount: 0, status: "Pending", notes: "", CUSTOMER_id: null, SHIPPING_id: null });

const fetchOrders = async () => {
  let { data, error } = await supabase
    .from("orders")
    .select("id, date, total_amount, status, notes, CUSTOMER_id, SHIPPING_id");

  if (error) console.error(error);
  else orders.value = data;
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
  if (updatedItem.value.total_amount < 0) {
    alert("Total amount cannot be negative.");
    return;
  }

  const { id, date, total_amount, status, notes, CUSTOMER_id, SHIPPING_id } = updatedItem.value;
  const { error } = await supabase
    .from("orders")
    .update({ date, total_amount, status, notes, CUSTOMER_id, SHIPPING_id })
    .eq("id", id);

  if (error) {
    console.error("Error updating record:", error);
  } else {
    fetchOrders();
    cancelEditing();
  }
};

const addItem = async () => {
  if (newItem.value.total_amount < 0) {
    alert("Total amount cannot be negative.");
    return;
  }

  const { error } = await supabase.from("orders").insert([newItem.value]);
  if (error) {
    console.error("Error adding record:", error);
  } else {
    fetchOrders();
    newItem.value = { date: "", total_amount: 0, status: "Pending", notes: "", CUSTOMER_id: null, SHIPPING_id: null };
  }
};

const deleteItem = async (id) => {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) {
    console.error("Error deleting record:", error);
  } else {
    fetchOrders();
  }
};

onMounted(fetchOrders);
</script>

<template>
  <div>
    <h2>Orders List</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Total Amount</th>
          <th>Status</th>
          <th>Notes</th>
          <th>Customer ID</th>
          <th>Shipping ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in orders" :key="item.id">
          <td>{{ item.id }}</td>
          <td v-if="editingItem === item.id"><input v-model="updatedItem.date" type="datetime-local" /></td>
          <td v-else>{{ item.date }}</td>

          <td v-if="editingItem === item.id"><input v-model="updatedItem.total_amount" type="number" /></td>
          <td v-else>{{ item.total_amount }}</td>

          <td v-if="editingItem === item.id">
            <select v-model="updatedItem.status">
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Shipped">Shipped</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </td>
          <td v-else>{{ item.status }}</td>

          <td v-if="editingItem === item.id"><input v-model="updatedItem.notes" type="text" /></td>
          <td v-else>{{ item.notes }}</td>

          <td v-if="editingItem === item.id"><input v-model="updatedItem.CUSTOMER_id" type="number" /></td>
          <td v-else>{{ item.CUSTOMER_id }}</td>

          <td v-if="editingItem === item.id"><input v-model="updatedItem.SHIPPING_id" type="number" /></td>
          <td v-else>{{ item.SHIPPING_id }}</td>

          <td>
            <button v-if="editingItem === item.id" @click="saveUpdate">Save</button>
            <button v-if="editingItem === item.id" @click="cancelEditing">Cancel</button>
            <button v-else @click="startEditing(item)">Edit</button>
            <button @click="deleteItem(item.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <h3>Add New Order</h3>
    <input v-model="newItem.date" type="datetime-local" placeholder="Date" />
    <input v-model="newItem.total_amount" type="number" placeholder="Total Amount" />
    <select v-model="newItem.status">
      <option value="Pending">Pending</option>
      <option value="Completed">Completed</option>
      <option value="Shipped">Shipped</option>
      <option value="Cancelled">Cancelled</option>
    </select>
    <input v-model="newItem.notes" type="text" placeholder="Notes" />
    <input v-model="newItem.CUSTOMER_id" type="number" placeholder="Customer ID" />
    <input v-model="newItem.SHIPPING_id" type="number" placeholder="Shipping ID" />
    <button @click="addItem">Add Order</button>
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
