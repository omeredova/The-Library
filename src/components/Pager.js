import { chevronIcon } from './icons.js';

export function Pager(state) {
  if (state.status !== 'success' || state.totalPages <= 1) return '';

  const { page, totalPages } = state;

  return `
    <button
      class="pager__btn pager__btn--prev"
      type="button"
      data-page="${page - 1}"
      ${page <= 1 ? 'disabled' : ''}
      aria-label="Previous page"
    >${chevronIcon}</button>

    <span class="pager__label">Page ${page} of ${totalPages}</span>

    <button
      class="pager__btn"
      type="button"
      data-page="${page + 1}"
      ${page >= totalPages ? 'disabled' : ''}
      aria-label="Next page"
    >${chevronIcon}</button>
  `;
}