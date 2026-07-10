"use strict";

(() => {
  const THEME_KEY = "portfolio-theme";

  const whenReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, {
        once: true
      });
    } else {
      callback();
    }
  };

  function getTheme() {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);

      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
    } catch (error) {
      // Fall back to the operating-system preference.
    }

    return window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle(
      "dark-mode",
      isDark
    );

    document.documentElement.style.colorScheme =
      isDark ? "dark" : "light";

    document
      .querySelectorAll(".theme-toggle")
      .forEach((button) => {
        const icon = button.querySelector("i");

        if (!button.hasAttribute("type")) {
          button.setAttribute("type", "button");
        }

        button.setAttribute(
          "aria-pressed",
          String(isDark)
        );

        button.setAttribute(
          "aria-label",
          isDark
            ? "Enable light mode"
            : "Enable dark mode"
        );

        if (icon) {
          icon.classList.toggle(
            "bi-moon-stars",
            !isDark
          );

          icon.classList.toggle(
            "bi-sun",
            isDark
          );

          icon.setAttribute(
            "aria-hidden",
            "true"
          );
        }
      });
  }

  function initThemeToggle() {
    applyTheme(getTheme());

    document
      .querySelectorAll(".theme-toggle")
      .forEach((button) => {
        /*
         * Capture mode prevents older inline theme
         * listeners from also running while those
         * duplicate page scripts are removed.
         */
        button.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();

            const nextTheme =
              document.body.classList.contains(
                "dark-mode"
              )
                ? "light"
                : "dark";

            applyTheme(nextTheme);

            try {
              localStorage.setItem(
                THEME_KEY,
                nextTheme
              );
            } catch (error) {
              // Theme still works for this session.
            }
          },
          {
            capture: true
          }
        );
      });
  }

  function initScrollProgress() {
    const bars = document.querySelectorAll(
      ".home-scroll-progress, .scroll-progress"
    );

    if (bars.length === 0) {
      return;
    }

    bars.forEach((bar) => {
      bar.setAttribute(
        "aria-hidden",
        "true"
      );
    });

    let frameId = null;

    const update = () => {
      frameId = null;

      const scrollableHeight = Math.max(
        document.documentElement.scrollHeight -
          window.innerHeight,
        0
      );

      const percentage =
        scrollableHeight === 0
          ? 0
          : Math.min(
              window.scrollY /
                scrollableHeight,
              1
            ) * 100;

      bars.forEach((bar) => {
        bar.style.width = `${percentage}%`;
      });
    };

    const requestUpdate = () => {
      if (frameId === null) {
        frameId =
          window.requestAnimationFrame(
            update
          );
      }
    };

    window.addEventListener(
      "scroll",
      requestUpdate,
      {
        passive: true
      }
    );

    window.addEventListener(
      "resize",
      requestUpdate
    );

    window.addEventListener(
      "load",
      requestUpdate,
      {
        once: true
      }
    );

    update();
  }

  function initRevealAnimations() {
    const selectors = [
      ".home-reveal",
      ".reveal",
      ".case-section-heading",
      ".section-heading",
      ".build-stage-interface",
      ".demo-feature-row",
      ".debug-folder",
      ".reflection-layout",
      ".project-contact-cta",
      ".info-card",
      ".flow-step",
      ".improvement-item",
      ".reflection-box",
      ".mini-build-step",
      ".mini-takeaway-card",
      ".mini-build-cta"
    ];

    const elements = [
      ...new Set(
        document.querySelectorAll(
          selectors.join(", ")
        )
      )
    ];

    if (elements.length === 0) {
      return;
    }

    const show = (element) => {
      const isHomeElement =
        element.classList.contains(
          "home-reveal"
        );

      element.classList.remove(
        isHomeElement
          ? "home-reveal-hidden"
          : "reveal-hidden"
      );

      element.classList.add(
        isHomeElement
          ? "home-reveal-visible"
          : "reveal-visible"
      );
    };

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (
      reducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach(show);
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            show(entry.target);
            observer.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -5%"
        }
      );

    elements.forEach((element) => {
      const isHomeElement =
        element.classList.contains(
          "home-reveal"
        );

      element.classList.add(
        isHomeElement
          ? "home-reveal-hidden"
          : "reveal-hidden"
      );

      observer.observe(element);
    });
  }

  function initTabGroup(config) {
    const container =
      document.querySelector(
        config.container
      );

    if (!container) {
      return;
    }

    const tabs = Array.from(
      container.querySelectorAll(
        config.tabs
      )
    );

    const panels = Array.from(
      container.querySelectorAll(
        config.panels
      )
    );

    if (
      tabs.length === 0 ||
      panels.length === 0
    ) {
      return;
    }

    const tabList =
      tabs[0].closest(
        '[role="tablist"]'
      ) || tabs[0].parentElement;

    if (tabList) {
      tabList.setAttribute(
        "role",
        "tablist"
      );
    }

    const findPanel = (tab, index) => {
      const value =
        tab.getAttribute(
          config.tabData
        );

      return (
        panels.find(
          (panel) =>
            panel.getAttribute(
              config.panelData
            ) === value
        ) ||
        panels[index] ||
        null
      );
    };

    const activate = (
      selectedTab,
      focusTab = false
    ) => {
      const selectedPanel =
        findPanel(
          selectedTab,
          tabs.indexOf(selectedTab)
        );

      tabs.forEach((tab) => {
        const selected =
          tab === selectedTab;

        tab.classList.toggle(
          "is-active",
          selected
        );

        tab.setAttribute(
          "aria-selected",
          String(selected)
        );

        tab.setAttribute(
          "tabindex",
          selected ? "0" : "-1"
        );
      });

      panels.forEach((panel) => {
        const selected =
          panel === selectedPanel;

        panel.classList.toggle(
          "is-active",
          selected
        );

        panel.hidden = !selected;
      });

      if (focusTab) {
        selectedTab.focus();
      }
    };

    tabs.forEach((tab, index) => {
      const panel =
        findPanel(tab, index);

      const tabId =
        tab.id ||
        `${config.idPrefix}-tab-${
          index + 1
        }`;

      const panelId =
        panel?.id ||
        `${config.idPrefix}-panel-${
          index + 1
        }`;

      tab.id = tabId;

      tab.setAttribute(
        "role",
        "tab"
      );

      if (panel) {
        panel.id = panelId;

        panel.setAttribute(
          "role",
          "tabpanel"
        );

        panel.setAttribute(
          "aria-labelledby",
          tabId
        );

        panel.setAttribute(
          "tabindex",
          "0"
        );

        tab.setAttribute(
          "aria-controls",
          panelId
        );
      }

      tab.addEventListener(
        "click",
        () => {
          activate(tab);
        }
      );

      tab.addEventListener(
        "keydown",
        (event) => {
          const current =
            tabs.indexOf(tab);

          let next;

          if (
            event.key ===
              "ArrowRight" ||
            event.key ===
              "ArrowDown"
          ) {
            next =
              (current + 1) %
              tabs.length;
          } else if (
            event.key ===
              "ArrowLeft" ||
            event.key ===
              "ArrowUp"
          ) {
            next =
              (current -
                1 +
                tabs.length) %
              tabs.length;
          } else if (
            event.key === "Home"
          ) {
            next = 0;
          } else if (
            event.key === "End"
          ) {
            next =
              tabs.length - 1;
          } else {
            return;
          }

          event.preventDefault();

          activate(
            tabs[next],
            true
          );
        }
      );
    });

    const selectedTab =
      tabs.find(
        (tab) =>
          tab.classList.contains(
            "is-active"
          ) ||
          tab.getAttribute(
            "aria-selected"
          ) === "true"
      ) || tabs[0];

    activate(selectedTab);
  }

  function initTabs() {
    initTabGroup({
      container: "#build",
      tabs: ".build-stage-tab",
      panels: ".build-stage-panel",
      tabData: "data-stage",
      panelData:
        "data-stage-panel",
      idPrefix: "build-stage"
    });

    initTabGroup({
      container: "#improvements",
      tabs: ".debug-folder-tab",
      panels: ".debug-file",
      tabData: "data-debug",
      panelData:
        "data-debug-file",
      idPrefix: "debug-file"
    });
  }

  function initProjectCarousel() {
    const carousel =
      document.querySelector(
        ".project-carousel"
      );

    const track =
      carousel?.querySelector(
        ".project-carousel-track"
      );

    const cards = carousel
      ? Array.from(
          carousel.querySelectorAll(
            ".carousel-card"
          )
        )
      : [];

    if (
      !carousel ||
      !track ||
      cards.length === 0
    ) {
      return;
    }

    const previousButton =
      carousel.querySelector(
        ".carousel-btn-prev"
      );

    const nextButton =
      carousel.querySelector(
        ".carousel-btn-next"
      );

    const dots = Array.from(
      carousel.querySelectorAll(
        ".carousel-dot"
      )
    );

    let index = 0;
    let resizeFrameId = null;

    const cardsPerView = () => {
      if (window.innerWidth <= 700) {
        return 1;
      }

      return window.innerWidth <= 992
        ? 2
        : 3;
    };

    const update = () => {
      const visibleCards =
        cardsPerView();

      const maxIndex = Math.max(
        0,
        cards.length - visibleCards
      );

      index = Math.min(
        index,
        maxIndex
      );

      const cardWidth =
        cards[0].getBoundingClientRect()
          .width;

      const styles =
        window.getComputedStyle(track);

      const gap =
        Number.parseFloat(
          styles.columnGap ||
            styles.gap
        ) || 0;

      track.style.transform =
        `translate3d(-${
          index *
          (cardWidth + gap)
        }px, 0, 0)`;

      dots.forEach(
        (dot, dotIndex) => {
          const active =
            dotIndex === index;

          dot.classList.toggle(
            "is-active",
            active
          );

          dot.setAttribute(
            "aria-current",
            active ? "true" : "false"
          );
        }
      );

      const canMove =
        maxIndex > 0;

      [
        previousButton,
        nextButton
      ].forEach((button) => {
        if (button) {
          button.disabled =
            !canMove;

          button.setAttribute(
            "aria-disabled",
            String(!canMove)
          );
        }
      });
    };

    nextButton?.addEventListener(
      "click",
      () => {
        const maxIndex = Math.max(
          0,
          cards.length -
            cardsPerView()
        );

        index =
          index >= maxIndex
            ? 0
            : index + 1;

        update();
      }
    );

    previousButton?.addEventListener(
      "click",
      () => {
        const maxIndex = Math.max(
          0,
          cards.length -
            cardsPerView()
        );

        index =
          index <= 0
            ? maxIndex
            : index - 1;

        update();
      }
    );

    dots.forEach(
      (dot, dotIndex) => {
        if (
          !dot.hasAttribute("type")
        ) {
          dot.setAttribute(
            "type",
            "button"
          );
        }

        dot.setAttribute(
          "aria-label",
          `Show project group ${
            dotIndex + 1
          }`
        );

        dot.addEventListener(
          "click",
          () => {
            index = Math.min(
              dotIndex,
              Math.max(
                0,
                cards.length -
                  cardsPerView()
              )
            );

            update();
          }
        );
      }
    );

    const requestUpdate = () => {
      if (
        resizeFrameId === null
      ) {
        resizeFrameId =
          window.requestAnimationFrame(
            () => {
              resizeFrameId = null;
              update();
            }
          );
      }
    };

    window.addEventListener(
      "resize",
      requestUpdate
    );

    window.addEventListener(
      "load",
      requestUpdate,
      {
        once: true
      }
    );

    update();
  }

  whenReady(() => {
    initThemeToggle();
    initScrollProgress();
    initRevealAnimations();
    initTabs();
    initProjectCarousel();
  });
})();
