import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Star field animation
function initStars() {
  const canvas = document.createElement('canvas');
  canvas.id = 'star-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 180 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + 0.2,
    speed: Math.random() * 0.3 + 0.05,
    opacity: Math.random(),
    opacitySpeed: Math.random() * 0.008 + 0.002,
    color: Math.random() > 0.7 ? '#d480ff' : Math.random() > 0.5 ? '#b44fff' : '#ffffff',
  }));

  // Shooting stars
  const shooters = [];
  const addShooter = () => {
    shooters.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      len: Math.random() * 120 + 60,
      speed: Math.random() * 8 + 6,
      opacity: 1,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
    });
  };
  setInterval(addShooter, 3000);

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => {
      s.opacity += s.opacitySpeed;
      if (s.opacity > 1 || s.opacity < 0) s.opacitySpeed *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color.replace(')', `, ${Math.abs(s.opacity)})`).replace('rgb', 'rgba').replace('#', 'rgba(').replace(')', '');
      // simpler approach:
      ctx.globalAlpha = Math.abs(s.opacity);
      ctx.fillStyle = s.color;
      ctx.fill();
      ctx.globalAlpha = 1;
      s.y += s.speed * 0.1;
      if (s.y > canvas.height) s.y = 0;
    });

    for (let i = shooters.length - 1; i >= 0; i--) {
      const sh = shooters[i];
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(sh.x - Math.cos(sh.angle) * sh.len, sh.y - Math.sin(sh.angle) * sh.len);
      const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - Math.cos(sh.angle) * sh.len, sh.y - Math.sin(sh.angle) * sh.len);
      grad.addColorStop(0, `rgba(212, 128, 255, ${sh.opacity})`);
      grad.addColorStop(1, 'transparent');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.stroke();
      sh.x += Math.cos(sh.angle) * sh.speed;
      sh.y += Math.sin(sh.angle) * sh.speed;
      sh.opacity -= 0.02;
      if (sh.opacity <= 0) shooters.splice(i, 1);
    }

    requestAnimationFrame(animate);
  };
  animate();
}

initStars();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
