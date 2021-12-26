window.addEventListener("load", () => {
  console.info("DOM Loaded");
  class Pagination {
    constructor(rootElement) {
      this.root = rootElement;
      this.pageWrapper = this.root.querySelector(".pages-container");
      this.previousPageBtn = this.root.querySelector(".prev-page");
      this.nextPageBtn = this.root.querySelector(".next-page");
      this.currentPageIndicator = this.root.querySelector(".page-tracker");

      this.currentPage = this.pageWrapper.querySelector(".current");
      this.pageIndex = 1;
      this.focused = false;

      this.root.addEventListener("mouseover", () => {
        this.focused = true;
      });

      this.root.addEventListener("mouseout", () => {
        this.focused = false;
      });

      this.previousPageBtn.addEventListener("click", () => {
        this.previousPage();
      });

      this.nextPageBtn.addEventListener("click", () => {
        this.nextPage();
      });

      window.addEventListener("keydown", (e) => {
        if (!this.focused) {
          return;
        }

        if (e.key === "ArrowRight") {
          this.nextPage();
        } else if (e.key === "ArrowLeft") {
          this.previousPage();
        }
      });

      this.root.addEventListener("swiped-left", () => {
        this.nextPage();
      });

      this.root.addEventListener("swiped-right", () => {
        this.previousPage();
      });

      this.updateIndicator();
      this.registerChildObserver();
    }

    updateIndicator() {
      this.currentPageIndicator.textContent = this.pageIndex;
    }

    resetIndex() {
      let pages = this.pageWrapper.children;

      for (let index = 0; index < pages.length; index++) {
        let page = pages[index];
        if (index === 0) {
          this.currentPage = page;
          this.currentPage.classList.add("current");
        } else {
          page.classList.remove("current");
        }
      }

      this.pageIndex = 1;
      this.updateIndicator();
    }

    nextPage() {
      if (this.pageWrapper.children.length === 0) {
        return;
      }

      this.currentPage.classList.remove("current");

      if (this.currentPage.nextElementSibling) {
        this.currentPage = this.currentPage.nextElementSibling;
        this.pageIndex++;
      } else {
        this.currentPage = this.pageWrapper.children[0];
        this.pageIndex = 1;
      }

      this.currentPage.classList.add("current");
      this.pageWrapper.style.height = this.currentPage.clientHeight + "px";
      this.updateIndicator();
    }

    previousPage() {
      if (this.pageWrapper.children.length === 0) {
        return;
      }

      this.currentPage.classList.remove("current");

      if (this.currentPage.previousElementSibling) {
        this.currentPage = this.currentPage.previousElementSibling;
        this.pageIndex--;
      } else {
        this.currentPage =
          this.pageWrapper.children[this.pageWrapper.children.length - 1];
        this.pageIndex = this.pageWrapper.children.length;
      }

      this.currentPage.classList.add("current");
      this.pageWrapper.style.height = this.currentPage.clientHeight + "px";
      this.updateIndicator();
    }

    updateHeight() {
      let largestHeight = 0;
      let pages = this.pageWrapper.children;

      for (let index = 0; index < pages.length; index++) {
        const page = pages[index];
        if (page.clientHeight >= largestHeight) {
          largestHeight = page.clientHeight;
        }
      }

      this.pageWrapper.style.height = largestHeight + "px";
    }

    registerHeightObserver(node) {
      const resizeObserver = new ResizeObserver((entries) => {
        this.updateHeight();
      });

      resizeObserver.observe(node);
    }

    registerChildObserver() {
      let pages = this.pageWrapper.children;

      for (let index = 0; index < pages.length; index++) {
        const page = pages[index];
        this.registerHeightObserver(page);
      }

      const callback = (mutationsList) => {
        for (let index = 0; index < mutationsList.length; index++) {
          const mutationRecord = mutationsList[index];
          if (mutationRecord.type === "childList") {
            if (this.pageWrapper.children.length > 0) {
              this.registerHeightObserver(
                this.pageWrapper.children[this.pageWrapper.children.length - 1]
              );
            }
            this.resetIndex();
            return;
          }
        }
      };

      let observer = new MutationObserver(callback);

      observer.observe(this.pageWrapper, {
        characterData: false,
        childList: true,
        attributes: false,
      });
    }
  }

  const cache = {};
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

  function getGenres(ids) {
    let genres = [];

    ids.forEach((id) => {
      let genre = "";

      GENRES.forEach((obj) => {
        if (obj.id == id) {
          genre = obj.name;
        }
      });

      if (genre !== "") {
        genres.push({
          name: genre,
          href: `https://www.themoviedb.org/genre/${id}/`,
        });
      }
    });

    return genres;
  }

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

  const renderMovie = (data) => {
    cache[data.id] = data;

    return `<div class="result-card" cache-id="${data.id}">
    <img class="result-poster" src="https://image.tmdb.org/t/p/original${
      data.poster_path
    }" alt="Movie Poster" />
    <h4 class="result-title text-white">
    ${data.title}&nbsp;<span class="text-primary text-underline">${
      data.release_date.split("-")[0]
    }</span>
    </h4>
    </div>
    `;
  };

  const renderShow = (data) => {
    cache[data.id] = data;

    return `<div class="result-card" cache-id="${data.id}">
    <img class="result-poster" src="https://image.tmdb.org/t/p/original${
      data.poster_path
    }" alt="Movie Poster" />
    <h4 class="result-title text-white">
    ${data.name}&nbsp;<span class="text-primary text-underline">${
      data.first_air_date.split("-")[0]
    }</span>
    </h4>
    </div>
    `;
  };

  const searchMovies = (query) => {
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
              curPage.innerHTML += renderMovie(item);
            });
          });
        });
      }
    );
  };

  const searchShows = (query) => {
    if (query === "") {
      searchResultsSection.style.display = "none";
      return;
    }

    searchResultsSection.style.display = "initial";
    let pagesContainer = document.querySelector("#search-results");
    pagesContainer.innerHTML = "";

    fetch(`https://findmovies-proxy.glitch.me/api/shows?query=${query}`).then(
      (res) => {
        res.json().then((data) => {
          let groups = sliceIntoChunks(data.results, 4);

          groups.forEach((group, index) => {
            pagesContainer.innerHTML += `<div class="page results-grid ${
              index === 0 ? "current" : ""
            }"></div>`;

            let curPage = pagesContainer.children[index];
            group.forEach((item) => {
              curPage.innerHTML += renderShow(item);
            });
          });
        });
      }
    );
  };

  const renderTrendingMovies = (timeline) => {
    let pagesContainer = document.querySelector("#trending-movies");
    pagesContainer.innerHTML = "";

    fetch(
      `https://findmovies-proxy.glitch.me/api/trendingmovies/${timeline}`
    ).then((res) => {
      res.json().then((data) => {
        let groups = sliceIntoChunks(data.results, 4);

        groups.forEach((group, index) => {
          pagesContainer.innerHTML += `<div class="page results-grid ${
            index === 0 ? "current" : ""
          }"></div>`;

          let curPage = pagesContainer.children[index];
          group.forEach((item) => {
            curPage.innerHTML += renderMovie(item);
          });
        });
      });
    });
  };

  const renderTrendingShows = (timeline) => {
    let pagesContainer = document.querySelector("#trending-shows");
    pagesContainer.innerHTML = "";

    fetch(
      `https://findmovies-proxy.glitch.me/api/trendingshows/${timeline}`
    ).then((res) => {
      res.json().then((data) => {
        let groups = sliceIntoChunks(data.results, 4);

        groups.forEach((group, index) => {
          pagesContainer.innerHTML += `<div class="page results-grid ${
            index === 0 ? "current" : ""
          }"></div>`;

          let curPage = pagesContainer.children[index];
          group.forEach((item) => {
            curPage.innerHTML += renderShow(item);
          });
        });
      });
    });
  };

  document.querySelectorAll(".pagination-component").forEach((component) => {
    new Pagination(component);
  });

  renderTrendingMovies("today");
  renderTrendingShows("today");

  // trending movies timeline
  const trendingMoviesSelect = document.querySelector(
    "#trending-movies-timeline"
  );

  trendingMoviesSelect.addEventListener("change", () => {
    renderTrendingMovies(trendingMoviesSelect.value);
  });

  // trending shows timeline
  const trendingShowsSelect = document.querySelector(
    "#trending-shows-timeline"
  );

  trendingShowsSelect.addEventListener("change", () => {
    renderTrendingShows(trendingShowsSelect.value);
  });

  // searching
  const searchBar = document.querySelector("#search-bar");

  document.querySelector("[type=submit]").addEventListener("click", (e) => {
    e.preventDefault();

    let query = searchBar.value;

    if (query.substring(0, 2) === "/s") {
      searchShows(query.substring(3));
    } else {
      searchMovies(query);
    }
  });

  // popout
  const popoutContainer = document.querySelector(".result-popout-container");

  document.addEventListener("click", (e) => {
    let target = e.target;
    if (target.classList.contains("result-poster")) {
      popoutContainer
        .querySelector(".result-poster")
        .setAttribute("src", target.getAttribute("src"));

      let data = cache[target.parentElement.getAttribute("cache-id")];
      console.log(data);

      popoutContainer.querySelector(".result-title").innerHTML = `${
        data.title || data.name
      }&nbsp;<span class="text-dark">${
        data.first_air_date
          ? data.first_air_date.split("-")[0]
          : data.release_date.split("-")[0]
      }</span>`;

      popoutContainer.querySelector(".result-rating").outerHTML = `
      <p class="result-rating text-dark" title="${data.vote_count} votes">${data.vote_average}/10&nbsp;<i class="fas fa-star text-yellow"></i></p>
      `;

      popoutContainer.querySelector(".result-overview").textContent =
        data.overview;

      let genres = getGenres(data.genre_ids);
      let genresUl = popoutContainer.querySelector(".genres");
      genresUl.innerHTML = "";

      genres.forEach((genre) => {
        genresUl.innerHTML += `
        <li><a href="${genre.href}" class="genre">${genre.name}</a></li>
        `;
      });

      popoutContainer.classList.remove("hidden");
    } else if (target.classList.contains("overlay")) {
      popoutContainer.classList.add("hidden");
    }
  });
});
