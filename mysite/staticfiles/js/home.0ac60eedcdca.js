/*------------------------home js-----------------------------*/
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
/*-------------------------------------------------------------*/


/*---------------------review js ------------------------------*/
function addReview() {
    const name = document.getElementById("username").value.trim();
    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value.trim();

    if (!name || !rating || !comment) {
        alert("Please fill all fields");
        return;
    }

    let stars = "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);

    const reviewHTML = `
        <div class="review-card">
            <h3>${name}</h3>
            <span class="stars">${stars}</span>
            <p>${comment}</p>
        </div>
    `;

    document.getElementById("reviewsList").insertAdjacentHTML("beforeend", reviewHTML);

    document.getElementById("username").value = "";
    document.getElementById("rating").value = "";
    document.getElementById("comment").value = "";
}
/*--------------------------------------------------*/

function filterMenu(category){
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (category === 'all' || cardCategory === category) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}


// Filter categories
function filterMenu(category) {
    const cards = document.querySelectorAll('.menu-grid .card');
  
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
  }
  
  // Premium popup
  function openPremiumPopup() {
    document.getElementById('premiumPopup').style.display = 'flex';
  }
  
  function closePremiumPopup() {
    document.getElementById('premiumPopup').style.display = 'none';
  }
  






  setTimeout(function () {
    window.location.href = "/login/";
  }, 300000);  // 5 minutes