
const navigationLinks = document.querySelectorAll(".nav-link");
const pageSections = document.querySelectorAll(".page-section");

// Display the requested page.
function navigateToPage(pageId) {
  const targetSection = document.getElementById(pageId);

  // Return to Home if the requested page doesn't exist.
  if (!targetSection || !targetSection.classList.contains("page-section")) {
    navigateToPage("home");
    return;
  }

  // Hide all sections.
  pageSections.forEach((section) => {
    section.classList.remove("active");
  });

  // Remove active styling from all navigation links.
  navigationLinks.forEach((link) => {
    link.classList.remove("active");
  });

  // Display the requested section.
  targetSection.classList.add("active");

  // Highlight the matching navigation link.
  const activeLink = document.querySelector(
    `.nav-link[href="#${pageId}"]`
  );

  if (activeLink) {
    activeLink.classList.add("active");
  }
}

// Listen for changes to the URL hash.
window.addEventListener("hashchange", () => {
  const pageId = window.location.hash.substring(1);
  navigateToPage(pageId);
});

// Handle navigation link clicks.
navigationLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const pageId = link.getAttribute("href").substring(1);
    navigateToPage(pageId);
  });
});

// Display the correct page when the application first loads.
const initialPage = window.location.hash.substring(1) || "home";
navigateToPage(initialPage);
