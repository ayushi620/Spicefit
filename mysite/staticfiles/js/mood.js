// ========== Simple JS for slider and popup ==========

// Get the mood container
const track = document.getElementById("moodTrack");
track.innerHTML += track.innerHTML; 
let scroll = 0, stop = false;

// Auto-scroll
function slide() {
  if(!stop){
    scroll += 0.5; 
    if(scroll >= track.scrollWidth/2) scroll = 0; 
    track.style.transform = `translateX(-${scroll}px)`;
  }
  requestAnimationFrame(slide);
}
slide();

// Arrows
document.getElementById("left").onclick = ()=> scroll -= 40;
document.getElementById("right").onclick = ()=> scroll += 40;

// Handle all clicks in one place
document.body.addEventListener("click", e => {
  const mood = e.target.closest(".mood");
  const card = e.target.closest(".cards");

  // Mood click
  if(mood){
    stop = true; setTimeout(()=>stop=false,4000);
     const selectedMood = mood.dataset.mood;
  sessionStorage.setItem("selectedMood", selectedMood); // ⭐ SAVE

    document.getElementById("placeholder").style.display = "none";
    document.querySelectorAll(".mood").forEach(m=>m.classList.remove("active"));
    mood.classList.add("active");

    const m = mood.dataset.mood;
    document.querySelectorAll(".cards").forEach(c => c.style.display = c.classList.contains(m)?"block":"none");
  }

});
window.addEventListener("DOMContentLoaded", () => {
  const savedMood = sessionStorage.getItem("selectedMood");
  if(!savedMood) return;

  document.getElementById("placeholder").style.display = "none";

  document.querySelectorAll(".mood").forEach(mood => {
    mood.classList.toggle("active", mood.dataset.mood === savedMood);
  });

  document.querySelectorAll(".cards").forEach(card => {
    card.style.display = card.classList.contains(savedMood) ? "block" : "none";
  });
});




// LOAD LIKED STATE
let likedData = JSON.parse(localStorage.getItem("likedRecipes")) || [];

document.querySelectorAll(".cards").forEach(card => {
  const heart = card.querySelector(".icon-right");
  const id = card.dataset.id;

  if(likedData.some(r => r.id === id)){
      heart.classList.add("liked");
  }
});
document.querySelectorAll(".cards").forEach(cards => {
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
      }
      localStorage.setItem("likedRecipes", JSON.stringify(likedData));
  };
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


function premiumAlert(){
  const alertBox = document.getElementById("premium-alert");
  alertBox.style.display = "block";
}
function closePremiumAlert(){
  document.getElementById("premium-alert").style.display = "none";
}   