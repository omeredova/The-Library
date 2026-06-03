import { searchIcon } from './icons.js';

export function SearchBar() {
  return `
    <section class="hero">
      <h1 class="hero__title">Discover Your Next Great Read</h1>
      <p class="hero__subtitle">
        Search millions of books, build your personal library, and never lose track of what to read next.
      </p>

      <form class="search" role="search">
        <div class="search__field">
          <span class="search__icon">${searchIcon}</span>
          <input
            class="search__input"
            type="search"
            placeholder="Search for books by title or author..."
            aria-label="Search for books"
            autocomplete="off"
          />
        </div>
        <button class="btn btn--primary search__button" type="submit">Search</button>
      </form>
    </section>
  `;
}