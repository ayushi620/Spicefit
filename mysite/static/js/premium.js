document.addEventListener("DOMContentLoaded", function () {

  const menuBtn = document.getElementById("menuBtn");
  const dashboard = document.getElementById("dashboard");
  const mainContent = document.getElementById("mainContent");
  const overlay = document.getElementById("overlay");
  const dashboardNav = document.getElementById('dashboardNav');

  // Toggle Sidebar
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

  // Close on Escape
  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dashboard.classList.contains('active')) {
          toggleSidebar();
      }
  });

  // Mobile Nav
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

});


// 🔥 KEEP THESE OUTSIDE (GLOBAL)
let selectedPremiumMethod = "";
let selectedPlanAmount = 0;
let selectedPlanName = "";

function openPremiumModal(planName, amount) {
  selectedPlanName = planName;
  selectedPlanAmount = amount;
  selectedPremiumMethod = "";

  document.getElementById("modalPlanName").innerText = planName;
  document.getElementById("modalPlanAmount").innerText = amount.toFixed(2);
  document.getElementById("premiumModal").style.display = "flex";

  document.getElementById("premiumUPI").style.display = "none";
  document.getElementById("premiumUPI").value = "";
  document.getElementById("premiumUPIError").style.display = "none";

  document.getElementById("cardDetails").style.display = "none";
  document.getElementById("cardNumber").value = "";
  document.getElementById("cardName").value = "";
  document.getElementById("cardExpiry").value = "";
  document.getElementById("cardCVV").value = "";
  document.getElementById("cardError").style.display = "none";

  document.getElementById("modalPayError").style.display = "none";

  document.querySelectorAll("#premiumModal .option").forEach(o => o.classList.remove("active"));
}

function closePremiumModal() {
  document.getElementById("premiumModal").style.display = "none";
}

function selectPremiumMethod(el, method) {
  selectedPremiumMethod = method;

  document.querySelectorAll("#premiumModal .option").forEach(o => o.classList.remove("active"));
  el.classList.add("active");

  document.getElementById("modalPayError").style.display = "none";

  document.getElementById("premiumUPI").style.display = method === "UPI" ? "block" : "none";
  document.getElementById("cardDetails").style.display = method === "CARD" ? "block" : "none";
}

function confirmPremiumPayment() {

  if (!selectedPremiumMethod) {
      document.getElementById("modalPayError").style.display = "block";
      return;
  }

  if (selectedPremiumMethod === "UPI") {
      const upiId = document.getElementById("premiumUPI").value.trim();

      if (!upiId || !upiId.includes("@")) {
          document.getElementById("premiumUPIError").style.display = "block";
          return;
      }

      document.getElementById("premiumUPIError").style.display = "none";
  } 
  else if (selectedPremiumMethod === "CARD") {

      const number = document.getElementById("cardNumber").value.trim();
      const name = document.getElementById("cardName").value.trim();
      const expiry = document.getElementById("cardExpiry").value.trim();
      const cvv = document.getElementById("cardCVV").value.trim();

      const expiryPattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;

      if (
          !/^\d{16}$/.test(number) ||
          !name ||
          !expiryPattern.test(expiry) ||
          !/^\d{3,4}$/.test(cvv)
      ) {
          document.getElementById("cardError").style.display = "block";
          return;
      }

      document.getElementById("cardError").style.display = "none";
  }

  // ✅ IMPORTANT DEBUG
  console.log("PLAN:", selectedPlanName);
  console.log("METHOD:", selectedPremiumMethod);

  // ✅ SET VALUES
  document.getElementById("hiddenPremiumType").value = selectedPlanName;
  document.getElementById("hiddenPaymentMethod").value = selectedPremiumMethod;
// ✅ SHOW FULL DETAILS ALERT
alert(
  "🎉 PAYMENT SUCCESSFUL 🎉\n\n" +
  "👑 Plan   : " + selectedPlanName + "\n" +
  "💰 Amount : ₹" + selectedPlanAmount.toFixed(2) + "\n" +
  "💳 Method : " + selectedPremiumMethod + "\n\n" +
  "Thank you for your purchase!"
  );

// ✅ SUBMIT AFTER DELAY
setTimeout(() => {
    document.getElementById("premiumForm").submit();
}, 800);
}