// ====== Sozlamalar ======
const API_ENDPOINT = "/api/login"; // Backendga yuboriladigan manzil

// ====== Elementlar ======
const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const usernameField = document.getElementById("usernameField");
const passwordField = document.getElementById("passwordField");
const submitBtn = document.getElementById("submitBtn");
const toggleEye = document.getElementById("toggleEye");
const errorMsg = document.getElementById("errorMsg");

// ====== Floating label + fokus animatsiyasi ======
function bindField(input, fieldEl) {
  const updateFilled = () => {
    fieldEl.classList.toggle("filled", input.value.length > 0);
  };

  input.addEventListener("focus", () => fieldEl.classList.add("focused"));
  input.addEventListener("blur", () => {
    fieldEl.classList.remove("focused");
    updateFilled();
  });
  input.addEventListener("input", () => {
    updateFilled();
    validateForm();
  });
}

bindField(usernameInput, usernameField);
bindField(passwordInput, passwordField);

// ====== Ko'z (parolni ko'rsatish/yashirish) ======
let passwordVisible = false;
toggleEye.addEventListener("click", () => {
  passwordVisible = !passwordVisible;
  passwordInput.type = passwordVisible ? "text" : "password";
  toggleEye.textContent = passwordVisible ? "Yashirish" : "Ko'rsatish";
  passwordInput.focus();
});

// ====== Tugmani validatsiya asosida yoqish/o'chirish ======
function validateForm() {
  const isValid = usernameInput.value.trim().length > 0 && passwordInput.value.length > 0;
  submitBtn.disabled = !isValid;
  submitBtn.classList.toggle("active", isValid);
  return isValid;
}

// ====== Formani yuborish ======
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  if (!validateForm()) return;

  const payload = {
    username: usernameInput.value.trim(),
    password: passwordInput.value,
  };

  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  try {
    const res = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Kirishda xatolik yuz berdi.");
    }

    // Muvaffaqiyatli kirish — token/sessiyani saqlash va yo'naltirish
    if (data.token) {
      sessionStorage.setItem("vantly_token", data.token);
    }
    window.location.href = "/dashboard.html";

  } catch (err) {
    errorMsg.textContent = err.message || "Server bilan bog'lanib bo'lmadi.";
  } finally {
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
  }
});

// ====== Ro'yxatdan o'tish havolasi (demo) ======
document.getElementById("signupLink").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/signup.html";
});

// ====== Facebook orqali kirish (demo, backendga ulanadi) ======
document.getElementById("fbLoginBtn").addEventListener("click", () => {
  window.location.href = "/api/auth/facebook";
});
