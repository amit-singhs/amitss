(function() {
    'use strict';

    // Scroll reveal for sections
    function initScrollReveal() {
        var revealElements = document.querySelectorAll('.section-content, .experience-item, .skill-category');

        revealElements.forEach(function(el) {
            el.classList.add('reveal');
        });

        function checkReveal() {
            var windowHeight = window.innerHeight;
            var revealPoint = 150;

            revealElements.forEach(function(el) {
                var elementTop = el.getBoundingClientRect().top;

                if (elementTop < windowHeight - revealPoint) {
                    el.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', checkReveal);
        checkReveal();
    }

    // Smooth scroll for navigation links
    function initSmoothScroll() {
        var navLinks = document.querySelectorAll('a[href^="#"]');

        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Navigation background on scroll
    function initNavScroll() {
        var nav = document.querySelector('.nav');
        var scrollThreshold = 100;

        function updateNav() {
            if (window.scrollY > scrollThreshold) {
                nav.style.background = 'rgba(10, 10, 10, 0.95)';
                nav.style.backdropFilter = 'blur(10px)';
            } else {
                nav.style.background = 'linear-gradient(to bottom, #0a0a0a 0%, transparent 100%)';
                nav.style.backdropFilter = 'none';
            }
        }

        window.addEventListener('scroll', updateNav);
        updateNav();
    }

    // Stagger animation for skill categories
    function initStaggerAnimation() {
        var skillCategories = document.querySelectorAll('.skill-category');

        skillCategories.forEach(function(category, index) {
            category.style.transitionDelay = (index * 0.1) + 's';
        });

        var experienceItems = document.querySelectorAll('.experience-item');

        experienceItems.forEach(function(item, index) {
            item.style.transitionDelay = (index * 0.15) + 's';
        });
    }

    // Parallax effect for hero decoration
    function initParallax() {
        var yearBadge = document.querySelector('.year-badge');
        if (!yearBadge) return;

        window.addEventListener('scroll', function() {
            var scrolled = window.scrollY;
            var rate = scrolled * 0.3;
            yearBadge.style.transform = 'translateY(' + rate + 'px)';
        });
    }

    // Active navigation link based on scroll position
    function initActiveNavigation() {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-links a');

        function updateActiveLink() {
            var scrollPosition = window.scrollY + 200;

            sections.forEach(function(section) {
                var sectionTop = section.offsetTop;
                var sectionHeight = section.offsetHeight;
                var sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();
    }

    // Typed effect for tagline (subtle)
    function initTypedEffect() {
        var tagline = document.querySelector('.hero-tagline p');
        if (!tagline) return;

        var text = tagline.textContent;
        tagline.textContent = '';
        tagline.style.opacity = '1';

        var charIndex = 0;
        var typingDelay = 50;

        function typeChar() {
            if (charIndex < text.length) {
                tagline.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, typingDelay);
            }
        }

        setTimeout(typeChar, 1200);
    }

    // Initialize all features when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initScrollReveal();
        initSmoothScroll();
        initNavScroll();
        initStaggerAnimation();
        initParallax();
        initActiveNavigation();
    });

})();
