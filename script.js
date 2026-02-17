(function() {
    'use strict';

    // ============================================
    // Particle Background Animation
    // ============================================
    class ParticleBackground {
        constructor() {
            this.canvas = document.getElementById('particles');
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.particleCount = 80;
            this.mouse = { x: null, y: null, radius: 150 };
            this.colors = ['#9e8857', '#c4a96a', '#ffffff'];

            this.init();
            this.animate();
            this.setupEventListeners();
        }

        init() {
            this.resize();
            this.createParticles();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        createParticles() {
            this.particles = [];
            for (let i = 0; i < this.particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    color: this.colors[Math.floor(Math.random() * this.colors.length)],
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        }

        drawParticles() {
            this.particles.forEach((particle, index) => {
                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color;
                this.ctx.globalAlpha = particle.opacity;
                this.ctx.fill();

                // Connect particles
                this.connectParticles(particle, index);
            });
            this.ctx.globalAlpha = 1;
        }

        connectParticles(particle, index) {
            for (let j = index + 1; j < this.particles.length; j++) {
                const particle2 = this.particles[j];
                const dx = particle.x - particle2.x;
                const dy = particle.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = particle.color;
                    this.ctx.globalAlpha = 0.1 * (1 - distance / 120);
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                }
            }
        }

        updateParticles() {
            this.particles.forEach(particle => {
                // Mouse interaction
                if (this.mouse.x !== null && this.mouse.y !== null) {
                    const dx = this.mouse.x - particle.x;
                    const dy = this.mouse.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < this.mouse.radius) {
                        const force = (this.mouse.radius - distance) / this.mouse.radius;
                        particle.x -= dx * force * 0.02;
                        particle.y -= dy * force * 0.02;
                    }
                }

                // Movement
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Boundary check
                if (particle.x < 0 || particle.x > this.canvas.width) {
                    particle.speedX *= -1;
                }
                if (particle.y < 0 || particle.y > this.canvas.height) {
                    particle.speedY *= -1;
                }

                // Keep particles in bounds
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            });
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawParticles();
            this.updateParticles();
            requestAnimationFrame(() => this.animate());
        }

        setupEventListeners() {
            window.addEventListener('resize', () => {
                this.resize();
                this.createParticles();
            });

            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });

            window.addEventListener('mouseout', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
        }
    }

    // ============================================
    // Navigation
    // ============================================
    class Navigation {
        constructor() {
            this.navbar = document.querySelector('.navbar');
            this.navToggle = document.getElementById('nav-toggle');
            this.navMenu = document.querySelector('.nav-menu');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.sections = document.querySelectorAll('section[id]');

            this.init();
        }

        init() {
            this.setupScrollEffect();
            this.setupMobileMenu();
            this.setupActiveLinks();
            this.setupSmoothScroll();
        }

        setupScrollEffect() {
            let lastScroll = 0;

            window.addEventListener('scroll', () => {
                const currentScroll = window.scrollY;

                // Add/remove scrolled class
                if (currentScroll > 50) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }

                lastScroll = currentScroll;
            });
        }

        setupMobileMenu() {
            if (!this.navToggle) return;

            this.navToggle.addEventListener('click', () => {
                this.navToggle.classList.toggle('active');
                this.navMenu.classList.toggle('active');
                document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Close menu when clicking a link
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.navToggle.classList.remove('active');
                    this.navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                    this.navToggle.classList.remove('active');
                    this.navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        setupActiveLinks() {
            const updateActiveLink = () => {
                const scrollPosition = window.scrollY + 200;

                this.sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');

                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        this.navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === '#' + sectionId) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            };

            window.addEventListener('scroll', updateActiveLink);
            updateActiveLink();
        }

        setupSmoothScroll() {
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const targetId = link.getAttribute('href');
                    if (targetId.startsWith('#')) {
                        e.preventDefault();
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            const headerOffset = 80;
                            const elementPosition = targetElement.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.scrollY - headerOffset;

                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                });
            });
        }
    }

    // ============================================
    // Scroll Reveal Animation - Converging Elements
    // ============================================
    class ScrollReveal {
        constructor() {
            this.init();
        }

        init() {
            // Setup Intersection Observer
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -100px 0px',
                threshold: 0.1
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        // Don't unobserve to allow re-animation if needed
                    }
                });
            }, observerOptions);

            // Apply reveal classes and observe elements
            this.setupRevealElements();
            this.setupTimeline();
            this.setupSkillCards();
            this.setupAboutSection();
            this.setupContactSection();
        }

        setupRevealElements() {
            // Section headers with blur reveal
            const sectionHeaders = document.querySelectorAll('.section-header');
            sectionHeaders.forEach(el => {
                el.classList.add('reveal-blur');
                this.observer.observe(el);
            });

            // Section titles with decorative border animation
            const sectionTitles = document.querySelectorAll('.section-title');
            sectionTitles.forEach(el => {
                const titleObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                entry.target.classList.add('active');
                            }, 300);
                        }
                    });
                }, { threshold: 0.5 });

                titleObserver.observe(el);
            });
        }

        setupTimeline() {
            // Old timeline support
            const timeline = document.querySelector('.timeline');
            const timelineItems = document.querySelectorAll('.timeline-item');

            if (timeline) {
                const timelineObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            timeline.classList.add('animate');
                        }
                    });
                }, { threshold: 0.1 });

                timelineObserver.observe(timeline);
            }

            timelineItems.forEach((item, index) => {
                item.style.animation = 'none';
                item.style.opacity = '0';
                item.style.transform = 'translateX(50px)';

                const itemObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                entry.target.classList.add('active');
                            }, index * 200);
                        }
                    });
                }, { threshold: 0.2 });

                itemObserver.observe(item);
            });

            // New experience timeline with center line and converging animation
            const expTimeline = document.querySelector('.exp-timeline');
            const expTimelineItems = document.querySelectorAll('.exp-timeline-item');

            if (expTimeline) {
                const expTimelineObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            expTimeline.classList.add('animate');
                        }
                    });
                }, { threshold: 0.1 });

                expTimelineObserver.observe(expTimeline);
            }

            // Observe each experience item for converging animation
            expTimelineItems.forEach((item, index) => {
                const itemObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                entry.target.classList.add('active');
                            }, index * 300); // Stagger by 300ms for smoother effect
                        }
                    });
                }, { threshold: 0.3 });

                itemObserver.observe(item);
            });
        }

        setupSkillCards() {
            const skillsSection = document.querySelector('.skills');
            const skillCards = document.querySelectorAll('.skill-card');

            // Observe skills section for the tree line animation
            if (skillsSection) {
                const skillsObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            skillsSection.classList.add('animate');
                        }
                    });
                }, { threshold: 0.1 });

                skillsObserver.observe(skillsSection);
            }

            skillCards.forEach((card, index) => {
                // Alternate between left and right reveals
                if (index % 2 === 0) {
                    card.classList.add('reveal-left');
                } else {
                    card.classList.add('reveal-right');
                }

                // Add staggered delay
                card.style.transitionDelay = `${index * 0.1}s`;

                this.observer.observe(card);
            });
        }

        setupAboutSection() {
            const aboutImage = document.querySelector('.about-image');
            const aboutText = document.querySelector('.about-text');

            if (aboutImage) {
                aboutImage.classList.add('reveal-left');
                this.observer.observe(aboutImage);
            }

            if (aboutText) {
                aboutText.classList.add('reveal-right');
                this.observer.observe(aboutText);
            }
        }

        setupContactSection() {
            const contactSection = document.querySelector('.contact');
            const contactContent = document.querySelector('.contact-content');

            // Observe contact section for the line animation
            if (contactSection) {
                const contactObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            contactSection.classList.add('animate');
                        }
                    });
                }, { threshold: 0.1 });

                contactObserver.observe(contactSection);
            }

            if (contactContent) {
                contactContent.classList.add('reveal-scale');
                this.observer.observe(contactContent);
            }
        }
    }

    // ============================================
    // Typed Text Effect - Type and Backspace
    // ============================================
    class TypedText {
        constructor(elementId, texts, options = {}) {
            this.element = document.getElementById(elementId);
            this.texts = texts;
            this.options = {
                typeSpeed: options.typeSpeed || 100,
                deleteSpeed: options.deleteSpeed || 60,
                delayBetween: options.delayBetween || 2500,
                startDelay: options.startDelay || 1500,
                loop: options.loop !== undefined ? options.loop : true
            };
            this.textIndex = 0;
            this.charIndex = 0;
            this.isDeleting = false;
            this.isPaused = false;

            if (this.element) {
                setTimeout(() => this.type(), this.options.startDelay);
            }
        }

        type() {
            const currentText = this.texts[this.textIndex];

            if (this.isDeleting) {
                // Backspace effect
                this.charIndex--;
                this.element.textContent = currentText.substring(0, this.charIndex);
            } else {
                // Typing effect
                this.charIndex++;
                this.element.textContent = currentText.substring(0, this.charIndex);
            }

            // Calculate speed with some natural variation
            let speed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;
            speed += Math.random() * 40 - 20; // Add slight randomness for natural feel

            // Finished typing current word
            if (!this.isDeleting && this.charIndex === currentText.length) {
                // Pause before deleting
                this.isPaused = true;
                setTimeout(() => {
                    this.isPaused = false;
                    this.isDeleting = true;
                    this.type();
                }, this.options.delayBetween);
                return;
            }

            // Finished deleting
            if (this.isDeleting && this.charIndex === 0) {
                this.isDeleting = false;
                this.textIndex = (this.textIndex + 1) % this.texts.length;
                // Small pause before typing next word
                setTimeout(() => this.type(), 500);
                return;
            }

            if (!this.isPaused) {
                setTimeout(() => this.type(), speed);
            }
        }
    }

    // ============================================
    // Counter Animation
    // ============================================
    class CounterAnimation {
        constructor() {
            this.counters = document.querySelectorAll('.stat-number');
            this.animated = false;
            this.init();
        }

        init() {
            window.addEventListener('scroll', () => this.checkCounters());
            this.checkCounters();
        }

        checkCounters() {
            if (this.animated) return;

            const heroStats = document.querySelector('.hero-stats');
            if (!heroStats) return;

            const rect = heroStats.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

            if (isVisible) {
                this.animated = true;
                this.animateCounters();
            }
        }

        animateCounters() {
            this.counters.forEach(counter => {
                const target = counter.textContent;
                const hasPlus = target.includes('+');
                const targetNumber = parseInt(target.replace(/\D/g, ''));
                let current = 0;
                const increment = targetNumber / 50;
                const duration = 2000;
                const stepTime = duration / 50;

                const updateCounter = () => {
                    current += increment;
                    if (current < targetNumber) {
                        counter.textContent = Math.floor(current) + (hasPlus ? '+' : '');
                        setTimeout(updateCounter, stepTime);
                    } else {
                        counter.textContent = target;
                    }
                };

                counter.textContent = '0' + (hasPlus ? '+' : '');
                updateCounter();
            });
        }
    }

    // ============================================
    // Tilt Effect for Cards
    // ============================================
    class TiltEffect {
        constructor() {
            this.cards = document.querySelectorAll('.skill-card, .timeline-content');
            this.init();
        }

        init() {
            this.cards.forEach(card => {
                card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
                card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
            });
        }

        handleMouseMove(e, card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        }

        handleMouseLeave(e, card) {
            card.style.transform = '';
        }
    }

    // ============================================
    // Cursor Effect
    // ============================================
    class CustomCursor {
        constructor() {
            this.cursor = null;
            this.cursorDot = null;
            this.init();
        }

        init() {
            // Only on desktop
            if (window.innerWidth < 1024) return;

            // Create cursor elements
            this.cursor = document.createElement('div');
            this.cursor.className = 'custom-cursor';
            this.cursorDot = document.createElement('div');
            this.cursorDot.className = 'custom-cursor-dot';

            document.body.appendChild(this.cursor);
            document.body.appendChild(this.cursorDot);

            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .custom-cursor {
                    position: fixed;
                    width: 40px;
                    height: 40px;
                    border: 2px solid rgba(158, 136, 87, 0.5);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    transition: transform 0.15s ease, border-color 0.3s ease;
                    transform: translate(-50%, -50%);
                }
                .custom-cursor-dot {
                    position: fixed;
                    width: 8px;
                    height: 8px;
                    background-color: #9e8857;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    transform: translate(-50%, -50%);
                }
                .custom-cursor.hover {
                    transform: translate(-50%, -50%) scale(1.5);
                    border-color: #9e8857;
                }
            `;
            document.head.appendChild(style);

            // Event listeners
            document.addEventListener('mousemove', (e) => {
                this.cursor.style.left = e.clientX + 'px';
                this.cursor.style.top = e.clientY + 'px';
                this.cursorDot.style.left = e.clientX + 'px';
                this.cursorDot.style.top = e.clientY + 'px';
            });

            // Hover effects
            const hoverElements = document.querySelectorAll('a, button, .btn, .skill-card, .timeline-content, .social-link');
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
                el.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
            });
        }
    }

    // ============================================
    // Parallax Effect
    // ============================================
    class ParallaxEffect {
        constructor() {
            this.hero = document.querySelector('.hero');
            this.init();
        }

        init() {
            if (!this.hero) return;

            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY;
                const rate = scrolled * 0.3;

                if (scrolled < window.innerHeight) {
                    this.hero.style.transform = `translateY(${rate}px)`;
                    this.hero.style.opacity = 1 - (scrolled / window.innerHeight);
                }
            });
        }
    }

    // ============================================
    // Initialize Everything
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize all components
        new ParticleBackground();
        new Navigation();
        new ScrollReveal();
        new CounterAnimation();
        new TiltEffect();
        new ParallaxEffect();

        // Initialize Typewriter effect
        new TypedText('typewriter', [
            'AI First SW Developer',
            'Tech Lead',
            'Full Stack Engineer',
            'React Specialist',
            'Problem Solver'
        ], {
            typeSpeed: 80,
            deleteSpeed: 50,
            delayBetween: 2000,
            startDelay: 1200
        });

        // Optional: Custom cursor (uncomment to enable)
        // new CustomCursor();

        // Add loading animation
        document.body.classList.add('loaded');

        // Console greeting
        console.log('%c Hi there! Thanks for checking out my portfolio.',
            'color: #9e8857; font-size: 14px; font-weight: bold;');
    });

    // Prevent flash of unstyled content
    window.addEventListener('load', function() {
        document.body.style.visibility = 'visible';
    });

})();
