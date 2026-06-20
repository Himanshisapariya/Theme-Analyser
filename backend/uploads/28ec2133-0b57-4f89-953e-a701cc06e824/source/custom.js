let logoScrollers = {};

function initLogoMarquee() {
  // Only run if viewport is mobile (<= 989px)
  if (window.innerWidth > 989) {
    // Kill existing animations if resizing from mobile to desktop
    Object.values(logoScrollers).forEach(anim => anim.kill());
    logoScrollers = {};
    return;
  }

  const rows = document.querySelectorAll(".logo-scroller-row");

  rows.forEach((row) => {
    // Clear existing animation if it exists
    if (logoScrollers[row]) {
      logoScrollers[row].kill();
      delete logoScrollers[row];
    }
    document.querySelectorAll('video').forEach((video, index) => {
      const fallbackImage = video.querySelector('img');
      if (fallbackImage) {
        fallbackImage.alt = `Video fallback image ${index + 1}`;
      }
    });
    
    const items = row.children;
    const itemWidth = items[0]?.offsetWidth || 100; // Fallback width
    const visibleItems = Math.ceil(window.innerWidth / itemWidth);
    
    // Clone items for seamless looping (if not already cloned)
    if (!row.dataset.cloned) {
      const clones = [];
      for (let i = 0; i < visibleItems * 2; i++) {
        clones.push(items[i % items.length].cloneNode(true));
      }
      row.append(...clones);
      row.dataset.cloned = "true";
    }

    const totalWidth = row.scrollWidth / 2; // Since we duplicated content

    // GSAP Animation (infinite loop)
    const tl = gsap.timeline({ repeat: -1, ease: "none" });
    tl.fromTo(
      row,
      { x: 0 },
      {
        x: -totalWidth,
        duration: totalWidth / 50, // Speed control (lower = faster)
        ease: "none",
      }
    );

    // Pause on hover/touch
    row.addEventListener("mouseenter", () => tl.pause());
    row.addEventListener("mouseleave", () => tl.resume());
    row.addEventListener("touchstart", () => tl.pause());
    row.addEventListener("touchend", () => tl.resume());

    // Store animation reference
    logoScrollers[row] = tl;
  });
}

// Initialize on load
document.addEventListener("DOMContentLoaded", initLogoMarquee);

// Re-init on resize (with debounce for performance)
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(initLogoMarquee, 100);
});

// Handle AJAX content reloads (if needed)
function handleAjaxReload() {
  setTimeout(initLogoMarquee, 500);
}

// Ctm FAQ

document.querySelectorAll(".ctm_multifaq_title_main").forEach((section) => {
  const questions = section.querySelectorAll(".faq_question");
  let previousActive = null;

  questions.forEach((question, index) => {
    const answerContainer = question.parentElement.querySelector(".answercont");

    // Mark the first one as open on load
    if (index === 0) {
      previousActive = question;
      question.classList.add("open");
      answerContainer.style.maxHeight = answerContainer.scrollHeight + "px";
    }

    question.addEventListener("click", () => {
      const isOpen = question.classList.contains("open");

      if (previousActive && previousActive !== question) {
        previousActive.classList.remove("open");
        const prevAnswer = previousActive.parentElement.querySelector(".answercont");
        prevAnswer.style.maxHeight = "0px";
      }

      if (isOpen) {
        question.classList.remove("open");
        answerContainer.style.maxHeight = "0px";
        previousActive = null;
      } else {
        question.classList.add("open");
        answerContainer.style.maxHeight = answerContainer.scrollHeight + "px";
        previousActive = question;
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const stickyButton = document.querySelector(".ctm-pooof-sticky-btn");
    const sentinel = document.getElementById("ctm-sticky-trigger-sentinel");

    if (!stickyButton || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.boundingClientRect.top < 0 && !entry.isIntersecting) {
            stickyButton.style.display = "flex";
          } else {
            stickyButton.style.display = "none";
          }
        });
      },
      {
        root: null,
        threshold: 0,
      }
    );

    observer.observe(sentinel);
  }, 100); // Wait 100ms to ensure DOM is stable
});

// sticky atc
document.addEventListener("DOMContentLoaded", function () {
  const stickyBar = document.querySelector(".ctm-atc-sticky-main");
  const header = document.querySelector(".header-wrapper");
  const announcement = document.querySelector("announcement-bar-section");

  const getOffset = () => {
    const announcementHeight = announcement ? announcement.offsetHeight : 0;
    const headerHeight = header ? header.offsetHeight : 0;
    return announcementHeight + headerHeight;
  };

  const toggleSticky = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const threshold = getOffset();

    if (scrollY > threshold) {
      if (!stickyBar.classList.contains("visible")) {
        stickyBar.classList.add("visible");
      }
    } else {
      stickyBar.classList.remove("visible");
      stickyBar.style.animation = "none"; // clear animation to allow re-trigger
      void stickyBar.offsetWidth; // trigger reflow
      stickyBar.style.animation = ""; // reset animation
    }
  };

  window.addEventListener("scroll", toggleSticky);
  window.addEventListener("resize", toggleSticky);
  toggleSticky();
});
