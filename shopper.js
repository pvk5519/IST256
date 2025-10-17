// shopper.js
// Required: email, name, age, address
// Optional: phone
// Validates inputs and prints JSON under the form

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+()\-\s]*$/; // optional; just limit characters

function setInvalid(input, message) {
  input.classList.add("is-invalid");
  const fb = input.nextElementSibling;
  if (fb && fb.classList.contains("invalid-feedback")) {
    if (message) fb.textContent = message;
  }
}

function clearInvalid(input) {
  input.classList.remove("is-invalid");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("shopperForm");
  const out  = document.getElementById("jsonOutput");

  const email   = document.getElementById("email");
  const name    = document.getElementById("name");
  const phone   = document.getElementById("phone");
  const age     = document.getElementById("age");
  const address = document.getElementById("address");

  // Live cleanup while typing
  [email, name, phone, age, address].forEach(inp => {
    inp.addEventListener("input", () => clearInvalid(inp));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // start fresh
    [email, name, phone, age, address].forEach(clearInvalid);

    let ok = true;

    // Email (required + format)
    if (email.value.trim() === "") {
      setInvalid(email, "Field required");
      ok = false;
    } else if (!emailPattern.test(email.value.trim())) {
      setInvalid(email, "Enter a valid email (e.g., joe@test.com)");
      ok = false;
    }

    // Name (required)
    if (name.value.trim() === "") {
      setInvalid(name, "Field required");
      ok = false;
    }

    // Phone (optional, but pattern if present)
    if (phone.value.trim() !== "" && !phonePattern.test(phone.value.trim())) {
      setInvalid(phone, "Digits, spaces, (), +, - allowed");
      ok = false;
    }

    // Age (required 1..120)
    const ageNum = Number(age.value.trim());
    if (age.value.trim() === "" || Number.isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setInvalid(age, "Enter age 1–120");
      ok = false;
    }

    // Address (required)
    if (address.value.trim() === "") {
      setInvalid(address, "Field required");
      ok = false;
    }

    if (!ok) {
      // focus first invalid
      const first = document.querySelector(".is-invalid");
      if (first) first.focus();
      return;
    }

    // Build JSON document
    const shopperDoc = {
      "email": email.value.trim(),
      "name": name.value.trim(),
      "contact-phone": phone.value.trim(), // optional; can be empty
      "age": age.value.trim(),
      "address": address.value.trim()
    };

    // Pretty print underneath the form
    out.textContent = JSON.stringify(shopperDoc, null, 2);
  });
});
