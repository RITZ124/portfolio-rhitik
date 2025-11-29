document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

// Smooth scroll + active link handling
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);

    if (target) {
      const yOffset = -70;
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    navLinks.classList.remove("open");
  });
});

window.addEventListener("scroll", () => {
  const scrollPos = window.pageYOffset;

  sections.forEach(sec => {
    const top = sec.offsetTop - 90;
    const bottom = top + sec.offsetHeight;

    if (scrollPos >= top && scrollPos < bottom) {
      const id = sec.getAttribute("id");
      links.forEach(link => {
        const match = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", match);
      });
    }
  });
});

// Projects horizontal scroll buttons
const projectsGrid = document.getElementById("projectsGrid");
const prevBtn = document.getElementById("projectsPrev");
const nextBtn = document.getElementById("projectsNext");

function scrollProjects(direction) {
  if (!projectsGrid) return;
  const card = projectsGrid.querySelector(".project-card");
  const scrollAmount = card ? card.offsetWidth + 20 : 320;
  projectsGrid.scrollBy({
    left: direction === "next" ? scrollAmount : -scrollAmount,
    behavior: "smooth",
  });
}

if (prevBtn && nextBtn && projectsGrid) {
  prevBtn.addEventListener("click", () => scrollProjects("prev"));
  nextBtn.addEventListener("click", () => scrollProjects("next"));
}

// Auto-scroll projects (pause on hover)
let autoScrollInterval = null;
function startAutoScroll() {
  if (!projectsGrid) return;
  autoScrollInterval = setInterval(() => {
    scrollProjects("next");
  }, 8000);
}
function stopAutoScroll() {
  if (autoScrollInterval) clearInterval(autoScrollInterval);
}
if (projectsGrid) {
  projectsGrid.addEventListener("mouseenter", stopAutoScroll);
  projectsGrid.addEventListener("mouseleave", startAutoScroll);
  startAutoScroll();
}

// Theme toggle (dark/light)
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

function setTheme(theme) {
  if (theme === "light") {
    body.classList.add("light-theme");
  } else {
    body.classList.remove("light-theme");
  }
  localStorage.setItem("theme", theme);
  updateThemeIcon();
}

function updateThemeIcon() {
  if (!themeToggle) return;
  const icon = themeToggle.querySelector("i");
  if (!icon) return;
  if (body.classList.contains("light-theme")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
}

// Load theme from storage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || savedTheme === "dark") {
  setTheme(savedTheme);
} else {
  setTheme("dark");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = body.classList.contains("light-theme") ? "dark" : "light";
    setTheme(nextTheme);
  });
}

// Reveal-on-scroll (Framer-like)
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add("in-view"));
}

/* ============================
   EMAILJS + TOAST + VALIDATION
===============================*/

// 1) INIT EMAILJS –– PUT YOUR PUBLIC KEY HERE
(function() {
  // TODO: REPLACE with your actual EmailJS Public Key, inside quotes
  emailjs.init("DG8iewRz1lI3-LQrh");
})();

// 2) Toast helper
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.classList.add("toast", type === "success" ? "toast-success" : "toast-error");
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3800);
}

// 3) Form validation
function validateForm() {
  let valid = true;

  const name = document.querySelector("[name=user_name]");
  const email = document.querySelector("[name=user_email]");
  const msg = document.querySelector("[name=message]");

  const inputs = [name, email, msg];
  inputs.forEach(i => i && i.classList.remove("input-error"));

  if (!name || !email || !msg) {
    showToast("Form is not wired correctly in HTML.", "error");
    return false;
  }

  if (!name.value.trim()) {
    name.classList.add("input-error");
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRegex.test(email.value)) {
    email.classList.add("input-error");
    valid = false;
  }

  if (!msg.value.trim()) {
    msg.classList.add("input-error");
    valid = false;
  }

  if (!valid) showToast("Please fill all fields correctly.", "error");
  return valid;
}

// 4) Contact form handler
const formEl = document.getElementById("contactForm");
const sendBtn = document.querySelector(".contact-form button");

if (formEl && sendBtn) {
  formEl.addEventListener("submit", function(e) {
    e.preventDefault();

    if (!validateForm()) return;

    // add loading state
    sendBtn.classList.add("button-loading");

    // TODO: REPLACE with your actual SERVICE ID and TEMPLATE ID from EmailJS
    emailjs
      .sendForm("service_qeo83db", "template_npr6tq2", "#contactForm")
      .then(
        function() {
          showToast("Message sent successfully!", "success");
          formEl.reset();
          sendBtn.classList.remove("button-loading");
        },
        function(error) {
          console.log("EmailJS FAILED", error);
          showToast("Failed to send message. Check your EmailJS IDs.", "error");
          sendBtn.classList.remove("button-loading");
        }
      );
  });
}


/* ============================
   HERO TYPING ANIMATION
===============================*/
const typingText = document.querySelector(".hero-role");
const roles = [
  "Software Engineer",
  "AI/ML Developer",
  "Full-Stack Developer"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
  const current = roles[roleIndex];
  if (!deleting) {
    typingText.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) {
      deleting = true;
      setTimeout(typeEffect, 900);
      return;
    }
  } else {
    typingText.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeEffect, deleting ? 60 : 120);
}

typeEffect();

