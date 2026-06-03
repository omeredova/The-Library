import { THEMES } from '../constants.js';

export function ThemeToggle(activeTheme) {
  const buttons = THEMES.map((theme) => {
    const isActive = theme.id === activeTheme;
    return `
      <button
        class="theme-toggle__btn ${isActive ? 'theme-toggle__btn--active' : ''}"
        type="button"
        data-theme-id="${theme.id}"
        aria-label="Switch to ${theme.label} theme"
      >${theme.label}</button>
    `;
  }).join('');

  return `
    <div class="theme-toggle" role="group" aria-label="Theme">
      ${buttons}
    </div>
  `;
}