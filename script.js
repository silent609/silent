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

//--- Snowflakes with smooth spawn/fade, landing slightly above bottom ---
const SNOWFLAKE_EVERY = 100; // ms between flakes
let lastSnowflakeTime = performance.now();

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
  const driftX = 60 + Math.random() * 80;
  snowflake.style.setProperty('--snowflake-drift', driftX + 'px');
  document.body.appendChild(snowflake);

  snowflake.addEventListener('animationend', () => {
    const rect = snowflake.getBoundingClientRect();
    snowflake.style.left = (rect.left + window.scrollX) + "px";
    snowflake.style.top = (rect.top + window.scrollY) + "px";
    snowflake.style.transform = "none";
    snowflake.style.animation = "none";
    snowflake.style.opacity = "0";
    setTimeout(() => {
      snowflake.remove();
    }, 1000);
  });
}

function snowflakeLoop(now) {
  if (now - lastSnowflakeTime > SNOWFLAKE_EVERY) {
    createSnowflake();
    lastSnowflakeTime = now;
  }
  requestAnimationFrame(snowflakeLoop);
}
requestAnimationFrame(snowflakeLoop);

//--- Crosshair follows mouse pointer ---
const crosshair = document.querySelector('.crosshair-container');
document.addEventListener('mousemove', (e) => {
  crosshair.style.left = (e.clientX - 30) + 'px';
  crosshair.style.top = (e.clientY - 30) + 'px';
});

//--- Magnetic title effect for "silent" h1 ---
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

//--- Orbiting social button with copy-to-clipboard ---
function setupOrbitingCopyButton(containerId, btnId, copiedId, username, orbitRadius, orbitSpeed, orbitOffset) {
  const btnContainer = document.getElementById(containerId);
  const btn = document.getElementById(btnId);
  const copiedMsg = document.getElementById(copiedId);
  const pfpContainer = document.querySelector('.pfp-container');
  const magneticTitleElem = document.getElementById('magnetic-title');

  btn.addEventListener('click', function() {
    navigator.clipboard.writeText(username).then(() => {
      copiedMsg.classList.add('visible');
      setTimeout(() => {
        copiedMsg.classList.remove('visible');
      }, 1500);
    });
  });

  function animateOrbit() {
    const now = Date.now() / 1000;
    const angle = now * orbitSpeed * 2 * Math.PI + orbitOffset;
    const pfpRect = pfpContainer.getBoundingClientRect();
    const titleRect = magneticTitleElem.getBoundingClientRect();
    const centerX = (pfpRect.left + titleRect.left + pfpRect.width/2 + titleRect.width/2) / 2 + window.scrollX;
    const centerY = (pfpRect.top + titleRect.top + pfpRect.height/2 + titleRect.height/2) / 2 + window.scrollY;
    const x = centerX + orbitRadius * Math.cos(angle) - btnContainer.offsetWidth/2;
    const y = centerY + orbitRadius * Math.sin(angle) - btnContainer.offsetHeight/2;
    btnContainer.style.left = `${x}px`;
    btnContainer.style.top = `${y}px`;
    requestAnimationFrame(animateOrbit);
  }
  animateOrbit();
}

setupOrbitingCopyButton("discord-btn-container", "discord-btn", "discord-copied", "goldenak", 270, 0.07, 0);
setupOrbitingCopyButton("roblox-btn-container", "roblox-btn", "roblox-copied", "GoldenAk01", 270, 0.07, Math.PI);

//--- Typing effect for tab: "silent", deletes back to "s", never blank ---
(function typeAndDeleteTitleLoop() {
  const text = 'silent';
  const typingSpeed = 120;
  const deletingSpeed = 70;
  const holdTime = 350;
  const restartTime = 600;

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
      if (i > 1) {
        document.title = text.slice(0, i - 1);
        i--;
        setTimeout(typeLoop, deletingSpeed);
      } else {
        typing = true;
        setTimeout(typeLoop, restartTime);
      }
    }
  }
  typeLoop();
})();
