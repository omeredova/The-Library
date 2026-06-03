import { heartIcon } from './icons.js';
import { getCoverUrl } from '../api/openLibrary.js';
import { escapeHtml } from '../utils/escapeHtml.js';

function favoriteRow(book) {
  const cover = book.coverId
    ? `<img class="favorite__cover" src="${getCoverUrl(book.coverId, 'S')}" alt="" loading="lazy" />`
    : '<div class="favorite__cover favorite__cover--empty"></div>';

  const authors = book.authors.length ? book.authors.join(', ') : 'Unknown author';
  const year = book.year != null ? `<span class="favorite__year">${book.year}</span>` : '';

  return `
    <li class="favorite">
      ${cover}
      <div class="favorite__info">
        <span class="favorite__title" title="${escapeHtml(book.title)}">${escapeHtml(book.title)}</span>
        <span class="favorite__author">${escapeHtml(authors)}</span>
        ${year}
      </div>
      <button
        class="favorite__remove"
        type="button"
        data-fav-id="${escapeHtml(book.id)}"
        aria-label="Remove ${escapeHtml(book.title)} from favorites"
      >${heartIcon(true)}</button>
    </li>
  `;
}

// The favorites sidebar content (header + list). Renders an empty state when
// nothing is saved yet.
export function FavoritesPanel(favorites) {
  const count = `${favorites.length} ${favorites.length === 1 ? 'book' : 'books'} saved`;

  const list = favorites.length === 0
    ? `
      <li class="favorites__empty">
        <p>No favorites yet.</p>
        <p class="favorites__empty-hint">Tap the heart on a book to save it.</p>
      </li>
    `
    : favorites.map(favoriteRow).join('');

  return `
    <div class="favorites__header">
      <span class="favorites__heart">${heartIcon(false)}</span>
      <div>
        <h2 class="favorites__title">Favorites</h2>
        <span class="favorites__count">${count}</span>
      </div>
    </div>
    <ul class="favorites__list">${list}</ul>
  `;
}