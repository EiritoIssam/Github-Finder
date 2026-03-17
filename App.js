import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!username.trim()) return;

    try {

      const resUser = await fetch(`https://api.github.com/users/${username}`);
      const userData = await resUser.json();

      if (userData.message === "Not Found") {
        setError("User not found");
        setUser(null);
        setRepos([]);
        return;
      }

      setUser(userData);
      setError("");

      const resRepos = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated`
      );
      const reposData = await resRepos.json();

      setRepos(reposData.slice(0, 5));
    } catch {
      setError("Error loading data");
    }
  };

  return (
    <div className="container">
      <h2>GitHub Finder</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search user..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {user && (
        <>
          <div className="card">
            <img src={user.avatar_url} alt="avatar" />
            <h3>{user.login}</h3>
            <p>{user.bio || "No bio available"}</p>

            <div className="info">
              <span>Repos: {user.public_repos}</span>
              <span>Followers: {user.followers}</span>
            </div>

            <a href={user.html_url} target="_blank" rel="noreferrer">
              View Profile
            </a>
          </div>

          <div className="repos">
            <h3>Latest Repositories</h3>

            {repos.map((repo) => (
              <div key={repo.id} className="repo">
                <a href={repo.html_url} target="_blank" rel="noreferrer">
                  {repo.name}
                </a>
                <span>⭐ {repo.stargazers_count}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;