// Typing animation for tagline
const text = "A passionate Engineer | Innovator | Creator";
let idx = 0;
function typeWriter() {
  if (idx < text.length) {
    document.getElementById("typing").innerHTML += text.charAt(idx);
    idx++;
    setTimeout(typeWriter, 60);
  }
}
window.onload = typeWriter;

// Animate skill bars
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.fill').forEach(bar => {
    const width = bar.getAttribute('data-width');
    bar.style.width = width;
  });
});

// Parallax stars background
function createStars() {
  const stars = document.getElementById('stars');
  stars.innerHTML = '';
  let w = window.innerWidth, h = window.innerHeight;
  for (let i = 0; i < 100; i++) {
    let star = document.createElement('div');
    let size = Math.random() * 2 + 1;
    star.style.position = 'absolute';
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.background = 'white';
    star.style.borderRadius = '50%';
    star.style.top = Math.random() * h + 'px';
    star.style.left = Math.random() * w + 'px';
    star.style.opacity = Math.random() * 0.8 + 0.2;
    star.style.boxShadow = `0 0 6px 2px #00d9ff88`;
    stars.appendChild(star);
  }
}
window.addEventListener('resize', createStars);
createStars();

// LEO satellites animation
const canvas = document.getElementById('satellite-canvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const satellites = [];
const earthCenter = () => ({
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
});
for (let i = 0; i < 6; i++) {
  satellites.push({
    angle: Math.random() * Math.PI * 2,
    radius: 180 + Math.random() * 60,
    speed: 0.003 + Math.random() * 0.002,
    size: 10 + Math.random() * 8,
    color: "#00d9ff"
  });
}

function drawSatellites() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const {x, y} = earthCenter();
  satellites.forEach(sat => {
    sat.angle += sat.speed;
    let sx = x + sat.radius * Math.cos(sat.angle);
    let sy = y + sat.radius * Math.sin(sat.angle) * 0.7;
    ctx.save();
    ctx.beginPath();
    ctx.arc(sx, sy, sat.size/2, 0, Math.PI * 2);
    ctx.fillStyle = sat.color;
    ctx.shadowColor = "#00d9ff";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();

    // Draw satellite "solar panels"
    ctx.save();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx - sat.size, sy);
    ctx.lineTo(sx + sat.size, sy);
    ctx.stroke();
    ctx.restore();
  });
  requestAnimationFrame(drawSatellites);
}
drawSatellites();

// --- SCROLLSPY SIDEBAR HIGHLIGHT ---

// Map each section to its sidebar link ID
const scrollspySections = [
  { id: "main", nav: "nav-home" },
  { id: "about", nav: "nav-about" },
  { id: "skills", nav: "nav-skills" },
  { id: "experience", nav: "nav-experience" },
  { id: "projects", nav: "nav-projects" },
  { id: "contact", nav: "nav-contact" }
];

function activateSidebarLink() {
  let scrollPos = window.scrollY || document.documentElement.scrollTop;
  let offset = 120; // adjust for your header height
  let currentSection = scrollspySections[0].id;
  for (let i = 0; i < scrollspySections.length; i++) {
    let section = document.getElementById(scrollspySections[i].id);
    if (section && section.offsetTop - offset <= scrollPos) {
      currentSection = scrollspySections[i].id;
    }
  }
  scrollspySections.forEach(s => {
    let nav = document.getElementById(s.nav);
    if (nav) {
      if (s.id === currentSection) {
        nav.classList.add("active");
      } else {
        nav.classList.remove("active");
      }
    }
  });
}

// Smooth scroll on sidebar click (optional, for a better UX)
document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80, // adjust for header
          behavior: 'smooth'
        });
      }
    }
  });
});

window.addEventListener("scroll", activateSidebarLink);
window.addEventListener("DOMContentLoaded", activateSidebarLink);
