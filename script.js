/* =========================================================
   Kerim Tuna Ulusoy — Award-Winning Portfolio Scripts
   GSAP + Three.js + Custom Cursor + Premium Effects
   ========================================================= */

(function () {
  'use strict';

  /* =========================================================
     UTILITY: Detect fine-pointer (desktop) for cursor features
     ========================================================= */
  var isDesktop = window.matchMedia('(pointer: fine)').matches;

  /* =========================================================
     CUSTOM CURSOR (dot + ring + glow)
     ========================================================= */
  var cursorDot = document.getElementById('cursor-dot');
  var cursorRing = document.getElementById('cursor-ring');
  var cursorGlow = document.getElementById('cursor-glow');
  var mx = 0, my = 0;
  var dotX = 0, dotY = 0;
  var ringX = 0, ringY = 0;
  var glowX = 0, glowY = 0;

  if (isDesktop) {
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      cursorGlow.classList.add('visible');
    });
    document.addEventListener('mouseleave', function () {
      cursorGlow.classList.remove('visible');
    });

    // Expand ring on interactive elements
    var hoverTargets = document.querySelectorAll('a, button, input, textarea, .magnetic, [role="button"]');
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursorRing.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { cursorRing.classList.remove('hover'); });
    });

    // Shrink ring on click
    document.addEventListener('mousedown', function () { cursorRing.classList.add('click'); });
    document.addEventListener('mouseup', function () { cursorRing.classList.remove('click'); });

    // Smooth cursor follow loop
    (function animateCursors() {
      dotX += (mx - dotX) * 0.25;
      dotY += (my - dotY) * 0.25;
      ringX += (mx - ringX) * 0.12;
      ringY += (my - ringY) * 0.12;
      glowX += (mx - glowX) * 0.08;
      glowY += (my - glowY) * 0.08;

      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top = dotY + 'px';
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';

      requestAnimationFrame(animateCursors);
    })();
  }

  /* =========================================================
     THREE.JS — Floating Particle Field Background
     ========================================================= */
  (function initThreeBackground() {
    var canvas = document.getElementById('three-canvas');
    if (typeof THREE === 'undefined' || !canvas) return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    var count = 800;
    var positions = new Float32Array(count * 3);
    var colors = new Float32Array(count * 3);
    var accentR = 230 / 255, accentG = 57 / 255, accentB = 70 / 255;
    var blueR = 95 / 255, blueG = 168 / 255, blueB = 211 / 255;

    for (var i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      var mix = Math.random();
      colors[i * 3] = accentR * mix + blueR * (1 - mix);
      colors[i * 3 + 1] = accentG * mix + blueG * (1 - mix);
      colors[i * 3 + 2] = accentB * mix + blueB * (1 - mix);
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var material = new THREE.PointsMaterial({
      size: 0.12, vertexColors: true, transparent: true, opacity: 0.6,
      sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false
    });

    var points = new THREE.Points(geometry, material);
    scene.add(points);

    // Mouse parallax
    var targetRotX = 0, targetRotY = 0;
    if (isDesktop) {
      document.addEventListener('mousemove', function (e) {
        targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.3;
        targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.3;
      });
    }

    function animate() {
      requestAnimationFrame(animate);
      points.rotation.y += 0.0003;
      points.rotation.x += 0.0001;
      points.rotation.x += (targetRotX - points.rotation.x) * 0.02;
      points.rotation.y += (targetRotY - points.rotation.y) * 0.02;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  })();

  /* =========================================================
     LOADING SCREEN + GSAP HERO ENTRANCE
     ========================================================= */
  document.body.style.overflow = 'hidden';

  window.addEventListener('load', function () {
    var loader = document.getElementById('loader');
    setTimeout(function () {
      // Bulletproof loader hide with inline style fallback
      loader.classList.add('hidden');
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      loader.style.pointerEvents = 'none';
      document.body.style.overflow = '';
      setTimeout(initHeroAnimation, 400);
    }, 2200);
  });

  function initHeroAnimation() {
    if (typeof gsap === 'undefined') return;
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-greeting', { y: 40, opacity: 0, duration: 0.8 })
      .from('.hero-name', { y: 60, opacity: 0, duration: 1, scale: 0.95 }, '-=0.5')
      .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('.hero-desc', { y: 30, opacity: 0, duration: 0.7 }, '-=0.4')
      .from('.hero-cta .btn', { y: 30, opacity: 0, duration: 0.6, stagger: 0.15 }, '-=0.3')
      .from('.hero-socials .social-icon', { y: 20, opacity: 0, scale: 0.5, duration: 0.5, stagger: 0.08 }, '-=0.2')
      .from('.scroll-indicator', { y: 20, opacity: 0, duration: 0.6 }, '-=0.1');
  }

  /* =========================================================
     GSAP SCROLL TRIGGER — Section Reveals
     ========================================================= */
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Standard reveals
    gsap.utils.toArray('.gsap-reveal').forEach(function (el) {
      if (el.closest('.hero')) return;
      gsap.fromTo(el, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });

    // Left reveals
    gsap.utils.toArray('.gsap-reveal-left').forEach(function (el) {
      gsap.fromTo(el, { x: -60, opacity: 0 }, {
        x: 0, opacity: 1, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });

    // Right reveals
    gsap.utils.toArray('.gsap-reveal-right').forEach(function (el) {
      gsap.fromTo(el, { x: 60, opacity: 0 }, {
        x: 0, opacity: 1, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });

    // Staggered up reveals (cards, skill cards, project cards, edu entries, personal cards)
    gsap.utils.toArray('.gsap-reveal-up').forEach(function (el) {
      var delay = 0;
      if (el.style.getPropertyValue('--i')) {
        delay = parseInt(el.style.getPropertyValue('--i')) * 0.12;
      }
      gsap.fromTo(el, { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.85, delay: delay, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      });
    });

    // Parallax on hero geo shapes
    gsap.to('.geo-1', { y: -80, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.geo-2', { y: -50, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
  }

  // Initialize scroll animations once GSAP is ready
  if (typeof gsap !== 'undefined') {
    initScrollAnimations();
  } else {
    var gsapCheck = setInterval(function () {
      if (typeof gsap !== 'undefined') { clearInterval(gsapCheck); initScrollAnimations(); }
    }, 100);
  }

  /* =========================================================
     MAGNETIC BUTTON EFFECT (desktop only)
     ========================================================= */
  if (isDesktop) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(function () { btn.style.transition = ''; }, 400);
      });
    });
  }

  /* =========================================================
     SCROLL PROGRESS BAR
     ========================================================= */
  var scrollBar = document.getElementById('scroll-progress-bar');

  function updateScrollProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollBar.style.width = percent + '%';
  }

  /* =========================================================
     NAVBAR — scroll background, active link
     ========================================================= */
  var navbar = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    if (window.scrollY > 50) { navbar.classList.add('scrolled'); }
    else { navbar.classList.remove('scrolled'); }

    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) { link.classList.add('active'); }
        });
      }
    });
  }

  /* =========================================================
     MOBILE NAV TOGGLE
     ========================================================= */
  var navToggle = document.getElementById('nav-toggle');
  var navLinksContainer = document.getElementById('nav-links');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
    var expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !expanded);
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('open');
      navLinksContainer.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* =========================================================
     TYPING ANIMATION
     ========================================================= */
  var typedEl = document.getElementById('typed-text');
  var phrases = ['Aspiring Web Developer', 'Digital Entrepreneur', 'Creative Problem Solver', 'Lifelong Learner'];
  var phraseIndex = 0, charIndex = 0, isDeleting = false;
  var typingSpeed = 80, deletingSpeed = 45, pauseTime = 2200;

  function typeEffect() {
    var current = phrases[phraseIndex];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }
    var delay = isDeleting ? deletingSpeed : typingSpeed;
    if (!isDeleting && charIndex === current.length) { delay = pauseTime; isDeleting = true; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 400; }
    setTimeout(typeEffect, delay);
  }
  setTimeout(typeEffect, 2500);

  /* =========================================================
     ANIMATED COUNTERS
     ========================================================= */
  var counters = document.querySelectorAll('.counter');
  var countersAnimated = false;

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counters.forEach(function (counter) {
          var target = parseInt(counter.getAttribute('data-target'));
          var current = 0;
          var increment = target / 60;
          var timer = setInterval(function () {
            current += increment;
            if (current >= target) { counter.textContent = target; clearInterval(timer); }
            else { counter.textContent = Math.ceil(current); }
          }, 28);
        });
      }
    });
  }, { threshold: 0.5 });

  var aboutSection = document.getElementById('about');
  if (aboutSection) counterObserver.observe(aboutSection);

  /* =========================================================
     SKILL BAR ANIMATION
     ========================================================= */
  var skillBars = document.querySelectorAll('.skill-bar-fill');
  var skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var bar = entry.target;
        bar.style.width = bar.getAttribute('data-width') + '%';
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(function (bar) { skillObserver.observe(bar); });

  /* =========================================================
     TIMELINE ANIMATION
     ========================================================= */
  var timeline = document.querySelector('.timeline');
  if (timeline) {
    var timelineObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { timeline.classList.add('animated'); timelineObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    timelineObserver.observe(timeline);
  }

  /* =========================================================
     AUTO-CALCULATE AGE FROM DATE OF BIRTH
     DOB: 28 September 2013
     ========================================================= */
  function calculateAge(year, month, day) {
    var today = new Date();
    var birthDate = new Date(year, month - 1, day);
    var age = today.getFullYear() - birthDate.getFullYear();
    var monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  var ageEl = document.getElementById('personal-age');
  if (ageEl) {
    var age = calculateAge(2013, 9, 28);
    ageEl.textContent = age + ' years old';
  }

  /* =========================================================
     RIPPLE EFFECT ON BUTTONS
     ========================================================= */
  document.querySelectorAll('.ripple').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var rect = el.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      el.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });
  });

  /* =========================================================
     BACK TO TOP
     ========================================================= */
  var backToTop = document.getElementById('back-to-top');
  function updateBackToTop() {
    if (window.scrollY > 500) { backToTop.classList.add('visible'); }
    else { backToTop.classList.remove('visible'); }
  }
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =========================================================
     CONTACT FORM
     ========================================================= */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = contactForm.querySelector('#name').value.trim();
      var email = contactForm.querySelector('#email').value.trim();
      var message = contactForm.querySelector('#message').value.trim();
      if (!name || !email || !message) { showFormMessage('Please fill in all fields.', 'error'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFormMessage('Please enter a valid email address.', 'error'); return; }

      var btn = contactForm.querySelector('button[type="submit"]');
      var originalText = btn.innerHTML;
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Opening mail app...';
      btn.disabled = true;

      var subject = encodeURIComponent('Website message from ' + name);
      var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);
      window.location.href = 'mailto:kerimtunau@gmail.com?subject=' + subject + '&body=' + body;

      setTimeout(function () {
        btn.innerHTML = originalText;
        btn.disabled = false;
        contactForm.reset();
        showFormMessage('Your email app has been opened. Please send the prepared message.', 'success');
      }, 800);
    });
  }

  function showFormMessage(text, type) {
    var existing = document.querySelector('.form-message');
    if (existing) existing.remove();
    var msg = document.createElement('div');
    msg.className = 'form-message';
    msg.textContent = text;
    msg.style.cssText = 'padding:14px 20px;border-radius:8px;font-size:0.9rem;margin-top:8px;';
    if (type === 'success') {
      msg.style.background = 'rgba(102,187,106,0.12)';
      msg.style.color = '#66bb6a';
      msg.style.border = '1px solid rgba(102,187,106,0.25)';
    } else {
      msg.style.background = 'rgba(230,57,70,0.12)';
      msg.style.color = '#e63946';
      msg.style.border = '1px solid rgba(230,57,70,0.25)';
    }
    contactForm.appendChild(msg);
    setTimeout(function () {
      msg.style.opacity = '0';
      msg.style.transition = 'opacity 0.4s';
      setTimeout(function () { msg.remove(); }, 400);
    }, 4000);
  }

  /* =========================================================
     SMOOTH SCROLL (fallback for Safari)
     ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
      }
    });
  });

  /* =========================================================
     COMBINED SCROLL HANDLER (throttled via rAF)
     ========================================================= */
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateScrollProgress();
        updateNavbar();
        updateBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Run once on init
  updateScrollProgress();
  updateNavbar();
  updateBackToTop();

})();
