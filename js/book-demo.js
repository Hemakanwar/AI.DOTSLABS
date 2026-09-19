document.addEventListener('DOMContentLoaded', function() {
    // State variables
    let currentStep = 1; // 1: Start, 2: Q1, 3: Q2, 4: Q3, 5: Form, 5.5: Submitting, 6: Success
    let isTransitioning = false;
    
    const selections = {
        category: '',
        target: '',
        scale: ''
    };

    const stagePusher = document.getElementById('stage-pusher-robot');
    const mainBadge = document.getElementById('demo-main-badge');
    const btnStart = document.getElementById('btn-start');
    const detailsForm = document.getElementById('details-form');
    
    const screens = {
        1: document.getElementById('screen-start'),
        2: document.getElementById('screen-q1'),
        3: document.getElementById('screen-q2'),
        4: document.getElementById('screen-q3'),
        5: document.getElementById('screen-details'),
        5.5: document.getElementById('screen-submitting'),
        6: document.getElementById('screen-success')
    };

    // Summary nodes (Sidebar)
    const selCategoryVal = document.getElementById('sel-category');
    const selTargetVal = document.getElementById('sel-target');
    const selScaleVal = document.getElementById('sel-scale');

    // Summary nodes (Mobile)
    const mSelCategoryVal = document.getElementById('mobile-sel-category');
    const mSelTargetVal = document.getElementById('mobile-sel-target');
    const mSelScaleVal = document.getElementById('mobile-sel-scale');
    const mobileSelCount = document.getElementById('mobile-selection-count');

    // Update main header badge text
    function updateStepBadge(text) {
        if (mainBadge) {
            mainBadge.style.opacity = '0';
            setTimeout(() => {
                mainBadge.textContent = text;
                mainBadge.style.transition = 'opacity 0.3s ease';
                mainBadge.style.opacity = '1';
            }, 150);
        }
    }

    /**
     * Unified Cinematic Robot PUSH Transition
     * Layers next question behind, sends robot from right to left,
     * physically pushing the ENTIRE question panel off-screen left.
     */
    function robotPushTransition(currentScreen, nextScreen, callback) {
        if (!currentScreen || !nextScreen || isTransitioning) {
            if (callback) callback();
            return;
        }

        // Accessibility: prefers-reduced-motion fallback
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            currentScreen.classList.remove('active');
            nextScreen.classList.add('active');
            if (callback) callback();
            return;
        }

        isTransitioning = true;

        // 1. Position next question panel BEHIND current question from the start
        nextScreen.classList.add('is-next-behind');
        currentScreen.classList.add('is-current-push');

        // Force browser layout reflow
        void nextScreen.offsetWidth;

        // 2. Setup Stage Pusher Robot Actor
        if (stagePusher) {
            stagePusher.className = 'stage-pusher-robot';
            void stagePusher.offsetWidth;

            // Phase 1: Robot enters from right and walks toward the card edge (~650ms)
            stagePusher.classList.add('actor-entering', 'pose-reach');
        }

        // Phase 2: Robot reaches card edge, touches hands, and pushes the entire panel LEFT (~1150ms)
        setTimeout(() => {
            if (stagePusher) {
                stagePusher.classList.remove('actor-entering', 'pose-reach');
                stagePusher.classList.add('actor-pushing', 'pose-push-act');
            }

            // Entire current question panel smoothly slides off-screen left with tilt & fade
            currentScreen.classList.add('pushed-left');

            // Next question panel reveals from behind into main position
            nextScreen.classList.add('revealing');
        }, 650);

        // Phase 3: Transition finishes, settle next screen and reset states (~1850ms)
        setTimeout(() => {
            // Cleanup current screen
            currentScreen.classList.remove('active', 'is-current-push', 'pushed-left');
            
            // Next screen becomes main active screen
            nextScreen.classList.remove('is-next-behind', 'revealing');
            nextScreen.classList.add('active');

            // Reset stage pusher robot
            if (stagePusher) {
                stagePusher.className = 'stage-pusher-robot';
            }

            // Re-enable interactions
            isTransitioning = false;

            if (callback) callback();
        }, 1850);
    }

    // Flying badge transition from option card to sidebar summary
    function triggerFlyingBadge(cardElement, step, selectedText) {
        const cardRect = cardElement.getBoundingClientRect();
        
        let targetNode, targetIcon;
        if (step === 1) {
            targetNode = selCategoryVal;
            targetIcon = document.querySelector('.selections-panel .selection-item[data-step="1"] i');
        } else if (step === 2) {
            targetNode = selTargetVal;
            targetIcon = document.querySelector('.selections-panel .selection-item[data-step="2"] i');
        } else if (step === 3) {
            targetNode = selScaleVal;
            targetIcon = document.querySelector('.selections-panel .selection-item[data-step="3"] i');
        }
        
        if (!targetNode) return;
        
        const targetRect = targetNode.parentElement.getBoundingClientRect();
        
        // Create flying clone badge
        const flyer = document.createElement('div');
        flyer.className = 'flying-selection-badge';
        flyer.textContent = selectedText;
        
        flyer.style.position = 'fixed';
        flyer.style.left = `${cardRect.left}px`;
        flyer.style.top = `${cardRect.top}px`;
        flyer.style.width = `${cardRect.width}px`;
        flyer.style.height = `${cardRect.height}px`;
        
        document.body.appendChild(flyer);
        
        // Animate flying badge toward sidebar
        requestAnimationFrame(() => {
            setTimeout(() => {
                flyer.style.left = `${targetRect.left}px`;
                flyer.style.top = `${targetRect.top}px`;
                flyer.style.width = `${targetRect.width}px`;
                flyer.style.height = '40px';
                flyer.style.transform = 'scale(0.85)';
                flyer.style.opacity = '0.7';
            }, 40);
        });
        
        // Update sidebar permanently after flying badge settles
        setTimeout(() => {
            flyer.remove();
            
            targetNode.classList.remove('empty');
            targetNode.textContent = selectedText;
            targetNode.style.animation = 'scalePulse 0.3s ease';
            
            const selectedIconClass = cardElement.querySelector('.option-icon i').className;
            if (targetIcon) {
                targetIcon.className = selectedIconClass;
            }
            
            // Populate mobile summary
            let mobileNode, mobileIcon;
            if (step === 1) {
                mobileNode = mSelCategoryVal;
                mobileIcon = document.querySelector('.selections-panel-mobile .selection-item:nth-child(1) i');
            } else if (step === 2) {
                mobileNode = mSelTargetVal;
                mobileIcon = document.querySelector('.selections-panel-mobile .selection-item:nth-child(2) i');
            } else if (step === 3) {
                mobileNode = mSelScaleVal;
                mobileIcon = document.querySelector('.selections-panel-mobile .selection-item:nth-child(3) i');
            }
            
            if (mobileNode) {
                mobileNode.classList.remove('empty');
                mobileNode.textContent = selectedText;
            }
            if (mobileIcon) {
                mobileIcon.className = selectedIconClass;
            }
            
            // Update mobile count indicator
            let count = 0;
            if (selections.category) count++;
            if (selections.target) count++;
            if (selections.scale) count++;
            if (mobileSelCount) {
                mobileSelCount.textContent = `(${count}/3)`;
            }
        }, 550);
    }

    // Step 1: Start Demo Button Click
    if (btnStart) {
        btnStart.addEventListener('click', function(e) {
            e.preventDefault();
            if (isTransitioning) return;
            
            robotPushTransition(screens[1], screens[2], () => {
                currentStep = 2;
                updateStepBadge('QUESTION 1');
            });
        });
    }

    // Option Cards Click Listener (Question 1, Question 2, Question 3)
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function() {
            if (isTransitioning) return;
            
            const stepNum = parseInt(this.getAttribute('data-step'));
            const val = this.getAttribute('data-val');
            
            // 1. Immediately lock interaction
            isTransitioning = true;

            // 2. Update selection state
            if (stepNum === 1) selections.category = val;
            else if (stepNum === 2) selections.target = val;
            else if (stepNum === 3) selections.scale = val;
            
            // 3. Highlight selected card & disable sibling clicks
            const group = this.parentElement.querySelectorAll('.option-card');
            group.forEach(c => {
                c.classList.remove('selected');
                c.style.pointerEvents = 'none';
            });
            this.classList.add('selected');
            
            // 4. Trigger flying badge
            triggerFlyingBadge(this, stepNum, val);

            // 5. Selection feedback delay (~200ms), then start cinematic robot PUSH transition
            setTimeout(() => {
                isTransitioning = false; // Reset lock for transition runner
                if (stepNum === 1) {
                    robotPushTransition(screens[2], screens[3], () => {
                        currentStep = 3;
                        updateStepBadge('QUESTION 2');
                        group.forEach(c => c.style.pointerEvents = '');
                    });
                } else if (stepNum === 2) {
                    robotPushTransition(screens[3], screens[4], () => {
                        currentStep = 4;
                        updateStepBadge('QUESTION 3');
                        group.forEach(c => c.style.pointerEvents = '');
                    });
                } else if (stepNum === 3) {
                    robotPushTransition(screens[4], screens[5], () => {
                        currentStep = 5;
                        updateStepBadge('YOUR DETAILS');
                        group.forEach(c => c.style.pointerEvents = '');
                    });
                }
            }, 200);
        });
    });

    // Form Field Validation
    function validateField(inputElement, containerElement) {
        let valid = true;
        if (!inputElement.value.trim()) {
            valid = false;
        } else if (inputElement.type === 'email') {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            valid = re.test(inputElement.value.trim());
        } else if (inputElement.id === 'phone') {
            const re = /^[6-9][0-9]{9}$/;
            valid = re.test(inputElement.value.trim());
        }
        
        if (valid) {
            containerElement.classList.remove('error');
        } else {
            containerElement.classList.add('error');
        }
        return valid;
    }

    const fields = [
        { input: document.getElementById('fullName'), container: document.getElementById('name-container') },
        { input: document.getElementById('orgName'), container: document.getElementById('org-container') },
        { input: document.getElementById('email'), container: document.getElementById('email-container') },
        { input: document.getElementById('phone'), container: document.getElementById('phone-container') }
    ];

    fields.forEach(f => {
        if (f.input) {
            f.input.addEventListener('input', () => {
                validateField(f.input, f.container);
            });
        }
    });

    // Step 5: User Details Submission
    if (detailsForm) {
        detailsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (isTransitioning) return;
            
            let formIsValid = true;
            fields.forEach(f => {
                const valid = validateField(f.input, f.container);
                if (!valid) formIsValid = false;
            });
            
            if (formIsValid) {
                // Robot pushes Details form away to reveal Submitting screen
                robotPushTransition(screens[5], screens[5.5], () => {
                    currentStep = 5.5;
                    updateStepBadge('SUBMITTING');
                    
                    // Simulate server processing (1.6s) then robot pushes Submitting screen to reveal Success screen
                    setTimeout(() => {
                        robotPushTransition(screens[5.5], screens[6], () => {
                            currentStep = 6;
                            updateStepBadge('SUCCESS SCREEN');
                            
                            // Populate summary card
                            const sumCat = document.getElementById('summary-success-category');
                            const sumTarget = document.getElementById('summary-success-target');
                            const sumScale = document.getElementById('summary-success-scale');
                            
                            if (sumCat) sumCat.textContent = selections.category || 'School Partnership';
                            if (sumTarget) sumTarget.textContent = selections.target || 'School';
                            if (sumScale) sumScale.textContent = selections.scale || '10–20';
                        });
                    }, 1600);
                });
            }
        });
    }

    // Mobile Navbar Toggle
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('active');
            const icon = toggle.querySelector('i');
            if (menu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }
});
