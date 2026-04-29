const body = document.body;
const root = document.documentElement;
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector("#primary-nav");
const themeToggle = document.querySelector("[data-theme-toggle]");
const yearElement = document.querySelector("[data-current-year]");
const storageKey = "nahidur-portfolio-theme";

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

function closeNavigation() {
  body.classList.remove("nav-open");

  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
  }
}

if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    body.classList.toggle("nav-open", !isOpen);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      closeNavigation();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavigation();
    }
  });
}

function readSavedTheme() {
  try {
    return localStorage.getItem(storageKey);
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(storageKey, theme);
  } catch (error) {
    return;
  }
}

function applyTheme(theme) {
  const activeTheme = theme === "dark" ? "dark" : "light";
  root.dataset.theme = activeTheme;

  if (themeToggle) {
    themeToggle.textContent = activeTheme === "dark" ? "Light" : "Dark";
    themeToggle.setAttribute("aria-pressed", String(activeTheme === "dark"));
  }
}

const savedTheme = readSavedTheme();
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
applyTheme(savedTheme || preferredTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });
}

const filterButtons = [...document.querySelectorAll("[data-filter]")];
const projectCards = [...document.querySelectorAll("[data-project-card]")];
const projectStatus = document.querySelector("[data-project-status]");
const filterLabels = {
  all: "all",
  "html-css": "HTML/CSS",
  javascript: "JavaScript",
  responsive: "responsive",
};

function updateProjectStatus(filter, visibleCount) {
  if (!projectStatus) {
    return;
  }

  const projectWord = visibleCount === 1 ? "project" : "projects";
  const label = filterLabels[filter] || filter;
  projectStatus.textContent =
    filter === "all"
      ? `Showing all ${visibleCount} ${projectWord}.`
      : `Showing ${visibleCount} ${label} ${projectWord}.`;
}

function filterProjects(filter) {
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const categories = card.dataset.categories.split(" ");
    const shouldShow = filter === "all" || categories.includes(filter);
    card.hidden = !shouldShow;

    if (shouldShow) {
      visibleCount += 1;
    }
  });

  updateProjectStatus(filter, visibleCount);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((currentButton) => {
      currentButton.classList.toggle("is-active", currentButton === button);
    });

    filterProjects(filter);
  });
});

if (projectCards.length > 0) {
  filterProjects("all");
}

const contactForm = document.querySelector("[data-contact-form]");

function setFieldError(field, message) {
  const formField = field.closest(".form-field");
  const errorElement = document.querySelector(`[data-error-for="${field.name}"]`);

  field.setAttribute("aria-invalid", message ? "true" : "false");

  if (errorElement) {
    errorElement.textContent = message;
    field.setAttribute("aria-describedby", errorElement.id);
  }

  if (formField) {
    formField.classList.toggle("has-error", Boolean(message));
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

if (contactForm) {
  const statusElement = contactForm.querySelector("[data-form-status]");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = contactForm.elements.name;
    const email = contactForm.elements.email;
    const message = contactForm.elements.message;
    let isValid = true;

    setFieldError(name, "");
    setFieldError(email, "");
    setFieldError(message, "");

    if (name.value.trim().length < 2) {
      setFieldError(name, "Please enter your name.");
      isValid = false;
    }

    if (!isValidEmail(email.value.trim())) {
      setFieldError(email, "Please enter a valid email address.");
      isValid = false;
    }

    if (message.value.trim().length < 10) {
      setFieldError(message, "Please write at least 10 characters.");
      isValid = false;
    }

    if (!statusElement) {
      return;
    }

    statusElement.classList.toggle("is-success", isValid);

    if (!isValid) {
      statusElement.textContent = "Please fix the highlighted fields.";
      return;
    }

    const firstName = name.value.trim().split(" ")[0];
    statusElement.textContent = `Thanks, ${firstName}. Your message looks ready to send by email.`;
    contactForm.reset();
  });
}

const revealElements = [...document.querySelectorAll(".reveal")];

if (revealElements.length > 0 && "IntersectionObserver" in window) {
  body.classList.add("enable-reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
