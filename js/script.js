// Main JavaScript for AI.LABS
document.addEventListener('DOMContentLoaded', () => {
    // 0. Sticky Navbar Scroll State
    const header = document.querySelector('.header');
    if (header) {
        const handleHeaderScroll = () => {
            if (window.scrollY > 15) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        };
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll();
    }

    // 1. Mobile Navigation Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const toggleIcon = navToggle ? navToggle.querySelector('i') : null;

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            
            // Toggle hamburger icon between bars and close X
            if (toggleIcon) {
                if (navLinks.classList.contains('active')) {
                    toggleIcon.className = 'fa-solid fa-xmark';
                } else {
                    toggleIcon.className = 'fa-solid fa-bars';
                }
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                if (toggleIcon) {
                    toggleIcon.className = 'fa-solid fa-bars';
                }
            }
        });
    }

    // 2. Active Link Underline Handling & Smooth Scrolling for Anchors
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Handle internal in-page hash links (e.g. #contact, #our-labs)
            if (href && href.startsWith('#') && href.length > 1) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    } else {
                        location.hash = href;
                    }
                }
            }

            // Remove active class from all links and add to clicked
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu after clicking a link
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (toggleIcon) {
                    toggleIcon.className = 'fa-solid fa-bars';
                }
            }
        });
    });

    // Handle hash scrolling on page load (e.g., if navigating from another page to index.html#contact)
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 150);
        }
    }

    // 3. Package Detail Popups & Modal Interaction
    const packageData = {
        basic: {
            badge: "QUOTATION — TIER 1",
            name: "Basic AI LAB",
            investment: "₹2,00,000",
            students: "8–10 working simultaneously",
            benefits: [
                "Full curriculum — 1 year",
                "Certified mentors training support",
                "21 Total Components",
                "All software is free",
                "Annual new projects",
                "Annual lab review"
            ],
            equipment: [
                { no: 1, item: "Robonari V1", qty: "1" },
                { no: 2, item: "Raspberry Pi Kit (2GB, Case, SD Card, Power Supply)", qty: "5" },
                { no: 3, item: "Basic Sensor Pack (Light, Temperature, Motion, Ultrasonic)", qty: "2 Sets" },
                { no: 4, item: "Breadboard + Jumper Wires + LED Component Kit", qty: "5 Sets" },
                { no: 5, item: "USB Webcam 720p", qty: "2" },
                { no: 6, item: "Component Storage Boxes", qty: "5" },
                { no: 7, item: "Lab Stationery, Posters & Printed Worksheets", qty: "—" },
                { no: 8, item: "Tablets", qty: "1" },
                { no: 9, item: "Curriculum and LMS", qty: "—" }
            ]
        },
        advanced: {
            badge: "QUOTATION — TIER 2",
            name: "Advanced AI LAB",
            investment: "₹4,00,000",
            students: "15–18 working simultaneously",
            benefits: [
                "Full curriculum — 1 year",
                "Certified mentors training support",
                "53 Total Components",
                "All software is free",
                "Annual new projects",
                "Annual lab review"
            ],
            equipment: [
                { no: 1, item: "Robonari V2", qty: "1" },
                { no: 2, item: "Arduino Uno Starter Kit (Sensors + Components)", qty: "10" },
                { no: 3, item: "Raspberry Pi Kit (4GB)", qty: "5" },
                { no: 4, item: "IoT Sensor Expansion Set (DHT11, PIR, Soil, Gas Sensors)", qty: "8" },
                { no: 5, item: "Full HD 1080p Webcam + Mic", qty: "4" },
                { no: 6, item: "3D Printer", qty: "1" },
                { no: 7, item: "3D Filament PLA (1kg Rolls)", qty: "10" },
                { no: 8, item: "Breadboard + Component Kits", qty: "10" },
                { no: 9, item: "Lab Branding, Signage & Stationery", qty: "—" },
                { no: 10, item: "Tablets", qty: "4" },
                { no: 11, item: "Curriculum and LMS", qty: "—" }
            ]
        },
        premium: {
            badge: "QUOTATION — TIER 3",
            name: "Premium AI LAB",
            investment: "₹9,00,000",
            students: "25–30 working simultaneously",
            benefits: [
                "Full curriculum — 1 year",
                "Certified mentors training support",
                "66 Total Components",
                "All software is free",
                "Annual new projects",
                "Annual lab review"
            ],
            equipment: [
                { no: 1, item: "Robonari", qty: "1" },
                { no: 2, item: "3D Printer", qty: "1" },
                { no: 3, item: "Arduino Advanced Kit (Sensors + Shields)", qty: "10" },
                { no: 4, item: "Raspberry Pi (4GB) Kit", qty: "10" },
                { no: 5, item: "Drone", qty: "3" },
                { no: 6, item: "Full HD Webcam + Mic (AI Vision Stations)", qty: "10" },
                { no: 7, item: "IoT Sensor Expansion Kit (Full Set)", qty: "6 Sets" },
                { no: 8, item: "Lab Branding, Showcase Wall & Safety Setup", qty: "—" },
                { no: 9, item: "Tablets", qty: "25" },
                { no: 10, item: "Curriculum and LMS", qty: "—" }
            ]
        }
    };

    const modal = document.getElementById('package-modal');
    const modalCloseBtn = modal ? modal.querySelector('.modal-close') : null;
    const viewDetailsButtons = document.querySelectorAll('.package-btn');

    function openModal(type) {
        const data = packageData[type];
        if (!data || !modal) return;

        // Populate summary panel
        const modalBadge = document.getElementById('modal-badge');
        const modalHeading = document.getElementById('modal-heading');
        const modalInvestment = document.getElementById('modal-investment');
        const modalStudents = document.getElementById('modal-students');
        
        if (modalBadge) modalBadge.textContent = data.badge;
        if (modalHeading) modalHeading.textContent = data.name;
        if (modalInvestment) modalInvestment.textContent = data.investment;
        if (modalStudents) modalStudents.textContent = data.students;

        // Populate benefits list
        const benefitsList = document.getElementById('modal-benefits-list');
        if (benefitsList) {
            benefitsList.innerHTML = '';
            data.benefits.forEach(benefit => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${benefit}</span>`;
                benefitsList.appendChild(li);
            });
        }

        // Populate table body
        const tableBody = document.getElementById('modal-table-body');
        if (tableBody) {
            tableBody.innerHTML = '';
            data.equipment.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="font-weight: 700;">${item.no}</td>
                    <td>${item.item}</td>
                    <td style="font-weight: 700;">${item.qty}</td>
                `;
                tableBody.appendChild(tr);
            });
        }

        // Show modal and disable background scrolling
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    // Attach click handlers to the View Details buttons
    viewDetailsButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const type = btn.getAttribute('data-package-type') || (index === 1 ? 'advanced' : index === 2 ? 'premium' : 'basic');
            openModal(type);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // Close when clicking outside of modal container
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ==========================================
    // 7. Interactive Project Carousels (Single Horizontal Row with Smooth Scroll, Auto-Play & Infinite Loop)
    // ==========================================
    function initProjectCarousel({
        trackId,
        viewportId,
        prevBtnId,
        nextBtnId,
        paginationId,
        cardSelector = '.build-card',
        interval = 3800
    }) {
        const track = document.getElementById(trackId);
        const viewport = document.getElementById(viewportId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const pagination = document.getElementById(paginationId);

        if (!track || !viewport) return;

        const cards = track.querySelectorAll(cardSelector);
        if (cards.length === 0) return;

        let currentIndex = 0;
        let isPaused = false;
        let isDragging = false;
        let startX = 0;
        let autoPlayTimer = null;

        function getVisibleCardsCount() {
            const width = window.innerWidth;
            if (width <= 580) return 1;
            if (width <= 768) return 2;
            if (width <= 1024) return 3;
            return 4;
        }

        function getMaxIndex() {
            const visible = getVisibleCardsCount();
            return Math.max(0, cards.length - visible);
        }

        function getGap() {
            const width = window.innerWidth;
            if (width <= 768) return 16;
            if (width <= 1024) return 20;
            return 24;
        }

        function updateDots() {
            if (!pagination) return;
            const dots = pagination.querySelectorAll('.pagination-dot');
            const maxIndex = getMaxIndex();
            dots.forEach((dot, idx) => {
                if (idx > maxIndex) {
                    dot.style.display = 'none';
                } else {
                    dot.style.display = 'inline-block';
                }
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function updateCarousel(instant = false) {
            const maxIndex = getMaxIndex();
            if (currentIndex > maxIndex) {
                currentIndex = 0;
            }
            if (currentIndex < 0) {
                currentIndex = maxIndex;
            }

            const card = cards[0];
            const cardWidth = card ? card.offsetWidth : 0;
            const gap = getGap();
            const offset = currentIndex * (cardWidth + gap);

            track.style.transition = instant ? 'none' : 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)';
            track.style.transform = `translateX(-${offset}px)`;

            updateDots();
        }

        function nextSlide() {
            const maxIndex = getMaxIndex();
            if (currentIndex >= maxIndex) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateCarousel();
        }

        function prevSlide() {
            const maxIndex = getMaxIndex();
            if (currentIndex <= 0) {
                currentIndex = maxIndex;
            } else {
                currentIndex--;
            }
            updateCarousel();
        }

        function startAutoPlay() {
            stopAutoPlay();
            if (interval <= 0) return;
            autoPlayTimer = setInterval(() => {
                if (!isPaused && !isDragging) {
                    nextSlide();
                }
            }, interval);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextSlide();
                startAutoPlay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevSlide();
                startAutoPlay();
            });
        }

        if (pagination) {
            const dots = pagination.querySelectorAll('.pagination-dot');
            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetSlide = parseInt(dot.getAttribute('data-slide'), 10);
                    const maxIndex = getMaxIndex();
                    currentIndex = Math.min(targetSlide, maxIndex);
                    updateCarousel();
                    startAutoPlay();
                });
            });
        }

        // Pause on mouse hover
        viewport.addEventListener('mouseenter', () => {
            isPaused = true;
        });

        viewport.addEventListener('mouseleave', () => {
            isPaused = false;
        });

        // Touch event listeners for mobile swipe
        viewport.addEventListener('touchstart', (e) => {
            isPaused = true;
            isDragging = true;
            startX = e.changedTouches[0].screenX;
        }, { passive: true });

        viewport.addEventListener('touchend', (e) => {
            isDragging = false;
            const endX = e.changedTouches[0].screenX;
            const diffX = startX - endX;
            if (Math.abs(diffX) > 40) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            setTimeout(() => { isPaused = false; }, 1200);
        }, { passive: true });

        // Mouse Drag Support
        viewport.addEventListener('mousedown', (e) => {
            isPaused = true;
            isDragging = true;
            startX = e.pageX;
        });

        window.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const endX = e.pageX;
            const diffX = startX - endX;
            if (Math.abs(diffX) > 40) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            setTimeout(() => { isPaused = false; }, 1200);
        });

        // Window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateCarousel(true);
            }, 100);
        });

        // Init
        updateCarousel(true);
        startAutoPlay();
    }

    // Initialize all project carousels across the site
    initProjectCarousel({
        trackId: 'buildCarouselTrack',
        viewportId: 'buildCarouselViewport',
        prevBtnId: 'buildCarouselPrev',
        nextBtnId: 'buildCarouselNext',
        paginationId: 'buildCarouselPagination',
        cardSelector: '.build-card',
        interval: 3800
    });

    initProjectCarousel({
        trackId: 'swCarouselTrack',
        viewportId: 'swCarouselViewport',
        prevBtnId: 'swCarouselPrev',
        nextBtnId: 'swCarouselNext',
        paginationId: 'swCarouselPagination',
        cardSelector: '.build-card',
        interval: 3800
    });

    initProjectCarousel({
        trackId: 'projCarouselTrack',
        viewportId: 'projCarouselViewport',
        prevBtnId: 'projCarouselPrev',
        nextBtnId: 'projCarouselNext',
        paginationId: 'projCarouselPagination',
        cardSelector: '.project-slide-card',
        interval: 3800
    });

    // ==========================================
    // 8. Trusted Institutions Seamless Marquee Auto-Scroll & Controls
    // ==========================================
    const instTrackWrap = document.getElementById('instTrackWrap');
    const instTrack = document.getElementById('instTrack');
    const instPrevBtn = document.getElementById('instPrevBtn');
    const instNextBtn = document.getElementById('instNextBtn');
    const instWrapper = document.querySelector('.institutions-slider-wrapper');

    if (instTrackWrap && instTrack) {
        let isPaused = false;
        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;
        let resumeTimeout = null;
        const speed = 0.65; // ~40px per second at 60fps - slow, smooth, premium
        let currentScroll = instTrackWrap.scrollLeft;

        // Auto-scroll loop using requestAnimationFrame
        function autoScroll() {
            if (!isPaused && !isDragging) {
                const maxScroll = instTrack.scrollWidth / 2;
                if (maxScroll > 0) {
                    currentScroll += speed;
                    if (currentScroll >= maxScroll) {
                        currentScroll -= maxScroll;
                    }
                    instTrackWrap.scrollLeft = currentScroll;
                }
            } else {
                currentScroll = instTrackWrap.scrollLeft;
            }
            requestAnimationFrame(autoScroll);
        }
        requestAnimationFrame(autoScroll);

        const pauseAndResume = (delay = 2000) => {
            isPaused = true;
            clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => {
                isPaused = false;
            }, delay);
        };

        // Hover pause on desktop
        if (instWrapper) {
            instWrapper.addEventListener('mouseenter', () => {
                isPaused = true;
                clearTimeout(resumeTimeout);
            });
            instWrapper.addEventListener('mouseleave', () => {
                if (!isDragging) {
                    isPaused = false;
                }
            });
        }

        // Navigation arrow buttons
        const getScrollStep = () => {
            const card = instTrackWrap.querySelector('.institution-logo-card, .trusted-logo-card');
            return card ? (card.offsetWidth + 20) * 2 : 420;
        };

        if (instPrevBtn) {
            instPrevBtn.addEventListener('click', () => {
                pauseAndResume(2000);
                const maxScroll = instTrack.scrollWidth / 2;
                let target = instTrackWrap.scrollLeft - getScrollStep();
                if (target < 0) {
                    instTrackWrap.scrollLeft += maxScroll;
                    target += maxScroll;
                }
                instTrackWrap.scrollTo({ left: target, behavior: 'smooth' });
                currentScroll = target;
            });
        }

        if (instNextBtn) {
            instNextBtn.addEventListener('click', () => {
                pauseAndResume(2000);
                const maxScroll = instTrack.scrollWidth / 2;
                let target = instTrackWrap.scrollLeft + getScrollStep();
                if (target >= maxScroll * 2) {
                    instTrackWrap.scrollLeft -= maxScroll;
                    target -= maxScroll;
                }
                instTrackWrap.scrollTo({ left: target, behavior: 'smooth' });
                currentScroll = target;
            });
        }

        // Mouse drag to scroll
        instTrackWrap.addEventListener('mousedown', (e) => {
            isDragging = true;
            isPaused = true;
            clearTimeout(resumeTimeout);
            startX = e.pageX - instTrackWrap.offsetLeft;
            startScrollLeft = instTrackWrap.scrollLeft;
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                pauseAndResume(2000);
            }
        });

        instTrackWrap.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - instTrackWrap.offsetLeft;
            const walk = (x - startX) * 1.3;
            const maxScroll = instTrack.scrollWidth / 2;
            let target = startScrollLeft - walk;
            if (target >= maxScroll) {
                target -= maxScroll;
                startX = x;
                startScrollLeft = target;
            } else if (target < 0) {
                target += maxScroll;
                startX = x;
                startScrollLeft = target;
            }
            instTrackWrap.scrollLeft = target;
            currentScroll = target;
        });

        // Touch swipe on mobile
        instTrackWrap.addEventListener('touchstart', () => {
            isPaused = true;
            clearTimeout(resumeTimeout);
        }, { passive: true });

        instTrackWrap.addEventListener('touchend', () => {
            pauseAndResume(2000);
        }, { passive: true });

        // Wheel / trackpad scroll
        instTrackWrap.addEventListener('wheel', () => {
            pauseAndResume(2000);
        }, { passive: true });
    }

    // 6. "What Happens When Students Get to Build?" Section Scroll Animations
    const buildSection = document.querySelector('.students-build-section');
    if (buildSection) {
        const buildHeader = buildSection.querySelector('.students-build-header');
        const buildCards = buildSection.querySelectorAll('.build-card');

        if ('IntersectionObserver' in window) {
            // Enable animation classes
            if (buildHeader) buildHeader.classList.add('build-animated');
            buildCards.forEach(card => card.classList.add('build-animated'));

            const buildObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (buildHeader) buildHeader.classList.add('in-view');
                        buildCards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('in-view');
                            }, 100 + (index * 110));
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            });

            buildObserver.observe(buildSection);
        }
    }

    // 7. Emotional Storytelling ("They should build it.") Real Scroll-Driven Interaction
    const storySection = document.querySelector('.story-build-section');
    const stageInitial = document.getElementById('storyStageInitial');
    const stageRevealed = document.getElementById('storyStageRevealed');
    const underlinePath = storySection ? storySection.querySelector('.story-underline-svg path') : null;

    if (storySection && stageInitial && stageRevealed) {
        let isTicking = false;

        const handleStoryScroll = () => {
            const rect = storySection.getBoundingClientRect();
            const totalScrollable = storySection.offsetHeight - window.innerHeight;

            if (totalScrollable <= 0) return;

            // Calculate progress through the section (0.0 when top hits top of viewport, 1.0 when bottom hits bottom)
            const rawProgress = -rect.top / totalScrollable;
            const progress = Math.max(0, Math.min(1, rawProgress));

            if (progress <= 0.18) {
                // Phase 1: Fully visible
                stageInitial.style.opacity = '1';
                stageInitial.style.transform = 'translateY(0px)';
                stageInitial.style.pointerEvents = 'auto';

                stageRevealed.style.opacity = '0';
                stageRevealed.style.transform = 'translateY(28px)';
                stageRevealed.style.pointerEvents = 'none';

                if (underlinePath) underlinePath.style.strokeDashoffset = '200';
            } else if (progress > 0.18 && progress < 0.68) {
                // Smooth transition window
                const t = (progress - 0.18) / 0.50; // 0 to 1
                const easeT = t * t * (3 - 2 * t); // smoothstep easing

                stageInitial.style.opacity = Math.max(0, 1 - easeT).toFixed(3);
                stageInitial.style.transform = `translateY(${(-easeT * 26).toFixed(1)}px)`;
                stageInitial.style.pointerEvents = easeT > 0.5 ? 'none' : 'auto';

                stageRevealed.style.opacity = Math.min(1, easeT).toFixed(3);
                stageRevealed.style.transform = `translateY(${((1 - easeT) * 28).toFixed(1)}px)`;
                stageRevealed.style.pointerEvents = easeT > 0.5 ? 'auto' : 'none';

                if (underlinePath) {
                    underlinePath.style.strokeDashoffset = `${(200 * (1 - easeT)).toFixed(1)}`;
                }
            } else {
                // Phase 2: Fully revealed
                stageInitial.style.opacity = '0';
                stageInitial.style.transform = 'translateY(-26px)';
                stageInitial.style.pointerEvents = 'none';

                stageRevealed.style.opacity = '1';
                stageRevealed.style.transform = 'translateY(0px)';
                stageRevealed.style.pointerEvents = 'auto';

                if (underlinePath) underlinePath.style.strokeDashoffset = '0';
            }

            isTicking = false;
        };

        window.addEventListener('scroll', () => {
            if (!isTicking) {
                requestAnimationFrame(handleStoryScroll);
                isTicking = true;
            }
        }, { passive: true });

        window.addEventListener('resize', () => {
            if (!isTicking) {
                requestAnimationFrame(handleStoryScroll);
                isTicking = true;
            }
        }, { passive: true });

        // Initial setup
        handleStoryScroll();
    }

    console.log('AI.LABS initialized successfully.');
});



