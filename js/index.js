document.addEventListener("DOMContentLoaded", () => {
  const githubForm = document.getElementById("github-form");
  const searchInput = document.getElementById("search");
  const userList = document.getElementById("user-list");
  const reposList = document.getElementById("repos-list");

  githubForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
      try {
        // Clear previous results
        userList.innerHTML = "";
        reposList.innerHTML = "";

        // Fetch user data
        const users = await fetchUsers(searchTerm);

        // Display user data
        displayUsers(users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  });

  async function fetchUsers(searchTerm) {
    const response = await fetch(
      `https://api.github.com/search/users?q=${searchTerm}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.items; // Return array of users
  }

  function displayUsers(users) {
    users.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = user.login;
      li.addEventListener("click", async () => {
        try {
          // Fetch repositories for selected user
          const repos = await fetchUserRepositories(user.login);
          displayRepositories(repos);
        } catch (error) {
          console.error("Error fetching repositories:", error);
        }
      });
      userList.appendChild(li);
    });
  }

  async function fetchUserRepositories(username) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data; // Return array of repositories
  }

  function displayRepositories(repos) {
    reposList.innerHTML = "";
    repos.forEach((repo) => {
      const li = document.createElement("li");
      li.textContent = repo.name;
      reposList.appendChild(li);
    });
  }
});
