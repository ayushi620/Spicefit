const menuBtn = document.getElementById("menuBtn");
    const dashboard = document.getElementById("dashboard");
    const overlay = document.getElementById("overlay");
    const mainContent = document.getElementById("mainContent");
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

    if (menuBtn) menuBtn.addEventListener("click", toggleSidebar);
    if (overlay) overlay.addEventListener("click", toggleSidebar);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && dashboard.classList.contains("active")) {
          toggleSidebar();
      }
  });

/* ================= MOBILE NAV ================= */

function handleMobileNav() {
  let mobileNav = document.getElementById("mobileNavLinks");

  if (window.innerWidth <= 768) {
    if (!mobileNav && dashboard) {
      mobileNav = document.createElement("div");
      mobileNav.id = "mobileNavLinks";
      mobileNav.innerHTML = `
          <hr style="margin:20px 0;border:0;border-top:1px solid var(--border-color);">
          <a href="/home/"><i class="fa-solid fa-house"></i> Home</a>
          <a href="/menu/"><i class="fa-solid fa-utensils"></i> Our Menu</a>
          <a href="/about/"><i class="fa-solid fa-circle-info"></i> About us</a>
          <a href="/review/"><i class="fa-solid fa-star"></i> Review</a>
      `; 
  
      dashboard.insertBefore(mobileNav, dashboard.firstChild);
  }
  } else if (mobileNav) {
      mobileNav.remove();
  }
}

window.addEventListener('load', handleMobileNav);
window.addEventListener('resize', handleMobileNav);


dashboardNav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    dashboard.classList.remove("active");
    overlay.classList.remove("active");
    mainContent.classList.remove("shifted");
  }
});



// =======================
// CARD ENTRANCE ANIMATION
// =======================
const cards = document.querySelectorAll(".menu-card");

function animateVisibleCards() {
  const visibleCards = Array.from(cards).filter(c => c.style.display !== "none");
  visibleCards.forEach((card, i) => {
    card.classList.remove("show"); // reset animation
    setTimeout(() => { card.classList.add("show"); }, i * 100);
  });
}

// Animate all cards on page load
window.addEventListener("DOMContentLoaded", () => {
  animateVisibleCards();
});


// =======================
// CATEGORY FILTER
// =======================
const categoryBtns = document.querySelectorAll(".categories button");
const underline = document.querySelector(".underline");

function moveUnderline(btn){
  underline.style.width = btn.offsetWidth + "px";
  underline.style.left = btn.offsetLeft + "px";
}

// Initial underline position
moveUnderline(document.querySelector(".categories button.active"));

categoryBtns.forEach(btn => {
  btn.onclick = () => {
    // Set active button
    categoryBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    moveUnderline(btn);

    // Filter cards
    const cat = btn.dataset.cat;
    cards.forEach(card => {
      if (cat === "all" || card.dataset.cat === cat) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });

    // Animate visible cards after filtering
    animateVisibleCards();
  }
});


// =======================
// LIKE FEATURE
// =======================
// =======================
// LIKE FEATURE
// =======================

let likedData = JSON.parse(localStorage.getItem("likedRecipes")) || [];

cards.forEach(card => {

  const heart = card.querySelector(".icon-right");
  const id = card.dataset.id;
  const title = card.dataset.name;

  // 🚫 STOP if premium locked
  if(heart.classList.contains("locked-heart")){
      heart.style.cursor = "not-allowed";
      return;
  }

  // show liked on load
  if(likedData.some(r => r.id === id)){
      heart.classList.add("liked");
  }

  heart.onclick = () => {

      likedData = JSON.parse(localStorage.getItem("likedRecipes")) || [];

      if (heart.classList.contains("liked")) {
          likedData = likedData.filter(r => r.id !== id);
          heart.classList.remove("liked");
      } 
      else {
          heart.classList.add("liked");

          likedData.push({
              id,
              title,
              img: card.querySelector("img").src,
              recipe: card.dataset.recipe,
              hasIngredients: false
          });

          showLikeAlert(); 
      }

      localStorage.setItem("likedRecipes", JSON.stringify(likedData));
  };

});
  

// =======================
// POPUP
// =======================
function openBox(btn){
  const card = btn.closest(".menu-card");
  const title = card.dataset.name;
  const recipe = card.dataset.recipe;

  document.getElementById("pop-title").innerText = title; 
  document.getElementById("pop-content").innerHTML = `
    <strong>Instructions:</strong> ${recipe}
  `;
  document.getElementById("popupoverlay").style.display = "flex";
}
function closeOutside(e)
{
  if(e.target.id === "popupoverlay")
  {
    closeBox();
  }
}

function closeBox(){
  document.getElementById("popupoverlay").style.display = "none";
}

function showLikeAlert(){
  const alertBox = document.getElementById("like-alert");
  alertBox.style.display = "block";
  setTimeout(() => { alertBox.style.display = "none"; }, 2000);
}

// =======================
// CART
// =======================
function addToCart(btn){
  const card = btn.closest(".menu-card");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const id = card.dataset.id;
  const name = card.dataset.name;
  const price = parseInt(card.dataset.price);
  const img = card.querySelector("img").src;

  let existing = cart.find(item => item.id === id);
  if(existing) existing.qty += 1;
  else cart.push({id, name, price, img, qty: 1});

  localStorage.setItem("cart", JSON.stringify(cart));

  const popup = document.getElementById("popup-alert");
  popup.innerText = "Added to cart!";
  popup.style.display = "block";
  setTimeout(() => { popup.style.display = "none"; }, 2000);
}

function orderNow(btn){

  const card = btn.closest(".menu-card");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const id = card.dataset.id;
  const name = card.dataset.name;
  const price = parseInt(card.dataset.price);
  const img = card.querySelector("img").src;

  let existing = cart.find(item => item.id === id);

  // Only add if not already in cart
  if(!existing){
      cart.push({id, name, price, img, qty: 1});
      localStorage.setItem("cart", JSON.stringify(cart));
  }

  window.location.href = "/cart/";
}

function premiumAlert(){
  const alertBox = document.getElementById("premium-alert");
  alertBox.style.display = "block";
}
function closePremiumAlert(){
  document.getElementById("premium-alert").style.display = "none";
}  