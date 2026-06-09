
    const menuBtn = document.getElementById("menuBtn");
    const dashboard = document.getElementById("dashboard");
    const mainContent = document.getElementById("mainContent");
    const overlay = document.getElementById("overlay");
    const navLinks = document.querySelector('.nav-center-links');
    const dashboardNav = document.getElementById('dashboardNav');
    const reviewForm = document.getElementById('reviewForm');
    const statusMessage = document.getElementById('statusMessage');

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

    reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(reviewForm);
    const rating = formData.get('rating'); // This captures the 1-5 value
    
    console.log("Rating Submitted:", rating);

    // Show success message
    statusMessage.style.display = 'block';
    reviewForm.reset();
    
    // Hide message after 5 seconds
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 5000);
});