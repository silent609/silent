window.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('overlay');
  const audio = document.getElementById('bg-music');

  overlay.addEventListener('click', function () {
    audio.currentTime = 0;
    audio.loop = true;
    audio.play().then(() => {
      overlay.classList.add('fading');
      setTimeout(() => overlay.style.display = 'none', 700);
      console.log("🎵 MUSIC PLAYING");
    }).catch(err => {
      console.error("❌ Audio could not play", err);
      alert("Please unmute your device or click again.");
    });
  });

  // Crosshair
  const crosshair = document.querySelector('.crosshair-container');
  document.addEventListener('mousemove', (e) => {
    crosshair.style.left = `${e.clientX - 30}px`;
    crosshair.style.top = `${e.clientY - 30}px`;
  });

  // Snowflakes
  const makeSnowflake = () => {
    const f = document.createElement('div');
    f.classList.add('snowflake');
    f.style.left = Math.random() * window.innerWidth + 'px';
    f.style.width = f.style.height = (Math.random() * 4 + 2) + 'px';
    f.style.animationDuration = (Math.random() * 5 + 5) + 's';
    f.style.setProperty('--snowflake-drift', (Math.random() * 80 + 60) + 'px');
    document.body.appendChild(f);
    f.addEventListener('animationend', () => f.remove());
  };
  setInterval(makeSnowflake, 100);

  // Magnetic title
  const title = document.getElementById('magnetic-title');
  document.addEventListener('mousemove', e => {
    const mx = window.innerWidth / 2;
    const my = window.innerHeight / 2;
    const dx = (e.clientX - mx) / mx;
    const dy = (e.clientY - my) / my;
    title.style.transform = `translate(-50%, -50%) translate(${dx * 40}px, ${dy * 40}px)`;
  });

  // Orbiting buttons with copy
  const orbitButton = (containerId, btnId, toastId, username, radius, speed, offset = 0) => {
    const container = document.getElementById(containerId);
    const btn = document.getElementById(btnId);
    const toast = document.getElementById(toastId);
    const title = document.getElementById('magnetic-title');
    const pfp = document.querySelector('.pfp-container');

    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(username).then(() => {
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 1500);
      });
    });

    function animate() {
      const t = Date.now() / 1000;
      const angle = t * speed * 2 * Math.PI + offset;
      const base = title.getBoundingClientRect();
      const centerX = base.left + base.width / 2;
      const centerY = base.top + base.height / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      container.style.left = `${x}px`;
      container.style.top = `${y}px`;
      requestAnimationFrame(animate);
    }
    animate();
  };

  orbitButton("discord-btn-container", "discord-btn", "discord-copied", "goldenak", 270, 0.07, 0);
  orbitButton("roblox-btn-container", "roblox-btn", "roblox-copied", "GoldenAk01", 270, 0.07, Math.PI);

  // Tab title typing
  (function tabTitleLoop() {
    const text = "silent";
    let i = 0, typing = true;
    function loop() {
      if (typing) {
        if (i < text.length) {
          document.title = text.slice(0, i + 1);
          i++;
          setTimeout(loop, 120);
        } else {
          typing = false;
          setTimeout(loop, 500);
        }
      } else {
        if (i > 1) {
          document.title = text.slice(0, i - 1);
          i--;
          setTimeout(loop, 70);
        } else {
          typing = true;
          setTimeout(loop, 600);
        }
      }
    }
    loop();
  })();
});
