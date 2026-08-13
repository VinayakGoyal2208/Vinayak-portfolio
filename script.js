/* =================================================================
   VINAYAK GOYAL — PORTFOLIO JS
   GSAP + ScrollTrigger · No Lenis (native scroll, zero desync)
   ================================================================= */

// Wait for GSAP to load
window.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────
     1. REGISTER GSAP PLUGINS
  ───────────────────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  /* ─────────────────────────────────────────────────
     2. CUSTOM CURSOR  (requestAnimationFrame, no jank)
  ───────────────────────────────────────────────── */
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  if (dot && ring && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mx = 0, my = 0;
    let rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    });

    const animCursor = () => {
      // Dot snaps instantly
      dot.style.transform  = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
      // Ring lags behind for smooth feel
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
      requestAnimationFrame(animCursor);
    };
    animCursor();

    // Scale ring on hover
    document.querySelectorAll('a, button, .proj-card, .acard, .ch-link').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
  }

  /* ─────────────────────────────────────────────────
     3. SCROLL PROGRESS BAR
  ───────────────────────────────────────────────── */
  const scrollBar = document.querySelector('.scroll-bar');
  if (scrollBar) {
    window.addEventListener('scroll', () => {
      const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      scrollBar.style.width = `${Math.min(progress * 100, 100)}%`;
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────
     4. NAVBAR SCROLL STATE
  ───────────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────
     5. MOBILE MENU
  ───────────────────────────────────────────────── */
  const toggle   = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = toggle.querySelectorAll('span');
      if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.transform = '';
      }
    });

    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.transform = '';
      });
    });
  }

  /* ─────────────────────────────────────────────────
     6. ANCHOR SMOOTH SCROLL (native, reliable)
  ───────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id && id !== '#') {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ─────────────────────────────────────────────────
     7. HERO CANVAS — Animated Grid + Glow Orbs
  ───────────────────────────────────────────────── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Grid dots
    const gridSpacing = 55;
    const dots = [];

    const buildGrid = () => {
      dots.length = 0;
      for (let x = gridSpacing; x < W; x += gridSpacing) {
        for (let y = gridSpacing; y < H; y += gridSpacing) {
          dots.push({ x, y, baseAlpha: Math.random() * 0.15 + 0.04, alpha: 0, offset: Math.random() * Math.PI * 2 });
        }
      }
    };
    buildGrid();
    window.addEventListener('resize', buildGrid, { passive: true });

    // Floating orbs
    const orbs = [
      { x: 0.15, y: 0.35, r: 260, col: 'rgba(200,240,101,', speed: 0.0004 },
      { x: 0.85, y: 0.2,  r: 200, col: 'rgba(124,106,255,', speed: 0.0006 },
      { x: 0.6,  y: 0.75, r: 180, col: 'rgba(200,240,101,', speed: 0.0003 },
    ];

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 1;

      // Orbs
      orbs.forEach(o => {
        const cx = W * o.x + Math.sin(t * o.speed * 1200) * 60;
        const cy = H * o.y + Math.cos(t * o.speed * 800) * 40;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.r);
        grad.addColorStop(0, o.col + '0.12)');
        grad.addColorStop(0.5, o.col + '0.04)');
        grad.addColorStop(1,   o.col + '0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Animated grid dots
      dots.forEach(d => {
        d.alpha = d.baseAlpha + Math.sin(t * 0.012 + d.offset) * 0.06;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${d.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ─────────────────────────────────────────────────
     8. HERO ENTRANCE ANIMATIONS
  ───────────────────────────────────────────────── */
  const heroTL = gsap.timeline({ defaults: { ease: 'power4.out' } });

  heroTL
    .to('.hero-tag', { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
    .to('.hero-title .line-inner', { y: '0%', duration: 1.1, stagger: 0.12, ease: 'power4.out' }, '-=0.4')
    .to('.hero-meta', { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
    .to('.hero-stats', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');

  /* ─────────────────────────────────────────────────
     9. TYPEWRITER
  ───────────────────────────────────────────────── */
  const phrases = [
    'Frontend Developer',
    'UI/UX Enthusiast',
    'Fullstack Engineer',
    'MCA Scholar 🎓',
    'Open to Remote Work',
  ];
  let pi = 0, ci = 0, deleting = false;
  const tw = document.getElementById('typewriter');
  if (tw) {
    const type = () => {
      const current = phrases[pi];
      tw.textContent = deleting
        ? current.slice(0, --ci)
        : current.slice(0, ++ci);

      let delay = deleting ? 50 : 90;
      if (!deleting && ci === current.length) { delay = 1800; deleting = true; }
      if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 300; }

      setTimeout(type, delay);
    };
    setTimeout(type, 1600);
  }

  /* ─────────────────────────────────────────────────
     10. MAGNETIC BUTTONS
  ───────────────────────────────────────────────── */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      gsap.to(btn, { x: x * 0.28, y: y * 0.28, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
    });
  });

  /* ─────────────────────────────────────────────────
     11. SECTION REVEAL — universal scroll triggers
  ───────────────────────────────────────────────── */
  // .reveal-fade
  gsap.utils.toArray('.reveal-fade').forEach(el => {
    gsap.to(el, {
      opacity: 1, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // .reveal-up
  gsap.utils.toArray('.reveal-up').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // .reveal-left (with optional --delay CSS var support)
  gsap.utils.toArray('.reveal-left').forEach(el => {
    const d = parseFloat(getComputedStyle(el).getPropertyValue('--delay') || '0');
    gsap.to(el, {
      opacity: 1, x: 0, duration: 1, delay: d, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }
    });
  });

  // .reveal-scale  (about cards, contact form)
  gsap.utils.toArray('.reveal-scale').forEach(el => {
    const d = parseFloat(getComputedStyle(el).getPropertyValue('--delay') || '0');
    gsap.to(el, {
      opacity: 1, y: 0, scale: 1, duration: 1, delay: d, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // .reveal-card  (project cards — stagger within grid)
  const cardGrids = document.querySelectorAll('.proj-grid');
  cardGrids.forEach(grid => {
    const cards = grid.querySelectorAll('.reveal-card');
    gsap.to(cards, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out',
      scrollTrigger: { trigger: grid, start: 'top 80%', toggleActions: 'play none none none' }
    });
  });

  // .reveal-timeline  (experience items)
  gsap.utils.toArray('.reveal-timeline').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.9, delay: i * 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  /* ─────────────────────────────────────────────────
     12. SECTION HEADING PARALLAX (subtle text drift)
  ───────────────────────────────────────────────── */
  gsap.utils.toArray('.section-heading').forEach(el => {
    gsap.fromTo(el, { y: 30 }, {
      y: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
  });

  /* ─────────────────────────────────────────────────
     13. SKILL BAR ANIMATIONS
  ───────────────────────────────────────────────── */
  gsap.utils.toArray('.skill-block').forEach(block => {
    ScrollTrigger.create({
      trigger: block,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        block.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.width = bar.getAttribute('data-w') + '%';
        });
      }
    });
  });

  /* ─────────────────────────────────────────────────
     14. PROJECT FILTERS
  ───────────────────────────────────────────────── */
  const pills = document.querySelectorAll('.fpill');
  const projCards = document.querySelectorAll('.proj-card');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      projCards.forEach(card => {
        const cat = card.getAttribute('data-cat') || '';
        const show = filter === 'all' || cat.includes(filter);
        gsap.to(card, {
          opacity: show ? 1 : 0.15,
          scale: show ? 1 : 0.97,
          duration: 0.4,
          ease: 'power2.out',
        });
        card.style.pointerEvents = show ? 'auto' : 'none';
      });
    });
  });

  /* ─────────────────────────────────────────────────
     15. CONTACT SECTION — heading reveal
  ───────────────────────────────────────────────── */
  gsap.to('.contact-heading', {
    opacity: 1, y: 0, duration: 1, ease: 'power4.out',
    scrollTrigger: { trigger: '.contact-heading', start: 'top 85%', toggleActions: 'play none none none' }
  });

  /* ─────────────────────────────────────────────────
     16. CONTACT FORM (Real FormSubmit Integration)
  ───────────────────────────────────────────────── */
  const form   = document.getElementById('contact-form');
  const formMsg = document.getElementById('form-msg');

  if (form && formMsg) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const name = document.getElementById('f-name')?.value || '';
      const email = document.getElementById('f-email')?.value || '';
      const message = document.getElementById('f-msg')?.value || '';

      if (btn) { btn.disabled = true; btn.querySelector('span').textContent = 'Sending…'; }

      fetch('https://formsubmit.co/ajax/vinayakgoyal2208@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `Portfolio Contact from ${name}`
        })
      })
      .then(res => res.json())
      .then(data => {
        formMsg.style.color = 'var(--c-accent)';
        formMsg.textContent = '✓ Message sent! I\'ll get back to you within 24 hours.';
        form.reset();
      })
      .catch(err => {
        console.error('Contact Form Error:', err);
        formMsg.style.color = '#ff6b6b';
        formMsg.textContent = '⚠️ Could not send message. Please email me directly at vinayakgoyal2208@gmail.com';
      })
      .finally(() => {
        if (btn) {
          btn.disabled = false;
          btn.querySelector('span').textContent = 'Send Message';
        }
        setTimeout(() => { formMsg.textContent = ''; }, 7000);
      });
    });
  }

  /* ─────────────────────────────────────────────────
     17. MARQUEE PAUSE ON HOVER (already handled in CSS)
         — nothing extra needed

     18. SCROLLTRIGGER REFRESH on load  
  ───────────────────────────────────────────────── */
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

}); // end DOMContentLoaded
