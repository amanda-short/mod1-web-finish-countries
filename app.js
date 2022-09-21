/* Imports */
import { getCountries } from './fetch-utils.js';
import { getContinents } from './fetch-utils.js';
import { renderContinentOption, renderCountry } from './render-utils.js';

/* Get DOM Elements */
const notificationDisplay = document.getElementById('notification-display');
const searchForm = document.getElementById('search-form');
const continentSelect = document.getElementById('continent-select');
const countryList = document.getElementById('country-list');

/* State */
let error = null;
let count = 0;
let continents = [];
let countries = [];

displayCountries();

/* Events */
window.addEventListener('load', async () => {
    findCountries();
    const response = await getContinents();

    error = response.error;
    continents = response.data;

    if (!error) {
        displayContinentOptions();
    }
});

async function findCountries(name, continent) {
    const response = await getCountries(name, continent);

    error = response.error;
    count = response.count;
    countries = response.data;

    displayNotifications();
    if (!error) {
        displayCountries();
    }
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(searchForm);
    findCountries(formData.get('name'), formData.get('continent'));
});

/* Display Functions */
function displayCountries() {
    countryList.innerHTML = '';

    for (const country of countries) {
        const countryEl = renderCountry(country);
        countryList.append(countryEl);
    }
}

function displayNotifications() {
    if (error) {
        notificationDisplay.classList.add('error');
        notificationDisplay.textContent = error.message;
    } else {
        notificationDisplay.classList.remove('error');
        notificationDisplay.textContent = `Showing ${countries.length} of ${count} matching countries`;
    }
}

function displayContinentOptions() {
    for (const continent of continents) {
        const option = renderContinentOption(continent);
        continentSelect.append(option);
    }
}
