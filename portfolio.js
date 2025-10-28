// Optimized Performance Variables
let ticking = false;
let isScrolling = false;

// Create falling rose petals with increased quantity
function createRosePetals() {
    const container = document.getElementById('animated-bg');
    let petalCount = 0;
    const maxPetals = 15; // Increased from 8 to 15
    
    function createPetal() {
        if (petalCount >= maxPetals) return;
        
        const petal = document.createElement('div');
        petal.className = 'rose-petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 8 + 12) + 's';
        petal.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(petal);
        petalCount++;

        setTimeout(() => {
            if (petal.parentNode) {
                petal.parentNode.removeChild(petal);
                petalCount--;
            }
        }, 20000);
    }

    // Create initial petals - increased quantity
    for (let i = 0; i < 8; i++) {
        setTimeout(createPetal, i * 400);
    }

    // More frequent petal creation
    setInterval(createPetal, 2000); // Changed from 4000 to 2000ms
    
    // Add extra burst every 10 seconds
    setInterval(() => {
        for (let i = 0; i < 3; i++) {
            setTimeout(createPetal, i * 200);
        }
    }, 10000);
}

// Advanced scroll animations with optimized performance
function animateOnScroll() {
    if (ticking) return;
    
    requestAnimationFrame(() => {
        const fadeElements = document.querySelectorAll('.fade-in:not(.visible)');
        const slideLeftElements = document.querySelectorAll('.slide-in-left:not(.visible)');
        const slideRightElements = document.querySelectorAll('.slide-in-right:not(.visible)');
        const threshold = window.innerHeight * 0.8;

        [...fadeElements, ...slideLeftElements, ...slideRightElements].forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < threshold) {
                element.classList.add('visible');
            }
        });
        
        ticking = false;
    });
    
    ticking = true;
}

// Parallax effect for decorative elements with throttling
function parallaxEffect() {
    if (isScrolling) return;
    
    requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const decorationDots = document.querySelectorAll('.decoration-dots');
        
        decorationDots.forEach((dot, index) => {
            const speed = (index + 1) * 0.3;
            dot.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        isScrolling = false;
    });
    
    isScrolling = true;
}

// Dynamic navbar styling with optimized performance
function handleNavbar() {
    const navbar = document.querySelector('nav');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(253, 242, 244, 0.98))';
        navbar.style.boxShadow = '0 5px 30px rgba(173, 35, 63, 0.15)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(253, 242, 244, 0.95))';
        navbar.style.boxShadow = 'none';
    }
}

// Lightbox functionality for each section
class LightboxManager {
    constructor(sectionId, images) {
        this.sectionId = sectionId;
        this.images = images;
        this.currentIndex = 0;
        this.lightbox = document.getElementById(`lightbox-${sectionId}`);
        
        if (!this.lightbox || !this.images.length) return;
        
        this.lightboxImg = this.lightbox.querySelector('.lightbox-img');
        this.closeBtn = this.lightbox.querySelector('.lightbox-close');
        this.prevBtn = this.lightbox.querySelector('.prev-btn');
        this.nextBtn = this.lightbox.querySelector('.next-btn');

        this.init();
    }

