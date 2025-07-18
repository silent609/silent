console.log("✅ script.js loaded");

const overlay = document.getElementById('overlay');
const audio = document.getElementById('bg-music');

// Handle overlay click
overlay.addEventListener('click', function () {
  console.log("🖱️ Overlay clicked");

  if (!audio) {
    alert('Audio not found');
    return;
  }

  audio.currentTime = 0;
  audio.loop = true;

  audio.play().then(() => {
    console.log("🎵 Music playing");
    overlay.classList.add('fading');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 700);
  }).catch(err => {
    console.error("⚠️ Audio playback failed:", err);
    alert("Music couldn't play. Tap to try again or check browser settings.");
  });
});

// Snowflakes
const SNOW_INTERVAL = 100;
let lastTime = performance.now();

function createSnowflake() {
  const f = document.createElement('div');
  f.className = 'snowflake';
  f.style.left = Math.random() * window.innerWidth + "px";
  const size = Math.random() * 4 + 2;
  f.style.width = size + "px";
  f.style.height = size + "px";
  f.style.animationDuration = (Math.random() * 5 + 5) + "s";
  f.style.setProperty('--snowflake-drift', 50 + Math.random() * 100 + "px");
  document.body.appendChild(f);

  f.addEventListener('animationend', () => {
    f.remove();
  });
}

function snowLoop(time) {
  if (time - lastTime > SNOW_INTERVAL) {
    createSnowflake();
    lastTime = time;
  }
  requestAnimationFrame(snowLoop);
}
requestAnimationFrame(snowLoop);

// Crosshair
const crosshair = document.querySelector('.crosshair-container');
document.addEventListener('mousemove', e => {
  crosshair.style.left = (e.clientX - 30) + 'px';
  crosshair.style.top = (e.clientY - 30) + 'px';
});

// Orbiting Buttons
function orbitButton(containerId, btnId, toastId, label, radius, speed, offset = 0) {
  const container = document.getElementById(containerId);
  const btn = document.getElementById(btnId);
  const toast = document.getElementById(toastId);

  btn.addEventListener("click", () => {
    navigator.clipboard.writeText(label).then(() => {
      toast.classList.add("visible");
      setTimeout(() => toast.classList.remove("visible"), 1500);
    });
  });

  const pfp = document.querySelector('.pfp-container');
  const title = document.getElementById('magnetic-title');

  function orbit() {
    const t = Date.now() / 1000;
    const angle = t * speed * 2 * Math.PI + offset;

    const rect = pfp.getBoundingClientRect();
    const tRect = title.getBoundingClientRect();

    const cx = (rect.left + tRect.left + rect.width / 2 + tRect.width / 2) / 2 + window.scrollX;
    const cy = (rect.top + tRect.top + rect.height / 2 + tRect.height / 2) / 2 + window.scrollY;

    const x = cx + radius * Math.cos(angle) - container.offsetWidth / 2;
    const y = cy + radius * Math.sin(angle) - container.offsetHeight / 2;

    container.style.left = `${x}px`;
    container.style.top = `${y}px`;

    requestAnimationFrame(orbit);
  }
  orbit();
}

orbitButton("discord-btn-container", "discord-btn", "discord-copied", "goldenak", 270, 0.07, 0);
orbitButton("roblox-btn-container", "roblox-btn", "roblox-copied", "GoldenAk01", 270, 0.07, Math.PI);

// Magnetic Title
const mag = document.getElementById("magnetic-title");
document.addEventListener("mousemove", e => {
  const mx = window.innerWidth / 2;
  const my = window.innerHeight / 2;
  const dx = (e.clientX - mx) / mx;
  const dy = (e.clientY - my) / my;
  mag.style.transform = `translate(-50%, -50%) translate(${dx * 60}px, ${dy * 60}px)`;
});
document.addEventListener("mouseleave", () => {
  mag.style.transform = 'translate(-50%, -50%)';
});

// Tab Title Typing
(function loopTitle() {
  const text = "silent";
  let i = 0;
  let typing = true;

  function next() {
    if (typing) {
      if (i < text.length) {
        document.title = text.slice(0, ++i);
        return setTimeout(next, 120);
      } else {
        typing = false;
        setTimeout(next, 500);
      }
    } else {
      if (i > 1) {
        document.title = text.slice(0, --i);
        return setTimeout(next, 60);
      } else {
        typing = true;
        setTimeout(next, 600);
      }
    }
  }
  next();
})();
