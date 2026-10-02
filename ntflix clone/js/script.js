/**
 * Netflix Clone - Interactive Script
 * Features: Navbar scroll, Modal system, Row navigation,
 * Search, Loading states, Intersection Observer animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // ================================
    // DOM Elements
    // ================================
    const navbar = document.querySelector('.navbar');
    const modal = document.getElementById('movieModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const posters = document.querySelectorAll('.poster');
    const rows = document.querySelectorAll('.row');
    const searchIcon = document.querySelector('.fa-search');
    const navRight = document.querySelector('.nav-right');
    const heroContent = document.querySelector('.hero-content');
    const content = document.querySelector('.content');

    // ================================
    // Loading State
    // ================================
    function createLoadingScreen() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="netflix-logo">NETFLIX</div>
                <div class="loader-spinner"></div>
            </div>
        `;
        document.body.appendChild(loader);
        return loader;
    }

    const pageLoader = createLoadingScreen();

    // Remove loader after content loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            pageLoader.style.opacity = '0';
            pageLoader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                pageLoader.remove();
                initAnimations();
            }, 500);
        }, 1500);
    });

    // ================================
    // Navbar Scroll Effect
    // ================================
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.backgroundColor = '#141414';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.backgroundColor = 'transparent';
            navbar.style.boxShadow = 'none';
        }

        // Hide/Show navbar on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // ================================
    // Search Functionality
    // ================================
    let searchBar = null;

    function createSearchBar() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <input type="text" class="search-input" placeholder="Titles, people, genres">
            <i class="fas fa-times close-search"></i>
        `;
        navRight.insertBefore(searchContainer, navRight.firstChild);

        const input = searchContainer.querySelector('.search-input');
        const closeBtn = searchContainer.querySelector('.close-search');

        input.focus();

        // Animate search container
        requestAnimationFrame(() => {
            searchContainer.classList.add('active');
        });

        closeBtn.addEventListener('click', () => {
            searchContainer.classList.remove('active');
            setTimeout(() => searchContainer.remove(), 300);
            searchBar = null;
        });

        // Search functionality
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            filterPosters(query);
        });

        return searchContainer;
    }

    searchIcon.addEventListener('click', () => {
        if (!searchBar) {
            searchBar = createSearchBar();
        }
    });

    function filterPosters(query) {
        posters.forEach(poster => {
            const alt = poster.querySelector('img').alt.toLowerCase();
            const info = poster.querySelector('.poster-info');
            const match = info ? info.textContent.toLowerCase() : '';

            if (alt.includes(query) || match.includes(query) || query === '') {
                poster.style.display = '';
                poster.style.opacity = '1';
            } else {
                poster.style.opacity = '0.3';
            }
        });
    }

    // ================================
    // Modal System
    // ================================
    function openModal(posterData = null) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Update modal content if poster data provided
        if (posterData) {
            updateModalContent(posterData);
        }

        // Animate modal content
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'none';
        requestAnimationFrame(() => {
            modalContent.style.animation = 'modalFadeIn 0.3s ease forwards';
        });
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateModalContent(posterData) {
        const img = modal.querySelector('.modal-hero img');
        const title = modal.querySelector('.modal-hero-content h2');

        if (posterData.image) img.src = posterData.image;
        if (posterData.title) title.textContent = posterData.title;
    }

    // Poster click handlers
    posters.forEach(poster => {
        poster.addEventListener('click', () => {
            const img = poster.querySelector('img');
            const data = {
                image: img.src,
                title: img.alt || 'Movie Title'
            };
            openModal(data);
        });

        // Video preview simulation on hover
        let hoverTimeout;
        poster.addEventListener('mouseenter', () => {
            hoverTimeout = setTimeout(() => {
                poster.classList.add('preview-active');
            }, 800);
        });

        poster.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            poster.classList.remove('preview-active');
        });
    });

    closeModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ================================
    // Row Navigation Arrows
    // ================================
    rows.forEach(row => {
        const postersContainer = row.querySelector('.row-posters');

        // Create navigation arrows
        const leftArrow = document.createElement('button');
        leftArrow.className = 'row-arrow row-arrow-left';
        leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';

        const rightArrow = document.createElement('button');
        rightArrow.className = 'row-arrow row-arrow-right';
        rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';

        row.style.position = 'relative';
        row.appendChild(leftArrow);
        row.appendChild(rightArrow);

        const scrollAmount = 600;

        leftArrow.addEventListener('click', () => {
            postersContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        rightArrow.addEventListener('click', () => {
            postersContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Show/hide arrows based on scroll position
        function updateArrows() {
            leftArrow.style.opacity = postersContainer.scrollLeft > 0 ? '1' : '0';
            rightArrow.style.opacity =
                postersContainer.scrollLeft < (postersContainer.scrollWidth - postersContainer.clientWidth - 10) ?
                '1' : '0';
        }

        postersContainer.addEventListener('scroll', updateArrows);
        updateArrows();
    });

    // ================================
    // Intersection Observer for Animations
    // ================================
    function initAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');

                    // Stagger animations for posters
                    if (entry.target.classList.contains('row')) {
                        const rowPosters = entry.target.querySelectorAll('.poster');
                        rowPosters.forEach((poster, index) => {
                            setTimeout(() => {
                                poster.classList.add('poster-visible');
                            }, index * 100);
                        });
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe rows
        rows.forEach(row => observer.observe(row));

        // Observe footer
        const footer = document.querySelector('.footer');
        if (footer) observer.observe(footer);
    }

    // ================================
    // Parallax Effect for Hero
    // ================================
    function parallaxHero() {
        const scrollY = window.scrollY;
        const hero = document.querySelector('.hero');

        if (scrollY < window.innerHeight) {
            const translateY = scrollY * 0.5;
            hero.style.backgroundPositionY = `${translateY}px`;

            if (heroContent) {
                heroContent.style.transform = `translateY(${translateY * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.6));
            }
        }
    }

    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            requestAnimationFrame(() => {
                parallaxHero();
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    });

    // ================================
    // Button Ripple Effect
    // ================================
    function createRipple(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        ripple.className = 'ripple';

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });

    // ================================
    // Notification Bell Animation
    // ================================
    const bellIcon = document.querySelector('.fa-bell');
    if (bellIcon) {
        bellIcon.addEventListener('click', () => {
            bellIcon.classList.add('ringing');
            setTimeout(() => bellIcon.classList.remove('ringing'), 1000);

            // Show notification toast
            showToast('No new notifications');
        });
    }

    function showToast(message) {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ================================
    // My List Toggle
    // ================================
    document.querySelectorAll('.fa-plus-circle, .btn-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const icon = btn.tagName === 'I' ? btn : btn.querySelector('i');

            if (icon && icon.classList.contains('fa-plus')) {
                icon.classList.replace('fa-plus', 'fa-check');
                showToast('Added to My List');
            } else if (icon && icon.classList.contains('fa-check')) {
                icon.classList.replace('fa-check', 'fa-plus');
                showToast('Removed from My List');
            } else {
                showToast('Added to My List');
            }
        });
    });

    // ================================
    // Thumbs Up/Down Toggle
    // ================================
    document.querySelectorAll('.fa-thumbs-up').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('liked');

            if (btn.classList.contains('liked')) {
                btn.style.color = '#46d369';
                showToast('You liked this');
            } else {
                btn.style.color = '';
            }
        });
    });

    // ================================
    // Smooth Scroll for Nav Links
    // ================================
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');

            if (href === '#') {
                // Animate to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================================
    // Hero Play Button
    // ================================
    const playBtn = document.querySelector('.hero-buttons .btn-play');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            showToast('Starting playback...');

            // Simulate video player opening
            const videoOverlay = document.createElement('div');
            videoOverlay.className = 'video-player-overlay';
            videoOverlay.innerHTML = `
                <div class="video-player">
                    <div class="video-placeholder">
                        <i class="fas fa-play-circle"></i>
                        <p>Video Player Simulation</p>
                    </div>
                    <button class="close-video"><i class="fas fa-times"></i></button>
                </div>
            `;
            document.body.appendChild(videoOverlay);

            requestAnimationFrame(() => {
                videoOverlay.classList.add('active');
            });

            videoOverlay.querySelector('.close-video').addEventListener('click', () => {
                videoOverlay.classList.remove('active');
                setTimeout(() => videoOverlay.remove(), 300);
            });
        });
    }

    // ================================
    // Netflix Logo Animation on Load
    // ================================
    const netflixLogo = document.querySelector('.logo');
    if (netflixLogo) {
        netflixLogo.style.animation = 'logoPop 0.6s ease forwards';
    }

    // ================================
    // Row Title Hover Effect
    // ================================
    document.querySelectorAll('.row-title').forEach(title => {
        title.addEventListener('mouseenter', () => {
            title.style.transform = 'translateX(10px)';
        });
        title.addEventListener('mouseleave', () => {
            title.style.transform = 'translateX(0)';
        });
    });

    // ================================
    // Random Movie Spotlight
    // ================================
    function spotlightRandomMovie() {
        const allPosters = Array.from(posters);
        const randomPoster = allPosters[Math.floor(Math.random() * allPosters.length)];

        if (randomPoster) {
            randomPoster.style.boxShadow = '0 0 20px rgba(229, 9, 20, 0.5)';
            setTimeout(() => {
                randomPoster.style.boxShadow = '';
            }, 2000);
        }
    }

    // Spotlight a random movie every 30 seconds
    setInterval(spotlightRandomMovie, 30000);

    console.log('🎬 Netflix Clone loaded successfully!');
});