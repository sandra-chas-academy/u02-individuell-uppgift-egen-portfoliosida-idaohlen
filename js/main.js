const toggleNav = document.querySelector(".toggle-nav");

const projectsElement = document.querySelector(".projects-container");
const educationList = document.querySelector(".education-list");
const workList = document.querySelector(".work-list");
const techList = document.querySelector(".tech-list");

const dialog = document.querySelector(".dialog");
const dialogContent = document.querySelector(".dialog__content");

/* ------------------------------------------------------ */
// GET PAGE CONTENT
/* ------------------------------------------------------ */

// Load GitHub repos for Projects section
async function fetchGitHubRepos() {
const loader = document.querySelector(".projects-loader");
loader.style.display = "block";

  // fetch("data/repos.json")
  fetch("https://api.github.com/users/idaohlen/repos")
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Unable to retrieve projects from GitHub.');
  })
  .then( data => {
    // Do not include profile repo
    const repos =  data.filter(repo => repo.name !== "idaohlen");
    console.log(repos);

    // Get the repos languages
    repos.forEach(repo => {
      fetch(repo.languages_url)
      .then(response => response.json())
      .then(
        languages => {
          const card = document.createElement("div");
          card.classList.add("card");
          let languagesContent = "";

          Object.keys(languages).forEach(lang => {
            languagesContent += `<div class="pill">${lang}</div>`;
          });

          card.innerHTML = `
          <div class="card__image"></div>
          <div class="card__content">
            <div class="card__title">${repo.name} <a href="${repo.html_url}" title="View on GitHub"><i class="icon icon-github"></i></a></div>
            <div class="card__description">${repo.description}</div>
          </div>
          <div class="card__footer">${languagesContent}</div>
          `;

          card.addEventListener("click", (e) => {
            if (!e.target.classList.contains("icon-github")) {

              dialogContent.innerHTML = `
              <div class="dialog__title">${repo.name}</div>
              <div class="dialog__description"> ${repo.description}</div>
              <div class="dialog__tags">${languagesContent}</div>
              <div class="dialog__links">
                <a href="${repo.homepage}" class="btn"><i class="icon icon-scan_search"></i> Preview</a>
                <a href="${repo.html_url}" class="btn"><i class="icon icon-github"></i> View on GitHub</a>
              </div>
              `;
              openDialog();
            }
          });

          // div.innerHTML = `${repo.name}: ${repo.description} ${Object.keys(languages).join(", ")}`;
          projectsElement.appendChild(card);
        }
      )
    });

    // Hide the loader
    loader.style.display = "none";
  })
  .catch(error => {
    // Display error message if repos cannot be loaded
    console.error(error);
    loader.style.display = "none";
    projectsElement.textContent = "Unable to load projects.";
  });
}

// Fetch experiences for About section
async function fetchExperience() {
  fetch("./data/experience.json")
  .then((response) => response.json())
  .then((data) => {
    renderExperienceListContents(educationList, data.education);
    renderExperienceListContents(workList, data.work);
  })
  .catch(error => console.error(error));
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

// Fetch tech stack for Skills section
function fetchTechStack() {
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

/* ------------------------------------------------------ */
// VISUAL EFFECTS
/* ------------------------------------------------------ */

// Scrolling horizontal marquee effect
// Source: https://getbutterfly.com/javascript-marquee-a-collection-of-scrolling-text-snippets/

function startMarquee(element, repeatCount = 7, step = 1) {
  function animateMarquee() {
      position = position < width ? position + step : 1;
      element.style.marginLeft = `${-position}px`;
      element.style.overflow = 'hidden';
      element.style.whiteSpace = 'nowrap';
      requestAnimationFrame(animateMarquee);
  };

  let position = 0;
  const initialStep = step;
  const space = '';
  const content = element.innerHTML;
  element.innerHTML = Array(repeatCount).fill(content + space).join('');
  element.style.position = 'absolute';
  const width = element.clientWidth + 1;
  element.style.position = '';

  element.onmouseover = () => step = 0;
  element.onmouseout = () => step = initialStep;

  animateMarquee();
};

// Scroll down to shrink the intro section
function handleScroll() {
  if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
    document.querySelector(".intro").style.maxHeight = "40rem";
} else {
  document.querySelector(".intro").style.maxHeight = "100vh";
}
}
window.addEventListener("scroll", handleScroll);

// Scroll to sections from header nav links fix to adjust for the intro section shrinking on scrolling down
document.querySelectorAll('header nav a').forEach(anchor => {
  console.log(anchor);
  anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      // Convert 40rem to pixels
      const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const remHeight = 40 * remInPixels;

      // Get the height of 100vh in pixels
      const vhHeight = window.innerHeight;

      // Calculate the offset
      const offset = vhHeight - remHeight;

      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
      });
  });
});

/* ------------------------------------------------------ */
// DIALOG MODAL
/* ------------------------------------------------------ */

let scrollPosition = 0;
let originalScrollListener = null;

function openDialog() {
  // Save scroll position so the page won't scroll to the top when modal is shown
  scrollPosition = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = '100%';

  // Remove the scroll event listener for the intro section since it is in conflict with the dialog scroll
  originalScrollListener = handleScroll;
  window.removeEventListener("scroll", handleScroll);

  dialog.showModal();
}

function closeDialog() {
  // Restore scroll position
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollPosition);

  // Re-add the scroll event listener for the intro section
  if (originalScrollListener) {
    window.addEventListener("scroll", originalScrollListener);
  }

  dialog.close();
}

dialog.addEventListener('click', (e) => {
  if (!e.target.closest('.dialog__content')) {
    closeDialog();
  }
});

document.querySelector(".dialog__close-btn").addEventListener('click', (e) => {
    closeDialog();
});

/* ------------------------------------------------------ */
// INITIALIZING CODE
/* ------------------------------------------------------ */

toggleNav.addEventListener("click", (e) => {
  e.target.closest(".toggle-nav").classList.toggle("open");
  document.querySelector(".header__nav").classList.toggle("hidden");
});

fetchGitHubRepos();
fetchExperience();
fetchTechStack();
