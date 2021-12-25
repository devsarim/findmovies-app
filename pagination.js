window.addEventListener("load", () => {
  console.log("pagination");

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
      pagesContainer.style.height = currentPage.clientHeight + "px";
      currentPageIndicator.textContent = 1;
    }
  });
});
