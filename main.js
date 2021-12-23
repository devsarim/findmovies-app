window.onload = () => {
  console.info("DOM Loaded");

  async function searchMovies(query, callback) {
    const res = await fetch(
      `https://findmovies-proxy.glitch.me/api/movies/?query=${query}`
    );
    res.json().then(callback, (err) => {
      console.error(err);
    });
  }

  async function searchShows(query, callback) {
    const res = await fetch(
      `https://findmovies-proxy.glitch.me/api/shows/?query=${query}`
    );
    res.json().then(callback, (err) => {
      console.error(err);
    });
  }

  document.querySelector("#search-btn").addEventListener("click", (e) => {
    e.preventDefault();

    let query = document.querySelector("#search-bar").value;

    if (query === "") {
      return;
    }

    searchMovies(query, (data) => {
      console.log(data);

      let moviesContainer = document.querySelector("#movies");
      let results = data.results;

      moviesContainer.innerHTML = "";

      results.forEach((movie) => {
        moviesContainer.innerHTML += `<img src="https://image.tmdb.org/t/p/original/${movie.poster_path}">`;
      });
    });
  });

  //https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg
};
