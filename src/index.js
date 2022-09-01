import './sass/main.scss';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { refs } from './js/refs.js';
import { fetchImg, fetchImgOptions } from './js/fetchImages.js';
import cardMarkup from './templates/cardMarkup.hbs';

const ligthbox = new SimpleLightbox('.gallery a', { captionDelay: 200 });

const initialData = {
  totalHits: 0,
  hits: [],
};

const markup = hits => {
  refs.gallery.insertAdjacentHTML('beforeend', cardMarkup(hits));
  ligthbox.refresh();
};

const observer = new IntersectionObserver((entries, observer) => {
  const { hits, totalHits } = initialData;
  const lastCard = entries[0];
  if (!lastCard.isIntersecting || hits.length === totalHits) return;
  observer.unobserve(lastCard.target);
  fetchImgOptions.page++;
  createGallery();
});

const createGallery = () => {
  fetchImg(fetchImgOptions).then(({ data }) => {
    const { total, hits, totalHits } = data;
    const endHits = fetchImgOptions.per_page * fetchImgOptions.page;
    if (total || hits.length) {
      if (fetchImgOptions.page === 1) {
        Notify.success(`Hooray! We found ${total} images.`);
      }
      initialData.hits = hits;
      markup(hits);
      if (totalHits <= endHits) {
        Notify.info(
          'We are sorry, but you have reached the end of search results.'
        );
      }
      observer.observe(document.querySelector('.gallery-item:last-child'));
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  });
};

const onSearch = event => {
  event.preventDefault();

  const searchValue = event.currentTarget.elements.searchQuery.value.trim();

  if (searchValue === '') return Notify.failure('There is nothing to search!');

  if (searchValue === fetchImgOptions.q)
    return Notify.info('Search results are already displayed.');

  refs.gallery.innerHTML = '';
  fetchImgOptions.q = searchValue;
  fetchImgOptions.page = 1;
  createGallery();
};

refs.form.addEventListener('submit', onSearch);
