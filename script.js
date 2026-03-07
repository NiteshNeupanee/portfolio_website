// ===================================================================
// NITESH NEUPANE — PORTFOLIO SCRIPTS
// Clean, minimal. Scrollspy + smooth scroll only.
// ===================================================================

// --- SCROLLSPY SIDEBAR HIGHLIGHT ---
const scrollspySections = [
  { id: "hero", nav: "nav-home" },
  { id: "about", nav: "nav-about" },
  { id: "skills", nav: "nav-skills" },
  { id: "experience", nav: "nav-experience" },
  { id: "projects", nav: "nav-projects" },
  { id: "contact", nav: "nav-contact" }
];

function activateSidebarLink() {
  const scrollPos = window.scrollY || document.documentElement.scrollTop;
  const offset = 120;
  let currentSection = scrollspySections[0].id;

  for (let i = 0; i < scrollspySections.length; i++) {
    const section = document.getElementById(scrollspySections[i].id);
    if (section && section.offsetTop - offset <= scrollPos) {
      currentSection = scrollspySections[i].id;
    }
  }

  scrollspySections.forEach(s => {
    const nav = document.getElementById(s.nav);
    if (nav) {
      nav.classList.toggle("active", s.id === currentSection);
    }
  });
}

window.addEventListener("scroll", activateSidebarLink);
window.addEventListener("DOMContentLoaded", activateSidebarLink);

// --- SMOOTH SCROLL ON SIDEBAR CLICK ---
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 64,
          behavior: 'smooth'
        });
      }
    }
  });
});
