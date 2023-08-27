import icons from 'url:../../img/icons.svg';
import View from './view.js';
import { RESULTS_PER_PAGE } from '../config.js';

class PagenationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandelerClick(handeler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handeler(goToPage);
    });
  }

  _generateMarkup() {
    const currrentPage = this._data.page;
    const numPage = Math.ceil(this._data.results.length / RESULTS_PER_PAGE);
    console.log(numPage);

    //page one and there other pages
    if (currrentPage === 1 && numPage > 1)
      return `<button data-goto="${
        currrentPage + 1
      }" class="btn--inline pagination__btn--next">
    <span>page ${currrentPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
    //last page
    if (currrentPage === numPage)
      return `<button data-goto="${
        currrentPage - 1
      }"class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>page ${currrentPage - 1}</span>
  </button>`;

    //other
    if (currrentPage > 1 && currrentPage < numPage)
      return `<button data-goto="${
        currrentPage + 1
      }" class="btn--inline pagination__btn--next">
    <span>page ${currrentPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>

  <button data-goto="${
    currrentPage - 1
  }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>page ${currrentPage - 1}</span>
  </button>
  
  `;
    //page one and there no other pages
    return '';
  }
}

export default new PagenationView();
