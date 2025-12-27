window.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('overlay');
  const audio = document.getElementById('bg-music');

  // Click to remove overlay and play music
  document.addEventListener('click', function onFirstClick() {
    // Try to load and play music
    audio.load(); // Force reload the audio source
    audio.currentTime = 0;
    audio.loop = true;
    
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log("Music playing!");
        overlay.classList.add('fading');
        setTimeout(() => overlay.style.display = 'none', 650);
      }).catch(err => {
        console.log("Music couldn't play (continuing anyway):", err);
        // Still remove overlay even if music fails
        overlay.classList.add('fading');
        setTimeout(() => overlay.style.display = 'none', 650);
      });
    } else {
      // Fallback for older browsers
      overlay.classList.add('fading');
      setTimeout(() => overlay.style.display = 'none', 650);
    }
    
    document.removeEventListener('click', onFirstClick);
  });

  // Snowflake effect
  setInterval(() => {
    const flake = document.createElement('div');
    flake.className = 'snowflake';
    flake.style.left = Math.random() * window.innerWidth + 'px';
    flake.style.width = flake.style.height = (Math.random() * 4 + 2) + 'px';
    flake.style.animationDuration = (Math.random() * 5 + 5) + 's';
    flake.style.setProperty('--snowflake-drift', Math.random() * 100 + 'px');
    document.body.appendChild(flake);
    flake.addEventListener('animationend', () => flake.remove());
  }, 100);

  // Custom crosshair follows mouse
  const crosshair = document.querySelector('.crosshair-container');
  document.addEventListener('mousemove', (e) => {
    crosshair.style.left = `${e.clientX - 30}px`;
    crosshair.style.top = `${e.clientY - 30}px`;
  });

  // Blood trail effect
  let lastTrailTime = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime > 20) { // Create trail particle every 20ms
      lastTrailTime = now;
      
      const trail = document.createElement('div');
      trail.className = 'blood-trail';
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
      document.body.appendChild(trail);
      
      setTimeout(() => trail.remove(), 1000);
    }
  });

  // Magnetic title effect
  const title = document.getElementById('magnetic-title');
  document.addEventListener('mousemove', e => {
    const dx = (e.clientX - window.innerWidth / 2) / window.innerWidth;
    const dy = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    title.style.transform = `translate(-50%, -50%) translate(${dx * 60}px, ${dy * 60}px)`;
  });
  document.addEventListener('mouseleave', () => {
    title.style.transform = 'translate(-50%, -50%)';
  });

  // Orbiting copy button setup
  function setupOrbitingCopyButton(containerId, btnId, copiedId, username, orbitRadius, orbitSpeed, orbitOffset) {
    const btnContainer = document.getElementById(containerId);
    const btn = document.getElementById(btnId);
    const copiedMsg = document.getElementById(copiedId);

    btn.addEventListener('click', function() {
      navigator.clipboard.writeText(username).then(() => {
        copiedMsg.classList.add('visible');
        setTimeout(() => copiedMsg.classList.remove('visible'), 1500);
      }).catch(err => {
        console.error("Copy failed:", err);
      });
    });

    function animateOrbit() {
      const now = Date.now() / 1000;
      const angle = now * orbitSpeed * 2 * Math.PI + orbitOffset;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const x = centerX + orbitRadius * Math.cos(angle) - btnContainer.offsetWidth / 2;
      const y = centerY + orbitRadius * Math.sin(angle) - btnContainer.offsetHeight / 2;
      btnContainer.style.left = `${x}px`;
      btnContainer.style.top = `${y}px`;
      requestAnimationFrame(animateOrbit);
    }
    animateOrbit();
  }

  // Setup Discord, Roblox, and Dox buttons with larger orbit and slower speed
  setupOrbitingCopyButton("discord-btn-container", "discord-btn", "discord-copied", "goldenak", 450, 0.025, 0);
  setupOrbitingCopyButton("roblox-btn-container", "roblox-btn", "roblox-copied", "GoldenAk01", 450, 0.025, Math.PI);
  setupOrbitingCopyButton("dox-btn-container", "dox-btn", "dox-copied", "Why ?", 450, 0.025, Math.PI * 0.66);

  // Title typing animation
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
        if (i > 0) {
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
});
