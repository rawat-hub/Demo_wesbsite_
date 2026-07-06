/* ============================================
   VELURA — Premium Clothing Brand
   Interactive Scripts with GSAP
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       LOADING SCREEN
       ========================================== */
    const loader = document.getElementById('loader');

    function hideLoader() {
        loader.classList.add('hidden');
        // Ensure all animated elements are visible (fallback if GSAP failed)
        document.querySelectorAll('[data-anim]').forEach(el => {
            if (getComputedStyle(el).opacity === '0') {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
        });
        // Fallback: if GSAP never loaded, remove has-js so content stays visible
        document.documentElement.classList.remove('has-js');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }

    // Hide loader after assets are ready (or fallback to timeout)
    window.addEventListener('load', () => {
        setTimeout(hideLoader, 600);
    });

    // Fallback: hide loader after 3 seconds max and show content regardless
    setTimeout(hideLoader, 3000);


    /* ==========================================
       RANDOM STATS — Randomize hero counter values
       on every page load (MUST run before GSAP init)
       ========================================== */
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const suffix = stat.nextElementSibling ? stat.nextElementSibling.textContent : '';
        let randomTarget = 0;

        if (suffix.includes('K+')) {
            if (stat.closest('.stat') && stat.closest('.stat').querySelector('.stat-label')?.textContent.includes('Orders')) {
                randomTarget = Math.floor(Math.random() * 400) + 100; // 100-500K
            } else {
                randomTarget = Math.floor(Math.random() * 60) + 25; // 25-85K
            }
        } else if (suffix.includes('%')) {
            randomTarget = Math.floor(Math.random() * 6) + 94; // 94-99%
        } else if (suffix.includes('+')) {
            if (stat.closest('.stat') && stat.closest('.stat').querySelector('.stat-label')?.textContent.includes('Years')) {
                randomTarget = Math.floor(Math.random() * 11) + 10; // 10-20
            } else {
                randomTarget = Math.floor(Math.random() * 201) + 150; // 150-350
            }
        }

        stat.dataset.count = randomTarget;
    });

    /* ==========================================
       DEMO BANNER DISMISS
       ========================================== */
    const demoBanner = document.getElementById('demoBanner');
    const demoBannerClose = document.getElementById('demoBannerClose');

    if (demoBannerClose && demoBanner) {
        // Set initial navbar position based on banner visibility
        const setNavTop = (isMobile) => {
            document.getElementById('navbar').style.top = isMobile ? '48px' : '52px';
        };
        setNavTop(window.innerWidth <= 768);

        // Adjust on resize
        window.addEventListener('resize', () => {
            if (!demoBanner.classList.contains('hidden-banner')) {
                setNavTop(window.innerWidth <= 768);
            }
        });

        demoBannerClose.addEventListener('click', () => {
            demoBanner.classList.add('hidden-banner');
            localStorage.setItem('velura-demo-banner-dismissed', 'true');
            document.getElementById('navbar').style.top = '0';
        });

        // Auto-dismiss after 8 seconds if not interacted
        setTimeout(() => {
            if (!demoBanner.classList.contains('hidden-banner')) {
                demoBanner.classList.add('hidden-banner');
                document.getElementById('navbar').style.top = '0';
            }
        }, 8000);
    }

    /* ==========================================
       HERO PARTICLES
       ========================================== */
    const particlesContainer = document.getElementById('heroParticles');

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particlesContainer.appendChild(particle);

        // Remove particle after animation completes to avoid DOM bloat
        // Max animation time: duration (10-25s) + delay (0-10s) = up to 35s
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 40000);
    }

    // Create initial burst of particles
    for (let i = 0; i < 30; i++) {
        setTimeout(createParticle, i * 200);
    }

    // Continue creating particles periodically
    setInterval(createParticle, 2000);


    /* ==========================================
       NAVBAR SCROLL EFFECT
       ========================================== */
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // Add/remove scrolled class
        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (currentScroll > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        lastScroll = currentScroll;
    }, { passive: true });


    /* ==========================================
       MOBILE HAMBURGER MENU
       ========================================== */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('open') &&
            !navLinks.contains(e.target) &&
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        }
    });


    /* ==========================================
       BACK TO TOP
       ========================================== */
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    /* ==========================================
       SMOOTH SCROLL FOR NAV LINKS
       ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    /* ==========================================
       ACTIVE NAV LINK ON SCROLL
       ========================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinkItems = navLinks.querySelectorAll('a');

    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                current = section.getAttribute('id');
            }
        });

        navLinkItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });


    /* ==========================================
       GSAP ANIMATIONS
       ========================================== */
    // Wait for GSAP to load
    function initGSAP() {
        if (typeof gsap === 'undefined') {
            setTimeout(initGSAP, 200);
            return;
        }

        // Register ScrollTrigger plugin
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // ---- Hero Section Entrance ----
        const heroTl = gsap.timeline({ delay: 0.8 });

        heroTl
            .from('.hero-subtitle', {
                y: 40,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            })
            .from('.text-line', {
                y: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            }, '-=0.5')
            .from('.hero-desc', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.5')
            .from('.hero-buttons .btn', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'back.out(1.7)'
            }, '-=0.4')
            .from('.hero-stats .stat', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out'
            }, '-=0.3');

        // ---- Hero Background Parallax ----
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.to('.hero-bg', {
                y: '15%',
                scale: 1.1,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });

            // Hero content parallax fade
            gsap.to('.hero-content', {
                y: 80,
                opacity: 0.3,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });

            // Scroll indicator fade on scroll
            gsap.to('.scroll-indicator', {
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#hero',
                    start: 'top -20%',
                    end: 'top -60%',
                    scrub: 1
                }
            });
        }

        // ---- Section Scroll Animations ----
        const animElements = document.querySelectorAll('[data-anim]');

        animElements.forEach(el => {
            const animType = el.dataset.anim;
            let vars = {
                opacity: 0,
                ease: 'power3.out',
                duration: 1
            };

            switch (animType) {
                case 'fade-up':
                    vars.y = 50;
                    break;
                case 'fade-down':
                    vars.y = -50;
                    break;
                case 'fade-left':
                    vars.x = -80;
                    break;
                case 'fade-right':
                    vars.x = 80;
                    break;
                default:
                    vars.y = 50;
            }

            if (typeof ScrollTrigger !== 'undefined') {
                gsap.from(el, {
                    ...vars,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                });
            } else {
                // Fallback: simple IntersectionObserver
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            gsap.to(el, { opacity: 1, y: 0, x: 0, duration: 1, ease: 'power3.out' });
                            observer.unobserve(el);
                        }
                    });
                }, { threshold: 0.15 });
                observer.observe(el);
            }
        });

        // ---- Counter Animation ----
        const statNumbers = document.querySelectorAll('.stat-number');

        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.count) || 0;

            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.create({
                    trigger: stat,
                    start: 'top 85%',
                    onEnter: () => animateCounter(stat, target)
                });
            } else {
                // Fallback with IntersectionObserver
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            animateCounter(stat, target);
                            observer.unobserve(stat);
                        }
                    });
                }, { threshold: 0.5 });
                observer.observe(stat);
            }
        });

        function animateCounter(element, target) {
            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);
                element.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    element.textContent = target;
                }
            }

            requestAnimationFrame(update);
        }

        // ---- Collection Cards Stagger ----
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.from('.collection-card', {
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.collections-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });

            // Product cards stagger
            gsap.from('.product-card', {
                y: 50,
                opacity: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.products-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });

        }

        // ---- About Image Reveal ----
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.from('.about-image img', {
                scale: 0.95,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.about-image',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });

            // About badge entrance
            gsap.from('.about-image-badge', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: 0.3,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: '.about-image',
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        // ---- Quality Cards Stagger ----
        if (typeof ScrollTrigger !== 'undefined') {
            const qualitySection = document.querySelector('.quality-grid');
            if (qualitySection) {
                gsap.from('.quality-card', {
                    y: 40,
                    opacity: 0,
                    duration: 0.7,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.quality-grid',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                });
            }
        }
    }

    // Initialize GSAP animations
    initGSAP();


    /* ==========================================
       PRODUCT CARD 3D TILT EFFECT
       ========================================== */
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;

            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });


    /* ==========================================
       COLLECTION CARD TILT
       ========================================== */
    const collectionCards = document.querySelectorAll('.collection-card');

    collectionCards.forEach(card => {
        const img = card.querySelector('.collection-img img');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });


    /* ==========================================
       PRODUCT BADGES — Randomly assign Best Seller / Most Bought
       & populate fabric material from data-material attribute
       ========================================== */
    const productCardsForBadges = document.querySelectorAll('.product-card');

    productCardsForBadges.forEach(card => {
        // Populate material text
        const materialEl = card.querySelector('.product-material');
        const materialData = card.dataset.material;
        if (materialEl && materialData) {
            materialEl.textContent = materialData;
        }

        // Randomly assign badge types at page load
        const badge = card.querySelector('.product-badge');
        if (badge) {
            const types = [
                { className: 'badge-bestseller', label: 'Best Seller' },
                { className: 'badge-mostbought', label: 'Most Bought' },
                { className: 'badge-bestseller', label: "Editor's Pick" },
                { className: 'badge-mostbought', label: 'Trending Now' },
                { className: 'badge-bestseller', label: 'Top Rated' }
            ];
            const pick = types[Math.floor(Math.random() * types.length)];
            badge.className = 'product-badge ' + pick.className;
            badge.textContent = pick.label;
        }
    });

    /* ==========================================
       WISHLIST BUTTON TOGGLE
       ========================================== */
    const wishlistButtons = document.querySelectorAll('.product-btn .fa-heart, .product-btn .far.fa-heart');

    wishlistButtons.forEach(heart => {
        heart.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('far');
            this.classList.toggle('fas');
            this.style.color = this.classList.contains('fas') ? '#e74c3c' : '';
        });
    });


    /* ==========================================
       PARALLAX ON SCROLL (Non-GSAP fallback)
       Only applies to the about image to avoid CSS hover conflicts
       ========================================== */
    function parallaxElements() {
        const parallaxItems = document.querySelectorAll('.about-image img');

        parallaxItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const speed = 0.04;

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = (rect.top - window.innerHeight / 2) * speed;
                item.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    window.addEventListener('scroll', parallaxElements, { passive: true });


    /* ==========================================
       INTERSECTION OBSERVER FOR FADE-IN FALLBACK
       ========================================== */
    // IntersectionObserver fallback — only when GSAP is unavailable
    // If GSAP is loaded, it handles all animation; no need for a competing observer
    if (typeof gsap === 'undefined') {
        const observerFallback = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'none';
                    observerFallback.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('[data-anim]').forEach(el => {
            if (getComputedStyle(el).opacity === '0') {
                observerFallback.observe(el);
            }
        });
    }


    /* ==========================================
       SMOOTH APPEAR FOR COLLECTION OVERLAYS
       ON NON-HOVER DEVICES (Touch)
       ========================================== */
    if ('ontouchstart' in window) {
        document.querySelectorAll('.collection-card').forEach(card => {
            card.addEventListener('click', function() {
                const overlay = this.querySelector('.collection-overlay');
                overlay.style.opacity = overlay.style.opacity === '1' ? '0' : '1';
            });
        });
    }


    /* ==========================================
       CART DRAWER — SHOPPING BAG FUNCTIONALITY
       ========================================== */
    const cart = {
        items: [],

        addItem(product) {
            const existing = this.items.find(item => item.id === product.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                this.items.push({ ...product, quantity: 1 });
            }
            this.updateUI();
        },

        removeItem(productId) {
            this.items = this.items.filter(item => item.id !== productId);
            this.updateUI();
        },

        getTotal() {
            return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },

        getCount() {
            return this.items.reduce((sum, item) => sum + item.quantity, 0);
        },

        updateUI() {
            const cartCount = document.querySelector('.cart-count');
            const cartHeaderCount = document.getElementById('cartHeaderCount');
            const cartItems = document.getElementById('cartItems');
            const cartFooter = document.getElementById('cartFooter');
            const cartTotal = document.getElementById('cartTotal');

            const count = this.getCount();
            if (cartCount) cartCount.textContent = count;
            if (cartHeaderCount) cartHeaderCount.textContent = `(${count})`;

            if (count === 0) {
                cartItems.innerHTML = `
                    <div class="cart-empty">
                        <i class="fas fa-shopping-bag"></i>
                        <p>Your bag is empty</p>
                        <span>Explore our collection and add items you love.</span>
                    </div>
                `;
                if (cartFooter) cartFooter.style.display = 'none';
            } else {
                let html = '';
                this.items.forEach(item => {
                    html += `
                        <div class="cart-item" data-id="${item.id}">
                            <div class="cart-item-img">
                                <img src="${item.image}" alt="${item.name}" loading="lazy">
                            </div>
                            <div class="cart-item-info">
                                <h4 class="cart-item-name">${item.name}</h4>
                                <span class="cart-item-category">${item.category}</span>
                                <div class="cart-item-bottom">
                                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                                    <div class="cart-item-qty">
                                        <button class="cart-qty-btn cart-qty-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                                        <span class="cart-qty-value">${item.quantity}</span>
                                        <button class="cart-qty-btn cart-qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
                                    </div>
                                </div>
                            </div>
                            <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove item"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    `;
                });
                cartItems.innerHTML = html;

                // Add remove event listeners
                cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.dataset.id;
                        this.removeItem(id);
                    });
                });

                // Add quantity +/- listeners
                cartItems.querySelectorAll('.cart-qty-minus').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.dataset.id;
                        const item = this.items.find(i => i.id === id);
                        if (item && item.quantity > 1) {
                            item.quantity -= 1;
                            this.updateUI();
                        } else if (item && item.quantity === 1) {
                            this.removeItem(id);
                        }
                    });
                });

                cartItems.querySelectorAll('.cart-qty-plus').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.dataset.id;
                        const item = this.items.find(i => i.id === id);
                        if (item) {
                            item.quantity += 1;
                            this.updateUI();
                        }
                    });
                });

                if (cartFooter) cartFooter.style.display = 'block';
                if (cartTotal) cartTotal.textContent = `$${this.getTotal().toFixed(2)}`;
            }
        },

        toggle() {
            const drawer = document.getElementById('cartDrawer');
            const overlay = document.getElementById('cartOverlay');
            const isOpen = drawer.classList.contains('open');

            if (isOpen) {
                drawer.classList.remove('open');
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            } else {
                drawer.classList.add('open');
                overlay.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        },

        init() {
            // Cart icon toggle
            const cartIcon = document.querySelector('.nav-icon[aria-label="Cart"]');
            if (cartIcon) {
                cartIcon.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggle();
                });
            }

            // Close button
            const closeBtn = document.getElementById('cartClose');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.toggle());
            }

            // Overlay click to close
            const overlay = document.getElementById('cartOverlay');
            if (overlay) {
                overlay.addEventListener('click', () => this.toggle());
            }

            // Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const drawer = document.getElementById('cartDrawer');
                    if (drawer.classList.contains('open')) {
                        this.toggle();
                    }
                }
            });

            // Initial empty state
            this.updateUI();
        }
    };

    // Connect Quick Add buttons to cart
    const addToCartButtons = document.querySelectorAll('.product-add');
    addToCartButtons.forEach(button => {
        const card = button.closest('.product-card');
        const img = card.querySelector('.product-img img');
        const name = card.querySelector('.product-name');
        const category = card.querySelector('.product-category');
        const price = card.querySelector('.product-price');
        const id = name ? name.textContent.trim().toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substr(2, 9);

        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const originalText = this.innerHTML;

            cart.addItem({
                id: id,
                name: name ? name.textContent.trim() : 'Product',
                category: category ? category.textContent.trim() : '',
                price: parseFloat(price ? price.textContent.replace('$', '') : '0'),
                image: img ? img.getAttribute('src') : ''
            });

            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.background = '#4caf50';

            // Animate cart icon
            const cartIconEl = document.querySelector('.nav-icon .fa-shopping-bag');
            if (cartIconEl) {
                cartIconEl.parentElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    cartIconEl.parentElement.style.transform = '';
                }, 300);
            }

            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '';
            }, 2000);
        });
    });

    // Initialize cart
    cart.init();

    /* ==========================================
       CHECKOUT MODAL
       ========================================== */
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutOverlay = document.getElementById('checkoutOverlay');
    const checkoutClose = document.getElementById('checkoutClose');
    const checkoutNext = document.getElementById('checkoutNext');
    const checkoutBack = document.getElementById('checkoutBack');
    const checkoutBody = document.getElementById('checkoutBody');
    const checkoutFooter = document.getElementById('checkoutFooter');
    const checkoutFooterTotal = document.getElementById('checkoutFooterTotal');
    let currentStep = 1;

    function openCheckout() {
        currentStep = 1;
        showStep(1);
        checkoutModal.classList.add('open');
        checkoutOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        document.getElementById('cartDrawer').classList.remove('open');
        document.getElementById('cartOverlay').classList.remove('open');
        updateFooterTotal();
    }

    function closeCheckout() {
        checkoutModal.classList.remove('open');
        checkoutOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    function showStep(step) {
        // Hide all panels
        document.querySelectorAll('.checkout-panel').forEach(p => p.classList.remove('active'));
        // Update step indicators
        document.querySelectorAll('.checkout-step').forEach((s, i) => {
            s.classList.toggle('active', i + 1 <= step);
            s.classList.toggle('completed', i + 1 < step);
        });

        if (step === 1) {
            document.getElementById('checkoutStep1').classList.add('active');
            checkoutBack.style.display = 'none';
            checkoutNext.innerHTML = 'Continue <i class="fas fa-arrow-right"></i>';
        } else if (step === 2) {
            document.getElementById('checkoutStep2').classList.add('active');
            checkoutBack.style.display = 'flex';
            checkoutNext.innerHTML = 'Continue <i class="fas fa-arrow-right"></i>';
        } else if (step === 3) {
            document.getElementById('checkoutStep3').classList.add('active');
            checkoutBack.style.display = 'flex';
            checkoutNext.innerHTML = 'Place Order <i class="fas fa-lock"></i>';
            populateReview();
        } else if (step === 4) {
            // Success
            document.querySelectorAll('.checkout-panel').forEach(p => p.classList.remove('active'));
            document.getElementById('checkoutSuccess').classList.add('active');
            checkoutBack.style.display = 'none';
            checkoutNext.style.display = 'none';
            checkoutFooterTotal.style.display = 'none';
            // Update order number
            const orderNum = document.querySelector('.checkout-success-details span:first-child');
            if (orderNum) {
                orderNum.innerHTML = `<strong>Order #:</strong> VEL-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
            }
        }

        currentStep = step;
        updateFooterTotal();
    }

    function updateFooterTotal() {
        if (checkoutFooterTotal) {
            checkoutFooterTotal.textContent = `Total: $${cart.getTotal().toFixed(2)}`;
            checkoutFooterTotal.style.display = 'block';
        }
    }

    function populateReview() {
        const shippingData = new FormData(document.getElementById('shippingForm'));
        const paymentData = new FormData(document.getElementById('paymentForm'));

        document.getElementById('reviewShipping').textContent =
            `${shippingData.get('firstName') || '—'} ${shippingData.get('lastName') || ''}, ${shippingData.get('address') || '—'}, ${shippingData.get('city') || ''}, ${shippingData.get('zip') || ''}`;

        const cardNum = (paymentData.get('cardNumber') || '****').toString();
        const masked = cardNum.replace(/\d(?=\d{4})/g, '*');
        document.getElementById('reviewPayment').textContent =
            `${paymentData.get('cardName') || '—'} | ${masked}`;

        // Items
        const reviewItems = document.getElementById('reviewItems');
        let html = '';
        cart.items.forEach(item => {
            html += `<div class="review-item">
                <span>${item.name} <small>x${item.quantity}</small></span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>`;
        });
        reviewItems.innerHTML = html;

        document.getElementById('reviewTotal').textContent = `$${cart.getTotal().toFixed(2)}`;
    }

    // Checkout button in cart
    const checkoutBtn = document.querySelector('.cart-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openCheckout);
    }

    // Close checkout
    if (checkoutClose) {
        checkoutClose.addEventListener('click', closeCheckout);
    }
    if (checkoutOverlay) {
        checkoutOverlay.addEventListener('click', closeCheckout);
    }

    // Next step
    if (checkoutNext) {
        checkoutNext.addEventListener('click', () => {
            if (currentStep === 1) {
                // Validate shipping form
                const form = document.getElementById('shippingForm');
                if (form.checkValidity()) {
                    showStep(2);
                } else {
                    form.reportValidity();
                }
            } else if (currentStep === 2) {
                // Validate payment form
                const form = document.getElementById('paymentForm');
                if (form.checkValidity()) {
                    showStep(3);
                } else {
                    form.reportValidity();
                }
            } else if (currentStep === 3) {
                // Place order - show success
                showStep(4);
                // Clear cart
                cart.items = [];
                cart.updateUI();
                // Scroll to top of modal
                checkoutBody.scrollTop = 0;
            }
        });
    }

    // Back step
    if (checkoutBack) {
        checkoutBack.addEventListener('click', () => {
            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    }

    // Continue shopping after success
    const continueShop = document.getElementById('checkoutContinueShop');
    if (continueShop) {
        continueShop.addEventListener('click', closeCheckout);
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && checkoutModal.classList.contains('open')) {
            closeCheckout();
        }
    });

    /* ==========================================
       SEARCH FUNCTIONALITY
       ========================================== */
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchEmpty = document.getElementById('searchEmpty');
    const searchClear = document.getElementById('searchClear');
    const searchClose = document.getElementById('searchClose');
    const searchTrigger = document.querySelector('.search-trigger');

    let searchData = [];
    let selectedIndex = -1;
    let searchItems = [];

    function buildSearchIndex() {
        searchData = [];

        // Index products
        document.querySelectorAll('.product-card').forEach(card => {
            const name = card.querySelector('.product-name')?.textContent?.trim();
            const category = card.querySelector('.product-category')?.textContent?.trim();
            const price = card.querySelector('.product-price')?.textContent?.trim();
            const material = card.dataset?.material;
            const desc = card.querySelector('.product-info p')?.textContent?.trim() || category;

            if (name) {
                searchData.push({
                    type: 'product',
                    typeLabel: 'Products',
                    name: name,
                    description: `${category} — ${price}`,
                    keywords: [name, category, material, price].filter(Boolean).join(' ').toLowerCase(),
                    sectionId: 'products'
                });
            }
        });

        // Index collections
        document.querySelectorAll('.collection-card').forEach(card => {
            const name = card.querySelector('.collection-info h3')?.textContent?.trim();
            const desc = card.querySelector('.collection-info p')?.textContent?.trim();
            const tag = card.querySelector('.collection-img-tag')?.textContent?.trim();

            if (name) {
                searchData.push({
                    type: 'collection',
                    typeLabel: 'Collections',
                    name: name,
                    description: desc || '',
                    keywords: [name, desc, tag].filter(Boolean).join(' ').toLowerCase(),
                    sectionId: 'collections'
                });
            }
        });

        // Index quality cards
        document.querySelectorAll('.quality-card').forEach(card => {
            const name = card.querySelector('.quality-card-content h3')?.textContent?.trim();
            const desc = card.querySelector('.quality-card-content p')?.textContent?.trim();

            if (name) {
                searchData.push({
                    type: 'quality',
                    typeLabel: 'Why VELURA',
                    name: name,
                    description: desc || '',
                    keywords: [name, desc].filter(Boolean).join(' ').toLowerCase(),
                    sectionId: 'quality'
                });
            }
        });

        // Index sections
        const sections = [
            { id: 'hero', name: 'Home', desc: 'New Season Collection — Define Your Style' },
            { id: 'collections', name: 'Collections', desc: 'Browse our curated collections' },
            { id: 'products', name: 'New Arrivals', desc: 'Latest additions to our collection' },
            { id: 'about', name: 'About VELURA', desc: 'Our story and brand values' },
            { id: 'quality', name: 'Why VELURA', desc: 'Crafted for excellence' },
            { id: 'contact', name: 'Contact', desc: 'Get in touch with us' }
        ];
        sections.forEach(s => {
            searchData.push({
                type: 'section',
                typeLabel: 'Pages',
                name: s.name,
                description: s.desc,
                keywords: s.name.toLowerCase() + ' ' + s.desc.toLowerCase(),
                sectionId: s.id
            });
        });
    }

    function performSearch(query) {
        const trimmed = query.trim().toLowerCase();
        searchResults.innerHTML = '';
        selectedIndex = -1;
        searchItems = [];

        if (!trimmed) {
            searchResults.appendChild(searchEmpty);
            searchClear.classList.remove('visible');
            return;
        }

        searchClear.classList.add('visible');

        // Filter and score results
        const scored = searchData.map(item => {
            let score = 0;
            const nameLower = item.name.toLowerCase();
            const kwLower = item.keywords;

            // Exact name match = highest
            if (nameLower === trimmed) score += 100;
            // Name starts with query
            else if (nameLower.startsWith(trimmed)) score += 80;
            // Name contains query
            else if (nameLower.includes(trimmed)) score += 60;
            // Keywords contain query
            else if (kwLower.includes(trimmed)) score += 30;

            // Bonus for individual word matches
            const words = trimmed.split(/\s+/);
            words.forEach(word => {
                if (nameLower.includes(word)) score += 15;
                else if (kwLower.includes(word)) score += 8;
            });

            return { ...item, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

        if (scored.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search-minus"></i>
                    <p>No results found for "${query.trim()}"</p>
                    <small>Try searching for a product, collection, or topic</small>
                </div>
            `;
            return;
        }

        // Group results by type
        const groups = {};
        scored.forEach(item => {
            if (!groups[item.typeLabel]) groups[item.typeLabel] = [];
            groups[item.typeLabel].push(item);
        });

        let html = '';
        const order = ['Products', 'Collections', 'Why VELURA', 'Pages'];
        order.forEach(groupName => {
            const items = groups[groupName];
            if (!items) return;

            html += `<div class="search-result-group">`;
            html += `<div class="search-result-group-title">${groupName}</div>`;

            items.forEach((item, i) => {
                const iconMap = {
                    'product': 'fa-tshirt',
                    'collection': 'fa-layer-group',
                    'quality': 'fa-star',
                    'section': 'fa-file'
                };
                const icon = iconMap[item.type] || 'fa-circle';
                const globalIdx = searchItems.length;
                searchItems.push(item);

                const nameHtml = item.name.replace(
                    new RegExp(`(${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
                    '<em>$1</em>'
                );

                html += `
                    <div class="search-result-item" data-index="${globalIdx}" data-section="${item.sectionId}">
                        <div class="search-result-icon"><i class="fas ${icon}"></i></div>
                        <div class="search-result-info">
                            <div class="search-result-name">${nameHtml}</div>
                            <div class="search-result-desc">${item.description}</div>
                        </div>
                        <span class="search-result-action">Jump to <i class="fas fa-arrow-right"></i></span>
                    </div>
                `;
            });

            html += `</div>`;
        });

        searchResults.innerHTML = html;

        // Add click handlers
        searchResults.querySelectorAll('.search-result-item').forEach(el => {
            el.addEventListener('click', () => {
                const sectionId = el.dataset.section;
                navigateToSection(sectionId);
            });
        });
    }

    function navigateToSection(sectionId) {
        closeSearch();
        const target = document.getElementById(sectionId);
        if (target) {
            const offset = navbar.offsetHeight + (demoBanner?.classList.contains('hidden-banner') ? 0 : 50);
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    }

    function openSearch() {
        // Don't open search if cart or checkout is open
        if (document.getElementById('cartDrawer')?.classList.contains('open')) return;
        if (document.getElementById('checkoutModal')?.classList.contains('open')) return;

        searchOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        buildSearchIndex();
        setTimeout(() => {
            searchInput.focus();
        }, 100);
    }

    function closeSearch() {
        searchOverlay.classList.remove('open');
        document.body.style.overflow = '';
        searchInput.value = '';
        searchResults.innerHTML = '';
        searchResults.appendChild(searchEmpty);
        searchClear.classList.remove('visible');
        selectedIndex = -1;
        searchItems = [];
    }

    function navigateResults(direction) {
        if (searchItems.length === 0) return;

        // Remove previous highlight
        document.querySelectorAll('.search-result-item.highlighted').forEach(el => {
            el.classList.remove('highlighted');
        });

        selectedIndex += direction;
        if (selectedIndex < 0) selectedIndex = searchItems.length - 1;
        if (selectedIndex >= searchItems.length) selectedIndex = 0;

        const item = document.querySelector(`.search-result-item[data-index="${selectedIndex}"]`);
        if (item) {
            item.classList.add('highlighted');
            item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    // Search trigger click
    if (searchTrigger) {
        searchTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openSearch();
        });
    }

    // Keyboard shortcut: Ctrl+K or Cmd+K
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchOverlay.classList.contains('open')) {
                closeSearch();
            } else {
                openSearch();
            }
        }
    });

    // Close search on overlay click (outside modal)
    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                closeSearch();
            }
        });
    }

    // Close button
    if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
    }

    // Clear button
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            performSearch('');
        });
    }

    // Input handler with debounce
    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(searchInput.value);
            }, 150);
        });

        // Keyboard navigation within search
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearch();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                navigateResults(1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                navigateResults(-1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < searchItems.length) {
                    const item = searchItems[selectedIndex];
                    navigateToSection(item.sectionId);
                } else if (searchItems.length > 0) {
                    navigateToSection(searchItems[0].sectionId);
                }
            }
        });
    }

    // Close on Escape globally
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('open')) {
            closeSearch();
        }
    });

    /* ==========================================
       CONSOLE BRANDING
       ========================================== */
    console.log('%c VELURA ', 'background: #c9a96e; color: #000; font-size: 20px; font-weight: bold; padding: 8px 16px; border-radius: 4px;');
    console.log('%c Premium Clothing — Demo Showcase', 'color: #c9a96e; font-size: 14px; font-style: italic;');
    console.log('%c Ctrl+K to search', 'color: #666; font-size: 12px;');

}); // End DOMContentLoaded