    init() {
        // Add click listeners to images
        this.images.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                e.preventDefault();
                this.open(index);
            });
        });

        // Add control listeners
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());

        // Close on outside click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.close();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('open')) return;
            
            switch(e.key) {
                case 'Escape': this.close(); break;
                case 'ArrowLeft': this.prev(); break;
                case 'ArrowRight': this.next(); break;
            }
        });
    }

    open(index) {
        this.currentIndex = index;
        this.updateImage();
        this.lightbox.classList.add('open');
        this.updateControls();
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    close() {
        this.lightbox.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImage();
        this.updateControls();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
        this.updateControls();
    }

    updateImage() {
        if (this.lightboxImg && this.images[this.currentIndex]) {
            // Kiểm tra và tạo container nếu chưa có
            let imgContainer = this.lightbox.querySelector('.lightbox-img-container');
            if (!imgContainer) {
                // Tạo container cho ảnh
                imgContainer = document.createElement('div');
                imgContainer.className = 'lightbox-img-container';
                
                // Chèn container vào đúng vị trí (trước controls)
                const lightboxContent = this.lightbox.querySelector('.lightbox-content');
                const controls = this.lightbox.querySelector('.lightbox-controls');
                lightboxContent.insertBefore(imgContainer, controls);
                
                // Di chuyển ảnh vào container
                imgContainer.appendChild(this.lightboxImg);
            }
            
            // Cập nhật source ảnh
            this.lightboxImg.src = this.images[this.currentIndex].src;
            this.lightboxImg.alt = this.images[this.currentIndex].alt;
        }
    }

    updateControls() {
        if (this.prevBtn) this.prevBtn.disabled = this.images.length <= 1;
        if (this.nextBtn) this.nextBtn.disabled = this.images.length <= 1;
    }
}

// Floating navigation interaction
function setupFloatingNav() {
    const floatingNavItems = document.querySelectorAll('.floating-nav-item');
    floatingNavItems.forEach((item, index) => {
        item.style.animationDelay = (index * 0.1) + 's';
        
        item.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'bounce 3s ease-in-out infinite';
            }, 100);
        });
    });
}

// Card hover effects
function setupCardEffects() {
    const cards = document.querySelectorAll('.card, .skill-hex, .project-main');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

// Stagger animations for better performance
function staggerAnimations() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    elements.forEach((element, index) => {
        element.style.transitionDelay = (index * 0.05) + 's';
    });
}

// Typing effect for hero subtitle
function typewriterEffect() {
    const subtitle = document.getElementById('typewriter');
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.borderRight = '2px solid #AD233f';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            setTimeout(() => {
                subtitle.style.borderRight = 'none';
            }, 1000);
        }
    }, 60);
}

// Animated counter for statistics
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseFloat(stat.dataset.target);
        const isFloat = target.toString().includes('.');
        let current = 0;
        const increment = target / 60;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target.toString();
                clearInterval(timer);
            } else {
                if (isFloat) {
                    stat.textContent = current.toFixed(1);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }
        }, 50);
    });
}

// Active navigation highlighting
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a, .floating-nav-item');
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
            const id = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Magnetic effect for floating nav (optimized)
let magneticTimeout;
function setupMagneticEffect() {
    document.addEventListener('mousemove', function(e) {
        if (window.innerWidth <= 768) return; // Disable on mobile
        
        clearTimeout(magneticTimeout);
        magneticTimeout = setTimeout(() => {
            const floatingNav = document.querySelector('.floating-nav');
            const rect = floatingNav.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) * 0.05;
            const deltaY = (e.clientY - centerY) * 0.05;
            
            if (Math.abs(deltaX) < 50 && Math.abs(deltaY) < 100) {
                floatingNav.style.transform = `translateY(-50%) translate(${deltaX}px, ${deltaY}px)`;
            } else {
                floatingNav.style.transform = 'translateY(-50%) translate(0px, 0px)';
            }
        }, 16); // ~60fps
    });
}

// Interactive floating elements (throttled)
let mouseTimeout;
function setupInteractiveElements() {
    document.addEventListener('mousemove', function(e) {
        if (window.innerWidth <= 768) return; // Disable on mobile
        
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
            const floatingElements = document.querySelectorAll('.decoration-dots');
            floatingElements.forEach((element, index) => {
                const speed = (index + 1) * 0.0001;
                const x = e.clientX * speed;
                const y = e.clientY * speed;
                element.style.transform = `translate(${x}px, ${y}px)`;
            });
        }, 32); // ~30fps
    });
}

// Ripple effect on click
function setupRippleEffect() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('cta-button') || e.target.classList.contains('contact-link')) {
            const ripple = document.createElement('span');
            const rect = e.target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            e.target.style.position = 'relative';
            e.target.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });
}

