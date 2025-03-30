import { createGallery, clearGallery, showLoader, hideLoader } from './js/render-functions.js';
import { getImagesByQuery } from './js/pixabay-api.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const searchInput = document.querySelector('[name="search-text"]');
const loadMoreButton = document.getElementById('load-more'); 

let query = '';
let page = 1;
let totalHits = 0;

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    query = searchInput.value.trim();
    page = 1;

    if (!query) {
        iziToast.error({
            title: 'Error',
            message: 'Please enter a search query.',
        });
        return;
    }

    showLoader();
    clearGallery();
    hideLoadMoreButton(); 

    try {
        const { hits, totalHits: total } = await getImagesByQuery(query, page);
        totalHits = total;

        if (hits.length === 0) {
            iziToast.info({
                title: 'No Results',
                message: 'Sorry, there are no images matching your search query. Please try again!',
            });
        } else {
            createGallery(hits);
            if (totalHits > 15) showLoadMoreButton();
        }
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: 'Something went wrong. Please try again later.',
        });
    } finally {
        hideLoader();
    }
});

loadMoreButton.addEventListener('click', async () => {
    page += 1;
    showLoader();

    try {
        const { hits } = await getImagesByQuery(query, page);
        createGallery(hits);

        if (page * 15 >= totalHits) {
            hideLoadMoreButton();
            iziToast.info({
                title: 'End of results',
                message: "We're sorry, but you've reached the end of search results.",
            });
        }
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: 'Something went wrong. Please try again later.',
        });
    } finally {
        hideLoader();
    }
});

function showLoadMoreButton() {
    loadMoreButton.classList.remove('hidden');
}

function hideLoadMoreButton() {
    loadMoreButton.classList.add('hidden');
}