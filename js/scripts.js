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

    // Build path checkpoint panels
    const checkpointButtons = document.querySelectorAll("#build .checkpoint-button");
    const buildPathWrapper = document.querySelector("#build .build-path-wrapper");

    checkpointButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const currentCheckpoint = button.closest(".build-checkpoint");
            const currentPanel = currentCheckpoint ? currentCheckpoint.querySelector(".checkpoint-panel") : null;
            const checkpointNumber = button.querySelector(".checkpoint-number");

            if (!currentPanel || !checkpointNumber) {
                return;
            }

            // Close all checkpoint panels
            document.querySelectorAll("#build .checkpoint-button").forEach((btn) => {
                btn.setAttribute("aria-expanded", "false");
            });

            document.querySelectorAll("#build .checkpoint-panel").forEach((panel) => {
                panel.classList.remove("is-open");
            });

            // Open the selected checkpoint panel
            button.setAttribute("aria-expanded", "true");
            currentPanel.classList.add("is-open");

            // Move the glowing runner to the selected checkpoint
            if (buildPathWrapper) {
                buildPathWrapper.setAttribute(
                    "data-active",
                    checkpointNumber.textContent.trim()
                );
            }
        });
    });

});
