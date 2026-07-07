// ── Navbar scroll behaviour ──────────────────
    const navbar = document.getElementById('navbar');
    const stickyCta = document.getElementById('sticky-cta');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Show sticky CTA after scrolling past hero
      if (window.scrollY > window.innerHeight * 0.7) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    }, { passive: true });

    // ── Mobile menu ──────────────────────────────
    const hamburger = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileClose = document.getElementById('mobile-close-btn');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const closeMenu = () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        mobileMenu.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });

    mobileClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });

    mobileLinks.forEach(l => l.addEventListener('click', closeMenu));

    // ── FAQ Accordion ────────────────────────────
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-question');
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(i => {
          i.classList.remove('open');
          i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        // Toggle current
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // ── Countdown Timer ──────────────────────────
    function initCountdown() {
      const saved = localStorage.getItem('cac-countdown-end');
      let endTime;
      if (saved) {
        endTime = parseInt(saved);
        if (endTime < Date.now()) {
          endTime = Date.now() + 24 * 60 * 60 * 1000;
          localStorage.setItem('cac-countdown-end', endTime);
        }
      } else {
        endTime = Date.now() + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000;
        localStorage.setItem('cac-countdown-end', endTime);
      }

      const hoursEl = document.getElementById('cd-hours');
      const minsEl  = document.getElementById('cd-mins');
      const secsEl  = document.getElementById('cd-secs');

      function tick() {
        const diff = endTime - Date.now();
        if (diff <= 0) {
          hoursEl.textContent = '00';
          minsEl.textContent  = '00';
          secsEl.textContent  = '00';
          return;
        }
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        hoursEl.textContent = String(h).padStart(2, '0');
        minsEl.textContent  = String(m).padStart(2, '0');
        secsEl.textContent  = String(s).padStart(2, '0');
      }
      tick();
      setInterval(tick, 1000);
    }
    initCountdown();

    // ── Counter Animations ───────────────────────
    function animateCounter(el, target, suffix = '') {
      let start = 0;
      const duration = 2000;
      const step = 16;
      const increment = target / (duration / step);

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(start).toLocaleString() + suffix;
      }, step);
    }

    // ── GSAP + ScrollTrigger ─────────────────────
    window.addEventListener('load', () => {
      if (typeof gsap === 'undefined') return;

      gsap.registerPlugin(ScrollTrigger);

      // Lenis smooth scroll
      if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
          duration: 1.4,
          easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smooth: true,
        });
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      }

      // Animate fade-up elements
      gsap.utils.toArray('.fade-up').forEach(el => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        });
      });

      // Animate fade-in elements
      gsap.utils.toArray('.fade-in').forEach(el => {
        gsap.to(el, {
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        });
      });

      // Slide-left elements
      gsap.utils.toArray('.slide-left').forEach(el => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        });
      });

      // Slide-right elements
      gsap.utils.toArray('.slide-right').forEach(el => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        });
      });

      // Counter animation on scroll into view
      const counterMap = [
        { id: 'counter-1', target: 3200, suffix: '+' },
        { id: 'counter-2', target: 98,   suffix: '%' },
        { id: 'counter-3', target: 49,   suffix: '' },
        { id: 'counter-4', target: 12,   suffix: '' },
      ];

      counterMap.forEach(({ id, target, suffix }) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => {
            animateCounter(el, target, suffix);
          }
        });
      });

      // Stagger module cards
      gsap.utils.toArray('.module-card').forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, x: 30 },
          {
            opacity: 1, x: 0,
            duration: 0.6,
            delay: i * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none',
            }
          }
        );
      });

    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });