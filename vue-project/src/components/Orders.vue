<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const orders = ref([]);
const editingOrder = ref(null);
const updatedOrder = ref({});
const newOrder = ref({
  date: "",
  total_amount: "",
  status: "",
  notes: "",
  customer_id: "",
  shipping_id: "",
});

// Fetch orders from Supabase
const fetchOrders = async () => {
  let { data, error } = await supabase
    .from("orders")
    .select("id, date, total_amount, status, notes, customer_id, shipping_id");

  if (error) console.error(error);
  else orders.value = data;
};

// Enable editing mode
const startEditing = (order) => {
  editingOrder.value = order.id;
  updatedOrder.value = { ...order };
};

// Cancel editing mode
const cancelEditing = () => {
  editingOrder.value = null;
  updatedOrder.value = {};
};

// Save updated data
const saveUpdate = async () => {
  const { id, ...fields } = updatedOrder.value;
  const { error } = await supabase.from("orders").update(fields).eq("id", id);

  if (error) console.error(error);
  else {
    fetchOrders();
    cancelEditing();
  }
};

// Add a new order
const addOrder = async () => {
  const { error } = await supabase.from("orders").insert([newOrder.value]);
  if (error) console.error(error);
  else {
    fetchOrders();
    newOrder.value = {
      date: "",
      total_amount: "",
      status: "",
      notes: "",
      customer_id: "",
      shipping_id: "",
    };
  }
};

// Delete an order
const deleteOrder = async (id) => {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) console.error(error);
  else fetchOrders();
};

onMounted(fetchOrders);
</script>

<template>
  <div class="container">
    <h2>📑 Order Management</h2>

    <!-- Orders Table -->
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
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>

          <!-- Editable Fields -->
          <td v-if="editingOrder === order.id">
            <input v-model="updatedOrder.date" type="datetime-local" />
          </td>
          <td v-else>{{ new Date(order.date).toLocaleString() }}</td>

          <td v-if="editingOrder === order.id">
            <input v-model="updatedOrder.total_amount" type="number" />
          </td>
          <td v-else>${{ order.total_amount }}</td>

          <td v-if="editingOrder === order.id">
            <input v-model="updatedOrder.status" type="text" />
          </td>
          <td v-else>{{ order.status }}</td>

          <td v-if="editingOrder === order.id">
            <input v-model="updatedOrder.notes" type="text" />
          </td>
          <td v-else>{{ order.notes || "N/A" }}</td>

          <td v-if="editingOrder === order.id">
            <input v-model="updatedOrder.customer_id" type="number" />
          </td>
          <td v-else>{{ order.customer_id || "N/A" }}</td>

          <td v-if="editingOrder === order.id">
            <input v-model="updatedOrder.shipping_id" type="number" />
          </td>
          <td v-else>{{ order.shipping_id || "N/A" }}</td>

          <!-- Action Buttons -->
          <td>
            <button v-if="editingOrder === order.id" class="save-btn" @click="saveUpdate">Save</button>
            <button v-if="editingOrder === order.id" class="cancel-btn" @click="cancelEditing">Cancel</button>
            <button v-else class="edit-btn" @click="startEditing(order)">Edit</button>
            <button class="delete-btn" @click="deleteOrder(order.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add New Order -->
    <h3>Add New Order</h3>
    <div class="add-form">
      <input v-model="newOrder.date" type="datetime-local" />
      <input v-model="newOrder.total_amount" type="number" placeholder="Total Amount" />
      <input v-model="newOrder.status" type="text" placeholder="Status" />
      <input v-model="newOrder.notes" type="text" placeholder="Notes" />
      <input v-model="newOrder.customer_id" type="number" placeholder="Customer ID" />
      <input v-model="newOrder.shipping_id" type="number" placeholder="Shipping ID" />
      <button class="add-btn" @click="addOrder">Add</button>
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
