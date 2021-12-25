window.addEventListener("load", () => {
  console.info("DOM Loaded");

  // const MAX_OVERVIEW_WORDS = 35;
  // const GENRES = [
  //   { id: 28, name: "Action" },
  //   { id: 12, name: "Adventure" },
  //   { id: 16, name: "Animation" },
  //   { id: 35, name: "Comedy" },
  //   { id: 80, name: "Crime" },
  //   { id: 99, name: "Documentary" },
  //   { id: 18, name: "Drama" },
  //   { id: 10751, name: "Family" },
  //   { id: 14, name: "Fantasy" },
  //   { id: 36, name: "History" },
  //   { id: 27, name: "Horror" },
  //   { id: 10402, name: "Music" },
  //   { id: 9648, name: "Mystery" },
  //   { id: 10749, name: "Romance" },
  //   { id: 878, name: "Science Fiction" },
  //   { id: 10770, name: "TV Movie" },
  //   { id: 53, name: "Thriller" },
  //   { id: 10752, name: "War" },
  //   { id: 37, name: "Western" },
  // ];

  // const resultsGrid = document.querySelector(".results-grid");
  // const searchBar = document.querySelector("#search-bar");

  // let lastQuery = "";

  // function getGenreFromId(id) {
  //   for (let index = 0; index < GENRES.length; index++) {
  //     const object = GENRES[index];
  //     if (object.id === id) {
  //       return object.name;
  //     }
  //   }
  // }

  // async function renderTrendingMovies() {
  //   resultsGrid.innerHTML = "";

  //   let res = await fetch(
  //     "https://findmovies-proxy.glitch.me/api/trendingmovies/today"
  //   );

  //   res.json().then((data) => {
  //     data.results.forEach((result) => {
  //       let overview = result.overview;
  //       let split = overview.split(" ");
  //       if (split.length > MAX_OVERVIEW_WORDS) {
  //         overview = "";
  //         for (let index = 0; index < MAX_OVERVIEW_WORDS; index++) {
  //           overview += split[index] + " ";
  //         }
  //         overview += "...";
  //       }

  //       let genresList = "";
  //       result.genre_ids.forEach((genreId) => {
  //         genresList += `<li><a href="https://www.themoviedb.org/genre/${genreId}/movie" class="movie-genre">${getGenreFromId(
  //           genreId
  //         )}</a></li>`;
  //       });

  //       resultsGrid.innerHTML += `
  //           <div class="card">
  //           <div class="flip-card-container">
  //           <div class="flip-card-inner">
  //           <img src="https://image.tmdb.org/t/p/original${
  //             result.poster_path
  //           }" alt="movie poster" class="movie-poster" />
  //           <div class="movie-hover-info">
  //           <p class="movie-plot">
  //           ${overview}
  //           </p>
  //           <ul class="movie-genres">
  //           ${genresList}
  //           </ul>
  //           </div>
  //           </div>
  //           </div>
  //           <section class="movie-info-container">
  //           <h4 class="movie-title">${result.title}</h4>
  //           <div class="movie-info">
  //           <p class="text-secondary release-date">${
  //             result.release_date.split("-")[0]
  //           }</p>
  //           <p class="text-secondary movie-rating" title="${
  //             result.vote_count
  //           } votes">
  //           <i class="fas fa-star" style="color: #d3c43a"></i>&nbsp;${
  //             result.vote_average
  //           }
  //           </p>
  //           </div>
  //           </section>
  //           </div>
  //           `;
  //     });
  //   });
  // }

  // async function searchAndRender(query) {
  //   resultsGrid.innerHTML = "";

  //   let res = await fetch(
  //     `https://findmovies-proxy.glitch.me/api/movies/?query=${query}`
  //   );
  //   res.json().then((data) => {
  //     data.results.forEach((result) => {
  //       let overview = result.overview;
  //       let split = overview.split(" ");
  //       if (split.length > MAX_OVERVIEW_WORDS) {
  //         overview = "";
  //         for (let index = 0; index < MAX_OVERVIEW_WORDS; index++) {
  //           overview += split[index] + " ";
  //         }
  //         overview += "...";
  //       }

  //       let genresList = "";
  //       result.genre_ids.forEach((genreId) => {
  //         genresList += `<li><a href="https://www.themoviedb.org/genre/${genreId}/movie" class="movie-genre">${getGenreFromId(
  //           genreId
  //         )}</a></li>`;
  //       });

  //       resultsGrid.innerHTML += `
  //           <div class="card">
  //           <div class="flip-card-container">
  //           <div class="flip-card-inner">
  //           <img src="https://image.tmdb.org/t/p/original${
  //             result.poster_path
  //           }" alt="movie poster" class="movie-poster" />
  //           <div class="movie-hover-info">
  //           <p class="movie-plot">
  //           ${overview}
  //           </p>
  //           <ul class="movie-genres">
  //           ${genresList}
  //           </ul>
  //           </div>
  //           </div>
  //           </div>
  //           <section class="movie-info-container">
  //           <h4 class="movie-title">${result.title}</h4>
  //           <div class="movie-info">
  //           <p class="text-secondary release-date">${
  //             result.release_date.split("-")[0]
  //           }</p>
  //           <p class="text-secondary movie-rating" title="${
  //             result.vote_count
  //           } votes">
  //           <i class="fas fa-star" style="color: #d3c43a"></i>&nbsp;${
  //             result.vote_average
  //           }
  //           </p>
  //           </div>
  //           </section>
  //           </div>
  //           `;
  //     });
  //   });
  // }

  // document.querySelector("[type=submit]").addEventListener("click", (e) => {
  //   e.preventDefault();

  //   let query = searchBar.value;
  //   if (query === "") {
  //     document.querySelector("#subheading").textContent = "Trending";
  //     renderTrendingMovies();
  //     return;
  //   }

  //   if (query === lastQuery) {
  //     return;
  //   }

  //   document.querySelector(
  //     "#subheading"
  //   ).textContent = `Search results for '${query}'`;

  //   lastQuery = query;
  //   searchAndRender(query);
  // });

  // renderTrendingMovies();
  //https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg
});
