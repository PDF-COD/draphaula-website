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
      themeIcon.textContent = '☀️';
      themeToggle.setAttribute('aria-label', 'Alternar para modo claro');
    } else {
      html.removeAttribute('data-theme');
      themeIcon.textContent = '🌙';
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

  // --- Console Branding ---
  console.log(
    '%c🌹 Dra. Phaula Ferreira %c Ciência, ética e cuidado humano.',
    'color: #8B1A2B; font-size: 16px; font-weight: bold;',
    'color: #B8860B; font-size: 12px; font-style: italic;'
  );
});
