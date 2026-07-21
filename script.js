/* =========================================
   LUXESTAY HOTEL — MAIN SCRIPT
   ========================================= */

'use strict';

/* =========================================
   1. LOADER
   ========================================= */
window.addEventListener('load', () => {
  document.body.classList.add('loading');
  const loader = document.getElementById('loader');

  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
    // Kick off entrance animations after load
    initAOS();
    animateCounters();
  }, 2000);
});

/* =========================================
   2. NAVBAR — scroll effect + active link
   ========================================= */
const navbar  = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  // Sticky style
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back-to-top button
  const btn = document.getElementById('backToTop');
  if (window.scrollY > 400) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }

  // Active nav link highlight
  highlightActiveNav();
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = navLinks.querySelector(`a[href="#${id}"]`);
    if (!link) return;

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.querySelectorAll('a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

/* =========================================
   3. SMOOTH SCROLL FOR ALL ANCHOR LINKS
   ========================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =========================================
   4. HERO SLIDER
   ========================================= */
let heroSlideIndex = 0;
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDotsContainer = document.getElementById('heroSliderDots');

// Create dots
heroSlides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = `hero-dot ${i === 0 ? 'active' : ''}`;
  dot.addEventListener('click', () => goToHeroSlide(i));
  heroDotsContainer.appendChild(dot);
});

function showHeroSlide(index) {
  const heroDots = heroDotsContainer.querySelectorAll('.hero-dot');
  heroSlides.forEach(slide => slide.classList.remove('active'));
  heroDots.forEach(dot => dot.classList.remove('active'));
  
  heroSlideIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides[heroSlideIndex].classList.add('active');
  heroDots[heroSlideIndex].classList.add('active');
}

function goToHeroSlide(index) {
  showHeroSlide(index);
}

// Auto-advance every 6 seconds
setInterval(() => {
  showHeroSlide(heroSlideIndex + 1);
}, 6000);

/* =========================================
   5. COUNTER ANIMATION (Stats in Hero)
   ========================================= */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const speed = 200; // lower = faster

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const increment = target / speed;
    let count = 0;

    const updateCounter = () => {
      count += increment;
      if (count < target) {
        counter.textContent = Math.ceil(count);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    updateCounter();
  });
}

/* =========================================
   6. QUICK BOOKING BAR
   ========================================= */
function quickBooking() {
  const checkin = document.getElementById('qbCheckin').value;
  const checkout = document.getElementById('qbCheckout').value;
  const guests = document.getElementById('qbGuests').value;
  const room = document.getElementById('qbRoom').value;

  if (!checkin || !checkout) {
    showToast('Please select check-in and check-out dates');
    return;
  }

  // Validate dates
  if (new Date(checkin) >= new Date(checkout)) {
    showToast('Check-out date must be after check-in date');
    return;
  }

  showToast('✓ Rooms available! Scroll down to complete booking.');
  // Smooth scroll to booking section
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Pre-fill booking form
  setTimeout(() => {
    document.getElementById('checkinDate').value = checkin;
    document.getElementById('checkoutDate').value = checkout;
  }, 800);
}

/* =========================================
   7. ROOMS FILTER
   ========================================= */
const filterButtons = document.querySelectorAll('.filter-btn');
const roomCards = document.querySelectorAll('.room-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    // Filter rooms
    roomCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn 0.5s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* =========================================
   8. GALLERY LIGHTBOX
   ========================================= */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
let currentGalleryIndex = 0;
const galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));

function openLightbox(element) {
  const img = element.querySelector('img');
  lbImg.src = img.src;
  lightbox.classList.add('open');
  currentGalleryIndex = galleryItems.indexOf(img);
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lbPrev() {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
  lbImg.src = galleryItems[currentGalleryIndex].src;
}

function lbNext() {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
  lbImg.src = galleryItems[currentGalleryIndex].src;
}

// Close on escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) {
    closeLightbox();
  }
  if (lightbox.classList.contains('open')) {
    if (e.key === 'ArrowLeft') lbPrev();
    if (e.key === 'ArrowRight') lbNext();
  }
});

// Close on click outside
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* =========================================
   9. BOOKING FORM
   ========================================= */
