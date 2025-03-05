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
  contact_person: "",
  address: "",
  zip_code: "",
  rating: null,
  notes: "",
});

// Fetch suppliers from Supabase
const fetchSuppliers = async () => {
  let { data, error } = await supabase
    .from("supplier")
    .select("id, name, phone_number, country, email, contact_person, address, zip_code, rating, notes");

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

// Validate input fields
const validateSupplier = (supplier) => {
  if (
    !supplier.name ||
    !supplier.phone_number ||
    !supplier.country ||
    !supplier.email ||
    !supplier.contact_person ||
    !supplier.address ||
    !supplier.zip_code
  ) {
    alert("All fields except rating and notes must be filled.");
    return false;
  }

  if (!/^\d+$/.test(supplier.phone_number)) {
    alert("Phone number must contain only digits.");
    return false;
  }

  if (supplier.rating !== null && supplier.rating < 0) {
    alert("Rating cannot be negative.");
    return false;
  }

  if (supplier.zip_code && supplier.zip_code < 0) {
    alert("Zip Code cannot be negative.");
    return false;
  }

  return true;
};

// Save updated supplier data
const saveUpdate = async () => {
  if (!validateSupplier(updatedSupplier.value)) return;

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
  if (!validateSupplier(newSupplier.value)) return;

  const { error } = await supabase.from("supplier").insert([newSupplier.value]);
  if (error) console.error(error);
  else {
    fetchSuppliers();
    newSupplier.value = { name: "", phone_number: "", country: "", email: "", contact_person: "", address: "", zip_code: "", rating: null, notes: "" };
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
  <div>
    <h2>Supplier Management</h2>

    <!-- Add New Supplier -->
    <div class="form-container">
      <h3>Add Supplier</h3>
      <input v-model="newSupplier.name" placeholder="Name" required />
      <input v-model="newSupplier.phone_number" placeholder="Phone Number" />
      <input v-model="newSupplier.country" placeholder="Country" />
      <input v-model="newSupplier.email" placeholder="Email" type="email" />
      <input v-model="newSupplier.contact_person" placeholder="Contact Person" />
      <input v-model="newSupplier.address" placeholder="Address" />
      <input v-model="newSupplier.zip_code" placeholder="Zip Code" type="number" />
      <input v-model="newSupplier.rating" placeholder="Rating" type="number" />
      <textarea v-model="newSupplier.notes" placeholder="Notes"></textarea>
      <button @click="addSupplier">Add Supplier</button>
    </div>

    <!-- Supplier List -->
    <div v-if="suppliers.length">
      <h3>Supplier List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Country</th>
            <th>Email</th>
            <th>Contact Person</th>
            <th>Address</th>
            <th>Zip Code</th>
            <th>Rating</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="supplier in suppliers" :key="supplier.id">
            <td v-if="editingSupplier !== supplier.id">{{ supplier.name }}</td>
            <td v-else><input v-model="updatedSupplier.name" /></td>

            <td v-if="editingSupplier !== supplier.id">{{ supplier.phone_number }}</td>
            <td v-else><input v-model="updatedSupplier.phone_number" /></td>

            <td v-if="editingSupplier !== supplier.id">{{ supplier.country }}</td>
            <td v-else><input v-model="updatedSupplier.country" /></td>

            <td v-if="editingSupplier !== supplier.id">{{ supplier.email }}</td>
            <td v-else><input v-model="updatedSupplier.email" type="email" /></td>

            <td v-if="editingSupplier !== supplier.id">{{ supplier.contact_person }}</td>
            <td v-else><input v-model="updatedSupplier.contact_person" /></td>

            <td v-if="editingSupplier !== supplier.id">{{ supplier.address }}</td>
            <td v-else><input v-model="updatedSupplier.address" /></td>

            <td v-if="editingSupplier !== supplier.id">{{ supplier.zip_code }}</td>
            <td v-else><input v-model="updatedSupplier.zip_code" type="number" /></td>

            <td v-if="editingSupplier !== supplier.id">{{ supplier.rating }}</td>
            <td v-else><input v-model="updatedSupplier.rating" type="number" /></td>

            <td v-if="editingSupplier !== supplier.id">{{ supplier.notes }}</td>
            <td v-else><textarea v-model="updatedSupplier.notes"></textarea></td>

            <td>
              <button v-if="editingSupplier !== supplier.id" @click="startEditing(supplier)">Edit</button>
              <button v-else @click="saveUpdate">Save</button>
              <button v-if="editingSupplier === supplier.id" @click="cancelEditing">Cancel</button>
              <button @click="deleteSupplier(supplier.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>No suppliers available.</p>
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
}

.form-container {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: auto;
}

input,
textarea {
  margin: 5px 0;
  padding: 8px;
  width: 100%;
}

button {
  margin-top: 10px;
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
