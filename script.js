// === OVERLAY: Click to start music and fade out overlay ===
document.getElementById('overlay').addEventListener('click', function () {
  const audio = document.getElementById('bg-music');

  if (!audio) {
    alert('❌ Audio element not found!');
    console.error("❌ Audio element not found");
    return;
  }

  // Set audio props
  audio.loop = true;
  audio.currentTime = 0;

  console.log("🔄 Attempting to play music...");
  audio.play()
    .then(() => {
      console.log("✅ Music is playing");

      // Fade out overlay when music starts
      this.classList.add('fading');
      setTimeout(() => {
        this.style.display = 'none';
      }, 700);
    })
    .catch((error) => {
      console.error("❌ Failed to play music:", error);
      alert("⚠️ Music couldn't play. Try clicking again or unmute your browser.");
    });
});

// === SNOWFLAKES ===
const SNOWFLAKE_INTERVAL = 100;
let lastSnowflake = performance.now();

function createSnowflake() {
  const flake = document.createElement("div");
  flake.classList.add("snowflake");

  flake.style.left = Math.random() * window.innerWidth + "px";
  const size = Math.random() * 4 + 2;
  flake.style.width = size + "px";
  flake.style.height = size + "px";
  flake.style.animationDuration = Math.random() * 5 + 5 + "s";
  flake.style.setProperty("--snowflake-drift", 60 + Math.random() * 80 + "px");

  document.body.appendChild(flake);

  flake.addEventListener("animationend", () => {
    flake.style.opacity = "0";
    setTimeout(() => flake.remove(), 1000);
  });
}

function snowLoop(now) {
  if (now - lastSnowflake > SNOWFLAKE_INTERVAL) {
    createSnowflake();
    lastSnowflake = now;
  }
  requestAnimationFrame(snowLoop);
}
requestAnimationFrame(snowLoop);

// === CROSSHAIR FOLLOWING MOUSE ===
const crosshair = document.querySelector('.crosshair-container');
document.addEventListener('mousemove', e => {
  crosshair.style.left = (e.clientX - 30) + 'px';
  crosshair.style.top = (e.clientY - 30) + 'px';
});

// === MAGNETIC TITLE ===
const magnetic = document.getElementById("magnetic-title");
document.addEventListener("mousemove", e => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const dx = (e.clientX - centerX) / centerX;
  const dy = (e.clientY - centerY) / centerY;
  const maxDist = 60;

  magnetic.style.transform = `translate(-50%, -50%) translate(${dx * maxDist}px, ${dy * maxDist}px)`;
});
document.addEventListener("mouseleave", () => {
  magnetic.style.transform = "translate(-50%, -50%)";
});

// === ORBITING COPY BUTTONS ===
function orbitingCopyButton(containerId, btnId, toastId, username, radius, speed, offset = 0) {
  const container = document.getElementById(containerId);
  const button = document.getElementById(btnId);
  const toast = document.getElementById(toastId);
  const pfp = document.querySelector(".pfp-container");
  const title = document.getElementById("magnetic-title");

  button.addEventListener("click", () => {
    navigator.clipboard.writeText(username).then(() => {
      toast.classList.add("visible");
      setTimeout(() => toast.classList.remove("visible"), 1500);
    });
  });

  function orbit() {
    const t = Date.now() / 1000;
    const angle = t * speed * 2 * Math.PI + offset;

    const pfpRect = pfp.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();

    const centerX = (pfpRect.left + titleRect.left + pfpRect.width / 2 + titleRect.width / 2) / 2 + window.scrollX;
    const centerY = (pfpRect.top + titleRect.top + pfpRect.height / 2 + titleRect.height / 2) / 2 + window.scrollY;

    const x = centerX + radius * Math.cos(angle) - container.offsetWidth / 2;
    const y = centerY + radius * Math.sin(angle) - container.offsetHeight / 2;

    container.style.left = `${x}px`;
    container.style.top = `${y}px`;

    requestAnimationFrame(orbit);
  }
  orbit();
}

orbitingCopyButton("discord-btn-container", "discord-btn", "discord-copied", "goldenak", 270, 0.07, 0);
orbitingCopyButton("roblox-btn-container", "roblox-btn", "roblox-copied", "GoldenAk01", 270, 0.07, Math.PI);

// === TYPING TAB ANIMATION ===
(function tabTitleTyping() {
  const text = "silent";
  let i = 0;
  let typing = true;

  const typingSpeed = 120;
  const deletingSpeed = 70;
  const hold = 350;
  const restart = 600;

  function loop() {
    if (typing) {
      if (i < text.length) {
        document.title = text.slice(0, i + 1);
        i++;
        setTimeout(loop, typingSpeed);
      } else {
        typing = false;
        setTimeout(loop, hold);
      }
    } else {
      if (i > 1) {
        document.title = text.slice(0, i - 1);
        i--;
        setTimeout(loop, deletingSpeed);
      } else {
        typing = true;
        setTimeout(loop, restart);
      }
    }
  }
  loop();
})();
