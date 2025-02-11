(function () {
  /**
  Toggles the expanded/collapsed classed on side navigation element.

  @param {HTMLElement} sideNavigation The side navigation element.
  @param {Boolean} show Whether to show or hide the drawer.
*/
  function toggleDrawer(sideNavigation, show) {
    if (sideNavigation) {
      if (show) {
        sideNavigation.classList.remove("is-collapsed");
        sideNavigation.classList.add("is-expanded");
      } else {
        sideNavigation.classList.remove("is-expanded");
        sideNavigation.classList.add("is-collapsed");
      }
    }
  }

  /**
  Attaches event listeners for the side navigation toggles
  @param {HTMLElement} sideNavigation The side navigation element.
*/
  function setupSideNavigation(sideNavigation) {
    var toggles = [].slice.call(
      sideNavigation.querySelectorAll(".js-drawer-toggle")
    );

    toggles.forEach(function (toggle) {
      toggle.addEventListener("click", function (event) {
        event.preventDefault();
        var sideNav = document.getElementById(
          toggle.getAttribute("aria-controls")
        );

        if (sideNav) {
          toggleDrawer(sideNav, !sideNav.classList.contains("is-expanded"));
        }
      });
    });
  }

  /**
  Attaches event listeners for all the side navigations in the document.
  @param {String} sideNavigationSelector The CSS selector matching side navigation elements.
*/
  function setupSideNavigations(sideNavigationSelector) {
    // Setup all side navigations on the page.
    var sideNavigations = [].slice.call(
      document.querySelectorAll(sideNavigationSelector)
    );

    sideNavigations.forEach(setupSideNavigation);
  }

  function initFilters() {
    var urlParams = new URLSearchParams(window.location.search);
    var checkboxes = [].slice.call(
      document.querySelectorAll("[data-js='filter']")
    );
    var tutorials = [].slice.call(
      document.querySelectorAll("[data-js='item']")
    );
    var closeFiltersButtonMobile = document.querySelector(
      "[data-js='filter-button-mobile-close']"
    );
    var filters = [];

    if (urlParams.get("filters")) {
      filters = urlParams.get("filters").split(",");
    }

    populateCheckboxes();
    filterDom();

    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener("change", filterHandler);
    });

    // Check any checkboxes that match URL filters query
    function populateCheckboxes() {
      if (filters) {
        filters.forEach(function (filter) {
          var selector = "[aria-labelledby='" + filter + "-filter']";
          var checkboxObject = document.querySelector(selector);
          if (checkboxObject) {
            checkboxObject.checked = true;
          }
        });
      }
    }

    // Check if element shold be filtered
    function filterCheck(filterText) {
      var match = false;
      filters.forEach(function (filter) {
        if (filterText.includes(filter) && !match) {
          match = true;
        }
      });
      return match;
    }

    function filterDom() {
      if (filters.length === 0 && tutorials) {
        closeFiltersButtonMobile.innerHTML = "Hide filters";
        tutorials.forEach(function (tutorial) {
          tutorial.classList.remove("u-hide");
        });
      } else if (tutorials) {
        closeFiltersButtonMobile.innerHTML = "Apply filters";
        tutorials.forEach(function (tutorial) {
          if (filterCheck(tutorial.getAttribute("data-filter"))) {
            tutorial.classList.remove("u-hide");
          } else {
            tutorial.classList.add("u-hide");
          }
        });
      }
    }

    function updateUrl() {
      var currentUrl = window.location.href;
      var baseUrl = currentUrl.split("?")[0];
      var newUrl = baseUrl;

      if (filters.length > 0) {
        filtersString = "";
        filters.forEach(function (filter, i) {
          if (i === filters.length - 1) {
            filtersString = filtersString + filter;
          } else {
            filtersString = filtersString + filter + ",";
          }
        });
        newUrl = baseUrl + "?filters=" + filtersString;
        window.history.pushState({ filters: filters }, "", newUrl);
      } else {
        window.history.pushState({}, "", newUrl);
      }
    }

    function filterHandler(e) {
      if (e.target.checked) {
        filters.push(e.target.value);
      } else {
        filters.splice(filters.indexOf(e.target.value), 1);
      }
      filterDom();
      updateUrl();
    }
  }

  setupSideNavigations('.p-side-navigation, [class*="p-side-navigation--"]');
  initFilters();
})();
