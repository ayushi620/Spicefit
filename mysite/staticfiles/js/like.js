// localStorage.removeItem("likedRecipes");
// location.reload();

const liked = JSON.parse(localStorage.getItem('likedRecipes')) || [];
const container = document.getElementById('cards');

if (container) {
  liked.forEach(r => {
    const c = document.createElement('div');
    c.className = 'card';
    c.dataset.recipe = r.recipe;
    c.dataset.ing = r.ing || "";
    c.dataset.hasIngredients = r.hasIngredients;

    c.innerHTML = `
      <div class="image-container">
        <img src="${r.img}">
        <i class="fa-solid fa-heart icon-right" onclick="removeLike('${r.id}', this)"></i>
      </div>

      <h2>${r.title}</h2>
      <button onclick="openBox(this)">View Recipe</button> 
    `;

    container.appendChild(c);
  });
}

function removeLike(id, icon) {
  let liked = JSON.parse(localStorage.getItem('likedRecipes')) || [];
  liked = liked.filter(r => r.id !== id);
  localStorage.setItem('likedRecipes', JSON.stringify(liked));
  icon.closest('.card').remove();
}

function openBox(btn) {
  const card = btn.closest(".card");

  const title = card.querySelector("h2").innerText;
  const recipe = card.dataset.recipe;
  const ingredients = card.dataset.ing;

  document.getElementById("pop-title").innerText = title;

  document.getElementById("pop-content").innerHTML = `
    ${ingredients ? `<strong>Ingredients:</strong> ${ingredients}<br><br>` : ""}
    <strong>Instructions:</strong> ${recipe}
  `;

  document.getElementById("popup-overlay").style.display = "flex";
}

function closeBox() {
  document.getElementById("popup-overlay").style.display = "none";
}

/* ================= SIDEBAR ================= */

const menuBtn = document.getElementById("menuBtn");
const dashboard = document.getElementById("dashboard");
const mainContent = document.getElementById("mainContent");
const overlay = document.getElementById("overlay");
const dashboardNav = document.getElementById('dashboardNav');

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

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && dashboard.classList.contains('active')) {
    toggleSidebar();
  }
});

/* ================= MOBILE NAV ================= */

function handleMobileNav() {
  let mobileNav = document.getElementById('mobileNavLinks');

  if (window.innerWidth <= 768) {
    if (!mobileNav) {
      mobileNav = document.createElement('div');
      mobileNav.id = 'mobileNavLinks';
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

window.addEventListener('load', handleMobileNav);
window.addEventListener('resize', handleMobileNav);
