document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const initCursor = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;

    window.addEventListener('pointermove', (event) => {
      cursor.style.opacity = '1';
      cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
    });

    document.querySelectorAll('a, button, .food-panel, .review-card, .map-panel, .visual-card').forEach((element) => {
      element.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      element.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  };

  const initMagneticButtons = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.button, .nav-cta, .link-button').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        if (reduceMotion) return;
        const rect = button.getBoundingClientRect();
        const offsetX = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
        const offsetY = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
        gsap.to(button, {
          x: offsetX * 10,
          y: offsetY * 10,
          rotate: offsetX * 5,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      button.addEventListener('pointerleave', () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          rotate: 0,
          duration: 0.35,
          ease: 'power2.out'
        });
      });
    });
  };

  const splitWords = (element) => {
    if (!element) return [];

    const text = element.textContent.trim();
    const words = text.split(/\s+/);
    element.textContent = '';

    const fragment = document.createDocumentFragment();
    words.forEach((word, index) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'hero-word';

      [...word].forEach((letter) => {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'hero-letter';
        letterSpan.textContent = letter;
        wordSpan.appendChild(letterSpan);
      });

      fragment.appendChild(wordSpan);
      if (index < words.length - 1) {
        fragment.appendChild(document.createTextNode(' '));
      }
    });

    element.appendChild(fragment);
    return [...element.querySelectorAll('.hero-letter')];
  };

  const initHeroAnimation = () => {
    const lines = document.querySelectorAll('.hero-line');

    lines.forEach((line) => {
      splitWords(line);
    });

    const heroLetters = gsap.utils.toArray('.hero-letter');
    gsap.set(heroLetters, { opacity: 0, y: 90, rotate: 8, filter: 'blur(12px)' });
    gsap.set('.lead, .hero-actions, .hero-meta', { opacity: 0, y: 24 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl
      .from('.brand, .main-nav a', { y: -12, opacity: 0, duration: 0.7, stagger: 0.08 }, 0)
      .to(heroLetters, {
        opacity: 1,
        y: 0,
        rotate: 0,
        filter: 'blur(0px)',
        duration: 0.72,
        stagger: 0.04,
        ease: 'power3.out'
      }, 0.2)
      .to('.lead', { opacity: 1, y: 0, duration: 0.8 }, 0.95)
      .to('.hero-actions', { opacity: 1, y: 0, duration: 0.8 }, 1.15)
      .to('.hero-meta', { opacity: 1, y: 0, duration: 0.8 }, 1.35, '>-0.1');

    gsap.to('.mascot-stage', {
      y: -10,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.floating-burst', {
      y: -16,
      rotate: 8,
      duration: 4.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.35
    });
  };

  const initRevealAnimations = () => {
    const revealItems = gsap.utils.toArray('.story-copy, .story-visual, .food-panel, .mosaic-card, .review-card, .map-panel, .cta-inner, .section-copy');
    revealItems.forEach((item, index) => {
      gsap.fromTo(item, {
        opacity: 0,
        y: 40,
        rotate: 1
      }, {
        opacity: 1,
        y: 0,
        rotate: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          once: true
        },
        delay: index * 0.04
      });
    });

    gsap.fromTo('.story-line', {
      opacity: 0,
      y: -24,
      rotateX: 32,
      filter: 'blur(8px)'
    }, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.18,
      scrollTrigger: {
        trigger: '.story-copy',
        start: 'top 80%',
        once: true
      }
    });

    gsap.fromTo('.stat', {
      opacity: 0,
      y: 26,
      scale: 0.96,
      filter: 'blur(8px)'
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: '.story-stats',
        start: 'top 82%',
        once: true
      }
    });
  };

  const initParallax = () => {
    if (window.innerWidth <= 768) return;

    gsap.utils.toArray('[data-speed]').forEach((element) => {
      const speed = Number(element.dataset.speed) || 0.18;
      gsap.to(element, {
        yPercent: -(speed * 120),
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    const band = document.querySelector('.band-inner');
    if (!band) return;

    gsap.to(band, {
      x: () => -(band.scrollWidth - window.innerWidth) * 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: '.typography-band',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  };

  const initMarquee = () => {
    const track = document.querySelector('.marquee-track');
    if (!track) return;
    const text = track.innerHTML;
    track.innerHTML = text + text;
    const width = track.scrollWidth / 2;
    gsap.to(track, {
      x: -width,
      repeat: -1,
      duration: 22,
      ease: 'none'
    });
  };

  const initScoreCounter = () => {
    const scoreEl = document.querySelector('.score-number');
    if (!scoreEl) return;

    const value = Number(scoreEl.dataset.score || 4.3);
    const obj = { currentValue: 0 };
    gsap.to(obj, {
      currentValue: value,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.reviews',
        start: 'top 80%',
        once: true
      },
      onUpdate: () => {
        scoreEl.textContent = obj.currentValue.toFixed(1);
      }
    });
  };

  const initMascot = () => {
    const mascot = document.querySelector('.mascot');
    if (!mascot) return;

    gsap.to('.mascot .tail', {
      rotation: 16,
      transformOrigin: '0% 50%',
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.mascot .arm', {
      rotation: -18,
      transformOrigin: '0% 50%',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.2
    });

    gsap.to('.mascot .eye', {
      scaleY: 0.12,
      transformOrigin: 'center',
      duration: 0.18,
      repeat: -1,
      repeatDelay: 4,
      yoyo: true,
      ease: 'power1.inOut'
    });

    window.addEventListener('pointermove', (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(mascot, {
        rotation: x * 8,
        x: x * 18,
        y: y * 8,
        duration: 0.8,
        ease: 'power3.out'
      });
    });
  };

  const initCtaMascotInteraction = () => {
    const ctaSection = document.querySelector('.cta-section');
    const ctaButton = document.querySelector('.cta-section .button');
    const ctaBubble = document.querySelector('.cta-mascot-bubble');
    const ctaMiniMascot = document.querySelector('.cta-mini-mascot');

    if (!ctaSection || !ctaButton) return;

    ctaButton.addEventListener('click', () => {
      ctaSection.classList.add('is-punching');

      if (ctaMiniMascot) {
        gsap.fromTo(ctaMiniMascot, { rotate: 0, y: 0 }, {
          rotate: -12,
          y: -6,
          duration: 0.18,
          ease: 'power2.out'
        }).then(() => {
          gsap.to(ctaMiniMascot, {
            rotate: 0,
            y: 0,
            duration: 0.35,
            ease: 'elastic.out(1, 0.5)'
          });
        });
      }

      if (ctaBubble) {
        gsap.fromTo(ctaBubble, { scale: 1 }, { scale: 1.08, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' });
      }

      setTimeout(() => ctaSection.classList.remove('is-punching'), 700);
    });
  };

  const initMobileMenu = () => {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    const links = menu ? menu.querySelectorAll('a') : [];
    if (!toggle || !menu) return;

    let closeButton = menu.querySelector('.menu-close');
    if (!closeButton) {
      closeButton = document.createElement('button');
      closeButton.type = 'button';
      closeButton.className = 'menu-close';
      closeButton.setAttribute('aria-label', 'Close menu');
      closeButton.textContent = '×';
      menu.prepend(closeButton);
    }

    const lenisInstance = window.__elGritoLenis || null;

    const setMenuState = (isOpen) => {
      toggle.setAttribute('aria-expanded', String(isOpen));
      menu.classList.toggle('is-open', isOpen);
      menu.setAttribute('aria-hidden', String(!isOpen));
      document.body.classList.toggle('menu-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';

      if (lenisInstance) {
        if (isOpen) {
          lenisInstance.stop();
        } else {
          lenisInstance.start();
        }
      }
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setMenuState(!isOpen);
      if (!reduceMotion) {
        gsap.fromTo(links, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, clearProps: 'all' });
      }
    });

    closeButton.addEventListener('click', () => setMenuState(false));

    links.forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenuState(false);
      }
    });
  };

  const initMenuNavigation = () => {
    const nav = document.querySelector('.menu-category-nav');
    const buttons = document.querySelectorAll('.filter-btn');
    const panels = document.querySelectorAll('.menu-category-panel');

    if (!nav || !buttons.length || !panels.length) return;

    const setActive = (filterName) => {
      buttons.forEach((button) => {
        const active = button.dataset.filter === filterName;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      const target = document.getElementById(filterName === 'main-menu' ? 'main-menu' : filterName);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filterName = button.dataset.filter;
        setActive(filterName);
        const section = document.getElementById(filterName === 'main-menu' ? 'main-menu' : filterName);
        if (section) {
          history.replaceState(null, '', `#${section.id}`);
        }
      });
    });

    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visibleEntries.length) return;

      const activeId = visibleEntries[0].target.dataset.category;
      const activeButton = document.querySelector(`.filter-btn[data-filter="${activeId}"]`);
      if (!activeButton) return;

      buttons.forEach((button) => {
        const isActive = button === activeButton;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, {
      root: null,
      rootMargin: '-18% 0px -38% 0px',
      threshold: [0.3, 0.5, 0.8]
    });

    panels.forEach((panel) => observer.observe(panel));

    const initialFilter = (() => {
      const hash = location.hash.replace('#', '').trim();
      if (hash && [...panels].some((panel) => panel.id === hash || panel.dataset.category === hash)) {
        return hash;
      }
      return 'starters';
    })();

    const initialButton = document.querySelector(`.filter-btn[data-filter="${initialFilter}"]`);
    if (initialButton) {
      initialButton.classList.add('is-active');
    }
  };

  const initScrollHeader = () => {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const updateHeader = () => {
      header.classList.toggle('scrolled', window.scrollY > 28);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  };

  const initBookingPage = () => {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;

    const formStatus = document.getElementById('formStatus');
    const successState = document.getElementById('successState');
    const submitButton = document.getElementById('submitButton');
    const guestCount = document.getElementById('guestCount');
    const dateGrid = document.getElementById('dateGrid');
    const summaryDate = document.getElementById('summaryDate');
    const summaryTime = document.getElementById('summaryTime');
    const summaryGuests = document.getElementById('summaryGuests');
    const summaryName = document.getElementById('summaryName');
    const summaryEmail = document.getElementById('summaryEmail');
    const successDate = document.getElementById('successDate');
    const successTime = document.getElementById('successTime');
    const successGuests = document.getElementById('successGuests');

    const guestField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');

    let selectedDate = '';
    let selectedTime = '';
    let guestTotal = 2;

    const formatDate = (date) => {
      const fmt = new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
      return fmt.format(date);
    };

    const updateGuestValue = () => {
      guestCount.textContent = String(guestTotal);
      summaryGuests.textContent = `${guestTotal} PEOPLE`;
      successGuests.textContent = `${guestTotal} people`;
    };

    const updateSummary = () => {
      summaryDate.textContent = selectedDate ? selectedDate.toUpperCase() : 'SELECT A DATE';
      summaryTime.textContent = selectedTime ? selectedTime : 'SELECT A TIME';
      summaryGuests.textContent = `${guestTotal} PEOPLE`;
      summaryName.textContent = guestField && guestField.value ? guestField.value.toUpperCase() : 'YOUR NAME';
      summaryEmail.textContent = emailField && emailField.value ? emailField.value.toLowerCase() : 'YOUR EMAIL';
      if (successDate) successDate.textContent = selectedDate ? selectedDate : 'Selected date';
      if (successTime) successTime.textContent = selectedTime ? selectedTime : 'Selected time';
      if (successGuests) successGuests.textContent = `${guestTotal} people`;
    };

    const buildCalendar = () => {
      const startDate = new Date();
      const days = [];
      for (let i = 0; i < 14; i += 1) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        days.push(date);
      }

      dateGrid.innerHTML = days.map((date) => {
        const dateText = date.getDate();
        const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(date).toUpperCase();
        return `
          <button type="button" class="date-btn" data-date="${formatDate(date)}" aria-label="Select ${formatDate(date)}">
            <span class="date-weekday">${weekday}</span>
            <span class="date-day">${dateText}</span>
          </button>
        `;
      }).join('');

      const dateButtons = dateGrid.querySelectorAll('.date-btn');
      dateButtons.forEach((button) => {
        button.addEventListener('click', () => {
          dateButtons.forEach((item) => item.classList.remove('is-selected'));
          button.classList.add('is-selected');
          selectedDate = button.dataset.date;
          updateSummary();
          if (!reduceMotion) {
            gsap.fromTo(button, { scale: 0.92 }, { scale: 1, duration: 0.35, ease: 'back.out(1.8)' });
          }
        });
      });
    };

    const updateTimeSelection = () => {
      const timeButtons = document.querySelectorAll('.time-btn');
      timeButtons.forEach((button) => {
        const isSelected = button.dataset.time === selectedTime;
        button.classList.toggle('is-selected', isSelected);
      });
      summaryTime.textContent = selectedTime ? selectedTime : 'SELECT A TIME';
      if (successTime) successTime.textContent = selectedTime ? selectedTime : 'Selected time';
    };

    document.querySelectorAll('.time-btn').forEach((button) => {
      button.addEventListener('click', () => {
        selectedTime = button.dataset.time;
        updateTimeSelection();
      });
    });

    document.querySelectorAll('.guest-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        guestTotal = action === 'increase' ? Math.min(12, guestTotal + 1) : Math.max(1, guestTotal - 1);
        updateGuestValue();
        if (!reduceMotion) {
          gsap.fromTo('#guestCount', { y: -16, opacity: 0.35 }, { y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.7)' });
        }
      });
    });

    [guestField, emailField, phoneField].forEach((field) => {
      if (!field) return;
      field.addEventListener('input', updateSummary);
    });

    const showStatus = (message, isError = false) => {
      if (!formStatus) return;
      formStatus.textContent = message;
      formStatus.classList.toggle('error', isError);
    };

    document.getElementById('editSummary')?.addEventListener('click', () => {
      document.getElementById('reservation-process').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    bookingForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = guestField?.value.trim() || '';
      const email = emailField?.value.trim() || '';
      const phone = phoneField?.value.trim() || '';
      const message = document.getElementById('message')?.value.trim() || '';

      if (!selectedDate || !selectedTime || !name || !email || !phone) {
        showStatus('Please select a date and time and share your details.', true);
        if (window.__bookingMascot?.triggerError) window.__bookingMascot.triggerError();
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showStatus('Please enter a valid email address.', true);
        if (window.__bookingMascot?.triggerError) window.__bookingMascot.triggerError();
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = 'BOOKING...';
      if (window.__bookingMascot?.startLoading) window.__bookingMascot.startLoading();
      showStatus('Sending your reservation request...');

      try {
        const response = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            date: selectedDate,
            time: selectedTime,
            guests: guestTotal,
            message
          })
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.message || 'Unable to send reservation request.');
        }

        bookingForm.classList.add('is-hidden');
        successState?.classList.remove('hidden');
        successState?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.__bookingMascot?.celebrate?.();
        showStatus('Your reservation request has been received. We will contact you to confirm your table.');

        if (successDate) successDate.textContent = selectedDate;
        if (successTime) successTime.textContent = selectedTime;
        if (successGuests) successGuests.textContent = `${guestTotal} people`;

        if (!reduceMotion) {
          gsap.fromTo('.success-inner', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        }
      } catch (error) {
        submitButton.disabled = false;
        submitButton.textContent = 'BOOK MY TABLE';
        window.__bookingMascot?.stopLoading?.();
        window.__bookingMascot?.triggerError?.();
        showStatus(error.message || 'Something went wrong. Please try again.', true);
      }
    });

    buildCalendar();
    updateGuestValue();
    updateSummary();
  };

  const initBookingMascot = () => {
    const mascotWrap = document.getElementById('bookingMascot');
    if (!mascotWrap) return;

    const mascot = mascotWrap.querySelector('.booking-mascot');
    const eyes = mascotWrap.querySelectorAll('.eye');
    const arm = mascotWrap.querySelector('.arm');
    const tail = mascotWrap.querySelector('.tail');
    const body = mascotWrap.querySelector('.body');
    const bookingForm = document.getElementById('bookingForm');
    const submitButton = document.getElementById('submitButton');
    const focusMap = {
      date: { x: 7, y: -2 },
      time: { x: 10, y: -6 },
      guests: { x: 4, y: 4 },
      details: { x: -5, y: 7 },
      summary: { x: -8, y: -2 },
      button: { x: 9, y: 0 },
      idle: { x: 0, y: 0 }
    };

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const setEyeOffset = (x, y) => {
      eyes.forEach((eye) => {
        gsap.to(eye, {
          x: clamp(x, -8, 8),
          y: clamp(y, -6, 6),
          duration: 0.28,
          ease: 'power2.out',
          overwrite: true
        });
      });
    };

    const setMascotPose = (target = 'idle', extraY = 0) => {
      const offset = focusMap[target] || focusMap.idle;
      setEyeOffset(offset.x, offset.y);

      if (arm) {
        const armRotation = target === 'button' ? -34 : target === 'summary' ? -24 : target === 'details' ? -18 : -12;
        gsap.to(arm, {
          rotation: armRotation,
          transformOrigin: '0% 50%',
          duration: 0.28,
          ease: 'power2.out',
          overwrite: true
        });
      }

      if (tail) {
        const tailRotation = target === 'button' ? 18 : target === 'summary' ? 12 : 10;
        gsap.to(tail, {
          rotation: tailRotation,
          transformOrigin: '0% 50%',
          duration: 0.32,
          ease: 'power2.out',
          overwrite: true
        });
      }

      if (body) {
        gsap.to(body, {
          y: extraY,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: true
        });
      }
    };

    const bootMascot = () => {
      gsap.set(mascotWrap, {
        opacity: 0,
        x: 0,
        y: 0,
        scale: 0.42,
        rotation: -18
      });

      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .fromTo('.booking-line', {
          clipPath: 'inset(0 100% 0 0)'
        }, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out'
        }, 0)
        .fromTo(mascotWrap, {
          opacity: 0,
          scale: 0.42,
          x: -22,
          y: 80,
          rotation: -18
        }, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          rotation: 0,
          duration: 1,
          ease: 'power3.out'
        }, 0.28)
        .to(arm, {
          rotation: -28,
          transformOrigin: '0% 50%',
          duration: 0.18,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        }, 0.8)
        .to(eyes, {
          scaleY: 0.18,
          transformOrigin: 'center center',
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut'
        }, 1);

      gsap.to(mascotWrap, {
        y: -6,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      if (tail) {
        gsap.to(tail, {
          rotation: 14,
          transformOrigin: '0% 50%',
          duration: 1.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      if (arm) {
        gsap.to(arm, {
          rotation: -12,
          transformOrigin: '0% 50%',
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      if (body) {
        gsap.to(body, {
          y: -2,
          duration: 2.7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      if (!window.matchMedia('(pointer: coarse)').matches) {
        window.addEventListener('pointermove', (event) => {
          const x = (event.clientX / window.innerWidth - 0.5) * 16;
          const y = (event.clientY / window.innerHeight - 0.5) * 12;
          setEyeOffset(x * 0.45, y * 0.5);
        });
      } else {
        const focusSequence = ['date', 'time', 'guests', 'details', 'summary'];
        let focusIndex = 0;
        setInterval(() => {
          if (document.hidden) return;
          focusIndex = (focusIndex + 1) % focusSequence.length;
          setMascotPose(focusSequence[focusIndex], 0);
        }, 2600);
      }

      if (!reduceMotion) {
        gsap.to(mascotWrap, {
          x: 120,
          y: 38,
          scale: 0.82,
          rotation: 8,
          scrollTrigger: {
            trigger: '#reservation-process',
            start: 'top 55%',
            end: 'bottom top',
            scrub: 1
          }
        });
      }

      setMascotPose('idle', 0);
    };

    const announceReaction = (target, strength = 0.32) => {
      gsap.fromTo(mascot, {
        scale: 1,
        y: 0,
        rotation: 0
      }, {
        scale: 1 + strength,
        y: -8,
        rotation: 4,
        duration: 0.18,
        ease: 'power2.out',
        overwrite: true,
        onComplete: () => {
          gsap.to(mascot, {
            scale: 1,
            y: 0,
            rotation: 0,
            duration: 0.32,
            ease: 'back.out(1.7)'
          });
        }
      });
      setMascotPose(target, 0);
    };

    const createPapelBurst = () => {
      const container = document.querySelector('.success-inner');
      if (!container) return;

      for (let i = 0; i < 12; i += 1) {
        const piece = document.createElement('span');
        piece.className = 'papel-picado';
        piece.style.left = `${50 + ((i % 4) - 1.5) * 13}%`;
        piece.style.top = `${48 + Math.floor(i / 4) * 6}%`;
        piece.style.setProperty('--dx', `${(Math.random() - 0.5) * 180}px`);
        piece.style.setProperty('--dy', `${-50 - Math.random() * 140}px`);
        piece.style.setProperty('--rot', `${(Math.random() * 260 - 130).toFixed(1)}deg`);
        container.appendChild(piece);
        setTimeout(() => piece.remove(), 1500);
      }
    };

    const observeFocusTargets = () => {
      const focusFields = document.querySelectorAll('#name, #email, #phone, #message');
      focusFields.forEach((field) => {
        field.addEventListener('focus', () => {
          const target = field.id === 'name' ? 'details' : field.id === 'email' ? 'details' : field.id === 'phone' ? 'details' : 'summary';
          setMascotPose(target, 0);
        });
      });
    };

    const reactToSelection = () => {
      document.querySelectorAll('.date-btn').forEach((button) => {
        button.addEventListener('click', () => {
          announceReaction('date', 0.12);
        });
      });

      document.querySelectorAll('.time-btn').forEach((button) => {
        button.addEventListener('click', () => {
          announceReaction('time', 0.18);
        });
      });

      document.querySelectorAll('.guest-btn').forEach((button) => {
        button.addEventListener('click', () => {
          const currentGuestCount = Number(document.getElementById('guestCount')?.textContent || '2');
          const target = currentGuestCount >= 5 ? 'button' : currentGuestCount >= 3 ? 'guests' : 'guests';
          announceReaction(target, currentGuestCount >= 5 ? 0.28 : 0.18);
        });
      });
    };

    const triggerErrorReaction = () => {
      if (!mascot) return;
      gsap.fromTo(mascot, {
        x: 0,
        rotation: 0
      }, {
        x: -10,
        rotation: -6,
        duration: 0.16,
        yoyo: true,
        repeat: 2,
        ease: 'power2.inOut'
      });
      setMascotPose('idle', 0);
    };

    let loadingTimeline = null;

    const startLoading = () => {
      if (!eyes.length) return;
      loadingTimeline?.kill();
      loadingTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.12 });
      loadingTimeline
        .to(eyes, { x: -12, duration: 0.18, ease: 'power1.inOut' })
        .to(eyes, { x: 12, duration: 0.18, ease: 'power1.inOut' })
        .to(eyes, { x: 0, duration: 0.18, ease: 'power1.inOut' })
        .to(arm, { rotation: -34, duration: 0.18, ease: 'power2.inOut' }, 0)
        .to(arm, { rotation: -18, duration: 0.18, ease: 'power2.inOut' }, 0.18);
      setMascotPose('button', -4);
    };

    const stopLoading = () => {
      loadingTimeline?.kill();
      loadingTimeline = null;
      setMascotPose('idle', 0);
    };

    bootMascot();
    observeFocusTargets();
    reactToSelection();

    window.__bookingMascot = {
      startLoading,
      stopLoading,
      triggerError: triggerErrorReaction,
      celebrate: () => {
        loadingTimeline?.kill();
        loadingTimeline = null;
        setMascotPose('summary', -8);
        createPapelBurst();
        gsap.fromTo(mascotWrap, {
          scale: 1,
          y: 0,
          rotation: 0
        }, {
          scale: 1.06,
          y: -10,
          rotation: 5,
          duration: 0.22,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(mascotWrap, {
              scale: 1,
              y: 0,
              rotation: 0,
              duration: 0.38,
              ease: 'back.out(1.8)'
            });
          }
        });
      }
    };
  };

  const initMap = () => {
    const pin = document.querySelector('.pin-group');
    if (!pin) return;
    gsap.to(pin, {
      y: -8,
      repeat: -1,
      yoyo: true,
      duration: 1.6,
      ease: 'sine.inOut'
    });
  };

  if (!reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis) {
      const lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.1,
        lerp: 0.08
      });

      window.__elGritoLenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    initHeroAnimation();
    initRevealAnimations();
    initScoreCounter();
    initParallax();
    initMarquee();
    initMascot();
    initMap();
  } else {
    document.querySelectorAll('.hero-word, .lead, .hero-actions, .hero-meta').forEach((element) => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
  }

  initBookingMascot();
  initBookingPage();
  initCursor();
  initMagneticButtons();
  initCtaMascotInteraction();
  initMobileMenu();
  initMenuNavigation();
  initScrollHeader();
});
