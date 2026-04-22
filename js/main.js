/* ============================================= */
/*  TETHER — Main JavaScript                    */
/*  Core interactions, navbar, mobile menu,      */
/*  ripple effects, loader, testimonials,        */
/*  FAQ accordion, contact form, particles       */
/* ============================================= */

(function () {
  'use strict';

  /* =========================================== */
  /*  0. CONSTANTS & HELPERS                     */
  /* =========================================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
  const raf = (fn) => window.requestAnimationFrame(fn);

  // Throttle utility
  function throttle(fn, ms) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= ms) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  // Debounce utility
  function debounce(fn, ms) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  /* =========================================== */
  /*  1. LOADING SCREEN                          */
  /* =========================================== */
  function initLoader() {
    const loader = $('.loader-overlay');
    if (!loader) return;

    const minimumDisplayTime = 1800;
    const startTime = Date.now();

    function hideLoader() {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minimumDisplayTime - elapsed);

      setTimeout(() => {
        loader.classList.add('loaded');
        document.body.style.overflow = '';

        // Remove from DOM after transition
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 700);
      }, remaining);
    }

    // Prevent scroll while loading
    document.body.style.overflow = 'hidden';

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
    }
  }

  /* =========================================== */
  /*  2. NAVBAR                                  */
  /* =========================================== */
  function initNavbar() {
    const navbar = $('.navbar');
    if (!navbar) return;

    const scrollThreshold = 50;
    let lastScroll = 0;
    let ticking = false;

    function updateNavbar() {
      const scrollY = window.scrollY;

      // Add/remove scrolled class
      if (scrollY > scrollThreshold) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScroll = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        raf(updateNavbar);
        ticking = true;
      }
    }, { passive: true });

    // Set active link based on current page
    setActiveNavLink();
  }

  function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = $$('.nav-links a, .mobile-menu a');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkPage = href.split('/').pop();

      link.classList.remove('active');

      if (linkPage === currentPath) {
        link.classList.add('active');
      } else if (currentPath === '' && linkPage === 'index.html') {
        link.classList.add('active');
      } else if (currentPath === 'index.html' && (linkPage === 'index.html' || linkPage === '#')) {
        link.classList.add('active');
      }
    });
  }

  /* =========================================== */
  /*  3. MOBILE MENU                             */
  /* =========================================== */
  function initMobileMenu() {
    const hamburger = $('.nav-hamburger');
    const mobileMenu = $('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    const mobileLinks = $$('a', mobileMenu);
    let isOpen = false;

    function toggleMenu() {
      isOpen = !isOpen;

      hamburger.classList.toggle('active', isOpen);
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);

      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // Animate links stagger
      if (isOpen) {
        mobileLinks.forEach((link, i) => {
          link.style.opacity = '0';
          link.style.transform = 'translateX(30px)';

          setTimeout(() => {
            link.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateX(0)';
          }, 80 * i + 200);
        });
      }
    }

    function closeMenu() {
      if (!isOpen) return;
      isOpen = false;
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(closeMenu, 150);
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
        hamburger.focus();
      }
    });

    // Close on resize if desktop
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > 1024 && isOpen) {
        closeMenu();
      }
    }, 200));
  }

  /* =========================================== */
  /*  4. BUTTON RIPPLE EFFECT                    */
  /* =========================================== */
  function initRipple() {
    const buttons = $$('.btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', function (e) {
        // Remove any existing ripple
        const existingRipple = this.querySelector('.ripple');
        if (existingRipple) existingRipple.remove();

        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        this.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        }, 700);
      });
    });
  }

  /* =========================================== */
  /*  5. FEATURE CARD MOUSE TRACKING             */
  /* =========================================== */
  function initFeatureCards() {
    const cards = $$('.feature-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      });
    });
  }

  /* =========================================== */
  /*  6. TESTIMONIAL CAROUSEL                    */
  /* =========================================== */
  function initTestimonials() {
    const slides = $$('.testimonial-slide');
    const dots = $$('.testimonial-dot');
    if (slides.length === 0) return;

    let current = 0;
    let interval;
    const autoplayDelay = 5000;

    function goTo(index) {
      // Remove active from all
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));

      // Wrap index
      current = ((index % slides.length) + slides.length) % slides.length;

      // Activate current
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    function next() {
      goTo(current + 1);
    }

    function startAutoplay() {
      stopAutoplay();
      interval = setInterval(next, autoplayDelay);
    }

    function stopAutoplay() {
      if (interval) clearInterval(interval);
    }

    // Dot click handlers
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goTo(i);
        startAutoplay(); // Reset autoplay
      });
    });

    // Initialize
    goTo(0);
    startAutoplay();

    // Pause on hover
    const container = $('.testimonials-slider');
    if (container) {
      container.addEventListener('mouseenter', stopAutoplay);
      container.addEventListener('mouseleave', startAutoplay);
    }

    // Keyboard navigation
    if (container) {
      container.setAttribute('tabindex', '0');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Testimonials');

      container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          goTo(current - 1);
          startAutoplay();
        } else if (e.key === 'ArrowRight') {
          goTo(current + 1);
          startAutoplay();
        }
      });
    }
  }

  /* =========================================== */
  /*  7. FAQ ACCORDION                           */
  /* =========================================== */
  function initFAQ() {
    const faqItems = $$('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      // ARIA setup
      const id = 'faq-answer-' + Math.random().toString(36).substr(2, 9);
      answer.id = id;
      question.setAttribute('aria-controls', id);
      question.setAttribute('aria-expanded', 'false');
      answer.setAttribute('role', 'region');
      answer.setAttribute('aria-hidden', 'true');

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items (single-open mode)
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherQuestion = otherItem.querySelector('.faq-question');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
            if (otherAnswer) otherAnswer.setAttribute('aria-hidden', 'true');
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          question.setAttribute('aria-expanded', 'false');
          answer.setAttribute('aria-hidden', 'true');
        } else {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
          answer.setAttribute('aria-hidden', 'false');
        }
      });

      // Keyboard support
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  }

  /* =========================================== */
  /*  8. CONTACT FORM                            */
  /* =========================================== */
  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;

    const successEl = $('.form-success');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Validate
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        removeFieldError(field);

        if (!field.value.trim()) {
          isValid = false;
          showFieldError(field, 'This field is required');
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
          isValid = false;
          showFieldError(field, 'Please enter a valid email');
        }
      });

      if (!isValid) return;

      // Simulate submission
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-spinner"></span> Sending...';

      setTimeout(() => {
        // Log data
        console.log('📬 Tether Contact Form Submission:', data);
        console.table(data);

        // Show success
        form.style.display = 'none';
        if (successEl) successEl.classList.add('show');

        // Reset after delay
        setTimeout(() => {
          form.reset();
          form.style.display = '';
          if (successEl) successEl.classList.remove('show');
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }, 5000);
      }, 1500);
    });

    // Real-time validation
    const inputs = form.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        removeFieldError(input);
        if (input.hasAttribute('required') && !input.value.trim()) {
          showFieldError(input, 'This field is required');
        } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
          showFieldError(input, 'Please enter a valid email');
        }
      });

      input.addEventListener('input', () => {
        removeFieldError(input);
      });
    });
  }

  function showFieldError(field, message) {
    field.style.borderColor = '#FF4757';
    field.style.boxShadow = '0 0 0 3px rgba(255, 71, 87, 0.1)';

    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    error.style.cssText = 'color: #FF4757; font-size: 12px; margin-top: 4px; display: block;';

    const parent = field.closest('.form-group');
    if (parent && !parent.querySelector('.field-error')) {
      parent.appendChild(error);
    }
  }

  function removeFieldError(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';

    const parent = field.closest('.form-group');
    if (parent) {
      const error = parent.querySelector('.field-error');
      if (error) error.remove();
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* =========================================== */
  /*  9. PARTICLE SYSTEM (Hero Background)       */
  /* =========================================== */
  function initParticles() {
    const canvas = $('#particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationId;
    let mouse = { x: null, y: null };

    const config = {
      particleCount: 60,
      maxDistance: 150,
      particleSize: { min: 1, max: 3 },
      speed: { min: 0.1, max: 0.5 },
      color: '0, 229, 255',
      mouseRadius: 200,
      responsive: {
        768: { particleCount: 35 },
        480: { particleCount: 20 }
      }
    };

    function getParticleCount() {
      const w = window.innerWidth;
      if (w <= 480) return config.responsive[480].particleCount;
      if (w <= 768) return config.responsive[768].particleCount;
      return config.particleCount;
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * (config.particleSize.max - config.particleSize.min) + config.particleSize.min;
        this.speedX = (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min;
        this.speedY = (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < config.mouseRadius) {
            const force = (config.mouseRadius - dist) / config.mouseRadius;
            this.x -= dx * force * 0.02;
            this.y -= dy * force * 0.02;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${config.color}, ${this.opacity})`;
        ctx.fill();
      }
    }

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;

      // Reinitialize particles on resize
      const count = getParticleCount();
      while (particles.length < count) {
        particles.push(new Particle());
      }
      while (particles.length > count) {
        particles.pop();
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < config.maxDistance) {
            const opacity = (1 - dist / config.maxDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${config.color}, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      drawConnections();
      animationId = raf(animate);
    }

    // Mouse tracking
    canvas.addEventListener('mousemove', throttle((e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, 16));

    canvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Touch support
    canvas.addEventListener('touchmove', throttle((e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    }, 16), { passive: true });

    canvas.addEventListener('touchend', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Initialize
    resize();
    window.addEventListener('resize', debounce(resize, 250));
    animate();

    // Cleanup on page leave
    window.addEventListener('beforeunload', () => {
      if (animationId) cancelAnimationFrame(animationId);
    });

    // Pause when not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationId) cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    });
  }

  /* =========================================== */
  /*  10. SMOOTH SCROLL FOR ANCHOR LINKS         */
  /* =========================================== */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '#!') return;

        const target = $(href);
        if (!target) return;

        e.preventDefault();

        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;

        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without jump
        history.pushState(null, null, href);
      });
    });
  }

  /* =========================================== */
  /*  11. COUNTER ANIMATION                      */
  /* =========================================== */
  function initCounters() {
    const counters = $$('[data-count]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const startTime = Date.now();
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';

    function update() {
      const elapsed = Date.now() - startTime;
      const progress = clamp(elapsed / duration, 0, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        raf(update);
      }
    }

    update();
  }

  /* =========================================== */
  /*  12. TILT EFFECT ON CARDS                   */
  /* =========================================== */
  function initTilt() {
    const tiltElements = $$('[data-tilt]');

    tiltElements.forEach(el => {
      const maxTilt = parseInt(el.dataset.tilt) || 5;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const tiltX = (0.5 - y) * maxTilt;
        const tiltY = (x - 0.5) * maxTilt;

        el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.5s ease';
        setTimeout(() => {
          el.style.transition = '';
        }, 500);
      });
    });
  }

  /* =========================================== */
  /*  13. MAGNETIC BUTTONS                       */
  /* =========================================== */
  function initMagneticButtons() {
    const magneticBtns = $$('[data-magnetic]');

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const strength = parseFloat(btn.dataset.magnetic) || 0.3;

        btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => {
          btn.style.transition = '';
        }, 400);
      });
    });
  }

  /* =========================================== */
  /*  14. TYPED TEXT EFFECT                      */
  /* =========================================== */
  function initTypedText() {
    const typedEl = $('[data-typed]');
    if (!typedEl) return;

    const words = typedEl.dataset.typed.split(',').map(w => w.trim());
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 80;
    const deletingSpeed = 50;
    const pauseTime = 2000;

    function type() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typedEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let nextDelay = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentWord.length) {
        nextDelay = pauseTime;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        nextDelay = 300;
      }

      setTimeout(type, nextDelay);
    }

    // Start after a short delay
    setTimeout(type, 1000);
  }

  /* =========================================== */
  /*  15. SCROLL PROGRESS BAR                    */
  /* =========================================== */
  function initScrollProgress() {
    const progressBar = $('.scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', throttle(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      progressBar.style.width = progress + '%';
    }, 16), { passive: true });
  }

  /* =========================================== */
  /*  16. BACK TO TOP BUTTON                     */
  /* =========================================== */
  function initBackToTop() {
    const btn = $('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', throttle(() => {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, 100), { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =========================================== */
  /*  17. SWIPER INITIALIZATION                  */
  /* =========================================== */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;

    const swiperEl = $('.screenshots-swiper');
    if (!swiperEl) return;

    new Swiper('.screenshots-swiper', {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 24,
      loop: true,
      speed: 600,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1.2,
          spaceBetween: 16,
        },
        480: {
          slidesPerView: 1.5,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2.5,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 3.5,
          spaceBetween: 28,
        },
        1280: {
          slidesPerView: 4,
          spaceBetween: 32,
        }
      },
      keyboard: {
        enabled: true,
      },
      a11y: {
        prevSlideMessage: 'Previous screenshot',
        nextSlideMessage: 'Next screenshot',
      },
    });
  }

  /* =========================================== */
  /*  18. PARALLAX ELEMENTS                      */
  /* =========================================== */
  function initParallax() {
    const parallaxEls = $$('[data-parallax]');
    if (parallaxEls.length === 0) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;

      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const offset = (centerY - viewportCenter) * speed;

        el.style.transform = `translateY(${offset}px)`;
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        raf(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* =========================================== */
  /*  19. CURRENT YEAR IN FOOTER                 */
  /* =========================================== */
  function initYear() {
    $$('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* =========================================== */
  /*  20. ACCESSIBILITY ENHANCEMENTS             */
  /* =========================================== */
  function initAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
      position: fixed;
      top: -100px;
      left: 16px;
      z-index: 100000;
      padding: 12px 24px;
      background: var(--color-primary);
      color: #0A0F1C;
      font-weight: 700;
      border-radius: 0 0 8px 8px;
      transition: top 0.3s ease;
      text-decoration: none;
      font-family: var(--font-heading);
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-100px';
    });

    document.body.prepend(skipLink);

    // Announce page to screen readers
    const mainContent = $('#main-content');
    if (mainContent && !mainContent.getAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }
  }

  /* =========================================== */
  /*  21. PERFORMANCE: INTERSECTION OBSERVER     */
  /*      FOR LAZY LOADING IMAGES                */
  /* =========================================== */
  function initLazyLoad() {
    const lazyImages = $$('img[data-src]');
    if (lazyImages.length === 0) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px 0px',
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  /* =========================================== */
  /*  22. EASTER EGG: KONAMI CODE                */
  /* =========================================== */
  function initEasterEgg() {
    const konamiCode = [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          konamiIndex = 0;
          activateEasterEgg();
        }
      } else {
        konamiIndex = 0;
      }
    });
  }

  function activateEasterEgg() {
    console.log('🔗✨ Tether — Unbreakable Connections ✨🔗');
    console.log('You found the easter egg! Thanks for exploring.');

    // Brief neon flash effect
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(0, 229, 255, 0.1);
      pointer-events: none;
      animation: fadeIn 0.2s ease forwards, fadeIn 0.3s ease 0.2s reverse forwards;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 600);
  }

  /* =========================================== */
  /*  INITIALIZATION                             */
  /* =========================================== */
  function init() {
    initLoader();
    initNavbar();
    initMobileMenu();
    initRipple();
    initFeatureCards();
    initTestimonials();
    initFAQ();
    initContactForm();
    initParticles();
    initSmoothScroll();
    initCounters();
    initTilt();
    initMagneticButtons();
    initTypedText();
    initScrollProgress();
    initBackToTop();
    initSwiper();
    initParallax();
    initYear();
    initAccessibility();
    initLazyLoad();
    initEasterEgg();

    console.log(
      '%c🔗 Tether %c— Unbreakable Connections',
      'color: #00E5FF; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px rgba(0,229,255,0.5);',
      'color: #94A3C3; font-size: 14px;'
    );
  }

  // Boot up
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
