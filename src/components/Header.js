import { bookIcon } from './icons.js';
import { ThemeToggle } from './ThemeToggle.js';

export function Header(activeTheme) {
  return `
    <header class="header">
      <div class="header__inner container">

        <div class="header__brand">
          <span class="header__logo">${bookIcon}</span>
          <div class="header__titles">
            <span class="header__name">The Library</span>
            <span class="header__tagline">Discover your next favorite book</span>
          </div>
        </div>

        ${ThemeToggle(activeTheme)}

      </div>
    </header>
  `;
}