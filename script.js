(function() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const PARTICLE_COUNT = 130;
    const MAX_DIST = 150;
    const MOUSE_RADIUS = 200;
    const mouse = { x: null, y: null };
    const spectrum = ['#7df9ff', '#b7ff5a', '#ffc857', '#c3a6ff'];

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 1,
            });
        }
    }

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function draw() {
        ctx.clearRect(0, 0, width, height);

        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < MOUSE_RADIUS && dist > 0.1) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 1.2;
                    const angle = Math.atan2(dy, dx);
                    p.x += Math.cos(angle) * force * 0.6;
                    p.y += Math.sin(angle) * force * 0.6;
                }
            }

            p.x = Math.min(Math.max(p.x, 0), width);
            p.y = Math.min(Math.max(p.y, 0), height);
        }

        const colorIndex = Math.floor(Date.now() / 3200) % spectrum.length;
        const particleColor = spectrum[colorIndex];
        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.hypot(dx, dy);
                if (dist < MAX_DIST) {
                    const alpha = (1 - dist / MAX_DIST) * 0.6;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = particleColor;
                    ctx.globalAlpha = alpha * 0.4;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }

        for (let p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.shadowColor = particleColor;
            ctx.shadowBlur = 10;
            ctx.fillStyle = particleColor;
            ctx.fill();
            ctx.shadowBlur = 18;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        }
        ctx.shadowBlur = 0;
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    draw();
})();

const WHATSAPP_NUMBER = "254741299994";

const topNavigation = document.querySelector('.top-navigation');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 20 || currentScrollY < lastScrollY) {
        topNavigation?.classList.remove('nav-hidden');
        if (topNavigation) {
            topNavigation.style.transform = '';
            topNavigation.style.opacity = '';
            topNavigation.style.pointerEvents = '';
        }
    } else if (currentScrollY > lastScrollY) {
        topNavigation?.classList.add('nav-hidden');
        if (topNavigation) {
            topNavigation.style.transform = 'translateY(calc(-100% - 1rem))';
            topNavigation.style.opacity = '0';
            topNavigation.style.pointerEvents = 'none';
        }
    }

    lastScrollY = currentScrollY;
}, { passive: true });

document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('nameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const message = document.getElementById('messageInput').value.trim();

    if (!name || !email || !message) return;

    const text = `Hello Alex, my name is ${name}.%0A%0AEmail: ${email}%0A%0AMessage: ${message}`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

    const feedback = document.getElementById('formFeedback');
    feedback.classList.remove('hidden');

    window.open(waUrl, '_blank');

    this.reset();
    setTimeout(() => feedback.classList.add('hidden'), 4000);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === "#" || href === "") return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav-link')];
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.removeAttribute('aria-current'));
        document.querySelector(`.nav-link[href="#${entry.target.id}"]`)?.setAttribute('aria-current', 'page');
    });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));
