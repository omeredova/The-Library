// Styles are imported here so the bundler can pull them into the build. During
// development Vite injects them live; in the production build they are inlined
// into the JS bundle (see vite.config.js), so no separate CSS file is emitted.
import './styles/index.css';

import { STORAGE_KEYS, DEFAULT_THEME, THEMES, PAGE_SIZE, SEARCH_DEBOUNCE_MS } from './constants.js';
import { getLocalStorageItem, setLocalStorageItem } from './utils/storage.js';
import { debounce } from './utils/debounce.js';
import { searchBooks } from './api/openLibrary.js';
import { Header } from './components/Header.js';
import { SearchBar } from './components/SearchBar.js';
import { BookList, ResultsToolbar } from './components/BookList.js';
import { FavoritesPanel } from './components/FavoritesPanel.js';
import { Pager } from './components/Pager.js';
import { Footer } from './components/Footer.js';

// ---------- State ----------
const state = {
  status: 'idle', // idle | loading | success | empty | error | empty-query
  query: '',
  books: [],
  page: 1,
  totalPages: 1,
  total: 0,
  authors: [],
  selectedAuthor: 'all',
  favorites: getLocalStorageItem(STORAGE_KEYS.FAVORITES, []),
  theme: loadTheme(),
};

// Fall back to the default theme if the saved one is no longer available.
function loadTheme() {
  const saved = getLocalStorageItem(STORAGE_KEYS.THEME, DEFAULT_THEME);
  return THEMES.some((theme) => theme.id === saved) ? saved : DEFAULT_THEME;
}

// Unique, sorted author names from a list of books (for the filter dropdown).
function uniqueAuthors(books) {
  const names = new Set();
  books.forEach((book) => book.authors.forEach((name) => names.add(name)));
  return [...names].sort((a, b) => a.localeCompare(b));
}

// ---------- Render ----------
const app = document.getElementById('app');

function favoriteIds() {
  return new Set(state.favorites.map((book) => book.id));
}

// The toolbar (count + author filter) is rendered separately from the content.
function renderToolbar() {
  document.getElementById('results-toolbar').innerHTML = ResultsToolbar(state);
}

function renderContent() {
  document.getElementById('results-content').innerHTML = BookList(state, favoriteIds());
}

// Full results render (toolbar + content). Used for everything except the
// loading transition, which only re-renders the content.
function renderResults() {
  renderContent();
  renderToolbar();
}

function renderFavorites() {
  document.getElementById('favorites').innerHTML = FavoritesPanel(state.favorites);
}

function renderPager() {
  document.getElementById('pager').innerHTML = Pager(state);
}

function renderThemeButtons() {
  document.querySelectorAll('.theme-toggle__btn').forEach((btn) => {
    btn.classList.toggle('theme-toggle__btn--active', btn.dataset.themeId === state.theme);
  });
}

// ---------- Favorites ----------
function isFavorite(id) {
  return state.favorites.some((book) => book.id === id);
}

function toggleFavorite(id) {
  if (isFavorite(id)) {
    state.favorites = state.favorites.filter((book) => book.id !== id);
  } else {
    // Only books on the current page can be added.
    const book = state.books.find((item) => item.id === id);
    if (!book) return;
    state.favorites = [book, ...state.favorites];
  }
  setLocalStorageItem(STORAGE_KEYS.FAVORITES, state.favorites);
  renderFavorites();
  renderContent(); // keep the grid hearts in sync (toolbar is unaffected)
}

// ---------- Theme ----------
function setTheme(themeId) {
  state.theme = themeId;
  setLocalStorageItem(STORAGE_KEYS.THEME, themeId);
  document.documentElement.setAttribute('data-theme', themeId);
  renderThemeButtons();
}

// ---------- Search ----------
let activeRequest = null;

async function fetchPage(page) {
  // Cancel the previous request so a slow response can't overwrite a newer one.
  activeRequest?.abort();
  activeRequest = new AbortController();

  state.status = 'loading';

  renderContent();
  renderPager();

  // A picked author is sent to the API, so the filter spans all pages.
  const author = state.selectedAuthor !== 'all' ? state.selectedAuthor : undefined;

  try {
    const { books, total } = await searchBooks(state.query, { page, author, signal: activeRequest.signal });

    if (total === 0) {
      state.status = 'empty';
    } else {
      state.status = 'success';
      state.books = books;
      state.page = page;
      state.total = total;
      state.totalPages = Math.ceil(total / PAGE_SIZE);

      if (!author) state.authors = uniqueAuthors(books);
    }
  } catch (error) {
    if (error.name === 'AbortError') return;
    state.status = 'error';
  }

  renderResults();
  renderPager();
}

function runSearch(query) {
  state.query = query;
  state.page = 1;
  state.selectedAuthor = 'all';

  if (!query) {
    activeRequest?.abort();
    state.status = 'empty-query';
    renderResults();
    renderPager();
    return;
  }

  fetchPage(1);
}

const debouncedSearch = debounce(runSearch, SEARCH_DEBOUNCE_MS);

function goToPage(page) {
  if (state.status !== 'success' || page === state.page || page < 1 || page > state.totalPages) return;
  fetchPage(page);
  document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------- Events ----------
function wireEvents() {
  const input = document.querySelector('.search__input');
  const form = document.querySelector('.search');

  input.addEventListener('input', () => {
    const query = input.value.trim();

    if (!query) {
      debouncedSearch.cancel();
      runSearch('');
      return;
    }
    debouncedSearch(query);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    debouncedSearch.cancel();
    runSearch(input.value.trim());
  });

  app.addEventListener('click', (event) => {
    const themeBtn = event.target.closest('[data-theme-id]');
    if (themeBtn) return setTheme(themeBtn.dataset.themeId);

    const favBtn = event.target.closest('[data-fav-id]');
    if (favBtn) return toggleFavorite(favBtn.dataset.favId);

    const pageBtn = event.target.closest('[data-page]');
    if (pageBtn && !pageBtn.disabled) return goToPage(Number(pageBtn.dataset.page));
  });

  app.addEventListener('change', (event) => {
    const select = event.target.closest('[data-author-filter]');
    if (select) {
      state.selectedAuthor = select.value;
      state.page = 1;
      fetchPage(1);
    }
  });

  app.addEventListener(
    'error',
    (event) => {
      const img = event.target;
      if (img.classList && img.classList.contains('book-card__cover-img')) {
        const wrap = img.parentElement;
        wrap.classList.add('book-card__cover--empty');
        wrap.innerHTML = '<span class="book-card__cover-placeholder">No cover</span>';
      }
    },
    true,
  );
}

// ---------- Start ----------
function init() {
  document.documentElement.setAttribute('data-theme', state.theme);

  app.innerHTML = `
    ${Header(state.theme)}
    <main class="main">
      ${SearchBar()}
      <div class="workspace container">
        <div class="results__toolbar" id="results-toolbar"></div>
        <div class="results__content" id="results-content" aria-live="polite"></div>
        <aside class="favorites" id="favorites"></aside>
      </div>
      <nav class="pager container" id="pager" aria-label="Pagination"></nav>
    </main>
    ${Footer()}
  `;

  wireEvents();
  renderResults();
  renderFavorites();
  renderPager();
}

init();