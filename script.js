// script.js

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       Mobile Navigation Toggle
       ========================================== */
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = menuBtn.querySelector('i');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
        } else {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        });
    });

    /* ==========================================
       Active Link Highlighting on Scroll
       ========================================== */
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Add offset to trigger slightly earlier
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current) && current !== '') {
                item.classList.add('active');
            }
        });
    });

    /* ==========================================
       Scroll Reveal Intersection Observer
       ========================================== */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add show class
                entry.target.classList.add('show');

                // Optional: Handle staggered delays for elements with inline style --delay
                if (entry.target.style.getPropertyValue('--delay')) {
                    const delay = entry.target.style.getPropertyValue('--delay');
                    entry.target.style.transitionDelay = `${delay * 0.2}s`;
                }

                // Optional: Unobserve after revealing to animate only once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    /* ==========================================
       Typing Effect
       ========================================== */
    const typedTextSpan = document.getElementById("typewriter");
    const cursorSpan = document.querySelector(".cursor");

    // Words to type out
    const textArray = ["Developer.", "Problem Solver.", "Tech Enthusiast.", "Designer."];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        }
        else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        }
        else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    // Start typing effect slightly after page load
    if (textArray.length) {
        setTimeout(type, newTextDelay + 250);
    }

    /* ==========================================
       Contact Form — Real Email via EmailJS
       Keys are loaded from config.js (env-style file, excluded from Git).
    */
    const EMAILJS_PUBLIC_KEY = EMAILJS_CONFIG.PUBLIC_KEY;
    const EMAILJS_SERVICE_ID = EMAILJS_CONFIG.SERVICE_ID;
    const EMAILJS_TEMPLATE_ID = EMAILJS_CONFIG.TEMPLATE_ID;

    // Initialise EmailJS (v4 API uses an options object)
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            const originalHTML = btn.innerHTML;

            // Loading state
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span> Sending...</span>';

            // Collect form data manually for reliability
            const templateParams = {
                from_name: document.getElementById('name').value,
                reply_to: document.getElementById('email').value,
                message: document.getElementById('message').value,
            };

            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i><span> Message Sent!</span>';
                    btn.style.background = '#1D976C';
                    contactForm.reset();
                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 3500);
                })
                .catch((error) => {
                    console.error('EmailJS error:', error);
                    btn.innerHTML = '<i class="fas fa-times"></i><span> Failed — try again</span>';
                    btn.style.background = '#c0392b';
                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 3500);
                });
        });
    }
});
