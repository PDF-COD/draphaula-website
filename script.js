/* ============================================================
   DRA. PHAULA FERREIRA — Site Institucional
   JavaScript — Interatividade e Animações
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scroll Effect ---
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    mainNav.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Dark Mode Toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const html = document.documentElement;

  // Check saved preference or system preference
  function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      themeIcon.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
      themeToggle.setAttribute('aria-label', 'Alternar para modo claro');
    } else {
      html.removeAttribute('data-theme');
      themeIcon.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      themeToggle.setAttribute('aria-label', 'Alternar para modo escuro');
    }
  }

  // Apply saved theme on load
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  // Toggle on click
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = html.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';

      // Brief scale animation
      themeToggle.style.transform = 'scale(0.8) rotate(-180deg)';
      setTimeout(() => {
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.style.transform = '';
      }, 200);
    });
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // --- Active Navigation Highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Scroll-Triggered Animations (IntersectionObserver) ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Stagger animation delay
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all elements immediately
    animatedElements.forEach(el => el.classList.add('visible'));
  }

  // --- Contact Form Handling ---
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const submitBtn = document.getElementById('form-submit-btn');
      const originalText = submitBtn.innerHTML;

      // Simulate submission
      submitBtn.innerHTML = '<span>⏳</span> Enviando...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      setTimeout(() => {
        submitBtn.innerHTML = '<span>✅</span> Mensagem Enviada!';
        submitBtn.style.background = 'linear-gradient(135deg, #25D366, #128C7E)';

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.background = '';
          contactForm.reset();
        }, 3000);
      }, 1500);
    });

    // Phone input mask
    const phoneInput = document.getElementById('form-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 6) {
          value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
          value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length > 0) {
          value = `(${value}`;
        }

        e.target.value = value;
      });
    }
  }

  // --- Parallax Effect on Hero ---
  const heroSection = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg img');

  if (heroSection && heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
      }
    }, { passive: true });
  }

  // --- Service Cards Hover Sound Effect (Visual Feedback) ---
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });

  // --- Credential Items Sequential Animation ---
  const credentials = document.querySelectorAll('.credential-item');
  credentials.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.15}s`;
  });

  // --- Year Auto-Update in Footer ---
  const yearElements = document.querySelectorAll('[data-year]');
  yearElements.forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ============================================================
  // PREMIUM ENHANCEMENTS
  // ============================================================

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 1. Scroll Progress Bar ---
  (function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.prepend(bar);

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  })();

  // --- 2. Floating Particles / Bokeh Lights on Hero ---
  (function initParticles() {
    if (prefersReducedMotion) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-particles';
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId = null;
    let isVisible = true;

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const COLORS = [
      { r: 212, g: 168, b: 67, a: 0.3 },   // gold
      { r: 184, g: 134, b: 11, a: 0.25 },   // dark gold
      { r: 160, g: 33,  b: 58, a: 0.15 },   // rose
      { r: 240, g: 208, b: 112, a: 0.2 },   // light gold
    ];

    function createParticle() {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.2 - 0.1,
        color: color,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      };
    }

    for (let i = 0; i < 25; i++) {
      particles.push(createParticle());
    }

    function draw() {
      if (!isVisible) { animId = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        p.pulse += p.pulseSpeed;

        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        const alphaFlicker = p.color.a * (0.6 + 0.4 * Math.sin(p.pulse));
        const currentR = p.r * (0.9 + 0.1 * Math.sin(p.pulse));

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentR * 4);
        gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alphaFlicker})`);
        gradient.addColorStop(0.4, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alphaFlicker * 0.4})`);
        gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alphaFlicker * 1.2})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    // Only animate when hero is visible
    const heroObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0 });
    heroObserver.observe(hero);

    draw();
  })();

  // --- 3. Animated Counter ---
  (function initCounter() {
    const cardNumber = document.querySelector('.card-number');
    if (!cardNumber) return;

    const target = 10;
    let counted = false;

    const counterObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        let current = 0;
        const duration = 1500;
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          current = Math.round(eased * target);
          cardNumber.textContent = '+' + current;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        counterObserver.unobserve(cardNumber);
      }
    }, { threshold: 0.5 });

    counterObserver.observe(cardNumber);
  })();

  // --- 4. Testimonial Auto-Slider ---
  (function initTestimonialSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;

    const cards = slider.querySelectorAll('.testimonial-card');
    if (cards.length < 2) return;

    // Only activate slider on single-column layouts or always for the auto-rotate effect
    slider.classList.add('slider-active');

    // Create dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
    slider.parentElement.appendChild(dotsContainer);

    let currentIndex = 0;
    let intervalId = null;

    function goTo(index) {
      cards[currentIndex].classList.remove('slide-active');
      dotsContainer.children[currentIndex].classList.remove('active');
      currentIndex = index;
      cards[currentIndex].classList.add('slide-active');
      dotsContainer.children[currentIndex].classList.add('active');
    }

    function next() {
      goTo((currentIndex + 1) % cards.length);
    }

    // Start
    cards.forEach(c => c.classList.remove('slide-active'));
    cards[0].classList.add('slide-active');

    function startAutoplay() {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(next, 5000);
    }

    startAutoplay();

    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(intervalId));
    slider.addEventListener('mouseleave', startAutoplay);

    // Pause when not visible
    const sliderObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { startAutoplay(); }
      else { clearInterval(intervalId); }
    }, { threshold: 0.2 });
    sliderObserver.observe(slider);
  })();

  // --- 5. Magnetic Hover on CTA Buttons ---
  (function initMagneticButtons() {
    if (prefersReducedMotion) return;

    const buttons = document.querySelectorAll('.btn-primary');
    const RANGE = 100;
    const STRENGTH = 0.3;

    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < RANGE) {
          const pull = (1 - dist / RANGE) * STRENGTH;
          btn.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
        }
      }, { passive: true });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        setTimeout(() => { btn.style.transition = ''; }, 400);
      });
    });
  })();

  // --- 6. Typing / Word-by-Word Reveal on Hero Subtitle ---
  (function initTextReveal() {
    if (prefersReducedMotion) return;

    const heroSubtitle = document.querySelector('.hero-content .section-subtitle');
    if (!heroSubtitle) return;
    // If hero doesn't have a .section-subtitle, try the about section subtitle
    // The hero in this site doesn't have a subtitle text, so let's target the about section
  })();

  // Word-by-word reveal for all section subtitles
  (function initSectionSubtitleReveal() {
    if (prefersReducedMotion) return;

    const subtitles = document.querySelectorAll('.section-subtitle');
    subtitles.forEach(subtitle => {
      const text = subtitle.textContent.trim();
      const words = text.split(/\s+/);
      subtitle.innerHTML = '';
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'text-reveal-word';
        span.textContent = word;
        span.style.transitionDelay = (i * 0.06) + 's';
        subtitle.appendChild(span);
        // Add a space between words
        if (i < words.length - 1) {
          subtitle.appendChild(document.createTextNode(' '));
        }
      });

      const revealObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          subtitle.querySelectorAll('.text-reveal-word').forEach(w => {
            w.classList.add('revealed');
          });
          revealObserver.unobserve(subtitle);
        }
      }, { threshold: 0.3 });
      revealObserver.observe(subtitle);
    });
  })();

  // --- 7. Enhanced Service Card Stagger ---
  (function initServiceCardStagger() {
    const serviceCards = document.querySelectorAll('.service-card.animate-on-scroll');
    serviceCards.forEach((card, index) => {
      card.style.transitionDelay = (index * 0.1) + 's';
    });
  })();

  // --- 8. Card Glow Effect (mouse-following) ---
  (function initCardGlow() {
    if (prefersReducedMotion) return;

    const glowCards = document.querySelectorAll('.service-card, .testimonial-card');

    glowCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--glow-x', x + '%');
        card.style.setProperty('--glow-y', y + '%');
        card.style.setProperty('--glow-opacity', '1');
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--glow-opacity', '0');
      });
    });
  })();

  // --- 9. Animated Gradient Border on Quote Card ---
  (function initQuoteBorderGlow() {
    if (prefersReducedMotion) return;

    const quoteCard = document.querySelector('.approach-quote-card');
    if (!quoteCard) return;

    const glow = document.createElement('div');
    glow.className = 'approach-quote-card-border-glow';
    quoteCard.style.position = 'relative';
    quoteCard.style.zIndex = '1';
    quoteCard.insertBefore(glow, quoteCard.firstChild);
  })();

  // --- Console Branding ---
  console.log(
    '%c🌹 Dra. Phaula Ferreira %c Ciência, ética e cuidado humano.',
    'color: #8B1A2B; font-size: 16px; font-weight: bold;',
    'color: #B8860B; font-size: 12px; font-style: italic;'
  );
});
