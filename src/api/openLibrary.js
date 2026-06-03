import { API, PAGE_SIZE } from '../constants.js';

function normalizeBook(doc) {
  return {
    id: doc.key,
    title: doc.title || 'Untitled',
    authors: doc.author_name || [],
    year: doc.first_publish_year || null,
    coverId: doc.cover_i || null,
  };
}

// Build a cover image URL. size is 'S', 'M' or 'L'.
export function getCoverUrl(coverId, size = 'M') {
  return `${API.COVERS_URL}/${coverId}-${size}.jpg`;
}

// Search books by title, author or keyword, one page at a time.
// Returns { books, total } and throws on a failed request.
export async function searchBooks(query, { page = 1, author, signal } = {}) {
  const url = new URL(API.SEARCH_URL);
  url.searchParams.set('q', query);
  url.searchParams.set('fields', API.SEARCH_FIELDS);
  url.searchParams.set('limit', String(PAGE_SIZE));
  url.searchParams.set('page', String(page));
  if (author) url.searchParams.set('author', author);

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  return {
    books: (data.docs || []).map(normalizeBook),
    total: data.numFound || 0,
  };
}