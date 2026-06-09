let currentCategory = "";
document.querySelectorAll('.landing .card').forEach(card=>{
  card.addEventListener('click',()=>{
    currentCategory = card.getAttribute('data-category');
    document.getElementById('landing').classList.remove('active');
    document.getElementById('planPage').classList.add('active');
  });
});

// Back button
function goBack(){
  document.getElementById('planPage').classList.remove('active');
  document.getElementById('landing').classList.add('active');
  searchInput.value="";
  dropdown.style.display="none";
  recipesContainer.innerHTML="";
}

// Search dropdown
const searchInput = document.getElementById('searchInput');
const dropdown = document.getElementById('dropdown');
const recipesContainer = document.getElementById('recipesContainer');

searchInput.addEventListener('click',()=>{
  dropdown.innerHTML="";
  const allPlanElems = document.querySelectorAll('#allPlans .plan');
  allPlanElems.forEach(plan=>{
    if(plan.getAttribute('data-category') === currentCategory){
      const div = document.createElement('div');
      div.innerText = plan.getAttribute('data-name');
      div.addEventListener('click',()=>{
        searchInput.value=div.innerText;
        dropdown.style.display="none";
        showRecipes(div.innerText);
      });
      dropdown.appendChild(div);
    }
  });
  dropdown.style.display="flex";
});


//show recipes for selected plan
function showRecipes(planName){
  recipesContainer.innerHTML = ""; // clear previous

  // Create container for grid
  const container = document.createElement('div');
  container.className = 'cards-container';

  // Get all recipes for this plan
  const allRecipeElems = document.querySelectorAll('#allRecipes .recipe');
  allRecipeElems.forEach(recipe => {
    if(recipe.getAttribute('data-plan') === planName){
      const cardWrapper = document.createElement('div');
      cardWrapper.innerHTML = recipe.innerHTML;

      // Append all .cards inside this recipe to container
      const cards = cardWrapper.querySelectorAll('.cards');
      cards.forEach(c => {
        container.appendChild(c);

        // Add heart click listener dynamically
        const heart = c.querySelector(".icon-right");
        const id = c.dataset.id;
        const title = c.dataset.title;

        let likedData = JSON.parse(localStorage.getItem("likedRecipes")) || [];
        if(likedData.some(r => r.id === id)){
          heart.classList.add("liked");
        }

        heart.onclick = ()=>{
          likedData = JSON.parse(localStorage.getItem("likedRecipes")) || [];
          if(heart.classList.contains("liked")){
            likedData = likedData.filter(r => r.id !== id);
            heart.classList.remove("liked");
          } else {
            heart.classList.add("liked");
            likedData.push({
              id,
              title,
              img: c.dataset.img,
              ing: c.dataset.ing,
              recipe: c.dataset.recipe,
              hasIngredients:true
            });
            showAlert();
          }
          localStorage.setItem("likedRecipes", JSON.stringify(likedData));
        };

      });
    }
  });

  recipesContainer.appendChild(container); // append container with all cards
}





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

function showRecipes(planName){
  recipesContainer.innerHTML = ""; // clear previous

  // Create container for grid
  const container = document.createElement('div');
  container.className = 'cards-container';

  // Get all recipes for this plan
  const allRecipeElems = document.querySelectorAll('#allRecipes .recipe');
  allRecipeElems.forEach(recipe => {
    if(recipe.getAttribute('data-plan') === planName){
      const cardWrapper = document.createElement('div');
      cardWrapper.innerHTML = recipe.innerHTML;

      // Append all .cards inside this recipe to container
      const cards = cardWrapper.querySelectorAll('.cards');
      cards.forEach(c => {
        container.appendChild(c);

        const heart = c.querySelector(".icon-right");

        // ✅ Skip if heart is locked
        if(heart.classList.contains("locked-heart")){
          heart.style.cursor = "not-allowed"; // optional
          return; // do NOT attach click listener
        }

        const id = c.dataset.id;
        const title = c.dataset.title;

        let likedData = JSON.parse(localStorage.getItem("likedRecipes")) || [];
        if(likedData.some(r => r.id === id)){
          heart.classList.add("liked");
        }

        heart.onclick = ()=> {
          likedData = JSON.parse(localStorage.getItem("likedRecipes")) || [];
          if(heart.classList.contains("liked")){
            likedData = likedData.filter(r => r.id !== id);
            heart.classList.remove("liked");
          } else {
            heart.classList.add("liked");
            likedData.push({
              id,
              title,
              img: c.dataset.img,
              ing: c.dataset.ing,
              recipe: c.dataset.recipe,
              hasIngredients:true
            });
            showAlert();
          }
          localStorage.setItem("likedRecipes", JSON.stringify(likedData));
        };
      });
    }
  });

  recipesContainer.appendChild(container); // append container with all cards
}


// POPUP
function openBox(type, btn){
  
  console.log("Button clicked:", btn, "type:", type); 
  // Find the closest recipe card
  const card = btn.closest(".cards");
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


function premiumAlert(){
  const alertBox = document.getElementById("premium-alert");
  alertBox.style.display = "block";
}
function closePremiumAlert(){
  document.getElementById("premium-alert").style.display = "none";
}

