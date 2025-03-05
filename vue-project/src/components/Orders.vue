<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const orders = ref([]);
const newOrder = ref({ total_amount: 0, status: "Pending", notes: "", customer_id: null, shipping_id: null });
const editingOrder = ref(null);
const updatedOrder = ref({});

const fetchOrders = async () => {
  let { data, error } = await supabase
    .from("orders")
    .select("id, date, total_amount, status, notes, customer_id, shipping_id");

  if (error) console.error(error);
  else orders.value = data;
};

const addOrder = async () => {
  if (newOrder.value.total_amount < 0) {
    alert("Total amount cannot be negative.");
    return;
  }
  const { error } = await supabase.from("orders").insert([newOrder.value]);
  if (error) console.error(error);
  else {
    fetchOrders();
    newOrder.value = { total_amount: 0, status: "Pending", notes: "", customer_id: null, shipping_id: null };
  }
};

const startEditing = (order) => {
  editingOrder.value = order.id;
  updatedOrder.value = { ...order };
};

const cancelEditing = () => {
  editingOrder.value = null;
  updatedOrder.value = {};
};

const saveUpdate = async () => {
  if (updatedOrder.value.total_amount < 0) {
    alert("Total amount cannot be negative.");
    return;
  }
  const { id, total_amount, status, notes, customer_id, shipping_id } = updatedOrder.value;
  const { error } = await supabase.from("orders").update({ total_amount, status, notes, customer_id, shipping_id }).eq("id", id);
  if (error) console.error(error);
  else {
    fetchOrders();
    cancelEditing();
  }
};

const deleteOrder = async (id) => {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) console.error(error);
  else fetchOrders();
};

onMounted(fetchOrders);
</script>

<template>
  <div>
    <h2>Orders</h2>
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
          <td>{{ new Date(order.date).toLocaleString() }}</td>
          <td v-if="editingOrder === order.id"><input v-model.number="updatedOrder.total_amount" type="number" /></td>
          <td v-else>${{ order.total_amount }}</td>
          <td v-if="editingOrder === order.id">
            <select v-model="updatedOrder.status">
              <option>Pending</option>
              <option>Completed</option>
              <option>Shipped</option>
              <option>Cancelled</option>
            </select>
          </td>
          <td v-else>{{ order.status }}</td>
          <td v-if="editingOrder === order.id"><input v-model="updatedOrder.notes" type="text" /></td>
          <td v-else>{{ order.notes || "N/A" }}</td>
          <td v-if="editingOrder === order.id"><input v-model.number="updatedOrder.customer_id" type="number" /></td>
          <td v-else>{{ order.customer_id || "N/A" }}</td>
          <td v-if="editingOrder === order.id"><input v-model.number="updatedOrder.shipping_id" type="number" /></td>
          <td v-else>{{ order.shipping_id || "N/A" }}</td>
          <td>
            <button v-if="editingOrder === order.id" @click="saveUpdate">Save</button>
            <button v-if="editingOrder === order.id" @click="cancelEditing">Cancel</button>
            <button v-else @click="startEditing(order)">Edit</button>
            <button @click="deleteOrder(order.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <h3>Add New Order</h3>
    <input v-model.number="newOrder.total_amount" type="number" placeholder="Total Amount" />
    <select v-model="newOrder.status">
      <option>Pending</option>
      <option>Completed</option>
      <option>Shipped</option>
      <option>Cancelled</option>
    </select>
    <input v-model="newOrder.notes" type="text" placeholder="Notes" />
    <input v-model.number="newOrder.customer_id" type="number" placeholder="Customer ID" />
    <input v-model.number="newOrder.shipping_id" type="number" placeholder="Shipping ID" />
    <button @click="addOrder">Add Order</button>
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