// Set minimum date to today
function setMinDates() {
  const today = new Date().toISOString().split('T')[0];
  const checkinField  = document.getElementById('checkinDate');
  const checkoutField = document.getElementById('checkoutDate');
  const qbCheckin     = document.getElementById('qbCheckin');
  const qbCheckout    = document.getElementById('qbCheckout');

  if (checkinField)  checkinField.min  = today;
  if (checkoutField) checkoutField.min = today;
  if (qbCheckin)     qbCheckin.min     = today;
  if (qbCheckout)    qbCheckout.min    = today;

  // When check-in changes, update check-out minimum
  checkinField && checkinField.addEventListener('change', () => {
    const next = new Date(checkinField.value);
    next.setDate(next.getDate() + 1);
    checkoutField.min = next.toISOString().split('T')[0];
    if (checkoutField.value && checkoutField.value <= checkinField.value) {
      checkoutField.value = next.toISOString().split('T')[0];
    }
  });

  qbCheckin && qbCheckin.addEventListener('change', () => {
    const next = new Date(qbCheckin.value);
    next.setDate(next.getDate() + 1);
    qbCheckout.min = next.toISOString().split('T')[0];
    if (qbCheckout.value && qbCheckout.value <= qbCheckin.value) {
      qbCheckout.value = next.toISOString().split('T')[0];
    }
  });
}
setMinDates();

function submitBooking(e) {
  e.preventDefault();

  const btn = e.target.querySelector('[type="submit"]');
  const original = btn.innerHTML;

  // Loading state
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Reservation Confirmed!';
    btn.style.background = 'linear-gradient(135deg, #27ae60, #1e8449)';
    
    showToast('🎉 Your reservation has been confirmed! Check your email.');

    // Reset after 3 seconds
    setTimeout(() => {
      e.target.reset();
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 3500);
  }, 1800);
}

/* =========================================
   10. TESTIMONIALS SLIDER
   ========================================= */
let testimonialIndex = 0;
const testimonialsTrack = document.getElementById('testimonialsTrack');
const totalCards = testimonialsTrack ? testimonialsTrack.children.length : 0;
let testimonialsPerView = getTestimonialsPerView();

function getTestimonialsPerView() {
  return window.innerWidth <= 768 ? 1 : 2;
}

function slideTestimonials(direction) {
  testimonialsPerView = getTestimonialsPerView();
  const maxIndex = totalCards - testimonialsPerView;
  testimonialIndex = Math.max(0, Math.min(testimonialIndex + direction, maxIndex));
  
  const cardWidth = testimonialsTrack.children[0].offsetWidth + 28; // gap = 28px
  testimonialsTrack.style.transform = `translateX(-${testimonialIndex * cardWidth}px)`;
}

// Auto-slide testimonials every 5 seconds
setInterval(() => {
  if (!testimonialsTrack) return;
  testimonialsPerView = getTestimonialsPerView();
  const maxIndex = totalCards - testimonialsPerView;
  if (testimonialIndex >= maxIndex) {
    testimonialIndex = 0;
    testimonialsTrack.style.transform = 'translateX(0)';
  } else {
    slideTestimonials(1);
  }
}, 5000);

window.addEventListener('resize', () => {
  testimonialsPerView = getTestimonialsPerView();
  testimonialIndex = 0;
  if (testimonialsTrack) testimonialsTrack.style.transform = 'translateX(0)';
});

/* =========================================
   11. CONTACT FORM
   ========================================= */
function submitContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('[type="submit"]');
  const original = btn.innerHTML;

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #27ae60, #1e8449)';
    showToast('✉ Your message has been sent! We\'ll respond within 24 hours.');

    setTimeout(() => {
      e.target.reset();
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1500);
}

/* =========================================
   12. NEWSLETTER SUBSCRIBE
   ========================================= */
function subscribeNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  if (!input.value) return;
  showToast('✓ You\'ve subscribed to our exclusive newsletter!');
  input.value = '';
}

/* =========================================
   13. TOAST NOTIFICATION
   ========================================= */
let toastTimeout;

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* =========================================
   14. BACK TO TOP
   ========================================= */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =========================================
   15. AOS — ANIMATE ON SCROLL (custom impl)
   ========================================= */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');

  // Intersection Observer for smooth scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-aos-delay') || 0;

        setTimeout(() => {
          el.classList.add('aos-animate');
        }, parseInt(delay));

        observer.unobserve(el); // animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* =========================================
   16. PARALLAX EFFECT on Experience Banner
   ========================================= */
window.addEventListener('scroll', () => {
  const banner = document.querySelector('.experience-banner');
  if (!banner) return;
  const rect = banner.getBoundingClientRect();
  const inView = rect.top < window.innerHeight && rect.bottom > 0;
  if (inView) {
    const offset = rect.top * 0.35;
    banner.style.backgroundPositionY = `calc(50% + ${offset}px)`;
  }
});

