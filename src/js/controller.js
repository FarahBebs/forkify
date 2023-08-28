import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import pagenationView from './views/pagenationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}
const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) {
      return;
    }

    //0)Update results view to maek selectedarch result
    resultsView.updat(model.getSearchResultsPage());
    //updating bookmarks
    bookmarksView.updat(model.state.bookmarks);
    //Spinner
    recipeView.renderSpinner();
    //1)Loading recipe
    await model.loadRecipe(id);
    //2)Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSrearchResults = async () => {
  try {
    //spinner
    resultsView.renderSpinner();
    //get search query
    const query = searchView.getQuery();
    if (!query) return;

    //load search results
    await model.loadSearchRecipe(query);

    //render search results
    resultsView.render(model.getSearchResultsPage());

    //render initial pagination buttons
    pagenationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagenation = goToPage => {
  //render New results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //render initial pagination buttons
  pagenationView.render(model.state.search);
};

const controlServings = newServeings => {
  //uptate the recipe servenings(in state)
  model.updateServings(newServeings);
  //updat the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.updat(model.state.recipe);
};

const controlAddBookmarks = () => {
  //add/delet a book mark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //update recipe view
  recipeView.updat(model.state.recipe);
  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();
    // console.log(newRecipe);
    //Upload the new Recipe data
    await model.uploadRecipe(newRecipe);
    //render recipe
    recipeView.render(model.state.recipe);

    //seccess message
    addRecipeView.renderMessage();

    //render the bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, 1000 * MODEL_CLOSE_SEC);
    console.log(model.state.recipe);
  } catch (err) {
    addRecipeView.renderError(err);
    console.error(err.message);
  }
};
const nothing = () => {
  console.log(3);
};
const init = () => {
  bookmarksView.addHandelerRender(controlBookmarks);
  recipeView.addHandelerRender(controlRecipes);
  recipeView.addHandelerUpdatServings(controlServings);
  recipeView.addHandelerBookmark(controlAddBookmarks);
  searchView.addHandelerSearch(controlSrearchResults);
  pagenationView.addHandelerClick(controlPagenation);
  addRecipeView.addHandelerUpload(controlAddRecipe);
  nothing();
};
init();
