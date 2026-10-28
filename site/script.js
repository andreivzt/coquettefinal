// WhatsApp Contact Configuration
const WA_PHONE_NUMBER = '40745079651';

// DOM Elements
const navbar = document.getElementById('navbar');
const mobileBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');
const cursorGlow = document.querySelector('.cursor-glow');

// Update copyright year
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Custom Cursor Glow effect (runs only on non-touch devices)
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;

        const target = e.target;
        if (target.tagName.toLowerCase() === 'a' ||
            target.tagName.toLowerCase() === 'button' ||
            target.closest('a') ||
            target.closest('button') ||
            target.closest('.flower-card') ||
            target.closest('.event-card')) {
            cursorGlow.style.opacity = '0.75';
            cursorGlow.style.background = 'radial-gradient(circle, rgba(240, 142, 165, 0.45) 0%, transparent 60%)';
            cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.15)';
        } else {
            cursorGlow.style.opacity = '1';
            cursorGlow.style.background = 'radial-gradient(circle, rgba(240, 142, 165, 0.25) 0%, transparent 70%)';
            cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorGlow.style.opacity = '1';
    });
} else if (cursorGlow) {
    cursorGlow.style.display = 'none';
}

// Intersection Observer for Scroll Animations
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.06,
        rootMargin: "0px 0px -30px 0px"
    });

    const elementsToAnimate = document.querySelectorAll('.fade-up, .fade-in, .fade-left, .fade-right');
    elementsToAnimate.forEach(el => observer.observe(el));
};

// Catalog Category Filtering
const initCatalogFilters = () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.flower-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.classList.add('animate');
                    }, 40);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
};

// Product & Event Lightbox Modal
const initProductModal = () => {
    const modal = document.getElementById('product-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalBadge = document.getElementById('modal-badge');
    const modalDesc = document.getElementById('modal-desc');
    const modalWaBtn = document.getElementById('modal-wa-btn');

    if (!modal) return;

    const openModal = (data) => {
        modalImg.src = data.img;
        modalImg.alt = data.title;
        modalTitle.textContent = data.title;
        modalBadge.textContent = data.badge || 'Florăria Coquette';
        modalDesc.textContent = data.desc;

        // Custom WhatsApp inquiry per item
        const messageText = `Bună ziua! Aș dori să comand sau să aflu disponibilitatea pentru "${data.title}" de pe site-ul Florăria Coquette.`;
        const waLink = `https://wa.me/${WA_PHONE_NUMBER}?text=${encodeURIComponent(messageText)}`;
        modalWaBtn.href = waLink;

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // prevent scroll
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Attach click listeners to all flower cards
    const flowerCards = document.querySelectorAll('.flower-card');
    flowerCards.forEach(card => {
        card.addEventListener('click', () => {
            openModal({
                img: card.getAttribute('data-img'),
                title: card.getAttribute('data-title'),
                desc: card.getAttribute('data-desc'),
                badge: card.getAttribute('data-badge') || 'Florăria Coquette'
            });
        });
    });

    // Attach click listeners to all event cards
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        card.addEventListener('click', () => {
            openModal({
                img: card.getAttribute('data-img'),
                title: card.getAttribute('data-title'),
                desc: card.getAttribute('data-desc'),
                badge: card.getAttribute('data-badge') || 'Organizare Evenimente'
            });
        });
    });
};

// Form submission - Redirect to WhatsApp
const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const typeEl = document.getElementById('product_type');
        const productType = typeEl ? typeEl.value : 'Comandă Florală';
        const message = document.getElementById('message').value.trim();

        // Format WhatsApp text
        const waText = `Bună ziua! Mă numesc ${name} (Tel: ${phone}).\nTip solicitare: ${productType}\n\nMesaj:\n${message}`;
        const waUrl = `https://wa.me/${WA_PHONE_NUMBER}?text=${encodeURIComponent(waText)}`;

        // Change button visual state temporarily
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.textContent = 'Se redirecționează...';
        btn.style.opacity = '0.75';

        // Open WhatsApp in a new tab
        window.open(waUrl, '_blank');

        // Reset form and button after a short delay
        setTimeout(() => {
            contactForm.reset();
            btn.innerHTML = originalText;
            btn.style.opacity = '1';
        }, 2500);
    });
};

// Initialize everything on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    observeElements();
    initCatalogFilters();
    initProductModal();
    initContactForm();
});
