import { heartIcon } from './icons.js';
import { getCoverUrl } from '../api/openLibrary.js';
import { escapeHtml } from '../utils/escapeHtml.js';

// Cover image, or a placeholder when the book has no cover.
function cover(book) {
  if (!book.coverId) {
    return `
      <div class="book-card__cover book-card__cover--empty">
        <span class="book-card__cover-placeholder">No cover</span>
      </div>
    `;
  }

  return `
    <div class="book-card__cover">
      <img
        class="book-card__cover-img"
        src="${getCoverUrl(book.coverId, 'M')}"
        alt="Cover of ${escapeHtml(book.title)}"
        loading="lazy"
      />
    </div>
  `;
}

// One book in the results grid. The heart button carries data-fav-id so main.js
// can toggle it; `isFavorite` decides its filled/active look.
export function BookCard(book, isFavorite) {
  const authors = book.authors.length ? book.authors.join(', ') : 'Unknown author';
  const year = book.year != null ? `<p class="book-card__year">${book.year}</p>` : '';

  return `
    <article class="book-card">
      <div class="book-card__cover-wrap">
        ${cover(book)}
        <button
          class="book-card__fav ${isFavorite ? 'book-card__fav--active' : ''}"
          type="button"
          data-fav-id="${escapeHtml(book.id)}"
          aria-pressed="${isFavorite}"
          aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
        >${heartIcon(isFavorite)}</button>
      </div>

      <div class="book-card__body">
        <h3 class="book-card__title" title="${escapeHtml(book.title)}">${escapeHtml(book.title)}</h3>
        <p class="book-card__author">${escapeHtml(authors)}</p>
        ${year}
      </div>
    </article>
  `;
}