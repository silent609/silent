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
      // 1. Get the visual landing position using getBoundingClientRect
      const rect = snowflake.getBoundingClientRect();
      // 2. Set left/top to that position (relative to document)
      snowflake.style.left = (rect.left + window.scrollX) + "px";
      snowflake.style.top = (rect.top + window.scrollY) + "px";
      // 3. Remove transform and animation so it stays there
      snowflake.style.transform = "none";
      snowflake.style.animation = "none";
      // 4. Wait 4 seconds, then fade out and remove
      setTimeout(() => {
        snowflake.style.opacity = "0";
        setTimeout(() => {
          snowflake.remove();
        }, 1000); // fade duration
      }, 4000); // 4 seconds on the ground
    });
  }
  setInterval(createSnowflake, 100);
  
  // Crosshair follows mouse
  const crosshair = document.querySelector('.crosshair-container');
  document.addEventListener('mousemove', (e) => {
    crosshair.style.left = (e.clientX - 30) + 'px';
    crosshair.style.top = (e.clientY - 30) + 'px';
  });
  
  // Magnetic title effect
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
   * @param {string} containerId - The ID for the orbiting button container (e.g. "discord-btn-container")
   * @param {string} btnId - The ID for the button itself (e.g. "discord-btn")
   * @param {string} copiedId - The ID for the "Copied!" message div (e.g. "discord-copied")
   * @param {string} username - The username to copy to clipboard
   * @param {number} orbitRadius - The orbit radius in pixels
   * @param {number} orbitSpeed - The orbit speed (rotations per second)
   * @param {number} orbitOffset - Angle offset in radians (e.g. 0 for Discord, Math.PI for Roblox)
   */
  function setupOrbitingCopyButton(containerId, btnId, copiedId, username, orbitRadius, orbitSpeed, orbitOffset) {
    const btnContainer = document.getElementById(containerId);
    const btn = document.getElementById(btnId);
    const copiedMsg = document.getElementById(copiedId);
    const pfpContainer = document.querySelector('.pfp-container');
    const magneticTitleElem = document.getElementById('magnetic-title');
  
    // Copy functionality
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
  
      // Center position (between pfp and title)
      const pfpRect = pfpContainer.getBoundingClientRect();
      const titleRect = magneticTitleElem.getBoundingClientRect();
      const centerX = (pfpRect.left + titleRect.left + pfpRect.width/2 + titleRect.width/2) / 2 + window.scrollX;
      const centerY = (pfpRect.top + titleRect.top + pfpRect.height/2 + titleRect.height/2) / 2 + window.scrollY;
  
      // Orbit position
      const x = centerX + orbitRadius * Math.cos(angle) - btnContainer.offsetWidth/2;
      const y = centerY + orbitRadius * Math.sin(angle) - btnContainer.offsetHeight/2;
  
      btnContainer.style.left = `${x}px`;
      btnContainer.style.top = `${y}px`;
  
      requestAnimationFrame(animateOrbit);
    }
    animateOrbit();
  }
  
  // Discord orbiting copy button
  setupOrbitingCopyButton(
    "discord-btn-container",
    "discord-btn",
    "discord-copied",
    "goldenak",
    270,
    0.07,
    0
  );
  
  // Roblox orbiting copy button
  setupOrbitingCopyButton(
    "roblox-btn-container",
    "roblox-btn",
    "roblox-copied",
    "GoldenAk01",
    270,
    0.07,
    Math.PI
  );
  