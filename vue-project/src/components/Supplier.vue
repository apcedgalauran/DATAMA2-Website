<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const suppliers = ref([]);
const editingItem = ref(null);
const updatedItem = ref({});
const newItem = ref({
  name: "",
  contact_person: "",
  phone_number: "",
  email: "",
  address: "",
  zip_code: "",
  country: "",
  rating: null,
  notes: ""
});

const fetchSuppliers = async () => {
  let { data, error } = await supabase
    .from("supplier")
    .select("id, name, contact_person, phone_number, email, address, zip_code, country, rating, notes");

  if (error) console.error(error);
  else suppliers.value = data;
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
  if (updatedItem.value.rating < 0) {
    alert("Rating cannot be negative.");
    return;
  }

  const { id, name, contact_person, phone_number, email, address, zip_code, country, rating, notes } = updatedItem.value;
  const { error } = await supabase
    .from("supplier")
    .update({ name, contact_person, phone_number, email, address, zip_code, country, rating, notes })
    .eq("id", id);

  if (error) {
    console.error("Error updating record:", error);
  } else {
    fetchSuppliers();
    cancelEditing();
  }
};

const addItem = async () => {
  if (newItem.value.rating < 0) {
    alert("Rating cannot be negative.");
    return;
  }

  const { error } = await supabase.from("supplier").insert([newItem.value]);
  if (error) {
    console.error("Error adding record:", error);
  } else {
    fetchSuppliers();
    newItem.value = { name: "", contact_person: "", phone_number: "", email: "", address: "", zip_code: "", country: "", rating: null, notes: "" };
  }
};

const deleteItem = async (id) => {
  const { error } = await supabase.from("supplier").delete().eq("id", id);
  if (error) {
    console.error("Error deleting record:", error);
  } else {
    fetchSuppliers();
  }
};

onMounted(fetchSuppliers);
</script>

<template>
  <div>
    <h2>Suppliers List</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Contact Person</th>
          <th>Phone Number</th>
          <th>Email</th>
          <th>Address</th>
          <th>Zip Code</th>
          <th>Country</th>
          <th>Rating</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in suppliers" :key="item.id">
          <td>{{ item.id }}</td>
          <td v-if="editingItem === item.id"><input v-model="updatedItem.name" type="text" /></td>
          <td v-else>{{ item.name }}</td>

          <td v-if="editingItem === item.id"><input v-model="updatedItem.contact_person" type="text" /></td>
          <td v-else>{{ item.contact_person }}</td>

          <td v-if="editingItem === item.id"><input v-model="updatedItem.phone_number" type="text" /></td>
          <td v-else>{{ item.phone_number }}</td>

          <td v-if="editingItem === item.id"><input v-model="updatedItem.email" type="email" /></td>
          <td v-else>{{ item.email }}</td>

          <td v-if="editingItem === item.id"><input v-model="updatedItem.address" type="text" /></td>
          <td v-else>{{ item.address }}</td>

          <td v-if="editingItem === item.id"><input v-model="updatedItem.zip_code" type="text" /></td>
          <td v-else>{{ item.zip_code }}</td>

          <td v-if="editingItem === item.id"><input v-model="updatedItem.country" type="text" /></td>
          <td v-else>{{ item.country }}</td>

          <td v-if="editingItem === item.id"><input v-model="updatedItem.rating" type="number" /></td>
          <td v-else>{{ item.rating }}</td>

          <td v-if="editingItem === item.id"><input v-model="updatedItem.notes" type="text" /></td>
          <td v-else>{{ item.notes }}</td>

          <td>
            <button v-if="editingItem === item.id" @click="saveUpdate">Save</button>
            <button v-if="editingItem === item.id" @click="cancelEditing">Cancel</button>
            <button v-else @click="startEditing(item)">Edit</button>
            <button @click="deleteItem(item.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <h3>Add New Supplier</h3>
    <input v-model="newItem.name" type="text" placeholder="Name" />
    <input v-model="newItem.contact_person" type="text" placeholder="Contact Person" />
    <input v-model="newItem.phone_number" type="text" placeholder="Phone Number" />
    <input v-model="newItem.email" type="email" placeholder="Email" />
    <input v-model="newItem.address" type="text" placeholder="Address" />
    <input v-model="newItem.zip_code" type="text" placeholder="Zip Code" />
    <input v-model="newItem.country" type="text" placeholder="Country" />
    <input v-model="newItem.rating" type="number" placeholder="Rating" />
    <input v-model="newItem.notes" type="text" placeholder="Notes" />
    <button @click="addItem">Add Supplier</button>
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
