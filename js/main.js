/* ---------------------------------------------- */
// DOM ELEMENTS
/* ---------------------------------------------- */

const headerNav = document.querySelector(".header__nav");
const toggleNav = document.querySelector(".toggle-nav");

const introSection = document.querySelector("#intro");

const projectsElement = document.querySelector(".projects-container");
const educationList = document.querySelector(".education-list");
const workList = document.querySelector(".work-list");
const techList = document.querySelector(".tech-list");

const dialog = document.querySelector(".dialog");
const dialogContent = document.querySelector(".dialog__content");


/* ---------------------------------------------- */
// VARIABLES
/* ---------------------------------------------- */

const introHeight = "40rem";
const introFullHeight = "100vh";

const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);


/* ---------------------------------------------- */
// FETCH & RENDER GITHUB REPOS FOR PROJECT SECTION
/* ---------------------------------------------- */

// Load GitHub repos for Projects section
async function loadProjects() {
  const loader = createLoader(".projects-container", "projects-loader", "white");
  projectsElement.style.maxHeight = "0";
  projectsElement.style.opacity = "0";

  let repos = [];

  try {
    repos = await getRepos();
    if (!repos) throw new Error("Couldn't load projects.");

  } catch(error) {
    console.warn(error);
    projectsElement.textContent = "Unable to load projects.";
  }

  if (repos) {
    // Create a card for each repo
    for (const repo of repos) {
      const card = document.createElement("div");
      card.classList.add("card");

      // Create HTML content from the repo languages
      const languages = await getRepoLanguages(repo.languages_url);
      let languagesHTML = "";
      languages.forEach(lang => {
        languagesHTML += `<div class="pill">${lang}</div>`;
      });

      const cardImagePath = `img/${repo.name}-thumbnail.webp`;
      const cardImageHTML = await getCardImageHTML(cardImagePath);

      let cardHTML = `
        ${cardImageHTML}
        <div class="card__content">
          <div class="card__title">${repo.name} <a href="${repo.html_url}" title="View on GitHub"><i class="icon icon-github"></i></a></div>
          <div class="card__description">${repo.description}</div>
        </div>
        <div class="card__footer">${languagesHTML}</div>
      `;

      card.innerHTML = cardHTML;

      // Display dialog when project info when clicking on the card
      card.addEventListener("click", (e) => {
        if (!e.target.classList.contains("icon-github")) {

          dialogContent.innerHTML = `
          <div class="dialog__title">${repo.name}</div>
          <div class="dialog__description"> ${repo.description}</div>
          <div class="dialog__tags">${languagesHTML}</div>
          <div class="dialog__links">
            <a href="${repo.homepage}" class="btn"><i class="icon icon-scan_search"></i> Preview</a>
            <a href="${repo.html_url}" class="btn"><i class="icon icon-github"></i> View on GitHub</a>
          </div>
          `;
          openDialog();
        }
      });

      // Append card to projects container
      projectsElement.appendChild(card);

    }
  }
  removeLoader(loader);
  projectsElement.style.maxHeight = "none";
  projectsElement.style.opacity = "1";
}

// Get repos from GitHub
async function getRepos() {
  try {
    const response = await fetch("https://api.github.com/users/idaohlen/repos");
    if (!response.ok) throw new Error('Unable to retrieve projects from GitHub.');

    let repos = await response.json();
    // Do not include profile repo
    return repos.filter(repo => repo.name !== "idaohlen");

  } catch(error) {
    console.warn(error);
  }
}

// Get a repo's languages as an array of strings
async function getRepoLanguages(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Unable to retrieve repo languages.');

    const languages = await response.json();
    return Object.keys(languages);

  } catch(error) {
    console.warn(error);
  }
}

// If thumbnail exists for a project, return it as a
// .card__image with the thumbnail as a background image
// else, return .card__image with default background
async function getCardImageHTML(url) {
  const response = await fetch(url);

  if (response.ok) {
    return `<div class="card__image" style='background-image:url(${url})'></div>`;
  } else {
    return `<div class="card__image"></div>`;
  }
}


/* ---------------------------------------------- */
// FETCH & RENDER ABOUT SECTION CONTENT
/* ---------------------------------------------- */

// Fetch experiences for About section
function loadExperience() {
  const educationLoader = createLoader(".education-list", "education-loader");
  const workLoader = createLoader(".work-list", "work-loader");

  fetch("./data/experience.json")
  .then((response) => response.json())
  .then((data) => {
    removeLoader(educationLoader);
    removeLoader(workLoader);
    renderExperienceListContents(educationList, data.education);
    renderExperienceListContents(workList, data.work);
  })
  .catch(error => {
    removeLoader(educationLoader);
    removeLoader(workLoader);
    console.error(error);
  });
}

// Render tech list contents from data source
function renderExperienceListContents(list, data) {
  data.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("experience-list__item");
    li.innerHTML = `
          <div class="experience-list__title">${item.title}</div>
          <div class="experience-list__place"><i class="icon icon-building"></i> ${item.place}</div>
          <div class="experience-list__location"><i class="icon icon-map_pin"></i> ${item.location}</div>
          <div class="experience-list__date">${item.date}</div>
    `;
    list.appendChild(li);
  });
}


