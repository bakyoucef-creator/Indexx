// ============================================
// YouzinElegancia — Landing page interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const isFloat = target % 1 !== 0;

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterIO.observe(el));

  /* ---------- Hero browser slideshow ---------- */
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.sdot');
  let current = 0;
  let slideTimer;

  const goToSlide = (index) => {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    current = index;
  };

  const nextSlide = () => {
    goToSlide((current + 1) % slides.length);
  };

  const startSlideshow = () => {
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, 3200);
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.goto, 10));
      startSlideshow();
    });
  });

  if (slides.length) startSlideshow();

  /* ---------- Device switcher (Bureau / Mobile toggle) ---------- */
  document.querySelectorAll('[data-switcher]').forEach(sw => {
    const tabs = sw.querySelectorAll('.switch-tab');
    const frames = sw.querySelectorAll('.switch-frame');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const view = tab.dataset.view;
        tabs.forEach(t => t.classList.toggle('active', t === tab));
        frames.forEach(f => f.classList.toggle('active', f.dataset.viewPanel === view));
      });
    });
  });

  /* ---------- Cursor glow (pointer devices only) ---------- */
  const glow = document.getElementById('cursorGlow');
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (isFinePointer) {
    window.addEventListener('mousemove', (e) => {
      glow.classList.add('active');
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
    window.addEventListener('mouseleave', () => glow.classList.remove('active'));
  }

  /* ---------- Smooth anchor scroll offset for sticky nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
