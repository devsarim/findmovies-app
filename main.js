const registerPagination = () => {
  document.querySelectorAll(".pages-container").forEach((pagesContainer) => {
    let rootContainer = pagesContainer.parentElement;
    let pageControls = rootContainer.children[1];

    let prevPage = pageControls.children[0];
    let currentPageIndicator = pageControls.children[1];
    let nextPage = pageControls.children[2];

    let pages = pagesContainer.children;
    let currentPage = pages[0];
    let currentPageNum = 1;

    let focused = false;

    function goToNextPage() {
      if (!currentPage) {
        return;
      }

      if (currentPage.nextElementSibling) {
        currentPage.classList.remove("current");
        currentPage = currentPage.nextElementSibling;
        currentPage.classList.add("current");

        currentPageNum++;
        currentPageIndicator.textContent = currentPageNum;
      } else {
        currentPage.classList.remove("current");
        currentPage = pages[0];
        currentPage.classList.add("current");

        currentPageNum = 1;
        currentPageIndicator.textContent = currentPageNum;
      }

      pagesContainer.style.height = currentPage.clientHeight + "px";
    }

    function goToPrevPage() {
      if (!currentPage) {
        return;
      }

      if (currentPage.previousElementSibling) {
        currentPage.classList.remove("current");
        currentPage = currentPage.previousElementSibling;
        currentPage.classList.add("current");

        currentPageNum--;
        currentPageIndicator.textContent = currentPageNum;
      } else {
        currentPage.classList.remove("current");
        currentPage = pages[pages.length - 1];
        currentPage.classList.add("current");

        currentPageNum = pages.length;
        currentPageIndicator.textContent = currentPageNum;
      }

      pagesContainer.style.height = currentPage.clientHeight + "px";
    }

    nextPage.addEventListener("click", goToNextPage);
    prevPage.addEventListener("click", goToPrevPage);

    rootContainer.addEventListener("mouseover", () => {
      focused = true;
    });

    rootContainer.addEventListener("mouseout", () => {
      focused = false;
    });

    window.addEventListener("keydown", (e) => {
      if (focused) {
        if (e.key === "ArrowRight") {
          goToNextPage();
        } else if (e.key === "ArrowLeft") {
          goToPrevPage();
        }
      }
    });

    // not really necessary
    window.addEventListener("resize", () => {
      if (!currentPage) {
        return;
      }

      pagesContainer.style.height = currentPage.clientHeight + "px";
    });

    if (currentPage) {
      console.log("set initial " + currentPage.clientHeight);
      pagesContainer.style.height = currentPage.clientHeight + "px";
      currentPageIndicator.textContent = 1;
    }
  });
};

window.addEventListener("load", () => {
  console.info("DOM Loaded");

  const GENRES = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];

  function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
    }
    return res;
  }

  const searchResultsSection = document.querySelector(
    "#search-results-section"
  );

  const renderSearchResults = (query) => {
    if (query === "") {
      searchResultsSection.style.display = "none";
      return;
    }

    searchResultsSection.style.display = "initial";
    let pagesContainer = document.querySelector("#search-results");
    pagesContainer.innerHTML = "";

    fetch(`https://findmovies-proxy.glitch.me/api/movies?query=${query}`).then(
      (res) => {
        res.json().then((data) => {
          let groups = sliceIntoChunks(data.results, 4);

          groups.forEach((group, index) => {
            pagesContainer.innerHTML += `
            <div class="page results-grid ${index === 0 ? "current" : ""}">
  
            </div>
  
          `;

            let curPage = pagesContainer.children[index];
            group.forEach((item) => {
              curPage.innerHTML += `
            <div class="result-card">
            <img class="result-poster" src="https://image.tmdb.org/t/p/original${item.poster_path}" alt="Movie Poster" />
            <h4 class="result-title text-white">
            ${item.title}
            </h4>
            </div>
            `;
            });
          });

          registerPagination();
        });
      }
    );
  };

  const renderTrendingMovies = () => {
    let pagesContainer = document.querySelector("#trending-movies");
    pagesContainer.innerHTML = "";

    fetch("https://findmovies-proxy.glitch.me/api/trendingmovies/today").then(
      (res) => {
        res.json().then((data) => {
          let groups = sliceIntoChunks(data.results, 4);

          groups.forEach((group, index) => {
            pagesContainer.innerHTML += `
            <div class="page results-grid ${index === 0 ? "current" : ""}">
  
            </div>
  
          `;

            let curPage = pagesContainer.children[index];
            group.forEach((item) => {
              curPage.innerHTML += `
            <div class="result-card">
            <img class="result-poster" src="https://image.tmdb.org/t/p/original${item.poster_path}" alt="Movie Poster" />
            <h4 class="result-title text-white">
            ${item.title}
            </h4>
            </div>
            `;
            });
          });

          registerPagination();
        });
      }
    );
  };

  const renderTrendingShows = () => {
    let pagesContainer = document.querySelector("#trending-shows");
    pagesContainer.innerHTML = "";

    fetch("https://findmovies-proxy.glitch.me/api/trendingshows/today").then(
      (res) => {
        res.json().then((data) => {
          let groups = sliceIntoChunks(data.results, 4);

          groups.forEach((group, index) => {
            pagesContainer.innerHTML += `
            <div class="page results-grid ${index === 0 ? "current" : ""}">
  
            </div>
  
          `;

            let curPage = pagesContainer.children[index];
            group.forEach((item) => {
              curPage.innerHTML += `
            <div class="result-card">
            <img class="result-poster" src="https://image.tmdb.org/t/p/original${item.poster_path}" alt="Movie Poster" />
            <h4 class="result-title text-white">
            ${item.name}
            </h4>
            </div>
            `;
            });
          });

          registerPagination();
        });
      }
    );
  };

  renderTrendingMovies();
  renderTrendingShows();
  registerPagination();

  const searchBar = document.querySelector("#search-bar");

  document.querySelector("[type=submit]").addEventListener("click", (e) => {
    e.preventDefault();

    renderSearchResults(searchBar.value);
  });
  //https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg
});
