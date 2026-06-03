import { BookCard } from './BookCard.js';
import { bookIcon, searchIcon } from './icons.js';
import { escapeHtml } from '../utils/escapeHtml.js';

function statusBlock({ icon = '', title, hint = '', spinner = false }) {
  const visual = spinner
    ? '<div class="status__spinner" aria-hidden="true"></div>'
    : `<div class="status__icon">${icon}</div>`;
  const hintHtml = hint ? `<p class="status__hint">${hint}</p>` : '';

  return `
    <div class="status">
      ${visual}
      <p class="status__title">${title}</p>
      ${hintHtml}
    </div>
  `;
}

function authorOptions(authors, selected) {
  const option = (value, label) =>
    `<option value="${escapeHtml(value)}" ${value === selected ? 'selected' : ''}>${escapeHtml(label)}</option>`;

  return [option('all', 'All authors'), ...authors.map((name) => option(name, name))].join('');
}

// The results toolbar (match count + author filter). Returns an
// empty string until there is a result set to describe.
export function ResultsToolbar(state) {
  if (state.status !== 'success' && state.status !== 'loading') return '';

  const count = `${state.total.toLocaleString()} ${state.total === 1 ? 'book' : 'books'} found`;

  return `
    <span class="results__count">${count}</span>
    <label class="author-filter">
      <span class="author-filter__label">Author</span>
      <select class="author-filter__select" data-author-filter aria-label="Filter by author">
        ${authorOptions(state.authors, state.selectedAuthor)}
      </select>
    </label>
  `;
}

export function BookList(state, favoriteIds) {
  if (state.status === 'loading') {
    return statusBlock({ spinner: true, title: 'Loading...' });
  }
  if (state.status === 'error') {
    return statusBlock({
      icon: searchIcon,
      title: 'Network error',
      hint: 'Something went wrong. Please try again.',
    });
  }
  if (state.status === 'empty') {
    return statusBlock({
      icon: searchIcon,
      title: 'Nothing found',
      hint: 'Try a different title or author.',
    });
  }
  // The user tried to search with an empty field (or cleared it).
  if (state.status === 'empty-query') {
    return statusBlock({
      icon: searchIcon,
      title: 'Your search is empty',
      hint: 'Please enter a book title, author or keyword to search.',
    });
  }
  if (state.status !== 'success') {
    return statusBlock({
      icon: bookIcon,
      title: 'Start your search',
      hint: 'Enter a book title, author or keyword above.',
    });
  }

  const cards = state.books.map((book) => BookCard(book, favoriteIds.has(book.id))).join('');
  return `<div class="book-grid">${cards}</div>`;
}