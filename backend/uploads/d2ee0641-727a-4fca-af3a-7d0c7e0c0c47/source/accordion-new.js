document.addEventListener("DOMContentLoaded", () => {
  const accordions = document.querySelectorAll(".accordion-new");

  accordions.forEach((accordion) => {
    const header = accordion.querySelector(".accordion-header-new");

    header.addEventListener("click", () => {
      // If this accordion is already active, just close it
      if (accordion.classList.contains("active")) {
        accordion.classList.remove("active");
        return;
      }

      // Close any other open accordion
      accordions.forEach((acc) => acc.classList.remove("active"));

      // Open this one
      accordion.classList.add("active");
    });
  });
});