// Dynamic color shifting for hero background (optimized)
function setupColorShifting() {
    let colorShift = 0;
    setInterval(() => {
        colorShift += 0.5;
        const hero = document.querySelector('.hero');
        if (hero && window.innerWidth > 768) {
            const hue = 340 + Math.sin(colorShift * 0.01) * 10;
            hero.style.background = `linear-gradient(135deg, #fff 0%, hsl(${hue}, 40%, 98%) 50%, hsl(${hue + 5}, 30%, 96%) 100%)`;
        }
    }, 200);
}

// Scroll to middle function for images
function scrollToMiddle(container, img) {
    if (!container || !img) return;

    // Đợi ảnh render hoàn toàn
    setTimeout(() => {
        const containerHeight = container.clientHeight;
        const imgScrollHeight = img.scrollHeight || img.offsetHeight;
        
        console.log(`Container height: ${containerHeight}px, Image scroll height: ${imgScrollHeight}px`);

        if (imgScrollHeight > containerHeight) {
            // Tính toán vị trí giữa thực tế
            const scrollPosition = (imgScrollHeight - containerHeight) / 2;
            container.scrollTop = scrollPosition;
            console.log(`Set scrollTop to middle: ${scrollPosition}px`);
        } else {
            // Nếu ảnh nhỏ hơn container, để ở giữa bằng cách không scroll
            container.scrollTop = 0;
            console.log(`Image smaller than container, set to top`);
        }
    }, 100); // Đợi 100ms để ảnh render xong
}

// Initialize scroll position for image containers
function initializeScroll() {
    const containers = document.querySelectorAll('.scroll-photo, .single-photo, .project-photo-container');
    containers.forEach(container => {
        const img = container.querySelector('img');
        if (img) {
            // Kiểm tra ngay lập tức
            if (img.complete && img.naturalHeight) {
                scrollToMiddle(container, img);
            }
            // Theo dõi sự kiện load
            img.addEventListener('load', () => scrollToMiddle(container, img));
            img.addEventListener('error', () => console.log(`Image load error in ${container.className}`));
            // Kiểm tra lại sau 500ms để đảm bảo ảnh tải xong
            setTimeout(() => {
                if (img.naturalHeight) scrollToMiddle(container, img);
            }, 500);
        }
    });
}

