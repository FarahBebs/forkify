class SearchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clear();
    return query;
  }

  _clear() {
    this._parentElement.querySelector('.search__field').value = '';
  }
  addHandelerSearch(handeler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault;
      handeler();
    });
  }
}

export default new SearchView();
