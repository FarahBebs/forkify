import { API_URL } from './config';
import { AJAX } from './views/helpers.js';
import { RESULTS_PER_PAGE } from './config';
import { KEY } from './config';
// import { map } from 'core-js/core/array';
// import { values } from 'core-js/core/array';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = data => {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async id => {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    console.log(state.recipe);
  } catch (err) {
    //Temp error handling
    console.error(`${err}🔥🔥`);
    throw err;
  }
};

export const loadSearchRecipe = async query => {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
  state.search.page = 1;
};

export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = newServeings => {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServeings) / state.recipe.servings;
  });

  state.recipe.servings = newServeings;
};

const persistsBookmarkes = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = recipe => {
  //add bookmark
  state.bookmarks.push(recipe);

  //mark current recipe as marked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistsBookmarkes();
};

export const deleteBookmark = id => {
  //delet the bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //mark current recipe as NOT marked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistsBookmarkes();
};

const init = () => {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = () => {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async newRecipe => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'wrong ingredient format :( please use the correct format!'
          );
        const [quantity, unit, description] = ingArr;

        return {
          quantity: `${quantity ? +quantity : null}`,
          unit,
          description,
        };
      });

    console.log(ingredients);

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
