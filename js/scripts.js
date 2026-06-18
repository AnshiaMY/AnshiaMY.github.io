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

            // Deactivate all tabs
            buildStageTabs.forEach((stageTab) => {
                stageTab.classList.remove("is-active");
                stageTab.setAttribute("aria-selected", "false");
            });

            // Hide all panels
            buildStagePanels.forEach((panel) => {
                panel.classList.remove("is-active");
            });

            // Activate selected tab
            tab.classList.add("is-active");
            tab.setAttribute("aria-selected", "true");

            // Show matching panel
            const activePanel = document.querySelector(
                `#build .build-stage-panel[data-stage-panel="${selectedStage}"]`
            );

            if (activePanel) {
                activePanel.classList.add("is-active");
            }
        });
    });

});
