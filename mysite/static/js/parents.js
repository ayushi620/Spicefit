function switchCategory(btn, cat){
  document.querySelectorAll('.cat').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.tabs').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));

  document.querySelector('.'+cat).classList.add('active');
}

function openTab(btn, id){
  btn.parentElement.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

 
// POPUP
function openBox(type,btn){
  const cards = btn.closest(".cards");
  document.getElementById("pop-title").innerText = type;
  document.getElementById("pop-content").innerText =
    type==="Ingredients" ? cards.dataset.ing : cards.dataset.recipe;
  document.getElementById("popupoverlay").style.display="flex";
}
function closeBox(){
  document.getElementById("popupoverlay").style.display="none";
}

// ALERT
function showAlert(){
  const a=document.getElementById("like-alert");
  a.style.display="block";
  setTimeout(()=>a.style.display="none",2000);
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



function hideAllSections() {
    document.querySelectorAll('.section').forEach(sec => {
        sec.style.display = 'none';
    });
}

function showSection(id) {
    // 🔴 THIS WAS MISSING
    document.getElementById('mainSection').style.display = 'none';

    hideAllSections();
    document.getElementById(id).style.display = 'block';

    // Scroll to top → feels like real redirection
    window.scrollTo(0, 0);
}

function goBack() {
    hideAllSections();
    document.getElementById('mainSection').style.display = 'block';
    window.scrollTo(0, 0);
}



function likeRecipe(el){

  const card = el.closest(".cards");

  const id = card.dataset.id;
  const title = card.dataset.title;
  const img = card.dataset.img;
  const ing = card.dataset.ing;
  const recipe = card.dataset.recipe;

  let likedData = JSON.parse(localStorage.getItem("likedRecipes")) || [];

  const exists = likedData.find(r => r.id === id);

  if(exists){
      likedData = likedData.filter(r => r.id !== id);
      el.classList.remove("liked");
  } 
  else {

      likedData.push({
          id:id,
          title:title,
          img:img,
          ing:ing,
          recipe:recipe
      });

      el.classList.add("liked");

      showAlert();
  }

  localStorage.setItem("likedRecipes", JSON.stringify(likedData));
}
window.addEventListener("DOMContentLoaded", function(){

  let likedData = JSON.parse(localStorage.getItem("likedRecipes")) || [];

  document.querySelectorAll(".cards").forEach(card=>{

    const id = card.dataset.id;

    const heart = card.querySelector(".icon-right");

    if(likedData.find(r=>r.id === id)){
        heart.classList.add("liked");
    }

  });

});


// POPUP
function openBox(type,btn){
  const cards = btn.closest(".cards");
  document.getElementById("pop-title").innerText = type;
  document.getElementById("pop-content").innerText =
    type==="Ingredients" ? cards.dataset.ing : cards.dataset.recipe;
  document.getElementById("popupoverlay").style.display="flex";
}
function closeBox(){
  document.getElementById("popupoverlay").style.display="none";
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