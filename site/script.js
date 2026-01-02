document.addEventListener("DOMContentLoaded", () => {
  // Agar dashboard.html da bo'lsa va login qilinmagan bo'lsa → login ga yo'naltir
  if (window.location.pathname.endsWith("dashboard.html")) {
    if (localStorage.getItem("loggedIn") !== "true") {
      window.location.href = "index.html";
      return;
    }
  }

  // Agar index.html da bo'lsa va allaqachon login qilingan bo'lsa → dashboard ga
  if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
    if (localStorage.getItem("loggedIn") === "true") {
      window.location.href = "dashboard.html";
      return;
    }
  }

  // ====================== LOGIN FORMA ======================
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      const errorMsg = document.getElementById("error-message");

      errorMsg.style.display = "none";
      errorMsg.textContent = "";

      try {
        const response = await fetch("http://localhost:8080/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
          // Ma'lumotlarni localStorage ga saqlash
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("username", data.username);
          localStorage.setItem("endDate", data.endDate);
          localStorage.setItem("daysLeft", data.daysLeft);
          localStorage.setItem("status", data.status);

          // Dashboard ga o'tish
          window.location.href = "dashboard.html";
        } else {
          errorMsg.textContent = data.message || "Noto'g'ri username yoki parol!";
          errorMsg.style.display = "block";
        }
      } catch (err) {
        console.error(err);
        errorMsg.textContent = "Server bilan bog'lanishda xatolik yuz berdi!";
        errorMsg.style.display = "block";
      }
    });
  }

  // ====================== DASHBOARD LOGIKASI ======================
  if (window.location.pathname.endsWith("dashboard.html")) {
    // Foydalanuvchi ma'lumotlarini ko'rsatish
    document.getElementById("user-name").textContent = localStorage.getItem("username") || "Foydalanuvchi";
    document.getElementById("status-info").textContent = "Status: " + localStorage.getItem("status");
    document.getElementById("end-date-info").textContent = "Muddat tugash sanasi: " + localStorage.getItem("endDate");
    document.getElementById("days-left-info").textContent = "Qolgan kunlar: " + localStorage.getItem("daysLeft");

    // Chiqish tugmasi
    document.getElementById("logout").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "index.html";
    });

    // ====================== MOBILE SIDEBAR ======================
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const closeMenuBtn = document.getElementById("close-menu-btn");
    const header = document.querySelector("header");

    if (hamburgerBtn && closeMenuBtn && header) {
      hamburgerBtn.addEventListener("click", () => {
        header.classList.add("show-mobile-menu");
      });

      closeMenuBtn.addEventListener("click", () => {
        header.classList.remove("show-mobile-menu");
      });

      // Overlay bosilganda yopilish
      header.addEventListener("click", (e) => {
        if (e.target === header && header.classList.contains("show-mobile-menu")) {
          header.classList.remove("show-mobile-menu");
        }
      });
    }
  }
});