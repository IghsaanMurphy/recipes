const form = document.getElementById('submit'),
searchBar = document.getElementById('search'),
resultHeading = document.getElementById('result-heading'),
meals = document.getElementById('result-meals'),
singleMeal = document.getElementById('single-meal'),
home = document.getElementById('backBtn'),
container = document.getElementById('home'),
page = document.body;

// SEARCH MEAL AND FETCH FROM API
function searchMeal(e) {
    e.preventDefault();
    // GET SEARCH VALUE
    const searched = searchBar.value;
    // CLEAR SINGLE MEAL 
    singleMeal.innerHTML = '';

    // SEARCH FUNCTION  
    if(searched.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searched}`)
        .then(res => res.json())
        .then(data => {
            resultHeading.innerHTML = `<h4>Search results for '${searched}' :</h4>`;
            if(data.meals === null){
                resultHeading.innerHTML = `<p>There are no results for '${searched}'. Try Again</p>`;
                meals.innerHTML = '';
                // container.classList.add('container');
                // container.classList.remove('centerEmpty');
                // page.classList.remove('changing');
            } else {
                meals.innerHTML = data.meals.map(meal => 
                    `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                        <a href="#mealPage"><div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div></a>
                    </div>    
                    `
                    ).join('');
                    home.classList.remove('home');
                    home.classList.add('back-btn');
                    // container.classList.add('centerEmpty');
                    // container.classList.remove('container');
                    // page.classList.add('changing');
            }
            
        });
        searchBar.value = '';
    }
}


// SINGLE MEAL FUNCTIONALITY 
//  |       |        |
//  V       V        V
//FETCH MEAL BY ID
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];

        addMealToDOM(meal);
    })
}

//ADD MEAL TO DOM 
function addMealToDOM(meal) {
    // start off empty then we can add to it
    const ingredients = [];

    // max 20 ingredients
    for(let i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strMeasure${i}`]} - ${meal[`strIngredient${i}`]}`);
        } else {
            break;
        }
    }

    singleMeal.innerHTML = 
    `
    <div class="single-meal">
        <h1 id="mealPage">${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>Category: ${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>Country: ${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
        <h2>Instructions</h2>
        <p class="instruction">${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
            ${ingredients.map(ing => `<li>${ing}</ing>`).join('')}
        </ul>
        </div>
    </div>
    `;
}





// EVENT LISTENERS 
form.addEventListener('submit', searchMeal);

meals.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if(item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if(mealInfo){
        const mealID = mealInfo.getAttribute('data-mealID');
        getMealById(mealID);
    }
});