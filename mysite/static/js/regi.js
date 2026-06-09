document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("registerBtn");
  
    const username = document.getElementById("reg-username");
    const email = document.getElementById("reg-email");
    const password = document.getElementById("reg-password");
  
    const fields = [username, email, password];
    let touched = false;
  
    fields.forEach(f =>
      f.addEventListener("input", () => {
        touched = true;
        validate();
      }) 
    );
  
    btn.addEventListener("click", e => {
      e.preventDefault();
      touched = true;
      if (validate()) {
        window.location.href = "/login/";
      }
    });
  
    function validate() {
      let valid = true;
      clearAll();
  
      if (!touched) {
        btn.disabled = true;
        return false;
      }
  
      if (username.value.trim().length < 3) {
        error(username, "Minimum 3 characters");
        valid = false;
      }
  
      if (!/^\S+@\S+\.\S+$/.test(email.value)) {
        error(email, "Invalid email address");
        valid = false;
      }
  
      if (password.value.length < 6) {
        error(password, "Minimum 6 characters");
        valid = false;
      }
  
      btn.disabled = !valid;
      return valid;
    }
  
    function error(input, msg) {
      input.classList.add("error");
      let small = input.nextElementSibling;
      if (!small || small.tagName !== "SMALL") {
        small = document.createElement("small");
        input.after(small);
      }
      small.innerText = msg;
    }
  
    function clearAll() {
      fields.forEach(f => {
        f.classList.remove("error");
        if (f.nextElementSibling?.tagName === "SMALL") {
          f.nextElementSibling.innerText = "";
        }
      });
    }
  });
  