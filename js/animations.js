/* ============================================= */
/*  TETHER — Scroll Animations                  */
/*  Intersection Observer powered reveals,       */
/*  stagger effects, parallax, counters,         */
/*  and advanced scroll-driven animations        */
/* ============================================= */

(function () {
  'use strict';

  /* =========================================== */
  /*  0. CONFIGURATION                           */
  /* =========================================== */
  const CONFIG = {
    // Intersection Observer defaults
    revealThreshold: 0.15,
    revealRootMargin: '0px 0px -60px 0px',

    // Stagger delay between children (ms)
    staggerDelay: 80,

    // Respect user preference
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

    // Parallax speed multiplier
    parallaxMultiplier: 0.3,

    // Counter animation duration (ms)
    counterDuration: 2000,
  };

  // If reduced motion is preferred, mark everything as revealed immediately
  if (CONFIG.reducedMotion) {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .stagger-children > *')
        .forEach(el => {
          el.classList.add('revealed');
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.transitionDelay = '0ms';
        });
    });
    return; // Exit early — no animations
  }

  /* =========================================== */
  /*  1. REVEAL ON SCROLL                        */
  /*     Handles: .reveal, .reveal-left,         */
  /*     .reveal-right, .reveal-scale,           */
  /*     .reveal-rotate                          */
  /* =========================================== */
  function initRevealObserver() {
    const revealSelectors = [
      '.reveal',
      '.reveal-left',
      '.reveal-right',
      '.reveal-scale',
      '.reveal-rotate'
    ];

    const allRevealElements = document.querySelectorAll(revealSelectors.join(','));
    if (allRevealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Get custom delay if set
          const delay = entry.target.dataset.revealDelay || 0;

          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, parseInt(delay));

          // Unobserve after revealing (one-time animation)
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: CONFIG.revealThreshold,
      rootMargin: CONFIG.revealRootMargin,
    });

    allRevealElements.forEach(el => observer.observe(el));
  }

  /* =========================================== */
  /*  2. STAGGER CHILDREN                        */
  /*     Parent has .stagger-children             */
  /*     Children get staggered reveal delays     */
  /* =========================================== */
  function initStaggerObserver() {
    const staggerParents = document.querySelectorAll('.stagger-children');
    if (staggerParents.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const parent = entry.target;
          const children = parent.querySelectorAll(':scope > *');
          const baseDelay = parseInt(parent.dataset.staggerDelay) || CONFIG.staggerDelay;

          children.forEach((child, index) => {
            // Set initial state if not already set
            if (!child.classList.contains('revealed')) {
              child.style.opacity = '0';
              child.style.transform = 'translateY(30px)';
              child.style.transition = `opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * baseDelay}ms, 
                                        transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * baseDelay}ms`;

              // Trigger animation on next frame
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  child.style.opacity = '1';
                  child.style.transform = 'translateY(0)';
                  child.classList.add('revealed');
                });
              });
            }
          });

          observer.unobserve(parent);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    });

    staggerParents.forEach(parent => observer.observe(parent));
  }

  /* =========================================== */
  /*  3. FEATURE CARDS STAGGER                   */
  /*     Special handling for feature grid        */
  /* =========================================== */
  function initFeatureCardsAnimation() {
    const featureGrid = document.querySelector('.features-grid');
    if (!featureGrid) return;

    const cards = featureGrid.querySelectorAll('.feature-card');
    if (cards.length === 0) return;

    // Set initial hidden state
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px) scale(0.95)';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.transition = 'opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
          });

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    observer.observe(featureGrid);
  }

  /* =========================================== */
  /*  4. NEWS CARDS ANIMATION                    */
  /* =========================================== */
  function initNewsCardsAnimation() {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;

    const cards = newsGrid.querySelectorAll('.news-card');
    if (cards.length === 0) return;

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px)';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 150);
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
    });

    observer.observe(newsGrid);
  }

  /* =========================================== */
  /*  5. TIMELINE ANIMATION                      */
  /*     Sequential reveal of timeline items      */
  /* =========================================== */
  function initTimelineAnimation() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const items = timeline.querySelectorAll('.timeline-item');
    if (items.length === 0) return;

    // Set initial states
    items.forEach((item, index) => {
      const content = item.querySelector('.timeline-content');
      const node = item.querySelector('.timeline-node');

      if (content) {
        content.style.opacity = '0';
        content.style.transform = index % 2 === 0 ? 'translateX(-40px)' : 'translateX(40px)';
      }

      if (node) {
        node.style.opacity = '0';
        node.style.transform = 'translateX(-50%) scale(0)';
      }
    });

    // Observe each item individually
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const content = item.querySelector('.timeline-content');
          const node = item.querySelector('.timeline-node');

          // Animate node first
          if (node) {
            node.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            node.style.opacity = '1';
            node.style.transform = 'translateX(-50%) scale(1)';
          }

          // Then content
          if (content) {
            setTimeout(() => {
              content.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
              content.style.opacity = '1';
              content.style.transform = 'translateX(0)';
            }, 200);
          }

          observer.unobserve(item);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -80px 0px',
    });

    items.forEach(item => observer.observe(item));
  }

  /* =========================================== */
  /*  6. HERO ENTRANCE ANIMATION                 */
  /*     Orchestrated multi-element reveal        */
  /* =========================================== */
  function initHeroAnimation() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const logo = hero.querySelector('.hero-logo');
    const title = hero.querySelector('.hero-title');
    const subtitle = hero.querySelector('.hero-subtitle');
    const cta = hero.querySelector('.hero-cta');
    const scroll = hero.querySelector('.hero-scroll');

    const elements = [
      { el: logo, delay: 300, transform: 'scale(0.5)', opacity: '0' },
      { el: title, delay: 600, transform: 'translateY(30px)', opacity: '0' },
      { el: subtitle, delay: 900, transform: 'translateY(20px)', opacity: '0' },
      { el: cta, delay: 1200, transform: 'translateY(20px)', opacity: '0' },
      { el: scroll, delay: 2000, transform: 'translateX(-50%) translateY(-20px)', opacity: '0' },
    ];

    // Set initial states
    elements.forEach(({ el, transform, opacity }) => {
      if (!el) return;
      el.style.opacity = opacity;
      el.style.transform = transform;
    });

    // Animate after loader finishes
    const startDelay = 2000; // Matches loader duration

    elements.forEach(({ el, delay }) => {
      if (!el) return;

      setTimeout(() => {
        el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        el.style.opacity = '1';

        // Special transform for scroll prompt (needs to keep translateX)
        if (el.classList.contains('hero-scroll')) {
          el.style.transform = 'translateX(-50%) translateY(0)';
        } else {
          el.style.transform = 'translateY(0) scale(1)';
        }
      }, startDelay + delay);
    });
  }

  /* =========================================== */
  /*  7. SECTION HEADER ANIMATIONS               */
  /*     Badge → Title → Subtitle sequence        */
  /* =========================================== */
  function initSectionHeaders() {
    const headers = document.querySelectorAll('.section-header');
    if (headers.length === 0) return;

    headers.forEach(header => {
      const badge = header.querySelector('.section-badge');
      const title = header.querySelector('.section-title');
      const subtitle = header.querySelector('.section-subtitle');

      const children = [badge, title, subtitle].filter(Boolean);

      children.forEach((child, index) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(25px)';
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            children.forEach((child, index) => {
              setTimeout(() => {
                child.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
              }, index * 150);
            });
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.2,
        rootMargin: '0px 0px -40px 0px',
      });

      observer.observe(header);
    });
  }

  /* =========================================== */
  /*  8. DOWNLOAD SECTION GLOW ANIMATION         */
  /* =========================================== */
  function initDownloadAnimation() {
    const downloadSection = document.querySelector('.download-section');
    if (!downloadSection) return;

    const glow = downloadSection.querySelector('.download-glow');
    const badges = downloadSection.querySelectorAll('.download-badge');

    if (glow) {
      glow.style.opacity = '0';
      glow.style.transform = 'translate(-50%, -50%) scale(0.5)';
    }

    badges.forEach(badge => {
      badge.style.opacity = '0';
      badge.style.transform = 'translateY(30px)';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate glow
          if (glow) {
            setTimeout(() => {
              glow.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
              glow.style.opacity = '1';
              glow.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 200);
          }

          // Animate badges
          badges.forEach((badge, index) => {
            setTimeout(() => {
              badge.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
              badge.style.opacity = '1';
              badge.style.transform = 'translateY(0)';
            }, 400 + index * 150);
          });

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
    });

    observer.observe(downloadSection);
  }

  /* =========================================== */
  /*  9. TESTIMONIAL SECTION ENTRANCE            */
  /* =========================================== */
  function initTestimonialAnimation() {
    const section = document.querySelector('.testimonials-slider');
    if (!section) return;

    section.style.opacity = '0';
    section.style.transform = 'translateY(40px)';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
    });

    observer.observe(section);
  }

  /* =========================================== */
  /*  10. FOOTER ENTRANCE                        */
  /* =========================================== */
  function initFooterAnimation() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    const footerGrid = footer.querySelector('.footer-grid');
    const footerBottom = footer.querySelector('.footer-bottom');

    const elements = [footerGrid, footerBottom].filter(Boolean);

    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          elements.forEach((el, index) => {
            setTimeout(() => {
              el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, index * 200);
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
    });

    observer.observe(footer);
  }

  /* =========================================== */
  /*  11. SCROLL-DRIVEN PROGRESS LINE            */
  /*     (Timeline connecting line animation)     */
  /* =========================================== */
  function initTimelineProgress() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const line = timeline.querySelector('.timeline::before') || null;

    // Create a dynamic progress overlay on the timeline line
    const progressLine = document.createElement('div');
    progressLine.style.cssText = `
      position: absolute;
      top: 0;
      left: 50%;
      width: 2px;
      height: 0%;
      background: linear-gradient(to bottom, #00E5FF, #00B8D9);
      transform: translateX(-50%);
      z-index: 1;
      transition: height 0.1s linear;
      box-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
      border-radius: 999px;
    `;
    timeline.style.position = 'relative';
    timeline.appendChild(progressLine);

    // Update progress based on scroll position through the timeline
    function updateProgress() {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much of the timeline is scrolled past
      const timelineTop = rect.top;
      const timelineHeight = rect.height;

      // Start when timeline top enters view, end when bottom leaves
      const start = windowHeight * 0.5;
      const scrolledPast = start - timelineTop;
      const progress = Math.min(Math.max(scrolledPast / timelineHeight, 0), 1);

      progressLine.style.height = (progress * 100) + '%';
    }

    // Mobile adjustment
    if (window.innerWidth <= 768) {
      progressLine.style.left = '24px';
    }

    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateProgress);
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        progressLine.style.left = '24px';
      } else {
        progressLine.style.left = '50%';
      }
    });

    updateProgress();
  }

  /* =========================================== */
  /*  12. NAVBAR LINK HIGHLIGHT ON SCROLL        */
  /*     (For single-page index.html sections)    */
  /* =========================================== */
  function initScrollSpy() {
    // Only active on index.html
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage !== 'index.html' && currentPage !== '') return;

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');

          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -40% 0px',
    });

    sections.forEach(section => observer.observe(section));
  }

  /* =========================================== */
  /*  13. TEXT SPLIT ANIMATION                   */
  /*     Splits text into chars/words and         */
  /*     animates them individually               */
  /* =========================================== */
  function initTextSplit() {
    const splitElements = document.querySelectorAll('[data-split]');
    if (splitElements.length === 0) return;

    splitElements.forEach(el => {
      const splitType = el.dataset.split; // 'chars' or 'words'
      const text = el.textContent;
      const delay = parseInt(el.dataset.splitDelay) || 30;

      el.innerHTML = '';
      el.style.opacity = '1';

      if (splitType === 'chars') {
        [...text].forEach((char, i) => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.cssText = `
            display: inline-block;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.4s ease ${i * delay}ms, transform 0.4s ease ${i * delay}ms;
          `;
          el.appendChild(span);
        });
      } else {
        text.split(' ').forEach((word, i) => {
          const span = document.createElement('span');
          span.textContent = word;
          span.style.cssText = `
            display: inline-block;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease ${i * delay}ms, transform 0.5s ease ${i * delay}ms;
            margin-right: 0.3em;
          `;
          el.appendChild(span);
        });
      }

      // Observe for triggering
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const spans = entry.target.querySelectorAll('span');
            spans.forEach(span => {
              span.style.opacity = '1';
              span.style.transform = 'translateY(0)';
            });
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.5,
      });

      observer.observe(el);
    });
  }

  /* =========================================== */
  /*  14. GLASS CARD HOVER GLOW                  */
  /*     Dynamic border glow following mouse      */
  /* =========================================== */
  function initGlassCardGlow() {
    const glassCards = document.querySelectorAll('.glass-card, .screenshot-card');
    if (glassCards.length === 0) return;

    glassCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.background = `
          radial-gradient(
            300px circle at ${x}px ${y}px,
            rgba(0, 229, 255, 0.06),
            rgba(18, 26, 46, 0.5)
          )
        `;
        card.style.borderImage = `
          radial-gradient(
            200px circle at ${x}px ${y}px,
            rgba(0, 229, 255, 0.3),
            rgba(0, 229, 255, 0.08)
          ) 1
        `;
      });

      card.addEventListener('mouseleave', () => {
        card.style.background = '';
        card.style.borderImage = '';
      });
    });
  }

  /* =========================================== */
  /*  15. PAGE TRANSITION EFFECT                 */
  /*     Fade out when navigating between pages   */
  /* =========================================== */
  function initPageTransitions() {
    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 99998;
      background: #0A0F1C;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease;
    `;
    document.body.appendChild(overlay);

    // Fade in on page load
    overlay.style.opacity = '1';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.opacity = '0';
      });
    });

    // Intercept internal links
    const internalLinks = document.querySelectorAll('a[href]');

    internalLinks.forEach(link => {
      const href = link.getAttribute('href');

      // Skip anchors, external links, and special links
      if (!href ||
          href.startsWith('#') ||
          href.startsWith('http') ||
          href.startsWith('mailto:') ||
          href.startsWith('tel:') ||
          link.hasAttribute('target') ||
          link.hasAttribute('download')) {
        return;
      }

      link.addEventListener('click', (e) => {
        e.preventDefault();

        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'all';

        setTimeout(() => {
          window.location.href = href;
        }, 400);
      });
    });
  }

  /* =========================================== */
  /*  16. CURSOR GLOW EFFECT (Desktop only)      */
  /* =========================================== */
  function initCursorGlow() {
    // Skip on touch devices
    if ('ontouchstart' in window) return;
    if (window.innerWidth < 1024) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
      position: fixed;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 229, 255, 0.04) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
      opacity: 0;
    `;
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      glow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
    });

    function animateGlow() {
      // Smooth follow
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;

      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';

      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  }

  /* =========================================== */
  /*  17. CHAIN LINK DIVIDER ANIMATIONS          */
  /* =========================================== */
  function initChainDividers() {
    const dividers = document.querySelectorAll('.chain-divider');
    if (dividers.length === 0) return;

    dividers.forEach(divider => {
      divider.style.opacity = '0';
      divider.style.transform = 'scaleX(0)';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'scaleX(1)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5,
    });

    dividers.forEach(d => observer.observe(d));
  }

  /* =========================================== */
  /*  18. FAQ ITEMS ENTRANCE                     */
  /* =========================================== */
  function initFAQAnimation() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-30px)';
    });

    const container = document.querySelector('.faq-container');
    if (!container) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          faqItems.forEach((item, index) => {
            setTimeout(() => {
              item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateX(0)';
            }, index * 80);
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
    });

    observer.observe(container);
  }

  /* =========================================== */
  /*  19. CONTACT FORM ANIMATION                 */
  /* =========================================== */
  function initContactAnimation() {
    const contactGrid = document.querySelector('.contact-grid');
    if (!contactGrid) return;

    const left = contactGrid.querySelector('.contact-info');
    const right = contactGrid.querySelector('.contact-form') || contactGrid.querySelector('form')?.parentElement;

    if (left) {
      left.style.opacity = '0';
      left.style.transform = 'translateX(-40px)';
    }

    if (right) {
      right.style.opacity = '0';
      right.style.transform = 'translateX(40px)';
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (left) {
            setTimeout(() => {
              left.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
              left.style.opacity = '1';
              left.style.transform = 'translateX(0)';
            }, 200);
          }

          if (right) {
            setTimeout(() => {
              right.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
              right.style.opacity = '1';
              right.style.transform = 'translateX(0)';
            }, 400);
          }

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
    });

    observer.observe(contactGrid);
  }

  /* =========================================== */
  /*  20. ABOUT PAGE VALUES GRID                 */
  /* =========================================== */
  function initAboutAnimation() {
    const valuesGrid = document.querySelector('.about-values-grid');
    if (!valuesGrid) return;

    const cards = valuesGrid.querySelectorAll('.about-value-card, .glass-card');

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px) scale(0.9)';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, index * 120);
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
    });

    observer.observe(valuesGrid);
  }

  /* =========================================== */
  /*  21. NUMBER COUNTER WITH GLOW               */
  /* =========================================== */
  function initStatCounters() {
    const statNumbers = document.querySelectorAll('[data-count]');
    if (statNumbers.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';

          const target = parseInt(entry.target.dataset.count);
          const suffix = entry.target.dataset.suffix || '';
          const prefix = entry.target.dataset.prefix || '';
          const duration = CONFIG.counterDuration;
          const start = Date.now();

          function update() {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out exponential
            const eased = 1 - Math.pow(2, -10 * progress);
            const current = Math.round(eased * target);

            entry.target.textContent = prefix + current.toLocaleString() + suffix;

            // Glow effect during counting
            const glowIntensity = (1 - progress) * 0.5;
            entry.target.style.textShadow = `0 0 ${20 * (1 - progress)}px rgba(0, 229, 255, ${glowIntensity})`;

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              entry.target.style.textShadow = '';
            }
          }

          update();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5,
    });

    statNumbers.forEach(el => observer.observe(el));
  }

  /* =========================================== */
  /*  22. SCREENSHOT CARD ENTRANCE               */
  /* =========================================== */
  function initScreenshotAnimation() {
    const screenshotCards = document.querySelectorAll('.screenshot-card');
    if (screenshotCards.length === 0) return;

    // Only animate standalone cards (not in Swiper)
    const standaloneCards = Array.from(screenshotCards).filter(
      card => !card.closest('.swiper')
    );

    standaloneCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px) scale(0.95)';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    });

    standaloneCards.forEach(card => observer.observe(card));
  }

  /* =========================================== */
  /*  MASTER INITIALIZATION                      */
  /* =========================================== */
  function initAllAnimations() {
    // Core reveal system
    initRevealObserver();
    initStaggerObserver();

    // Page-specific animations
    initHeroAnimation();
    initSectionHeaders();
    initFeatureCardsAnimation();
    initNewsCardsAnimation();
    initTimelineAnimation();
    initTimelineProgress();
    initDownloadAnimation();
    initTestimonialAnimation();
    initFooterAnimation();

    // Sub-page animations
    initFAQAnimation();
    initContactAnimation();
    initAboutAnimation();
    initScreenshotAnimation();

    // Advanced effects
    initTextSplit();
    initGlassCardGlow();
    initPageTransitions();
    initCursorGlow();
    initChainDividers();
    initStatCounters();
    initScrollSpy();

    // Log initialization
    console.log('%c✨ Tether Animations initialized', 'color: #00E5FF; font-size: 12px;');
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAnimations);
  } else {
    initAllAnimations();
  }

})();
