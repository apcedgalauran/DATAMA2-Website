<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const suppliers = ref([]);
const editingSupplier = ref(null);
const updatedSupplier = ref({});
const newSupplier = ref({
  name: "",
  phone_number: "",
  country: "",
  email: "",
});

// Fetch suppliers from Supabase
const fetchSuppliers = async () => {
  let { data, error } = await supabase
    .from("supplier")
    .select("id, name, phone_number, country, email");

  if (error) console.error(error);
  else suppliers.value = data;
};

// Enable editing mode
const startEditing = (supplier) => {
  editingSupplier.value = supplier.id;
  updatedSupplier.value = { ...supplier };
};

// Cancel editing mode
const cancelEditing = () => {
  editingSupplier.value = null;
  updatedSupplier.value = {};
};

// Save updated supplier data
const saveUpdate = async () => {
  const { id, ...fields } = updatedSupplier.value;
  const { error } = await supabase.from("supplier").update(fields).eq("id", id);

  if (error) console.error(error);
  else {
    fetchSuppliers();
    cancelEditing();
  }
};

// Add a new supplier
const addSupplier = async () => {
  const { error } = await supabase.from("supplier").insert([newSupplier.value]);
  if (error) console.error(error);
  else {
    fetchSuppliers();
    newSupplier.value = { name: "", phone_number: "", country: "", email: "" };
  }
};

// Delete a supplier
const deleteSupplier = async (id) => {
  const { error } = await supabase.from("supplier").delete().eq("id", id);
  if (error) console.error(error);
  else fetchSuppliers();
};

onMounted(fetchSuppliers);
</script>

<template>
  <div class="container">
    <h2>🏢 Supplier Management</h2>

    <!-- Suppliers Table -->
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Phone Number</th>
          <th>Country</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="supplier in suppliers" :key="supplier.id">
          <td>{{ supplier.id }}</td>

          <!-- Editable Fields -->
          <td v-if="editingSupplier === supplier.id">
            <input v-model="updatedSupplier.name" type="text" />
          </td>
          <td v-else>{{ supplier.name }}</td>

          <td v-if="editingSupplier === supplier.id">
            <input v-model="updatedSupplier.phone_number" type="text" />
          </td>
          <td v-else>{{ supplier.phone_number }}</td>

          <td v-if="editingSupplier === supplier.id">
            <input v-model="updatedSupplier.country" type="text" />
          </td>
          <td v-else>{{ supplier.country }}</td>

          <td v-if="editingSupplier === supplier.id">
            <input v-model="updatedSupplier.email" type="email" />
          </td>
          <td v-else>{{ supplier.email || "N/A" }}</td>

          <!-- Action Buttons -->
          <td>
            <button v-if="editingSupplier === supplier.id" class="save-btn" @click="saveUpdate">Save</button>
            <button v-if="editingSupplier === supplier.id" class="cancel-btn" @click="cancelEditing">Cancel</button>
            <button v-else class="edit-btn" @click="startEditing(supplier)">Edit</button>
            <button class="delete-btn" @click="deleteSupplier(supplier.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add New Supplier -->
    <h3>Add New Supplier</h3>
    <div class="add-form">
      <input v-model="newSupplier.name" type="text" placeholder="Supplier Name" />
      <input v-model="newSupplier.phone_number" type="text" placeholder="Phone Number" />
      <input v-model="newSupplier.country" type="text" placeholder="Country" />
      <input v-model="newSupplier.email" type="email" placeholder="Email" />
      <button class="add-btn" @click="addSupplier">Add</button>
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
  width: 140px;
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
