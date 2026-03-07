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

// === ROCKET ENGINE ELEMENT START ===

(function () {
  const canvas = document.getElementById('plume-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const bloom = document.getElementById('engine-bloom');
  const nozzleGlow = document.getElementById('nozzle-glow');
  const isMobile = window.innerWidth < 768;

  // Canvas sizing
  const dpr = window.devicePixelRatio || 1;
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();
  window.addEventListener('resize', () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    resizeCanvas();
  });

  // Plume parameters
  const NOZZLE_EXIT_DIAMETER = 120; // px, matches SVG diverging exit width
  const DIAMOND_SPACING = NOZZLE_EXIT_DIAMETER * 0.7;
  const MAX_DIAMONDS = isMobile ? 3 : 5;
  const CANVAS_W = canvas.getBoundingClientRect().width;
  const CANVAS_H = canvas.getBoundingClientRect().height;
  const CENTER_X = CANVAS_W / 2; // centered on nozzle

  // Lerp utility
  function lerp(a, b, t) { return a + (b - a) * t; }

  // Current smoothed state
  let current = {
    thrust: 0,         // 0–1, smoothed scroll percent
    plumeLength: 0,    // px
    diamondCount: 0,
    diamondBrightness: 0,
    coreOpacity: 0,
    orangeOpacity: 0,
    blueOpacity: 0,
    nozzleHeat: 0,     // 0–1
    bloomOpacity: 0,
    flameWidth: 0
  };

  // Target state (set by scroll)
  let target = { ...current };

  // Scroll listener
  function getScrollPercent() {
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    return Math.min(1, Math.max(0, scrollY / maxScroll));
  }

  function updateTargets() {
    const p = 1 - getScrollPercent(); // REVERSED: full thrust at top, idle at bottom

    if (p < 0.05) {
      // State 1: idle / cold
      target.thrust = p / 0.05 * 0.08;
      target.plumeLength = 20;
      target.diamondCount = 0;
      target.diamondBrightness = 0;
      target.coreOpacity = 0.15;
      target.orangeOpacity = 0;
      target.blueOpacity = 0.05;
      target.nozzleHeat = 0;
      target.bloomOpacity = 0;
      target.flameWidth = 15;
    } else if (p < 0.15) {
      // Transition to State 2: ignition
      const t = (p - 0.05) / 0.10;
      target.thrust = lerp(0.08, 0.25, t);
      target.plumeLength = lerp(20, 80, t);
      target.diamondCount = 0;
      target.diamondBrightness = 0;
      target.coreOpacity = lerp(0.15, 0.5, t);
      target.orangeOpacity = lerp(0, 0.4, t);
      target.blueOpacity = lerp(0.05, 0.15, t);
      target.nozzleHeat = lerp(0, 0.15, t);
      target.bloomOpacity = lerp(0, 0.1, t);
      target.flameWidth = lerp(15, 30, t);
    } else if (p < 0.35) {
      // State 3: low thrust — first shock diamond
      const t = (p - 0.15) / 0.20;
      target.thrust = lerp(0.25, 0.5, t);
      target.plumeLength = lerp(80, 200, t);
      target.diamondCount = lerp(0, 1.5, t);
      target.diamondBrightness = lerp(0, 0.6, t);
      target.coreOpacity = lerp(0.5, 0.8, t);
      target.orangeOpacity = lerp(0.4, 0.7, t);
      target.blueOpacity = lerp(0.15, 0.3, t);
      target.nozzleHeat = lerp(0.15, 0.35, t);
      target.bloomOpacity = lerp(0.1, 0.3, t);
      target.flameWidth = lerp(30, 50, t);
    } else if (p < 0.60) {
      // State 4: medium thrust — 2–3 diamonds
      const t = (p - 0.35) / 0.25;
      target.thrust = lerp(0.5, 0.75, t);
      target.plumeLength = lerp(200, 380, t);
      target.diamondCount = lerp(1.5, 3, t);
      target.diamondBrightness = lerp(0.6, 0.85, t);
      target.coreOpacity = lerp(0.8, 0.95, t);
      target.orangeOpacity = lerp(0.7, 0.85, t);
      target.blueOpacity = lerp(0.3, 0.5, t);
      target.nozzleHeat = lerp(0.35, 0.65, t);
      target.bloomOpacity = lerp(0.3, 0.6, t);
      target.flameWidth = lerp(50, 65, t);
    } else {
      // State 5: full throttle — 4–5 diamonds
      const t = Math.min(1, (p - 0.60) / 0.35);
      target.thrust = lerp(0.75, 1, t);
      target.plumeLength = lerp(380, CANVAS_H - 20, t);
      target.diamondCount = lerp(3, MAX_DIAMONDS, t);
      target.diamondBrightness = lerp(0.85, 1, t);
      target.coreOpacity = lerp(0.95, 1, t);
      target.orangeOpacity = lerp(0.85, 1, t);
      target.blueOpacity = lerp(0.5, 0.7, t);
      target.nozzleHeat = lerp(0.65, 1, t);
      target.bloomOpacity = lerp(0.6, 1, t);
      target.flameWidth = lerp(65, 80, t);
    }
  }

  window.addEventListener('scroll', updateTargets);
  updateTargets();

  // --- RENDER LOOP ---
  function render() {
    const LERP_FACTOR = 0.08;

    // Smooth interpolation
    for (const key in current) {
      current[key] = lerp(current[key], target[key], LERP_FACTOR);
    }

    const w = canvas.getBoundingClientRect().width;
    const h = canvas.getBoundingClientRect().height;
    ctx.clearRect(0, 0, w, h);

    if (current.coreOpacity < 0.02) {
      // Update DOM elements even when not drawing
      if (bloom) bloom.style.opacity = 0;
      if (nozzleGlow) nozzleGlow.setAttribute('opacity', 0);
      requestAnimationFrame(render);
      return;
    }

    // Flicker noise (±2%)
    const flicker = 1 + (Math.random() - 0.5) * 0.04;
    const cx = CENTER_X;
    const plumeLen = current.plumeLength * flicker;

    // --- Draw outer blue supersonic boundary ---
    if (current.blueOpacity > 0.01) {
      const outerGrad = ctx.createLinearGradient(cx, 0, cx, plumeLen);
      outerGrad.addColorStop(0, `rgba(40, 100, 200, ${current.blueOpacity * 0.6 * flicker})`);
      outerGrad.addColorStop(0.5, `rgba(40, 100, 200, ${current.blueOpacity * 0.3 * flicker})`);
      outerGrad.addColorStop(1, 'rgba(40, 100, 200, 0)');
      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      const outerW = current.flameWidth * 1.4;
      ctx.moveTo(cx - outerW * 0.5, 0);
      ctx.quadraticCurveTo(cx - outerW * 0.6, plumeLen * 0.5, cx - outerW * 0.15, plumeLen);
      ctx.lineTo(cx + outerW * 0.15, plumeLen);
      ctx.quadraticCurveTo(cx + outerW * 0.6, plumeLen * 0.5, cx + outerW * 0.5, 0);
      ctx.closePath();
      ctx.fill();
    }

    // --- Draw orange mid layer ---
    if (current.orangeOpacity > 0.01) {
      const midGrad = ctx.createLinearGradient(cx, 0, cx, plumeLen * 0.85);
      midGrad.addColorStop(0, `rgba(255, 160, 40, ${current.orangeOpacity * 0.8 * flicker})`);
      midGrad.addColorStop(0.4, `rgba(255, 120, 20, ${current.orangeOpacity * 0.5 * flicker})`);
      midGrad.addColorStop(1, 'rgba(255, 80, 0, 0)');
      ctx.fillStyle = midGrad;
      ctx.beginPath();
      const midW = current.flameWidth;
      ctx.moveTo(cx - midW * 0.4, 0);
      ctx.quadraticCurveTo(cx - midW * 0.45, plumeLen * 0.4, cx - midW * 0.1, plumeLen * 0.85);
      ctx.lineTo(cx + midW * 0.1, plumeLen * 0.85);
      ctx.quadraticCurveTo(cx + midW * 0.45, plumeLen * 0.4, cx + midW * 0.4, 0);
      ctx.closePath();
      ctx.fill();
    }

    // --- Draw white-hot core ---
    if (current.coreOpacity > 0.05) {
      const coreGrad = ctx.createLinearGradient(cx, 0, cx, plumeLen * 0.7);
      coreGrad.addColorStop(0, `rgba(255, 255, 240, ${current.coreOpacity * flicker})`);
      coreGrad.addColorStop(0.3, `rgba(255, 240, 200, ${current.coreOpacity * 0.7 * flicker})`);
      coreGrad.addColorStop(1, 'rgba(255, 200, 100, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      const coreW = current.flameWidth * 0.5;
      ctx.moveTo(cx - coreW * 0.35, 0);
      ctx.quadraticCurveTo(cx - coreW * 0.3, plumeLen * 0.3, cx - coreW * 0.05, plumeLen * 0.7);
      ctx.lineTo(cx + coreW * 0.05, plumeLen * 0.7);
      ctx.quadraticCurveTo(cx + coreW * 0.3, plumeLen * 0.3, cx + coreW * 0.35, 0);
      ctx.closePath();
      ctx.fill();
    }

    // --- Draw shock diamonds ---
    const numDiamonds = Math.floor(current.diamondCount);
    if (numDiamonds > 0 && current.diamondBrightness > 0.01) {
      for (let i = 0; i < numDiamonds; i++) {
        const diamondY = DIAMOND_SPACING * (i + 0.8);
        if (diamondY > plumeLen) break;

        const dFlicker = 1 + (Math.random() - 0.5) * 0.04;
        const brightness = current.diamondBrightness * dFlicker;

        // Bright compressed shock node (diamond shape)
        const dw = current.flameWidth * (0.35 - i * 0.04);
        const dh = DIAMOND_SPACING * 0.3;

        // Mach disk (bright horizontal band at diamond center)
        const diskGrad = ctx.createRadialGradient(cx, diamondY, 0, cx, diamondY, dw);
        diskGrad.addColorStop(0, `rgba(255, 255, 250, ${brightness * 0.9})`);
        diskGrad.addColorStop(0.4, `rgba(255, 200, 100, ${brightness * 0.5})`);
        diskGrad.addColorStop(1, 'rgba(255, 160, 40, 0)');

        ctx.fillStyle = diskGrad;
        ctx.beginPath();
        // Diamond shape: 4 points
        ctx.moveTo(cx, diamondY - dh);         // top
        ctx.lineTo(cx + dw, diamondY);         // right
        ctx.lineTo(cx, diamondY + dh);         // bottom
        ctx.lineTo(cx - dw, diamondY);         // left
        ctx.closePath();
        ctx.fill();

        // Expansion fan (darker zone after each diamond)
        if (i < numDiamonds - 1) {
          const fanY = diamondY + dh;
          const fanEnd = diamondY + DIAMOND_SPACING * 0.6;
          const fanGrad = ctx.createLinearGradient(cx, fanY, cx, fanEnd);
          fanGrad.addColorStop(0, `rgba(20, 10, 5, ${brightness * 0.15})`);
          fanGrad.addColorStop(1, 'rgba(20, 10, 5, 0)');
          ctx.fillStyle = fanGrad;
          ctx.fillRect(cx - dw * 0.8, fanY, dw * 1.6, fanEnd - fanY);
        }
      }
    }

    // --- Update nozzle heat glow ---
    if (nozzleGlow) {
      nozzleGlow.setAttribute('opacity', current.nozzleHeat * 0.8);
    }

    // --- Update bloom ---
    if (bloom) {
      bloom.style.opacity = current.bloomOpacity;
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();

// === ROCKET ENGINE ELEMENT END ===
