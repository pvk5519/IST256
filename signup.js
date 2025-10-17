// signup.js — required fields, email format, and passwords must match

const MSG_REQUIRED = "Field required";
const MSG_EMAIL    = "Enter a valid email (e.g., joe@test.com)";
const MSG_MATCH    = "Passwords must match";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showError(input, message) {
  if (!input.dataset.origType) input.dataset.origType = input.type;
  input.dataset.error = "1";
  if (input.type === "password") input.type = "text";
  input.value = message;
  input.style.color = "red";
  input.classList.add("border-danger");
  input.setAttribute("aria-invalid", "true");
}

function clearError(input) {
  if (input.dataset.error === "1") {
    input.value = "";
    input.style.color = "";
    input.classList.remove("border-danger");
    input.dataset.error = "";
    input.removeAttribute("aria-invalid");
    if (input.dataset.origType) input.type = input.dataset.origType;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form     = document.getElementById("signupForm");
  const username = document.getElementById("username");
  const email    = document.getElementById("email");
  const password = document.getElementById("password");
  const confirm  = document.getElementById("confirm");
  const inputs   = [username, email, password, confirm];
  let ignoreNextFocusId = null;

  inputs.forEach(inp => {
    inp.addEventListener("focus", () => {
      if (ignoreNextFocusId === inp.id) {
        ignoreNextFocusId = null;
        return;
      }
      clearError(inp);
    });
    inp.addEventListener("input", () => clearError(inp));
  });

  form.addEventListener("submit", (e) => {
    let valid = true;

    // USERNAME
    if (username.value.trim() === "" || username.dataset.error === "1") {
      showError(username, MSG_REQUIRED);
      valid = false;
    }

    // EMAIL
    if (email.value.trim() === "" || email.dataset.error === "1") {
      showError(email, MSG_REQUIRED);
      valid = false;
    } else if (!emailPattern.test(email.value.trim())) {
      showError(email, MSG_EMAIL);
      valid = false;
    }

    // PASSWORD
    if (password.value.trim() === "" || password.dataset.error === "1") {
      showError(password, MSG_REQUIRED);
      valid = false;
    }

    // CONFIRM
    if (confirm.value.trim() === "" || confirm.dataset.error === "1") {
      showError(confirm, MSG_REQUIRED);
      valid = false;
    }

    // MATCH CHECK
    if (
      password.value.trim() !== "" &&
      confirm.value.trim() !== "" &&
      !password.dataset.error &&
      !confirm.dataset.error &&
      password.value !== confirm.value
    ) {
      showError(confirm, MSG_MATCH);
      valid = false;
    }

    if (!valid) {
      e.preventDefault();
      const firstBad = inputs.find(i => i.dataset.error === "1");
      if (firstBad) {
        ignoreNextFocusId = firstBad.id;
        firstBad.focus();
      }
    }
  });
});