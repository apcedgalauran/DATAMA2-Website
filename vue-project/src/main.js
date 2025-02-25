import { createApp } from "vue";
import App from "./App.vue";
import { supabase } from "./lib/supabaseClient"; // ✅ Import Supabase

// Create Vue app instance
const app = createApp(App);

// Provide Supabase globally (optional, for easier access in components)
app.provide("supabase", supabase);

// Mount the app to the `#app` div in index.html
app.mount("#app");
