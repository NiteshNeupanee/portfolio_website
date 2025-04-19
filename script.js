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
    speed: 0.003 + Math.random() * 0.002