/* =========================================
   17. ROOM CARD — Price Night Calculator
        (shown in tooltip on hover)
   ========================================= */
document.querySelectorAll('.room-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const priceEl = card.querySelector('.room-price span');
    if (!priceEl) return;
    const price = parseInt(priceEl.textContent);
    const nights = 3; // default 3 nights for preview
    const total = price * nights;

    if (!card.querySelector('.price-tooltip')) {
      const tooltip = document.createElement('div');
      tooltip.className = 'price-tooltip';
      tooltip.textContent = `From $${total} for ${nights} nights`;
      tooltip.style.cssText = `
        position: absolute;
        bottom: 10px; right: 10px;
        background: rgba(0,0,0,0.85);
        color: #e8c97a;
        font-size: 0.75rem;
        padding: 5px 10px;
        border-radius: 50px;
        font-weight: 600;
        pointer-events: none;
        z-index: 5;
        animation: fadeIn 0.3s ease;
      `;
      card.querySelector('.room-img-wrap').style.position = 'relative';
      card.querySelector('.room-img-wrap').appendChild(tooltip);
    }
  });

  card.addEventListener('mouseleave', () => {
    const tooltip = card.querySelector('.price-tooltip');
    if (tooltip) tooltip.remove();
  });
});

/* =========================================
   18. TYPED TEXT EFFECT (hero tagline loop)
   ========================================= */
const taglines = [
  'Welcome to LuxeStay',
  'Your Luxury Retreat Awaits',
  'Unforgettable Experiences',
  'World-Class Hospitality'
];
let taglineIndex = 0;
let charIndex = 0;
let isDeleting = false;
const taglineEl = document.querySelector('.hero-tagline');

function typeTagline() {
  if (!taglineEl) return;

  const current = taglines[taglineIndex];

  if (isDeleting) {
    taglineEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    taglineEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 110;

  if (!isDeleting && charIndex === current.length) {
    delay = 2200; // pause at full word
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    taglineIndex = (taglineIndex + 1) % taglines.length;
    delay = 400;
  }

  setTimeout(typeTagline, delay);
}

// Start typing after loader
setTimeout(typeTagline, 2400);

/* =========================================
   19. STICKY QUICK-BOOK BAR visibility
       (only visible on desktop when hero passes)
   ========================================= */
const quickBook = document.querySelector('.quick-book');

window.addEventListener('scroll', () => {
  if (!quickBook) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const heroBottom = hero.offsetTop + hero.offsetHeight;
  if (window.scrollY > heroBottom - 80) {
    quickBook.style.boxShadow = '0 4px 32px rgba(0,0,0,0.18)';
  } else {
    quickBook.style.boxShadow = '0 8px 40px rgba(0,0,0,0.12)';
  }
});

/* =========================================
   20. TOUCH / SWIPE SUPPORT FOR SLIDERS
   ========================================= */
function addSwipeSupport(element, onLeft, onRight) {
  if (!element) return;
  let startX = 0;

  element.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
  }, { passive: true });

  element.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].screenX - startX;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) onLeft();
    else onRight();
  }, { passive: true });
}

// Hero slider swipe
addSwipeSupport(
  document.querySelector('.hero'),
  () => showHeroSlide(heroSlideIndex + 1),
  () => showHeroSlide(heroSlideIndex - 1)
);

// Testimonials swipe
addSwipeSupport(
  testimonialsTrack,
  () => slideTestimonials(1),
  () => slideTestimonials(-1)
);

/* =========================================
   21. ANIMATE AMENITY ICONS on hover (extra flair)
   ========================================= */
document.querySelectorAll('.amenity-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const icon = card.querySelector('.amenity-icon');
    icon.style.transform = 'rotateY(360deg) scale(1.1)';
  });
  card.addEventListener('mouseleave', () => {
    const icon = card.querySelector('.amenity-icon');
    icon.style.transform = '';
  });
});

/* =========================================
   22. NUMBER FORMAT helper & price display
   ========================================= */
function formatPrice(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/* =========================================
   23. INIT — run all setup on DOM ready
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Apply staggered delay to grid items that don't have explicit delay
  document.querySelectorAll('.amenities-grid .amenity-card:not([data-aos-delay])').forEach((card, i) => {
    if (!card.hasAttribute('data-aos-delay')) return;
    card.style.transitionDelay = `${i * 80}ms`;
  });

  // Preload hero images for smoother transitions
  [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80'
  ].forEach(src => { const img = new Image(); img.src = src; });

  console.log('%c🏨 LuxeStay Hotel — Loaded', 'color:#c9a84c;font-size:16px;font-weight:bold;');
});