/* ---------------------------------------------- */
// FETCH & RENDER SKILLS SECTION CONTENT
/* ---------------------------------------------- */

// Fetch tech stack for Skills section
function loadTechStack() {
  fetch("./data/tech.json")
  .then((response) => response.json())
  .then((data) => {
    renderTechListContents(techList, data);
  })
  .catch(error => console.error(error));
}

// Render tech list contents from data source
function renderTechListContents(list, data) {
  data.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("tech-list__item");
    div.innerHTML = `
      <i class="icon ${item.icon}" title="${item.name}"></i>
    `;
    list.appendChild(div);
  });

  // Start the tech stack marquee
  startMarquee(techList, 16, 1);
}


/* ---------------------------------------------- */
// LOADER
/* ---------------------------------------------- */

function createLoader(before, className, style = false) {
  before = document.querySelector(before);

  const loader = document.createElement("div");
  loader.classList.add("loader", className);
  if (style === "white") loader.classList.add("loader--white");

  return before.insertAdjacentElement("beforebegin", loader);
}

function removeLoader(loader) {
  loader.style.opacity = "0";
  loader.remove();
}


/* ---------------------------------------------- */
// SKILLS SECTION MARQUEE
/* ---------------------------------------------- */
// Scrolling horizontal marquee effect
// Source: https://getbutterfly.com/javascript-marquee-a-collection-of-scrolling-text-snippets/

function startMarquee(element, repeatCount = 7, step = 1) {
  function animateMarquee() {
    position = position < width ? position + step : 1;
    element.style.marginLeft = `${-position}px`;
    element.style.overflow = "hidden";
    element.style.whiteSpace = "nowrap";
    requestAnimationFrame(animateMarquee);
  };

  let position = 0;
  const initialStep = step;
  const space = "";
  const content = element.innerHTML;
  element.innerHTML = Array(repeatCount).fill(content + space).join("");
  element.style.position = "absolute";
  const width = element.clientWidth + 1;
  element.style.position = "";

  element.onmouseover = () => step = 0;
  element.onmouseout = () => step = initialStep;

  animateMarquee();
};


/* ---------------------------------------------- */
// RESIZE INTRO SECTION ON SCROLL
/* ---------------------------------------------- */

// Shrink the intro section when scrolling down
// go back to full height when scrolling back to the top
function introResize(entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) introSection.style.maxHeight = introHeight;
  else introSection.style.maxHeight = introFullHeight;
}

const introResizeObserver = new IntersectionObserver(introResize, {
  root: null,
  threshold: 0.95
});

introResizeObserver.observe(document.documentElement);

// Scroll to sections from header nav links
// fix to adjust for the intro section shrinking on scrolling down
document.querySelectorAll("header nav a").forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    // Convert 40rem to pixels
    const remHeight = Number.parseFloat(introHeight) * remInPixels;

    // Calculate the offset
    const offset = window.innerHeight - remHeight;

    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  });
});


/* ---------------------------------------------- */
// HEADER NAV
/* ---------------------------------------------- */

// When resizing the window to mobile width, disable the transition
// so there won't be a graphical glitch when the
// header nav switches from desktop -> mobile -> hidden
// Then turn the transition back on again

function handleResize() {
  // Temporarily remove transition from header nav
    headerNav.classList.add("no-transition");

  // Put transition back after resize is done
  setTimeout(() => {
    headerNav.classList.remove("no-transition");
  }, 0);
}
handleResize();

// Add event listener for window resize
window.addEventListener("resize", handleResize);

// Add event listener for toggling the mobile navigation
toggleNav.addEventListener("click", (e) => {
  e.target.closest(".toggle-nav").classList.toggle("open");
  headerNav.classList.toggle("hidden");
});


/* ---------------------------------------------- */
// DIALOG MODAL
/* ---------------------------------------------- */

let scrollPosition = 0;

function openDialog() {
  // Save scroll position so the page won't
  // scroll to the top when modal is shown
  scrollPosition = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = "100%";

  // Remove the intersection observer for the intro section resizing
  // since it is in conflict with the dialog scroll
  introResizeObserver.unobserve(document.documentElement);

  dialog.showModal();
}

function closeDialog() {
  // Restore scroll position
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollPosition);

  // Re-add the intersection observer for the intro section resizing
  introResizeObserver.observe(document.documentElement);

  dialog.close();
}

// Add event listener to close the dialog when clicking outside the modal
dialog.addEventListener("click", (e) => {
  if (!e.target.closest(".dialog__content")) {
    closeDialog();
  }
});

// Add event listener to close the dialog when
// clicking on the "close" button in the modal
document.querySelector(".dialog__close-btn").addEventListener("click", (e) => {
  closeDialog();
});


/* ---------------------------------------------- */
// RENDER PAGE CONTENT
/* ---------------------------------------------- */

loadProjects()
loadExperience();
loadTechStack();
