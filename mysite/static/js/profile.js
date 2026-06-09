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


    function openAvatar() {
        document.getElementById("avatarPopup").style.display = "flex";
    }
    
    function closeAvatar() {
        document.getElementById("avatarPopup").style.display = "none";
    }
    
    function setAvatar(img) {
        let src = img.src;
        document.getElementById("profileImg").src = src;
        localStorage.setItem("profileAvatar", src);
        closeAvatar();
    }
    
    // Load avatar on page load
    window.onload = function () {
        let saved = localStorage.getItem("profileAvatar");
        if (saved) {
            document.getElementById("profileImg").src = saved;
        }
    };
