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

    // 2. Active Link Underline Handling
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active class from all links
            links.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
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

    // 4. Contact Form Validation and Success Modal Handling
    const contactForm = document.getElementById('contact-enquiry-form');
    const successModal = document.getElementById('contact-success-modal');
    const successModalClose = document.getElementById('success-modal-close');

    if (contactForm) {
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const phoneInput = document.getElementById('contact-phone');
        const orgInput = document.getElementById('contact-org');
        const typeSelect = document.getElementById('contact-type');
        const messageInput = document.getElementById('contact-message');
        const submitBtn = document.getElementById('contact-submit-btn');

        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function validatePhone(phone) {
            return phone.trim().length >= 8;
        }

        function setFieldStatus(inputElement, isValid) {
            const group = inputElement ? inputElement.closest('.form-group') : null;
            if (!group) return;

            if (isValid) {
                group.classList.remove('has-error');
            } else {
                group.classList.add('has-error');
            }
        }

        // Real-time input error clearing
        [nameInput, emailInput, phoneInput, orgInput, typeSelect, messageInput].forEach(field => {
            if (field) {
                field.addEventListener('input', () => {
                    setFieldStatus(field, true);
                });
                field.addEventListener('change', () => {
                    setFieldStatus(field, true);
                });
            }
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let hasError = false;

            // Validate Name
            if (!nameInput.value.trim()) {
                setFieldStatus(nameInput, false);
                hasError = true;
            } else {
                setFieldStatus(nameInput, true);
            }

            // Validate Email
            if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
                setFieldStatus(emailInput, false);
                hasError = true;
            } else {
                setFieldStatus(emailInput, true);
            }

            // Validate Phone
            if (!phoneInput.value.trim() || !validatePhone(phoneInput.value)) {
                setFieldStatus(phoneInput, false);
                hasError = true;
            } else {
                setFieldStatus(phoneInput, true);
            }

            // Validate Org
            if (!orgInput.value.trim()) {
                setFieldStatus(orgInput, false);
                hasError = true;
            } else {
                setFieldStatus(orgInput, true);
            }

            // Validate Type
            if (!typeSelect.value) {
                setFieldStatus(typeSelect, false);
                hasError = true;
            } else {
                setFieldStatus(typeSelect, true);
            }

            // Validate Message
            if (!messageInput.value.trim()) {
                setFieldStatus(messageInput, false);
                hasError = true;
            } else {
                setFieldStatus(messageInput, true);
            }

            if (hasError) return;

            // Show loading state on button
            if (submitBtn) {
                const btnText = submitBtn.querySelector('.btn-text');
                const btnArrow = submitBtn.querySelector('.btn-arrow');
                const btnSpinner = submitBtn.querySelector('.btn-spinner');

                if (btnText) btnText.textContent = 'Sending...';
                if (btnArrow) btnArrow.style.display = 'none';
                if (btnSpinner) btnSpinner.style.display = 'inline-block';
                submitBtn.disabled = true;

                // Simulate asynchronous form submission
                setTimeout(() => {
                    // Populate success modal summary
                    const modalType = document.getElementById('modal-summary-type');
                    const modalOrg = document.getElementById('modal-summary-org');

                    if (modalType) modalType.textContent = typeSelect.value;
                    if (modalOrg) modalOrg.textContent = orgInput.value.trim();

                    // Open success modal
                    if (successModal) {
                        successModal.classList.add('active');
                        successModal.setAttribute('aria-hidden', 'false');
                        document.body.classList.add('modal-open');
                    }

                    // Reset form and button
                    contactForm.reset();
                    if (btnText) btnText.textContent = 'Submit Enquiry';
                    if (btnArrow) btnArrow.style.display = 'inline-block';
                    if (btnSpinner) btnSpinner.style.display = 'none';
                    submitBtn.disabled = false;
                }, 600);
            }
        });
    }

    if (successModalClose && successModal) {
        successModalClose.addEventListener('click', () => {
            successModal.classList.remove('active');
            successModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
        });

        successModal.addEventListener('click', (e) => {
            if (e.target === successModal || e.target.classList.contains('success-modal-backdrop')) {
                successModal.classList.remove('active');
                successModal.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('modal-open');
            }
        });
    }

    // 7. "Built. Tested. Taught." Project Carousel
    const projTrack = document.getElementById('projCarouselTrack');
    const projViewport = document.getElementById('projCarouselViewport');
    const projPrevBtn = document.getElementById('projCarouselPrev');
    const projNextBtn = document.getElementById('projCarouselNext');
    const projPagination = document.getElementById('projCarouselPagination');
    const projDots = projPagination ? projPagination.querySelectorAll('.pagination-dot') : [];
    const projCards = projTrack ? projTrack.querySelectorAll('.project-slide-card') : [];

    if (projTrack && projCards.length > 0) {
        let currentProjIndex = 0;
        let isPaused = false;
        let autoPlayTimer = null;
        let touchStartX = 0;
        let touchEndX = 0;

        function getVisibleCardsCount() {
            const width = window.innerWidth;
            if (width <= 600) return 1;
            if (width <= 1024) return 2;
            return 4;
        }

        function getMaxIndex() {
            const visible = getVisibleCardsCount();
            return Math.max(0, projCards.length - visible);
        }

        function updateCarousel(instant = false) {
            const maxIndex = getMaxIndex();
            if (currentProjIndex > maxIndex) {
                currentProjIndex = 0;
            }
            if (currentProjIndex < 0) {
                currentProjIndex = maxIndex;
            }

            const card = projCards[0];
            const gap = window.innerWidth <= 1024 ? 20 : 24;
            const cardWidth = card ? card.offsetWidth : 0;
            const offset = currentProjIndex * (cardWidth + gap);

            projTrack.style.transition = instant ? 'none' : 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)';
            projTrack.style.transform = `translateX(-${offset}px)`;

            // Update pagination dots
            projDots.forEach((dot, idx) => {
                if (idx > maxIndex) {
                    dot.style.display = 'none';
                } else {
                    dot.style.display = 'inline-block';
                }
                if (idx === currentProjIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function nextSlide() {
            const maxIndex = getMaxIndex();
            if (currentProjIndex >= maxIndex) {
                currentProjIndex = 0;
            } else {
                currentProjIndex++;
            }
            updateCarousel();
        }

        function prevSlide() {
            const maxIndex = getMaxIndex();
            if (currentProjIndex <= 0) {
                currentProjIndex = maxIndex;
            } else {
                currentProjIndex--;
            }
            updateCarousel();
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayTimer = setInterval(() => {
                if (!isPaused) {
                    nextSlide();
                }
            }, 3500);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }
        }

        // Arrow button listeners
        if (projNextBtn) {
            projNextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoPlay();
            });
        }

        if (projPrevBtn) {
            projPrevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoPlay();
            });
        }

        // Pagination dot listeners
        projDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetSlide = parseInt(dot.getAttribute('data-slide'), 10);
                const maxIndex = getMaxIndex();
                currentProjIndex = Math.min(targetSlide, maxIndex);
                updateCarousel();
                startAutoPlay();
            });
        });

        // Pause on mouse hover
        if (projViewport) {
            projViewport.addEventListener('mouseenter', () => {
                isPaused = true;
            });

            projViewport.addEventListener('mouseleave', () => {
                isPaused = false;
            });

            // Touch event listeners for mobile swipe
            projViewport.addEventListener('touchstart', (e) => {
                isPaused = true;
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            projViewport.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diffX = touchStartX - touchEndX;
                if (Math.abs(diffX) > 40) {
                    if (diffX > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
                setTimeout(() => { isPaused = false; }, 1000);
            }, { passive: true });
        }

        // Recalculate on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateCarousel(true);
            }, 100);
        });

        // Initial setup
        updateCarousel(true);
        startAutoPlay();
    }

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

    console.log('AI.LABS initialized successfully.');
});

