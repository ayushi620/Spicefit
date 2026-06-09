function syncCartToDatabase(){

  fetch("/sync-cart/",{
  
  method:"POST",
  
  headers:{
  "Content-Type":"application/json",
  "X-CSRFToken": getCookie("csrftoken")
  },
  
  body: JSON.stringify({
  items: orderList
  })
  
  })
  .then(res=>res.json())
  .then(data=>{
  console.log("Cart synced:",data);
  });
  
  }
function renderCartItems() {

  const cartEl = document.getElementById("cartItems");
  const emptyEl = document.getElementById("emptyCart");
  const checkout = document.getElementById("checkoutBox");

  cartEl.innerHTML = "";

  
if(orderList.length === 0) {
  emptyEl.style.display = "block";
  checkout.style.display = "none";
  document.getElementById("cartOptions").style.display = "none";
  return;
}

  // If cart has items
emptyEl.style.display = "none";

const options = document.getElementById("cartOptions");

if(orderList.length > 0){
  options.style.display = "block";
}else{
  options.style.display = "none";
}

checkout.style.display = "none";

  orderList.forEach((item, index) => {

    const div = document.createElement("div");
    div.className = "cart-card";

    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>₹ ${item.price}</p>

        <div class="qty">
          <button onclick="changeQty(${index}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>

      </div>

      <i class="remove fa-solid fa-trash" onclick="removeItem(${index})"></i>
    `;

    cartEl.appendChild(div);
  });
}

// Load cart from localStorage
let orderList = JSON.parse(localStorage.getItem("cart")) || [];
let totalAmount = 0;


renderCartItems();
function changeQty(index, delta) {
  orderList[index].qty += delta;
  if(orderList[index].qty < 1) orderList[index].qty = 1;
  localStorage.setItem("cart", JSON.stringify(orderList));
  renderCartItems();
  syncCartToDatabase();
  renderOrder();
}

function removeItem(index) {
  orderList.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(orderList));
  renderCartItems();
  syncCartToDatabase();
  renderOrder();
}





let selectedPremiumMethod = "";
let selectedPlanAmount = 0;
let selectedPlanName = "";

function openPremiumModal(planName, amount) {
  selectedPlanName = planName;
  selectedPlanAmount = amount;
  selectedPremiumMethod = "";

  document.getElementById("modalPlanName").innerText = planName;
  document.getElementById("modalPlanAmount").innerText = amount.toFixed(2);
  document.getElementById("premiumModal").style.display = "flex";

  // Reset UPI fields
  document.getElementById("premiumUPI").style.display = "none";
  document.getElementById("premiumUPI").value = "";
  document.getElementById("premiumUPIError").style.display = "none";

  // Reset Card fields
  document.getElementById("cardDetails").style.display = "none";
  document.getElementById("cardNumber").value = "";
  document.getElementById("cardName").value = "";
  document.getElementById("cardExpiry").value = "";
  document.getElementById("cardCVV").value = "";
  document.getElementById("cardError").style.display = "none";

  document.getElementById("modalPayError").style.display = "none";

  // Remove active class from options
  document.querySelectorAll("#premiumModal .option").forEach(o => o.classList.remove("active"));
}

function closePremiumModal() {
  document.getElementById("premiumModal").style.display = "none";
}

function selectPremiumMethod(el, method) {
  selectedPremiumMethod = method;

  document.querySelectorAll("#premiumModal .option").forEach(o => o.classList.remove("active"));
  el.classList.add("active");

  document.getElementById("modalPayError").style.display = "none";

  // Show the right fields
  document.getElementById("premiumUPI").style.display = method === "UPI" ? "block" : "none";
  document.getElementById("cardDetails").style.display = method === "CARD" ? "block" : "none";
}

function confirmPremiumPayment() {
  if (!selectedPremiumMethod) {
    document.getElementById("modalPayError").style.display = "block";
    return;
  }

  if (selectedPremiumMethod === "UPI") {
    const upiId = document.getElementById("premiumUPI").value.trim();
    if (!upiId || !upiId.includes("@")) {
      document.getElementById("premiumUPIError").style.display = "block";
      return;
    }
    document.getElementById("premiumUPIError").style.display = "none";
    alert(`Payment of $${selectedPlanAmount.toFixed(2)} successful via UPI (${upiId})`);

  } else if (selectedPremiumMethod === "CARD") {
    const number = document.getElementById("cardNumber").value.trim();
    const name = document.getElementById("cardName").value.trim();
    const expiry = document.getElementById("cardExpiry").value.trim();
    const cvv = document.getElementById("cardCVV").value.trim();

    // Card validation
    const expiryPattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/; // MM/YY
    if (
      !/^\d{16}$/.test(number) || !name || !expiryPattern.test(expiry) || !/^\d{3,4}$/.test(cvv)
    ) {
      document.getElementById("cardError").innerText = "Enter valid card details";
      document.getElementById("cardError").style.display = "block";
      return;
    }

    document.getElementById("cardError").style.display = "none";
    alert(`Payment of $${selectedPlanAmount.toFixed(2)} successful via Card (****${number.slice(-4)})`);
  }

  closePremiumModal();
}







// Render order
function renderOrder(){
  const listEl = document.getElementById("orderList");
  listEl.innerHTML="";
  totalAmount = 0;
  orderList.forEach(d=>{
    const div = document.createElement("div");
    div.className="summary-row";
    div.innerHTML=`<span>${d.name} x${d.qty}</span><span>₹ ${d.price*d.qty}</span>`;
    listEl.appendChild(div);
    totalAmount += d.price*d.qty;
  });
  if(orderList.length > 0) totalAmount += 40; // delivery charge only for items
  document.getElementById("finalTotal").innerText = totalAmount;
  const loader = document.getElementById("loader");
}
renderOrder();

// CAPTCHA
let currentCaptcha;
function generateCaptcha(){
  const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let captcha="";
  for(let i=0;i<6;i++) captcha += chars.charAt(Math.floor(Math.random()*chars.length));
  document.getElementById("captchaText").textContent=captcha;
  currentCaptcha=captcha;
}
generateCaptcha();

// Payment selection
let selectedMethod="";
function selectMethod(el, method){
  document.querySelectorAll(".option").forEach(o=>o.classList.remove("active"));
  el.classList.add("active");
  selectedMethod = method;
  document.getElementById("payError").style.display="none";
}
function payNow(){

  let addr = document.getElementById("address").value.trim();
  let method = document.getElementById("paymentMethod").value;
  
  // Reset all errors first
  document.getElementById("addrError").style.display = "none";
  document.getElementById("captchaError").style.display = "none";
  document.getElementById("payError").style.display = "none";
  
  if(orderList.length===0){
    alert("Cart is empty!");
    return;
  }
  
  if(addr===""){
    document.getElementById("addrError").style.display = "block";
    return;
  }
  
  if(method===""){
    document.getElementById("payError").style.display = "block";
    return;
  }
  
  let captchaInput = document.getElementById("captchaInput").value.trim().toUpperCase();
  let actualCaptcha = currentCaptcha.trim().toUpperCase();
  
  if(captchaInput !== actualCaptcha){
    document.getElementById("captchaError").style.display = "block";
    return;
  }
  
  /* COD PAYMENT */
  
  if(method==="COD"){
    alert("Order placed! Payment will be collected on delivery.");
  }
  
  /* UPI PAYMENT */
  
  else if(method==="UPI"){
  
    let upiId = document.getElementById("upiId").value.trim();
  
    if(!upiId || !upiId.includes("@")){
      alert("Enter valid UPI ID");
      return;
    }
  
    alert(`Payment of ₹${totalAmount} successful via UPI (${upiId})`);
  }
  
  /* CARD PAYMENT */
  
  else if(method==="CARD"){
  
    let number = document.getElementById("cardNumber").value.trim();
    let name = document.getElementById("cardName").value.trim();
    let expiry = document.getElementById("cardExpiry").value.trim();
    let cvv = document.getElementById("cardCVV").value.trim();
  
    const expiryPattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
  
    if(!/^\d{16}$/.test(number) || !name || !expiryPattern.test(expiry) || !/^\d{3,4}$/.test(cvv)){
      alert("Enter valid card details");
      return;
    }
  
    alert(`Payment of ₹${totalAmount} successful via Card (****${number.slice(-4)})`);
  }
  
  
  /* ----------------------------- */
  /* SAVE ORDER TO DJANGO DATABASE */
  /* ----------------------------- */
  
  fetch("/checkout/",{
  
  method:"POST",
  
  headers:{
  "Content-Type":"application/json",
  "X-CSRFToken": getCookie("csrftoken")
  },
  
  body: JSON.stringify({
  items: orderList,
  address: addr,
  payment_method: method,
  total: totalAmount
  })
  
  })
  .then(res => res.json())
  .then(data=>{
  console.log("Order saved:",data);
  });
  
  
  /* SUCCESS */
  
  document.getElementById("successMsg").innerText="Order completed!";
  saveLastOrderPerUser(orderList); 
  localStorage.removeItem("cart");
  orderList = [];
  
  renderCartItems();
  renderOrder();
  
  }

  function getCookie(name) {
    let cookieValue = null;
    
    if (document.cookie && document.cookie !== '') {
    
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
    
    const cookie = cookies[i].trim();
    
    if (cookie.substring(0, name.length + 1) === (name + '=')) {
    
    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
    
    break;
    
    }
    }
    }
    
    return cookieValue;
    }

//SHOWCHECKOUT
function showCheckout(){
  document.getElementById("checkoutBox").style.display = "block";
  document.getElementById("cartOptions").style.display = "none";
}

function addMore(){
  window.location.href = "/menu/"; // or your menu page
}





const menuBtn = document.getElementById("menuBtn");
    const dashboard = document.getElementById("dashboard");
    const mainContent = document.getElementById("mainContent");
    const overlay = document.getElementById("overlay");
    const navLinks = document.querySelector('.nav-center-links');
    const dashboardNav = document.getElementById('dashboardNav');

    // Toggle Sidebar
    const toggleSidebar = () => {
        dashboard.classList.toggle("active");
        if(window.innerWidth > 1024) {
            mainContent.classList.toggle("shifted");
        } else {
            overlay.classList.toggle("active");
        }
    };

    menuBtn.addEventListener("click", toggleSidebar);
    overlay.addEventListener("click", toggleSidebar);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dashboard.classList.contains('active')) toggleSidebar();
    });

  // Handle Mobile Navigation Injection
    function handleMobileNav() {
    let mobileNav = document.getElementById('mobileNavLinks');
    if (window.innerWidth <= 768) {
        if (!mobileNav) {
            mobileNav = document.createElement('div');
            mobileNav.id = 'mobileNavLinks';
            mobileNav.innerHTML = `
                <hr style="margin:20px 0;border:0;border-top:1px solid var(--border-color);">
                <a href="#"><i class="fa-solid fa-house"></i> Home</a>
                <a href="#"><i class="fa-solid fa-utensils"></i> Our Menu</a>
                <a href="#"><i class="fa-solid fa-circle-info"></i> About us</a>
                <a href="#"><i class="fa-solid fa-star"></i> Review</a>
            `;
            dashboardNav.prepend(mobileNav);
        }
    } else if (mobileNav) {
        mobileNav.remove();
    }
}


    window.addEventListener('load', handleMobileNav);
    window.addEventListener('resize', handleMobileNav);





function showPaymentFields(){

let method = document.getElementById("paymentMethod").value;

document.getElementById("upiId").style.display = "none";
document.getElementById("cardBox").style.display = "none";

if(method === "UPI"){
  document.getElementById("upiId").style.display = "block";
}

if(method === "CARD"){
  document.getElementById("cardBox").style.display = "block";
}

}