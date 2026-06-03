export const API = {
  SEARCH_URL: 'https://openlibrary.org/search.json',
  COVERS_URL: 'https://covers.openlibrary.org/b/id',
  // Fields we ask the API for — smaller payloads, faster responses.
  SEARCH_FIELDS: 'key,title,author_name,first_publish_year,cover_i',
};

/** Search esults per page.*/
export const PAGE_SIZE = 10;

export const STORAGE_KEYS = {
  FAVORITES: 'books-catalogue:favorites',
  THEME: 'books-catalogue:theme',
};

export const SEARCH_DEBOUNCE_MS = 400;

export const THEMES = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

export const DEFAULT_THEME = 'light';