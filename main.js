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
        });
      }
    );
  };

  document.querySelectorAll(".pagination-component").forEach((component) => {
    new Pagination(component);
  });

  renderTrendingMovies();
  renderTrendingShows();

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
});
