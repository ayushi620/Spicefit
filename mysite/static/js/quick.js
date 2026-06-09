/* ===================== QUICK RECIPE PAGE ===================== */

/* ===================== LIKE FUNCTIONALITY ===================== */
const likeAlert = document.getElementById("like-alert");

// Show alert when recipe liked
function showAlert() {
  if (!likeAlert) return;
  likeAlert.classList.add("show");
  setTimeout(() => likeAlert.classList.remove("show"), 1500);
}

// Save liked recipe
function saveLikedRecipe(recipeObj) {
  let likedData = JSON.parse(localStorage.getItem("likedRecipes")) || [];

  // Prevent duplicate likes
  if (likedData.some(r => r.title === recipeObj.title)) return;

  likedData.push(recipeObj);
  localStorage.setItem("likedRecipes", JSON.stringify(likedData));
}

/* ===================== POPUP ===================== */
function openBox(type, btn) {
  const card = btn.closest(".card");

  const title = card.dataset.title;
  const ingredients = card.dataset.ing;
  const recipe = card.dataset.recipe;

  document.getElementById("pop-title").innerText = title;

  if (type === "Ingredients") {
    document.getElementById("pop-content").innerHTML =
      `<strong>Ingredients:</strong><br>${ingredients}`;
  } else {
    document.getElementById("pop-content").innerHTML =
      `<strong>Recipe:</strong><br>${recipe}`;
  }

  document.getElementById("popup-overlay").style.display = "flex";
}

function closeBox() {
  document.getElementById("popup-overlay").style.display = "none";
}

/* ===================== LIKE BUTTON CLICK ===================== */
// LOAD LIKED STATE
let likedData = JSON.parse(localStorage.getItem("likedRecipes")) || [];

document.querySelectorAll(".card").forEach(card => {
  const heart = card.querySelector(".icon-right");
  const id = card.dataset.id;

  if(likedData.some(r => r.id === id)){
      heart.classList.add("liked");
  }
});
document.querySelectorAll(".card").forEach(cards => {
  const heart = cards.querySelector(".icon-right");

  // Skip if locked
  if(heart.classList.contains("locked-heart")){
      heart.style.cursor = "not-allowed";
      return;
  }

  const id = cards.dataset.id;
  const title = cards.dataset.title;

  heart.onclick = () => {
      let likedData = JSON.parse(localStorage.getItem("likedRecipes")) || [];
      if(heart.classList.contains("liked")){
          likedData = likedData.filter(r => r.id !== id);
          heart.classList.remove("liked");
      } else {
          heart.classList.add("liked");
          likedData.push({
              id,
              title,
              img: cards.dataset.img,
              ing: cards.dataset.ing,
              recipe: cards.dataset.recipe,
              hasIngredients:true
          });
          showAlert();  
      }
      localStorage.setItem("likedRecipes", JSON.stringify(likedData));
  };
});
/* ===================== SIDEBAR ===================== */
const menuBtn = document.getElementById("menuBtn");
const dashboard = document.getElementById("dashboard");
const mainContent = document.getElementById("mainContent");
const overlay = document.getElementById("overlay");
const dashboardNav = document.getElementById("dashboardNav");

const toggleSidebar = () => {
  dashboard.classList.toggle("active");
  if (window.innerWidth > 1024) {
    mainContent.classList.toggle("shifted");
  } else {
    overlay.classList.toggle("active");
  }
};

menuBtn.addEventListener("click", toggleSidebar);
overlay.addEventListener("click", toggleSidebar);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && dashboard.classList.contains("active")) {
    toggleSidebar();
  }
});

/* ===================== MOBILE NAV ===================== */
function handleMobileNav() {
  let mobileNav = document.getElementById("mobileNavLinks");

  if (window.innerWidth <= 768) {
    if (!mobileNav) {
      mobileNav = document.createElement("div");
      mobileNav.id = "mobileNavLinks";
      mobileNav.innerHTML = `
        <hr style="margin:20px 0;border:0;border-top:1px solid var(--border-color);">
        <a href="/home"><i class="fa-solid fa-house"></i> Home</a>
        <a href="/menu"><i class="fa-solid fa-utensils"></i> Our Menu</a>
        <a href="/about"><i class="fa-solid fa-circle-info"></i> About us</a>
        <a href="/review"><i class="fa-solid fa-star"></i> Review</a>
      `;
      dashboardNav.prepend(mobileNav);
    }
  } else if (mobileNav) {
    mobileNav.remove();
  }
}

window.addEventListener("load", handleMobileNav);
window.addEventListener("resize", handleMobileNav);

// ALERT
function showAlert(){
  const a=document.getElementById("like-alert");
  a.style.display="block";
  setTimeout(()=>a.style.display="none",2000);
}


function premiumAlert(){
  const alertBox = document.getElementById("premium-alert");
  alertBox.style.display = "block";
}
function closePremiumAlert(){
  document.getElementById("premium-alert").style.display = "none";
}