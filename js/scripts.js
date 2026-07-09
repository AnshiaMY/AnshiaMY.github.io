/*!
* Start Bootstrap - Creative v7.0.7 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts
//

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');

        if (!navbarCollapsible) {
            return;
        }

        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink');
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
        }
    };

    // Shrink the navbar
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');

    if (mainNav && typeof bootstrap !== 'undefined') {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');

    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );

    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    if (typeof SimpleLightbox !== 'undefined') {
        new SimpleLightbox({
            elements: '#portfolio a.portfolio-box'
        });
    }

    // Build stage tabs
    const buildStageTabs = document.querySelectorAll("#build .build-stage-tab");
    const buildStagePanels = document.querySelectorAll("#build .build-stage-panel");

    buildStageTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const selectedStage = tab.getAttribute("data-stage");

            buildStageTabs.forEach((stageTab) => {
                stageTab.classList.remove("is-active");
                stageTab.setAttribute("aria-selected", "false");
            });

            buildStagePanels.forEach((panel) => {
                panel.classList.remove("is-active");
            });

            tab.classList.add("is-active");
            tab.setAttribute("aria-selected", "true");

            const activePanel = document.querySelector(
                `#build .build-stage-panel[data-stage-panel="${selectedStage}"]`
            );

            if (activePanel) {
                activePanel.classList.add("is-active");
            }
        });
    });

    // Debug folder tabs
    const debugFolderTabs = document.querySelectorAll("#improvements .debug-folder-tab");
    const debugFiles = document.querySelectorAll("#improvements .debug-file");

    debugFolderTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const selectedDebug = tab.getAttribute("data-debug");

            debugFolderTabs.forEach((folderTab) => {
                folderTab.classList.remove("is-active");
                folderTab.setAttribute("aria-selected", "false");
            });

            debugFiles.forEach((file) => {
                file.classList.remove("is-active");
            });

            tab.classList.add("is-active");
            tab.setAttribute("aria-selected", "true");

            const activeFile = document.querySelector(
                `#improvements .debug-file[data-debug-file="${selectedDebug}"]`
            );

            if (activeFile) {
                activeFile.classList.add("is-active");
            }
        });
    });

});


// Project carousel
function initProjectCarousel() {
    const carouselTrack = document.querySelector(".project-carousel-track");
    const carouselCards = document.querySelectorAll(".carousel-card");
    const prevCarouselBtn = document.querySelector(".carousel-btn-prev");
    const nextCarouselBtn = document.querySelector(".carousel-btn-next");
    const carouselDots = document.querySelectorAll(".carousel-dot");

    if (!carouselTrack || carouselCards.length === 0) {
        return;
    }

    let carouselIndex = 0;

    function getCardsPerView() {
        if (window.innerWidth <= 700) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }

    function updateCarousel() {
        const cardsPerView = getCardsPerView();
        const maxIndex = Math.max(0, carouselCards.length - cardsPerView);

        if (carouselIndex > maxIndex) {
            carouselIndex = maxIndex;
        }

        const cardWidth = carouselCards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
        const moveAmount = carouselIndex * (cardWidth + gap);

        carouselTrack.style.transform = `translateX(-${moveAmount}px)`;

        carouselDots.forEach((dot, index) => {
            dot.classList.toggle("is-active", index === carouselIndex);
        });
    }

    if (nextCarouselBtn) {
        nextCarouselBtn.addEventListener("click", () => {
            const cardsPerView = getCardsPerView();
            const maxIndex = Math.max(0, carouselCards.length - cardsPerView);

            carouselIndex = carouselIndex >= maxIndex ? 0 : carouselIndex + 1;
            updateCarousel();
        });
    }

    if (prevCarouselBtn) {
        prevCarouselBtn.addEventListener("click", () => {
            const cardsPerView = getCardsPerView();
            const maxIndex = Math.max(0, carouselCards.length - cardsPerView);

            carouselIndex = carouselIndex <= 0 ? maxIndex : carouselIndex - 1;
            updateCarousel();
        });
    }

    carouselDots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            const cardsPerView = getCardsPerView();
            const maxIndex = Math.max(0, carouselCards.length - cardsPerView);

            carouselIndex = Math.min(index, maxIndex);
            updateCarousel();
        });
    });

    window.addEventListener("resize", updateCarousel);
    updateCarousel();
}

window.addEventListener("load", initProjectCarousel);
