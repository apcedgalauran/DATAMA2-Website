<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const suppliers = ref([]);
const editingSupplier = ref(null);
const updatedSupplier = ref({});
const newSupplier = ref({
  name: "",
  contact_person: "",
  phone_number: "",
  email: "",
  address: "",
  zip_code: "",
  country: "",
  rating: "",
  notes: "",
});

// Fetch suppliers from Supabase
const fetchSuppliers = async () => {
  let { data, error } = await supabase
    .from("supplier")
    .select("id, name, contact_person, phone_number, email, address, zip_code, country, rating, notes");

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

// Validation Function
const validateInput = (supplier) => {
  if (!supplier.name.trim() || !supplier.phone_number.trim() || !supplier.country.trim()) {
    alert("Name, Phone Number, and Country cannot be empty.");
    return false;
  }
  if (!/^\d+$/.test(supplier.phone_number)) {
    alert("Phone Number must contain only numeric characters.");
    return false;
  }
  if (supplier.zip_code && !/^\d+$/.test(supplier.zip_code)) {
    alert("Zip Code must contain only numeric characters.");
    return false;
  }
  if (supplier.rating && (supplier.rating < 1 || supplier.rating > 5)) {
    alert("Rating must be between 1 and 5.");
    return false;
  }
  return true;
};

// Save updated supplier data
const saveUpdate = async () => {
  if (!validateInput(updatedSupplier.value)) return;

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
  if (!validateInput(newSupplier.value)) return;

  const { error } = await supabase.from("supplier").insert([newSupplier.value]);
  if (error) console.error(error);
  else {
    fetchSuppliers();
    newSupplier.value = { name: "", contact_person: "", phone_number: "", email: "", address: "", zip_code: "", country: "", rating: "", notes: "" };
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
        <tr v-for="supplier in suppliers" :key="supplier.id">
          <td>{{ supplier.id }}</td>

          <td v-if="editingSupplier === supplier.id">
            <input v-model="updatedSupplier.name" type="text" />
          </td>
          <td v-else>{{ supplier.name }}</td>

          <td v-if="editingSupplier === supplier.id">
            <input v-model="updatedSupplier.contact_person" type="text" />
          </td>
          <td v-else>{{ supplier.contact_person || "N/A" }}</td>

          <td v-if="editingSupplier === supplier.id">
            <input v-model="updatedSupplier.phone_number" type="text" />
          </td>
          <td v-else>{{ supplier.phone_number }}</td>

          <td v-if="editingSupplier === supplier.id">
            <input v-model="updatedSupplier.email" type="email" />
          </td>
          <td v-else>{{ supplier.email || "N/A" }}</td>

          <td v-if="editingSupplier === supplier.id">
            <input v-model="updatedSupplier.address" type="text" />
          </td>
          <td v-else>{{ supplier.address || "N/A" }}</td>

          <td v-if="editingSupplier === supplier.id">
            <input v-model="updatedSupplier.zip_code" type="text" />
          </td>
          <td v-else>{{ supplier.zip_code || "N/A" }}</td>

          <td v-if="editingSupplier === supplier.id">
            <input v-model="updatedSupplier.country" type="text" />
          </td>
          <td v-else>{{ supplier.country }}</td>

          <td v-if="editingSupplier === supplier.id">
            <input v-model="updatedSupplier.rating" type="number" min="1" max="5" />
          </td>
          <td v-else>{{ supplier.rating || "N/A" }}</td>

          <td v-if="editingSupplier === supplier.id">
            <input v-model="updatedSupplier.notes" type="text" />
          </td>
          <td v-else>{{ supplier.notes || "N/A" }}</td>

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
      <input v-model="newSupplier.contact_person" type="text" placeholder="Contact Person" />
      <input v-model="newSupplier.phone_number" type="text" placeholder="Phone Number" />
      <input v-model="newSupplier.email" type="email" placeholder="Email" />
      <input v-model="newSupplier.address" type="text" placeholder="Address" />
      <input v-model="newSupplier.zip_code" type="text" placeholder="Zip Code" />
      <input v-model="newSupplier.country" type="text" placeholder="Country" />
      <input v-model="newSupplier.rating" type="number" min="1" max="5" placeholder="Rating (1-5)" />
      <input v-model="newSupplier.notes" type="text" placeholder="Notes" />
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
