/* eslint-disable no-console */
import ffetch from '../../scripts/ffetch.js';

/**
 * Search Component
 * - Lazy loads page data only when the user inputs 2 or more characters.
 * - Shows loading indicator while fetching or searching.
 * - Highlights matching text.
 * - Fully accessible with ARIA attributes.
 */
export default async function decorate(block) {
  // Extract placeholder text from the block or fallback to 'Search'
  const placeholder = block.querySelector('p')?.textContent?.trim() || 'Search';

  // Create search component structure
  const cmpSearch = document.createElement('div');
  cmpSearch.className = 'cmp-search';
  cmpSearch.setAttribute('role', 'search');

  cmpSearch.innerHTML = `
    <form class="cmp-search__form" autocomplete="off">
      <div class="cmp-search__field">
        <i class="cmp-search__icon" aria-hidden="false" style="display: block"></i>
        <span class="cmp-search__loading-indicator" aria-hidden="true" style="display: none"></span>
        <input class="cmp-search__input" type="text" name="fulltext" placeholder="${placeholder}" role="combobox"
          aria-autocomplete="list" aria-haspopup="true" aria-invalid="false" aria-expanded="false"
          aria-owns="cmp-search-results-0" />
        <button class="cmp-search__clear" aria-label="Clear" aria-hidden="true" style="display: none">
          <i class="cmp-search__clear-icon"></i>
        </button>
      </div>
    </form>
    <div class="cmp-search__results" aria-label="Search results" role="listbox" aria-multiselectable="false"
      id="cmp-search-results-0" aria-hidden="true" style="display: none"></div>
  `;

  // Replace block content with search component
  block.innerHTML = '';
  block.appendChild(cmpSearch);

  // Component elements references
  const input = cmpSearch.querySelector('.cmp-search__input');
  const resultsContainer = cmpSearch.querySelector('.cmp-search__results');
  const clearButton = cmpSearch.querySelector('.cmp-search__clear');
  const loadingIndicator = cmpSearch.querySelector('.cmp-search__loading-indicator');
  const searchIcon = cmpSearch.querySelector('.cmp-search__icon');

  let teaserData = null; // Lazy-loaded teaser data (initialized null)

  /**
   * Highlights the matched term inside the result text.
   */
  function highlightMatch(text, term) {
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark class="cmp-search__item-mark">$1</mark>');
  }

  /**
   * Renders search results into the results container.
   */
  function renderResults(term, data) {
    resultsContainer.innerHTML = '';

    const searchTerm = term.trim().toLowerCase();
    const matches = data.filter((item) => item.title?.toLowerCase().includes(searchTerm)
      || item.description?.toLowerCase().includes(searchTerm));

    if (matches.length > 0) {
      input.setAttribute('aria-expanded', 'true');
      resultsContainer.style.display = 'block';
      resultsContainer.setAttribute('aria-hidden', 'false');

      matches.forEach((item) => {
        const { path, title = '', description = '' } = item;
        let displayText = '';

        if (title.toLowerCase().includes(searchTerm)) {
          displayText = highlightMatch(title, term);
        } else if (description.toLowerCase().includes(searchTerm)) {
          displayText = title;
        }

        const a = document.createElement('a');
        a.className = 'cmp-search__item';
        a.setAttribute('role', 'option');
        a.setAttribute('aria-selected', 'false');
        a.setAttribute('href', path);
        a.innerHTML = `<span class="cmp-search__item-title">${displayText}</span>`;
        resultsContainer.appendChild(a);
      });
    } else {
      input.setAttribute('aria-expanded', 'false');
      resultsContainer.style.display = 'none';
      resultsContainer.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Handles user input events in the search field.
   */
  async function handleInput(e) {
    const term = e.target.value.trim();

    // If input is less than 2 characters, reset search state
    if (term.length < 2) {
      clearButton.style.display = 'none';
      clearButton.setAttribute('aria-hidden', 'true');
      resultsContainer.innerHTML = '';
      resultsContainer.style.display = 'none';
      resultsContainer.setAttribute('aria-hidden', 'true');
      input.setAttribute('aria-expanded', 'false');
      return;
    }

    clearButton.style.display = 'block';
    clearButton.setAttribute('aria-hidden', 'false');

    // Show loading state
    loadingIndicator.style.display = 'block';
    loadingIndicator.setAttribute('aria-hidden', 'false');
    searchIcon.style.display = 'none';
    searchIcon.setAttribute('aria-hidden', 'true');

    // Lazy-load teaser data if not already loaded
    if (!teaserData) {
      teaserData = await ffetch('/query-index.json').all();
    }

    renderResults(term, teaserData);

    // Hide loading state
    loadingIndicator.style.display = 'none';
    loadingIndicator.setAttribute('aria-hidden', 'true');
    searchIcon.style.display = 'block';
    searchIcon.setAttribute('aria-hidden', 'false');
  }

  /**
   * Clear button click handler.
   */
  function handleClear(e) {
    e.preventDefault();
    input.value = '';
    input.setAttribute('aria-expanded', 'false');
    clearButton.style.display = 'none';
    clearButton.setAttribute('aria-hidden', 'true');
    resultsContainer.innerHTML = '';
    resultsContainer.style.display = 'none';
    resultsContainer.setAttribute('aria-hidden', 'true');
  }

  /**
   * Outside click handler to close the results dropdown.
   */
  function handleOutsideClick(e) {
    if (!cmpSearch.contains(e.target)) {
      resultsContainer.style.display = 'none';
      resultsContainer.setAttribute('aria-hidden', 'true');
      input.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Focus handler to reload results if user focuses back into input.
   */
  async function handleFocus() {
    if (input.value.trim().length >= 2) {
      if (!teaserData) {
        // Show loading while fetching teaser data
        loadingIndicator.style.display = 'block';
        loadingIndicator.setAttribute('aria-hidden', 'false');
        searchIcon.style.display = 'none';
        searchIcon.setAttribute('aria-hidden', 'true');

        teaserData = await ffetch('/teaser-index.json').all();

        loadingIndicator.style.display = 'none';
        loadingIndicator.setAttribute('aria-hidden', 'true');
        searchIcon.style.display = 'block';
        searchIcon.setAttribute('aria-hidden', 'false');
      }
      renderResults(input.value.trim(), teaserData);
    }
  }

  // Attach Event Listeners
  input.addEventListener('input', handleInput);
  clearButton.addEventListener('click', handleClear);
  document.addEventListener('click', handleOutsideClick);
  input.addEventListener('focus', handleFocus);
}
