import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '29507685-ce40eb09955da3524e05d8b65';

export const fetchImgOptions = {
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
  page: 1,
};

export const fetchImg = async params => {
  try {
    return await axios.get(BASE_URL, { params: { ...params, key: API_KEY } });
  } catch (error) {
    console.error(error);
  }
};
