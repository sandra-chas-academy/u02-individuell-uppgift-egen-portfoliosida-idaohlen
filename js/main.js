const projectsElement = document.querySelector(".projects-container");
const educationList = document.querySelector(".education-list");
const workList = document.querySelector(".work-list");
const techList = document.querySelector(".tech-list");

// Load GitHub repos for Projects section
function fetchGitHubRepos() {
const loader = document.querySelector(".projects-loader");
loader.style.display = "block";

  fetch("https://api.github.com/users/idaohlen/repos")
  .then(response => response.json())
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
          const div = document.createElement("div");
          div.classList.add("card");
          let languagesContent = "";

          Object.keys(languages).forEach(lang => {
            languagesContent += `<div class="pill">${lang}</div>`;
          });

          div.innerHTML = `
          <div class="card__image"></div>
          <div class="card__content">
            <div class="card__title">${repo.name} <a href="${repo.html_url}" title="View on GitHub"><i class="icon icon-github"></i></a></div>
            <div class="card__description">${repo.description}</div>
          </div>
          <div class="card__footer">${languagesContent}</div>
          `;

          // div.innerHTML = `${repo.name}: ${repo.description} ${Object.keys(languages).join(", ")}`;
          projectsElement.appendChild(div);
        }
      );
    });

    // Hide the loader
    loader.style.display = "none";
  })
  .catch(error => console.error(error));
}

// Fetch experiences for About section
function fetchExperience() {
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
    renderTechListContents(techList, data.tech);
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

// Scrolling horizontal marquee effect
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


// Initializing code
fetchGitHubRepos();
fetchExperience();
fetchTechStack();