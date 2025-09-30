// signup.js — required fields, email format, and passwords must match

const MSG_REQUIRED = "Field required";
const MSG_EMAIL    = "Enter a valid email (e.g., joe@test.com)";
const MSG_MATCH    = "Passwords must match";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Remember the original input type so we can show tips in password fields
function showError(input, message) {
  if (!input.dataset.origType) input.dataset.origType = input.type;
  input.dataset.error = "1";
  if (input.type === "password") input.type = "text"; // make tip visible
  input.value = message;
  input.style.color = "red";
  input.classList.add("border-danger");
  input.setAttribute("aria-invalid", "true");
}

function clearError(input) {
  if (input.dataset.error === "1") {
    input.value = "";                   // clear the fake tip text
    input.style.color = "";
    input.classList.remove("border-danger");
    input.dataset.error = "";
    input.removeAttribute("aria-invalid");
    if (input.dataset.origType) input.type = input.dataset.origType; // restore password type
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form     = document.getElementById("signupForm");
  const username = document.getElementById("username");
  const email    = document.getElementById("email");
  const password = document.getElementById("password");
  const confirm  = document.getElementById("confirm");
  const inputs   = [username, email, password, confirm];

  // We'll ignore the *next* focus clear if we programmatically focus a field after submit
  let ignoreNextFocusId = null;

  // Clear error tip when the USER starts fixing the field
  inputs.forEach(inp => {
    // Don't clear on the programmatic focus we trigger after submit
    inp.addEventListener("focus", () => {
      if (ignoreNextFocusId === inp.id) {
        ignoreNextFocusId = null; // consume the flag; do not clear this time
        return;
      }
      clearError(inp);
    });

    // Also clear as soon as they start typing
    inp.addEventListener("input", () => clearError(inp));
  });

  form.addEventListener("submit", (e) => {
    let valid = true;

    // USERNAME required
    if (username.value.trim() === "" || username.dataset.error === "1") {
      showError(username, MSG_REQUIRED);
      valid = false;
    }

    // EMAIL required + format
    if (email.value.trim() === "" || email.dataset.error === "1") {
      showError(email, MSG_REQUIRED);
      valid = false;
    } else if (!emailPattern.test(email.value.trim())) {
      showError(email, MSG_EMAIL); // stays visible now
      valid = false;
    }

    // PASSWORD required
    if (password.value.trim() === "" || password.dataset.error === "1") {
      showError(password, MSG_REQUIRED);
      valid = false;
    }

    // CONFIRM required
    if (confirm.value.trim() === "" || confirm.dataset.error === "1") {
      showError(confirm, MSG_REQUIRED);
      valid = false;
    }

    // PASSWORDS must match (only if both have real values and no prior error)
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
      // Focus the first invalid field but DO NOT clear its tip on that focus
      const firstBad = inputs.find(i => i.dataset.error === "1");
      if (firstBad) {
        ignoreNextFocusId = firstBad.id; // prevent focus handler from clearing immediately
        firstBad.focus();
      }
    }
  });
});
