/* ================= SIDEBAR & NAV ================= */

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
        if (!mobileNav && dashboardNav) {
            mobileNav = document.createElement("div");
            mobileNav.id = "mobileNavLinks";
            mobileNav.innerHTML = `
                <hr style="margin:20px 0;border:0;border-top:1px solid var(--border-color);">
                <a href="/home/"><i class="fa-solid fa-house"></i> Home</a>
                <a href="/menu/"><i class="fa-solid fa-utensils"></i> Our Menu</a>
                <a href="/about/"><i class="fa-solid fa-circle-info"></i> About us</a>
                <a href="/review/"><i class="fa-solid fa-star"></i> Review</a>
            `;
            dashboardNav.prepend(mobileNav);
        }
    } else if (mobileNav) {
        mobileNav.remove();
    }
}

window.addEventListener("load", handleMobileNav);
window.addEventListener("resize", handleMobileNav);


/* ================= LIKE / HEART ================= */



/* ================= LIKE FEATURE ================= */

let likedData = JSON.parse(localStorage.getItem("likedRecipes")) || [];

document.querySelectorAll(".recipe-card-new").forEach(card=>{
    const heart = card.querySelector(".icon-right");
    const id = card.dataset.id;

    if(likedData.some(r=>r.id===id)){
        heart.classList.add("liked");
    }
});
document.querySelectorAll(".recipe-card-new").forEach(cards => {

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

      // check if recipe already exists
      let exists = likedData.some(r => r.id === id);

      if(exists){
          // remove like
          likedData = likedData.filter(r => r.id !== id);
          heart.classList.remove("liked");
      }else{
          // add like
          heart.classList.add("liked");

          likedData.push({
              id,
              title,
              img: cards.dataset.img,
              ing: cards.dataset.ing,
              recipe: cards.dataset.recipe,
              hasIngredients:true
          });
      }

      localStorage.setItem("likedRecipes", JSON.stringify(likedData));

  };

});



// POPUP
function openBox(type, btn){
  console.log("Button clicked:", btn, "Type:", type); 
  // Find the closest recipe card
  const card = btn.closest(".recipe-card-new");
  if (!card) {
      console.error("Card not found for button:", btn);
      return;
  }

  // Set title
  document.getElementById("pop-title").innerText = type;

  // Set content
  document.getElementById("pop-content").innerText =
      type === "Ingredients" ? card.dataset.ing : card.dataset.recipe;

  // Show popup
  document.getElementById("popup-overlay").style.display = "flex";
}
function closeBox(){
  document.getElementById("popup-overlay").style.display="none";
}

// ALERT
function showAlert(){
  const a=document.getElementById("like-alert");
  a.style.display="block";
  setTimeout(()=>a.style.display="none",2000);
}

/* ================= SECTION NAVIGATION (IMPORTANT) ================= */

function hideAllSections() {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });
}

function showRecipes(id) {
    hideAllSections();

    const section = document.getElementById(id);
    if (!section) {
        console.error("Section not found:", id);
        return;
    }

    section.classList.add("active");
}

function goBack() {
    hideAllSections();
    const home = document.getElementById("challengeSection");
    if (home) home.classList.add("active");
}



function premiumAlert(){
    const alertBox = document.getElementById("premium-alert");
    alertBox.style.display = "block";
  }
  function closePremiumAlert(){
    document.getElementById("premium-alert").style.display = "none";
  } 