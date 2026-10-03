import { supabase } from "./supabaseClient.js";

/* ============================
   SIGNUP
============================ */
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Account created! Please log in.");
      window.location.href = "login.html";
    }
  });
}

/* ============================
   LOGIN
============================ */
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert(error.message);
    } else {
      window.location.href = "editor.html";
    }
  });
}

/* ============================
   LOGOUT
============================ */
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "login.html";
  });
}

/* ============================
   SAVE NOTE
============================ */
export async function saveNote(content) {
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("notes")
    .insert({
      user_id: user.id,
      content: content
    });

  if (error) {
    alert(error.message);
  } else {
    alert("Note saved!");
  }
}

/* ============================
   LOAD NOTES
============================ */
export async function loadNotes() {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    alert(error.message);
    return [];
  }

  return data;
}
