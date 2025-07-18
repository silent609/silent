// Overlay click to start music and fade out overlay/blur/text
document.getElementById('overlay').addEventListener('click', function() {
  const audio = document.getElementById('bg-music');
  audio.loop = true;
  audio.play().catch((e) => {
    console.log("Audio play failed:", e);
  });

  this.classList.add('fading');
  setTimeout(() => {
    this.style.display = 'none';
  }, 700);
});

// Snowflake creation function (fall gently to right, land, stay, fade out in place)
function createSnowflake() {
  const snowflake = document.createElement("div");
  snowflake.classList.add("snowflake");
  const startLeft = Math.random() * window.innerWidth;
  snowflake.style.left = startLeft + "px";
  const size = Math.random() * 4 + 2;
  snowflake.style.width = size + "px";
  snowflake.style.height = size + "px";
  const duration = Math.random() * 5 + 5;
  snowflake.style.animationDuration = duration + "s";
  document.body.appendChild(snowflake);

  snowflake.addEventListener('animationend', () => {
    // Get the landing position using getBoundingClientRect
    const rect = snowflake.getBoundingClientRect();
    snowflake.style.left = (rect.left + window.scrollX) + "px";
    snowflake.style.top = (rect.top + window.scrollY) + "px";
    snowflake.style.transform = "none";
    snowflake.style.animation = "none";
    // Fade out after 4 seconds
    setTimeout(() => {
      snowflake.style.opacity = "0";
      setTimeout(() => {
        snowflake.remove();
      }, 1000);
    }, 4000);
  });
}
setInterval(createSnowflake, 100);

// Crosshair follows mouse pointer
const crosshair = document.querySelector('.crosshair-container');
document.addEventListener('mousemove', (e) => {
  crosshair.style.left = (e.clientX - 30) + 'px';
  crosshair.style.top = (e.clientY - 30) + 'px';
});

// Magnetic title effect (works with static "silent")
const magneticTitle = document.getElementById('magnetic-title');
document.addEventListener('mousemove', (e) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const maxDist = 60;
  const dx = (e.clientX - centerX) / centerX;
  const dy = (e.clientY - centerY) / centerY;
  magneticTitle.style.transform = `translate(-50%, -50%) translate(${dx * maxDist}px, ${dy * maxDist}px)`;
});
document.addEventListener('mouseleave', () => {
  magneticTitle.style.transform = 'translate(-50%, -50%)';
});

/**
 * Creates an orbiting social button with copy-to-clipboard.
 * @param {string} containerId - The ID for the orbiting button container
 * @param {string} btnId - The ID for the button itself
 * @param {string} copiedId - The ID for the "Copied!" message div
 * @param {string} username - The username to copy to clipboard
 * @param {number} orbitRadius - The orbit radius in pixels
 * @param {number} orbitSpeed - The orbit speed (rotations per second)
 * @param {number} orbitOffset - Angle offset in radians
 */
function setupOrbitingCopyButton(containerId, btnId, copiedId, username, orbitRadius, orbitSpeed, orbitOffset) {
  const btnContainer = document.getElementById(containerId);
  const btn = document.getElementById(btnId);
  const copiedMsg = document.getElementById(copiedId);
  const pfpContainer = document.querySelector('.pfp-container');
  const magneticTitleElem = document.getElementById('magnetic-title');

  // Copy to clipboard functionality
  btn.addEventListener('click', function() {
    navigator.clipboard.writeText(username).then(() => {
      copiedMsg.classList.add('visible');
      setTimeout(() => {
        copiedMsg.classList.remove('visible');
      }, 1500);
    });
  });

  // Orbit animation
  function animateOrbit() {
    const now = Date.now() / 1000;
    const angle = now * orbitSpeed * 2 * Math.PI + orbitOffset;

    // Calculate center between pfp and title for orbit center
    const pfpRect = pfpContainer.getBoundingClientRect();
    const titleRect = magneticTitleElem.getBoundingClientRect();
    const centerX = (pfpRect.left + titleRect.left + pfpRect.width/2 + titleRect.width/2) / 2 + window.scrollX;
    const centerY = (pfpRect.top + titleRect.top + pfpRect.height/2 + titleRect.height/2) / 2 + window.scrollY;

    // Calculate orbiting position
    const x = centerX + orbitRadius * Math.cos(angle) - btnContainer.offsetWidth / 2;
    const y = centerY + orbitRadius * Math.sin(angle) - btnContainer.offsetHeight / 2;

    // Apply position
    btnContainer.style.left = `${x}px`;
    btnContainer.style.top = `${y}px`;

    requestAnimationFrame(animateOrbit);
  }
  animateOrbit();
}

// Setup the Discord and Roblox orbiting buttons
setupOrbitingCopyButton("discord-btn-container", "discord-btn", "discord-copied", "goldenak", 270, 0.07, 0);
setupOrbitingCopyButton("roblox-btn-container", "roblox-btn", "roblox-copied", "GoldenAk01", 270, 0.07, Math.PI);

// Typing animation loop for browser/tab title ONLY (no empty titles to avoid glitch)
(function typeAndDeleteTitleLoop() {
  const text = 'silent';
  const typingSpeed = 120; // ms per character typing
  const deletingSpeed = 70; // ms per character deleting
  const holdTime = 350; // ms pause after full text typed
  const emptyHoldTime = 600; // ms pause after deleting to empty (but we avoid empty title)

  let i = 0;
  let typing = true;

  function typeLoop() {
    if (typing) {
      if (i < text.length) {
        document.title = text.slice(0, i + 1);
        i++;
        setTimeout(typeLoop, typingSpeed);
      } else {
        typing = false;
        setTimeout(typeLoop, holdTime);
      }
    } else {
      if (i > 0) {
        const newTitle = text.slice(0, i - 1);
        // Avoid empty string title to prevent browser fallback to URL
        document.title = newTitle.length > 0 ? newTitle : ' ';
        i--;
        setTimeout(typeLoop, deletingSpeed);
      } else {
        typing = true;
        setTimeout(typeLoop, emptyHoldTime);
      }
    }
  }
  typeLoop();
})();
