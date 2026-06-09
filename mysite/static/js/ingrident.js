const chipBox = document.getElementById("chips");
const selectedBox = document.getElementById("selected");
const selected = [];

/* Build chips */
document.querySelectorAll(".chip").forEach(chip=>{
    chip.addEventListener("click", function(){
        this.classList.toggle("active");
    });
});

function toggle(el){
  const val = el.innerText;

  if(selected.includes(val)) return; // ignore click if already selected

  el.classList.add("active");
  selected.push(val);

  renderSelected();
  updateRecipeCards();
}

function renderSelected(){
    selectedBox.innerHTML = "";
    selected.forEach(i=>{
        let s = document.createElement("span");
        s.innerText = i + " ✖";
        s.onclick = ()=>remove(i);
        selectedBox.appendChild(s);
    });
}

function remove(val){
    selected.splice(selected.indexOf(val),1);
    document.querySelectorAll(".chip").forEach(c=>{
        if(c.innerText===val) c.classList.remove("active");
    });
    renderSelected();
    updateRecipeCards();
}

function filterIng(v){
    v=v.toLowerCase();
    document.querySelectorAll(".chip").forEach(c=>{
        c.style.display=c.innerText.toLowerCase().includes(v)?"block":"none";
    });
}

function updateRecipeCards(){
    document.querySelectorAll(".cards").forEach(card=>{
        if(selected.length === 0){
            card.style.display = "none"; // hide all if nothing selected
            return;
        }
        const cardIngredients = card.dataset.ing.toLowerCase();
        const show = selected.some(sel => cardIngredients.includes(sel.toLowerCase()));
        card.style.display = show ? "block" : "none";
    });
}

/* Like functionality */
let likedData = JSON.parse(localStorage.getItem("likedRecipes")) || [];
document.querySelectorAll(".cards").forEach(cards=>{
  const heart = cards.querySelector(".icon-right");
  const id = cards.dataset.id;
  const title = cards.dataset.title;

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
        id, title,
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

/* Popup */
function openBox(type,btn){
  const cards = btn.closest(".cards");
  document.getElementById("pop-title").innerText = type;
  document.getElementById("pop-content").innerText =
    type==="Ingredients" ? cards.dataset.ing : cards.dataset.recipe;
  document.getElementById("popupoverlay").style.display="flex";
}

function closeBox(){
  document.getElementById("popupoverlay").style.display="none";
  updateRecipeCards(); // recalc cards visibility when popup closes
  // Optional: clear selection completely
  // selected.length=0;
  // document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
  // renderSelected();
}

/* Alert */
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



const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");

profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle("active");
});

// Close when clicking outside
document.addEventListener("click", () => {
    profileMenu.classList.remove("active");
});