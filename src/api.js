import axios from 'axios';

const BASE_URL = 'https://rxnav.nlm.nih.gov/REST';

export const getDrugs = (name) => axios.get(`${BASE_URL}/drugs?name=${name}`);
export const getSpellingSuggestions = (name) => axios.get(`${BASE_URL}/spellingsuggestions?name=${name}`);
export const getNDCs = (rxcui) => axios.get(`${BASE_URL}/rxcui/${rxcui}/ndcs`);