// CSS injection for additional styles
function injectAdditionalCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .nav-links a.active {
            background: linear-gradient(45deg, #771126, #AD233f);
            color: white;
        }
    `;
    document.head.appendChild(style);
}

// Main initialization function
document.addEventListener('DOMContentLoaded', function() {
    // Basic setup
    createRosePetals();
    animateOnScroll();
    setupFloatingNav();
    setupCardEffects();
    staggerAnimations();
    setupMagneticEffect();
    setupInteractiveElements();
    setupRippleEffect();
    setupColorShifting();
    injectAdditionalCSS();

    // Initialize lightboxes for each section
    setTimeout(() => {
        const sections = {
            'awards1': document.querySelectorAll('[data-section="awards1"] img'),
            'awards2': document.querySelectorAll('[data-section="awards2"] img'),
            'projects': document.querySelectorAll('[data-section="projects"] img'),
            'leadership': document.querySelectorAll('[data-section="leadership"] img'),
            'volunteer': document.querySelectorAll('[data-section="volunteer"] img'),
            'sos': document.querySelectorAll('[data-lightbox="sos"]'),
            'sgc': document.querySelectorAll('[data-lightbox="sgc"]')
        };

        Object.keys(sections).forEach(sectionId => {
            if (sections[sectionId].length > 0) {
                new LightboxManager(sectionId, Array.from(sections[sectionId]));
            }
        });
    }, 500);

    // Initialize scroll positioning for images
    initializeScroll();

    // Delay typewriter effect
    setTimeout(typewriterEffect, 1800);
    
    // Intersection Observer for counters
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }
    
    // Optimized scroll listeners
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            animateOnScroll();
            handleNavbar();
            parallaxEffect();
            updateActiveNav();
        }, 10);
    }, { passive: true });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Re-initialize scroll on resize and load
    window.addEventListener('resize', initializeScroll);
    window.addEventListener('load', initializeScroll);

    // Debug: Check final state
    window.addEventListener('load', () => {
        setTimeout(() => {
            const containers = document.querySelectorAll('.scroll-photo, .single-photo, .project-photo-container');
            containers.forEach(container => {
                const img = container.querySelector('img');
                if (img && img.naturalHeight) {
                    console.log(`Final scrollTop: ${container.scrollTop} | Container: ${container.clientHeight}px | Image: ${img.naturalHeight}px`);
                } else {
                    console.log(`No valid image in ${container.className}`);
                }
            });
        }, 1000);
    });
});
// Image Stack Navigator Class
class ImageStackNavigator {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.querySelector(`[data-section="${containerId}"]`);
        
        if (!this.container) {
            console.log(`Container not found for: ${containerId}`);
            return;
        }
        
        this.images = Array.from(this.container.querySelectorAll('.stack-img, .gallery-img'));
        this.currentIndex = 0;
        this.totalImages = this.images.length;
        
        if (this.totalImages === 0) {
            console.log(`No images found in: ${containerId}`);
            return;
        }
        
        this.prevBtn = this.container.querySelector('.stack-prev, .gallery-prev');
        this.nextBtn = this.container.querySelector('.stack-next, .gallery-next');
        this.counterCurrent = this.container.querySelector('.current');
        this.counterTotal = this.container.querySelector('.total');
        
        console.log(`Initialized ${containerId} with ${this.totalImages} images`);
        this.init();
    }
    
    init() {
        // Show first image
        this.showImage(0);
        
        // Update total counter
        if (this.counterTotal) {
            this.counterTotal.textContent = this.totalImages;
        }
        
        // Add click listeners to images (for lightbox)
        this.images.forEach((img, idx) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const lightboxId = img.getAttribute('data-lightbox');
                if (lightboxId) {
                    if (window.lightboxManagers && window.lightboxManagers[lightboxId]) {
                        window.lightboxManagers[lightboxId].open(idx);
                    }
                }
            });
        });
        
        // Button listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Update button states
        this.updateButtons();
    }
    
    showImage(index) {
        this.images.forEach((img, i) => {
            if (i === index) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });
        this.currentIndex = index;
        if (this.counterCurrent) {
            this.counterCurrent.textContent = index + 1;
        }
    }
    
    prev() {
        let newIndex = this.currentIndex - 1;
        if (newIndex < 0) {
            newIndex = this.totalImages - 1;
        }
        this.showImage(newIndex);
        this.updateButtons();
    }
    
    next() {
        let newIndex = this.currentIndex + 1;
        if (newIndex >= this.totalImages) {
            newIndex = 0;
        }
        this.showImage(newIndex);
        this.updateButtons();
    }
    
    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.totalImages <= 1;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.totalImages <= 1;
        }
    }
}

// Initialize stacks when page loads
function initializeImageStacks() {
    const stackSections = ['awards1', 'awards2', 'leadership1', 'leadership2', 'workshop', 'sos', 'sgc'];
    stackSections.forEach(section => {
        new ImageStackNavigator(section);
    });
    
    // Initialize lightboxes
    if (!window.lightboxManagers) window.lightboxManagers = {};
    
    const sections = {
        'leadership1': document.querySelectorAll('[data-lightbox="leadership1"]'),
        'leadership2': document.querySelectorAll('[data-lightbox="leadership2"]'),
        'workshop': document.querySelectorAll('[data-lightbox="workshop"]'),
        'sos': document.querySelectorAll('[data-lightbox="sos"]'),
        'sgc': document.querySelectorAll('[data-lightbox="sgc"]')
    };

    Object.keys(sections).forEach(sectionId => {
        if (sections[sectionId].length > 0) {
            window.lightboxManagers[sectionId] = new LightboxManager(sectionId, Array.from(sections[sectionId]));
        }
    });
    
    console.log('All image stacks and lightboxes initialized');
}

// Call this after DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeImageStacks);
} else {
    initializeImageStacks();
}