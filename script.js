const foodListEl = document.getElementById("foodList");
const fridgeEl = document.getElementById("fridge");
const recipeListEl = document.getElementById("recipeList");
const statusMessageEl = document.getElementById("statusMessage");

const fridgeItems = new Set();

function renderFoodList() {
  foodListEl.innerHTML = "";

  for (const food of window.FOOD_DATA) {
    const card = document.createElement("article");
    card.className = "food-card";

    card.innerHTML = `
      <img src="${food.image}" alt="${food.name}" />
      <strong>${food.name}</strong>
      <button class="add-btn" data-food-id="${food.id}">넣기</button>
    `;

    foodListEl.append(card);
  }
}

function renderFridge() {
  fridgeEl.innerHTML = "";

  if (fridgeItems.size === 0) {
    fridgeEl.innerHTML = '<p class="empty">현재 냉장고가 비어 있습니다.</p>';
    statusMessageEl.textContent = "사이드에서 음식을 추가해보세요.";
    return;
  }

  statusMessageEl.textContent = `현재 ${fridgeItems.size}개의 재료가 들어 있습니다.`;

  const foodsInFridge = window.FOOD_DATA.filter((food) => fridgeItems.has(food.id));

  for (const food of foodsInFridge) {
    const item = document.createElement("article");
    item.className = "fridge-item";

    item.innerHTML = `
      <img src="${food.image}" alt="${food.name}" />
      <div>${food.name}</div>
      <button class="remove-btn" data-remove-id="${food.id}">꺼내기</button>
    `;

    fridgeEl.append(item);
  }
}

function getRecommendedRecipes() {
  const current = [...fridgeItems];

  return window.RECIPE_DATA
    .filter((recipe) => recipe.ingredients.every((ingredient) => current.includes(ingredient)))
    .sort((a, b) => b.ingredients.length - a.ingredients.length);
}

function renderRecipes() {
  recipeListEl.innerHTML = "";
  const recipes = getRecommendedRecipes();

  if (recipes.length === 0) {
    recipeListEl.innerHTML = '<p class="empty">현재 재료 조합으로 만들 수 있는 요리가 없습니다.</p>';
    return;
  }

  for (const recipe of recipes) {
    const card = document.createElement("article");
    card.className = "recipe-card";

    const ingredientNames = recipe.ingredients
      .map((id) => window.FOOD_DATA.find((food) => food.id === id)?.name ?? id)
      .join(", ");

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.name}" />
      <div>
        <strong>${recipe.name}</strong>
        <div><small>${recipe.description}</small></div>
        <div><small>필요 재료: ${ingredientNames}</small></div>
      </div>
    `;

    recipeListEl.append(card);
  }
}

function addFood(foodId) {
  if (fridgeItems.has(foodId)) {
    statusMessageEl.textContent = "이미 냉장고에 있는 음식입니다.";
    return;
  }

  fridgeItems.add(foodId);
  renderFridge();
  renderRecipes();
}

function removeFood(foodId) {
  fridgeItems.delete(foodId);
  renderFridge();
  renderRecipes();
}

foodListEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const { foodId } = target.dataset;
  if (foodId) {
    addFood(foodId);
  }
});

fridgeEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const { removeId } = target.dataset;
  if (removeId) {
    removeFood(removeId);
  }
});

renderFoodList();
renderFridge();
renderRecipes();
