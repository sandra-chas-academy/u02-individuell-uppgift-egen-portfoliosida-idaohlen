const projectsElement = document.querySelector(".projects-container");

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
      const languages = fetch(repo.languages_url)
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
  .catch( error => console.error(error));
}

fetchGitHubRepos();