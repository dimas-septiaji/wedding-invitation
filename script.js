/**
 * WEDDING INVITATION — INTERACTIVE LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  const weddingDate = new Date('Jan 31, 2027 08:00:00').getTime();

  // ELEMENTS
  const loadingScreen = document.getElementById('loading-screen');
  const loadingBarFill = document.getElementById('loading-bar-fill');
  const cover = document.getElementById('cover');
  const btnOpen = document.getElementById('btn-open');
  const musicToggle = document.getElementById('music-toggle');
  const scrollTop = document.getElementById('scroll-top');
  const dotNav = document.querySelector('.dot-nav');
  const guestContainer = document.getElementById('cover-guest');
  const guestNameElem = document.getElementById('guest-name');
  const particlesContainer = document.getElementById('cover-particles');
  const revealElements = document.querySelectorAll('.reveal');

  // 1. LOADING LOGIC
  let loadProgress = 0;
  const interval = setInterval(() => {
    loadProgress += Math.random() * 30;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.classList.add('loaded');
        document.body.style.overflow = 'hidden';
      }, 500);
    }
    loadingBarFill.style.width = `${loadProgress}%`;
  }, 150);

  // 2. GUEST NAME LOGIC
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to');
  if (guestName) {
    guestNameElem.textContent = guestName;
    guestContainer.hidden = false;
  }

  // 3. COVER PARTICLES
  let particleInterval;
  const createParticle = () => {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100 + 100}%`;
    const duration = Math.random() * 5 + 5;
    particle.style.animationDuration = `${duration}s`;
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    particlesContainer.appendChild(particle);
    setTimeout(() => particle.remove(), duration * 1000);
  };
  particleInterval = setInterval(createParticle, 300);

  // 4. OPEN INVITATION
  let audio = new Audio('https://www.bensound.com/royalty-free-music/track/acoustic-breeze');
  audio.loop = true;
  let isPlaying = false;

  btnOpen.addEventListener('click', () => {
    btnOpen.classList.add('clicked');
    setTimeout(() => {
      cover.classList.add('cover-opened');
      document.body.style.overflow = 'auto';
      dotNav.style.display = 'flex';
      clearInterval(particleInterval);
      audio.play().catch(() => {});
      isPlaying = true;
      musicToggle.classList.remove('muted');
      initCountdown();
      initScrollAnimations();
      initCopyButtons();
      initRSVP();
      initWishes();
      initDotNav();
      initGallery();
    }, 400);
  });

  // 5. MUSIC TOGGLE
  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      musicToggle.classList.add('muted');
    } else {
      audio.play();
      musicToggle.classList.remove('muted');
    }
    isPlaying = !isPlaying;
  });

  // 6. COUNTDOWN
  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    if (distance < 0) {
      ['days', 'hours', 'minutes', 'seconds'].forEach(unit => {
        document.getElementById(`countdown-${unit}`).textContent = '00';
      });
      return;
    }
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById('countdown-days').textContent = String(d).padStart(2, '0');
    document.getElementById('countdown-hours').textContent = String(h).padStart(2, '0');
    document.getElementById('countdown-minutes').textContent = String(m).padStart(2, '0');
    document.getElementById('countdown-seconds').textContent = String(s).padStart(2, '0');
  };

  const initCountdown = () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  };

  // 7. REVEAL ON SCROLL
  const initScrollAnimations = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealElements.forEach(el => el.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0');
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => observer.observe(el));
  };

  // 8. COPY REKENING
  const initCopyButtons = () => {
    document.querySelectorAll('.btn--copy').forEach(btn => {
      btn.addEventListener('click', async () => {
        const num = btn.dataset.number;
        if (!num) return;
        try {
          await navigator.clipboard.writeText(num);
          showToast('Nomor rekening berhasil disalin');
          const original = btn.innerHTML;
          btn.classList.add('copied');
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Tersalin!</span>`;
          setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = original; }, 2000);
        } catch {
          showToast('Nomor rekening berhasil disalin');
        }
      });
    });
  };

  // 9. RSVP FORM
  const initRSVP = () => {
    const form = document.getElementById('rsvp-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Mengirim...';
      setTimeout(() => {
        showToast('Konfirmasi kehadiran berhasil dikirim!', 'success');
        btn.disabled = false;
        btn.innerHTML = originalText;
        form.reset();
      }, 1500);
    });
  };

  // 10. UCAPAN FORM
  const initWishes = () => {
    const form = document.getElementById('ucapan-form');
    const list = document.getElementById('ucapan-list');
    if (!form || !list) return;

    const dummyWishes = [
      { name: 'Budi Santoso', message: 'Selamat menempuh hidup baru Rumadi & Dias! Semoga menjadi keluarga sakinah mawaddah warahmah.', city: 'Jakarta' },
      { name: 'Siti Aminah', message: 'Barakallah! Semoga lancar sampai hari H ya.', city: 'Solo' }
    ];
    dummyWishes.forEach(w => addWishToList(w, false));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Mengirim...';
      setTimeout(() => {
        const name = document.getElementById('ucapan-name').value;
        const message = document.getElementById('ucapan-message').value;
        const city = document.getElementById('ucapan-city').value;
        addWishToList({ name, message, city, timestamp: new Date().toISOString() }, true);
        showToast('Ucapan Anda telah terkirim!');
        btn.disabled = false;
        btn.innerHTML = originalText;
        form.reset();
      }, 1000);
    });
  };

  const addWishToList = (wish, prepend = false) => {
    const list = document.getElementById('ucapan-list');
    if (!list) return;
    const item = document.createElement('div');
    item.className = 'ucapan-item';
    item.innerHTML = `
      <h4 class="ucapan-item-name">${wish.name}</h4>
      ${wish.city ? `<p class="ucapan-item-city">${wish.city}</p>` : ''}
      <p class="ucapan-item-message">${wish.message}</p>
      <p class="ucapan-item-time">Baru saja</p>
    `;
    if (prepend) list.prepend(item);
    else list.appendChild(item);
  };

  // 11. LIGHTBOX
  const initGallery = () => {
    const items = document.querySelectorAll('.galeri-item');
    const lightbox = document.getElementById('lightbox');
    if (!items.length || !lightbox) return;
    items.forEach(item => {
      item.addEventListener('click', () => {
        lightbox.classList.add('open');
      });
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.closest('.lightbox-close')) {
        lightbox.classList.remove('open');
      }
    });
  };

  // 12. DOT NAV & SCROLL TOP
  const sections = document.querySelectorAll('section[id]:not(#cover)');
  const navLinks = document.querySelectorAll('.dot-nav a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) scrollTop.classList.add('visible');
    else scrollTop.classList.remove('visible');

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 150) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  });

  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 13. ADD TO CALENDAR
  document.querySelectorAll('.btn-add-calendar').forEach(btn => {
    btn.addEventListener('click', () => {
      const { title, date, time, location } = btn.dataset;
      const start = `${date.replace(/-/g, '')}T${time.replace(/:/g, '')}00`;
      const end = `${date.replace(/-/g, '')}T${(parseInt(time.split(':')[0]) + 2).toString().padStart(2, '0')}${time.split(':')[1]}00`;
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=Undangan+Pernikahan&location=${encodeURIComponent(location)}`;
      window.open(url, '_blank');
    });
  });

  // UTILS
  const showToast = (message, type = '') => {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  };
});
