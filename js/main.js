const projectsElement = document.querySelector(".projects-container");
const educationList = document.querySelector(".education-list");
const workList = document.querySelector(".work-list");

// Load GitHub repos for Projects section
function fetchGitHubRepos() {
const loader = document.querySelector(".projects-loader");
loader.style.display = "block";

  fetch("https://api.github.com/users/idaohlen/repos")
  .then(response => response.json())
  .then( data => {
    // console.log(data);
    // Do not include profile repo
    const repos =  data.filter(repo => repo.name !== "idaohlen");

    repos.forEach(repo => {
      fetch(repo.languages_url)
      .then(response => response.json())
      .then(
        languages => {
          const div = document.createElement("div");

          div.innerHTML = `${repo.name}: ${repo.description} ${Object.keys(languages).join(", ")}`;
          projectsElement.appendChild(div);
        }
      );

    });

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

function renderExperienceListContents(list, data) {
  data.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("experience-list__item");
    li.innerHTML = `
          <div class="experience-list__title">${item.title}</div>
          <div class="experience-list__place">${item.place}</div>
          <div class="experience-list__location">${item.location}</div>
          <div class="experience-list__date">${item.date}</div>
    `;
    list.appendChild(li);
  });
}

fetchGitHubRepos();
fetchExperience();
