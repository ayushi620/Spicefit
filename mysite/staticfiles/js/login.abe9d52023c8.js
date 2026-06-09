document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("loginBtn");
  
    const username = document.getElementById("login-username");
    const password = document.getElementById("login-password");
    const phone = document.getElementById("login-phone");
    const address = document.getElementById("login-address");
  
    const fields = [username, password, phone, address];
  
    fields.forEach(f => f.addEventListener("input", validate));
  
    btn.addEventListener("click", e => {
      e.preventDefault();
      if (validate()) {
        window.location.href = "/home/";
      }
    });
  
    function validate() {
      let valid = true;
      clearAll();
  
      if (username.value.trim() === "") {
        error(username, "Required");
        valid = false;
      }
  
      if (password.value.trim() === "") {
        error(password, "Required");
        valid = false;
      }
  
      if (!/^\d{10}$/.test(phone.value)) {
        error(phone, "10-digit phone required");
        valid = false;
      }
  
      if (address.value.trim() === "") {
        error(address, "Required");
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
  